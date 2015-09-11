
module d5power {

	export class UVData{
		public offX:number = 0;
		public offY:number = 0;
		
		public width:number = 0;
		public height:number = 0;
		
		public u:number;
		public v:number;
		public w:number;
		public h:number;
		
		public format(data:any):void{
			this.offX = parseInt(data.offX);
			this.offY = parseInt(data.offY);
			this.width = parseInt(data.width);
			this.height = parseInt(data.height);
			
			this.u = <number><any> (data.u);
			this.v = <number><any> (data.v);
			this.w = <number><any> (data.w);
			this.h = <number><any> (data.h);
		}
	}
}