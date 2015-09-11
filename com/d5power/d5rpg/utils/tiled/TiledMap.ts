
module d5power {

	export class TiledMap{
		public width:number = 0;
		public height:number = 0;
		public tileWidth:number = 0;
		public tileHeight:number = 0;
		public version:number = 0;
		
		public orientation:string;
		public renderorder:string;
		
		public nextobjectid:number = 0;
		

//		public properties:TiledPropertySet = null;
		public layers:any = {};
		public tileSets:any = {};
		public objectGroups:any = {};
        public imgLib: Array<any>;
		
		public layers_ordered:Array<string>;
		
		public constructor(){
		}
		
		public format(data:any):void{
			this.width = parseInt(data.width);
			this.height = parseInt(data.height);
			this.tileWidth = parseInt(data.tilewidth);
			this.tileHeight = parseInt(data.tileheight);
			this.version = parseInt(data.version);
			this.orientation = <string><any> (data.orientation);
			this.renderorder = <string><any> (data.renderorder);
			this.nextobjectid = parseInt(data.nextobjectid);
			
			var node:any = null;
//			var length:number = data.properties.length;
//			for(var i:number = 0;i < length;i++){
//				node = data.properties[i];
//				this.properties = this.properties ? this.properties.format(node) : new TiledPropertySet(node);
//			}
//			// load tilesets
//
            this.imgLib = new Array<any>();
			var length1:number = data.tilesets.length;
			for(var i1:number = 0;i1 < length1;i1++){
				node = data.tilesets[i1];
				var tiledset:TiledTileSet = new TiledTileSet(node, this);	
                this.tileSets[node.name] = tiledset;
                this.imgLib.push(tiledset);
			}

			
			// load layers
			this.layers_ordered = new Array<string>();
			var length2:number = data.layers.length;
			for(var i2:number = 0;i2 < length2;i2++){
				node = data.layers[i2];
				this.layers[node.name] = new TiledLayer(node, this);
				this.layers_ordered.push(node.name);
			}
			
			// load object group
//			var length3:number = data.objectgroup.length;
//			for(var i3:number = 0;i3 < length3;i3++){
//				node = data.objectgroup[i3];
//				this.objectGroups[node.name] = new TiledObjectGroup(node, this);
//			}
		}
		
		

		
		public getTileSet(name:string):TiledTileSet {
			return <TiledTileSet><any> (this.tileSets[name]);
		}
		
		public getLayer(name:string):TiledLayer {
			return <TiledLayer><any> (this.layers[name]);
		}
		
//		public getObjectGroup(name:string):TiledObjectGroup {
//			return <TiledObjectGroup><any> (this.objectGroups[name]);
//		}
		
		// works only after TmxTileSet has been initialized with an image...
		public getGidOwner(gid:number = 0):TiledTileSet {
			var length:number = this.tileSets.length;
			for(var i:number = 0;i < length;i++){
				var tileSet:TiledTileSet = this.tileSets[i];
				if (tileSet.hasGid(gid))
					return tileSet;
			}
			return null;
		}
	}
}