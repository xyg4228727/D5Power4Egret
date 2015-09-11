
module d5power {

	export class TiledLayer{
		public map:TiledMap;
		public name:string;
		public x:number = 0;
		public y:number = 0;
		public width:number = 0;
		public height:number = 0;
		public opacity:number;
		public visible:boolean;
		public tileGIDs:Array<any>;
		public encoding:string;
		public compressed:boolean =false;
//		public properties:TiledPropertySet = null;
		
		public constructor(source:any, parent:TiledMap){
			this.map = parent;
			this.name = source.name;
			this.x = source.x;
			this.y = source.y;
			this.width = source.width;
			this.height = source.height;
			this.visible = !source.visible || (source.visible != 0);
			this.opacity = source.opacity;
            var node: any;
//			var length:number = source.properties.length;
//			for(var i:number = 0;i < length;i++){
//				var node:any = source.properties[i];
//				this.properties = this.properties ? this.properties.format(node) : new TiledPropertySet(node);
//			}
			
			this.tileGIDs = [];
			
			this.encoding = source.encoding;
			var chunk:string;
			if (source.encoding == "") {
				// create a 2dimensional array
				var lineWidth:number = this.width;
				var rowIdx:number = -1;
				var length1:number = source.tile.length;
				for(var i1:number = 0;i1 < length1;i1++){
					node = source.tile[i1];
					// new line?
					if (++lineWidth >= this.width) {
						this.tileGIDs[++rowIdx] = [];
						lineWidth = 0;
					}
					var gid:number = node.gid;
					this.tileGIDs[rowIdx].push(gid);
				}
			} else if (source.encoding == "csv") {
				chunk = <string><any> (source.data);
				this.tileGIDs = TiledLayer.csvToArray(<string><any> chunk, this.width);
			} else if (source.encoding == "base64") {
				chunk = <string><any> (source.data);
				if (source.compression == "zlib")
					this.compressed = true;
				else if (source.compression.length() != 0)
					throw <Error><any> ("TmxLayer - data compression type not supported!");
				
//				this.tileGIDs = TiledLayer.base64ToArray(chunk, this.width, this.compressed);
			}
			
		}
		
		public toJson():any{
			var result:any = new Object;
			result.name = this.name;
			result.x = this.x;
			result.y = this.y;
			result.width = this.width;
			result.height = this.height;
			result.visible = this.visible ;
			result.opacity = this.opacity;
			result.encoding = this.encoding;
//			var temp:String = arrayToString();
			if(this.encoding == ""){
				var node_arr:Array<any> = new Array<any>();
				for(var i:number = 0;i < this.tileGIDs.length;i++){
					var arr:Array<any> = new Array<any> (this.tileGIDs[i]);
					var len:number = arr.length;
					for(var j:number = 0;j < len;j++){
						var node:any = new Object;
						node.gid = arr[j];
						node_arr.push(node);	
					}
				}
				result.tile = node_arr;
			}else if(this.encoding == "csv"){
				result.data = this.arrayToCsv(this.tileGIDs);
			}else if(this.encoding == "base64"){
				result.data = this.arrayToBase64(this.tileGIDs,this.width,this.compressed);
				
//				var source:String = arrayToString();    
	
			}
			return result;
		}
		
		private arrayToString():string{
			var result:string = "";
			for(var i:number = 0;i < this.tileGIDs.length;i++){
				var arr:Array<any> = new Array<any> (this.tileGIDs[i]);
				var len:number = arr.length;
				for(var j:number = 0;j < len;j++){
					if(arr[j] != 0)	result += arr[j];
				}
			}
			return result;
		}
		
		
		public static csvToArray(input:string, lineWidth:number = 0):Array<any> {
			var result:Array<any> = [];
			var rows:Array<any> = input.split("\n");
			var length:number = rows.length;
			for(var i:number = 0;i < length;i++){
				var row:string = rows[i];
				var resultRow:Array<any> = [];
				var entries:Array<any> = row.split(",", lineWidth);
				var length1:number = entries.length;
				for(var i1:number = 0;i1 < length1;i1++){
					var entry:string = entries[i1];
				resultRow.push(parseInt(entry));
				}
				// convert to uint
				result.push(resultRow);
			}
			return result;
		}
		
		public  arrayToCsv(data:Array<any>):string{
			var result:string = "";
			for(var i:number = 0;i < data.length;i++){
				var arr:Array<any> = data[i];
				for(var j:number = 0;j < arr.length;j++){
					 j< arr.length-1 ?result += arr[j]+",":result+=arr[j];
				}
				result += "\n";
			}
			return result;
		}
		
		public  arrayToBase64(data:Array<any>,lineWidth:number, compressed:boolean):string{
			var result:string = "";
			
			var bytes:egret.ByteArray = new egret.ByteArray;
			bytes.endian = egret.Endian.LITTLE_ENDIAN;
			for(var m:number = 0; m < data.length;m++){
				var arr:Array<any> = data[m];
				for(var n:number = 0;n <arr.length;n++){
					bytes.writeInt(arr[n]);
				}
			}
			bytes.position = 0;
//			bytes.compress();

			result = Base64.encodeByteArray(bytes);
			return result;
		}
		
		
			
		public static base64ToArray(chunk:string, lineWidth:number, compressed:boolean):Array<any> {
			var result:Array<any> = [];
			var data:egret.ByteArray = Base64.decodeToByteArray(chunk);
//			if (compressed)
//			{
//                //				data.uncompress();
//                //由于接口需要传入Uint8Array类型参数，所以在此进行ArrayBuffer2Uint8Array转换
//                var plain:Uint8Array = new Uint8Array(data.buffer);
//                //            //zlib压缩
//                //            var deflate = new Zlib.Deflate(plain);
//                //            var compressed:Uint8Array = deflate.compress();
//                //zlib解压缩
//                var inflate = new Zlib.Inflate(plain);
//                var deplain:Uint8Array = inflate.decompress();
//                //在测试中发现解压后的deplain.buffer值不正确（也不知道为毛）
//                //所以要想得到最终的ArrayBuffer,需要重新复制一份deplain
//                var newDeplain: Uint8Array = new Uint8Array(deplain.length);
//                for(var i: number = 0;i < deplain.length;i++) { 
//                    newDeplain[i] = deplain[i];
//                }
//                //zlib解压后的字节流
//                //            var lastbytes: ArrayBuffer = newDeplain.buffer;
//                data = new egret.ByteArray(newDeplain.buffer);
//			}

			data.endian = egret.Endian.LITTLE_ENDIAN;
            console.log(data.bytesAvailable);
			while (data.bytesAvailable) {
				var resultRow:Array<any> = [];
				for (var i:number = 0; i < lineWidth; i++){
					var p:number = data.readInt();
					resultRow.push(p);
				}
				result.push(resultRow);
			}
			return result;
		}

		private testDecode(value:any):any
		{
    		
            return "";
		}
		
		
		private static BASE64_CHARS:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		
		public static base64ToByteArray(data:string):egret.ByteArray {
			var output:egret.ByteArray = new egret.ByteArray();
			// initialize lookup table
			var lookup:Array<any> = [];
			for (var c:number = 0; c < TiledLayer.BASE64_CHARS.length; c++)
				lookup[TiledLayer.BASE64_CHARS.charCodeAt(c)] = c;
			
			for (var i:number = 0; i < data.length - 3; i += 4) {
				// read 4 bytes and look them up in the table
				var a0:number = lookup[data.charCodeAt(i)];
				var a1:number = lookup[data.charCodeAt(i + 1)];
				var a2:number = lookup[data.charCodeAt(i + 2)];
				var a3:number = lookup[data.charCodeAt(i + 3)];
				
				// convert to and write 3 bytes
				if (a1 < 64)
					output.writeByte((a0 << 2) + ((a1 & 0x30) >> 4));
				if (a2 < 64)
					output.writeByte(((a1 & 0x0f) << 4) + ((a2 & 0x3c) >> 2));
				if (a3 < 64)
					output.writeByte(((a2 & 0x03) << 6) + a3);
			}
			
			// Rewind & return decoded data
			output.position = 0;
			return output;
		}
		
	}
}