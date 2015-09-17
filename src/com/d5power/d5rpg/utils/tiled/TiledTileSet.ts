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

	export class TiledTileSet{
		private _tileProps:Array<any> = [];
		private _image:egret.Texture = null;
		
		public firstGID:number = 0;
		public map:TiledMap;
		public name:string;
		public tileWidth:number = 0;
		public tileHeight:number = 0;
		public spacing:number = 0;
		public margin:number = 0;
		public imageSource:string = "";
        public imageheight: number = 0;
        public imagewidth: number = 0;
		
		// available only after immage has been assigned:
		public numTiles:number = 0xFFFFFF;
		public numRows:number = 1;
		public numCols:number = 1;
		
		public constructor(source:any, parent:TiledMap){
			this.firstGID = source.firstgid;
			
			this.imageSource =  source.image;
			
			this.map = parent;
			this.name = source.name;
			this.tileWidth = source.tilewidth;
			this.tileHeight = source.tileheight;
            this.imagewidth = source.imagewidth;
            this.imageheight = source.imageheight;
			this.spacing = source.spacing;
			this.margin = source.margin;
            this.numTiles = source.tilecount;
            this.numRows = Math.ceil(this.imagewidth/this.tileWidth);
            this.numCols = Math.ceil(this.imageheight/this.tileHeight);
			// read properties
//			var length:number = source.tile.length;
//			for(var i:number = 0;i < length;i++){
//				var node:any = source.tile[i];
//				if (node.properties[0])
//					this._tileProps[parseInt(node.id)] = new TiledPropertySet(node.properties[0]);
//			}
		}
		
		public toJson():any{
			var result:any = new Object;
			result.firstGID = this.firstGID;
			result.imageSource = this.imageSource;
			result.name = this.name;
			result.tileWidth = this.tileWidth;
			result.tileHeight = this.tileHeight;
			result.spacing = this.spacing;
			result.margin = this.margin;
			var temp:Array<any> = new Array<any>();
			var length:number = this._tileProps.length;
//			for(var i:number = 0;i < length;i++){
//				var node:TiledPropertySet = this._tileProps[i];
//				temp.push(node.toJson());
//			}
			result.tile = temp;
			
			return result;
		}
		
		public get image():egret.Texture {
			return this._image;
		}
		
		public set image(v:egret.Texture) {
			this._image = v;
			// TODO: consider spacing & margin
			this.numCols = Math.floor(v.textureWidth / this.tileWidth);
			this.numRows = Math.floor(v.textureHeight / this.tileHeight);
			this.numTiles = this.numRows * this.numCols;
		}
		
		public hasGid(gid:number = 0):boolean {
			return (gid >= this.firstGID) && (gid < this.firstGID + this.numTiles);
		}
		
		public fromGid(gid:number = 0):number {
			return gid - this.firstGID;
		}
		
		public toGid(id:number = 0):number {
			return this.firstGID + id;
		}
		
//		public getPropertiesByGid(gid:number = 0):TiledPropertySet {
//			return this._tileProps[gid - this.firstGID];
//		}
//		
//		public getProperties(id:number = 0):TiledPropertySet {
//			return this._tileProps[id];
//		}
		
		public getRect(id:number = 0):egret.Rectangle {
			// TODO: consider spacing & margin
			return new egret.Rectangle(((id-this.firstGID) % this.numCols) * this.tileWidth, Math.floor((id-this.firstGID) / this.numCols) * this.tileHeight, this.tileWidth, this.tileHeight);
		}
		
	}
}