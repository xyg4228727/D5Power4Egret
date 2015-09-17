//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

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