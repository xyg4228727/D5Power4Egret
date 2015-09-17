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

	export class D5Swf extends D5Component implements ISpriteSheetWaiter
    {
		public _src:string;
		public _zoom:number;
		private _drager:egret.Shape;
		protected _loadID:number=0;
		public _spriteSheet:IDisplayer;
		protected _monitor:egret.Bitmap;
		private _lastRender:number;

		private _playFrame:number=0;

		public constructor(){
			super();
			this._monitor = new egret.Bitmap();
			this._zoom = 1;
		}
		
		public setSrc(src:string):void{
			this._src = src;
            this.addParticle();
		}
		public get loadID():number
		{
			return this._loadID;
		}
		public setEditorMode():void{
			if(!this._drager){
				this._drager = new egret.Shape();
				this._drager.graphics.beginFill(Math.random()*0xffffff,.5);
				this._drager.graphics.drawRect(-20,-20,40,40);
				this._drager.graphics.endFill();
			}
			
			this.addChild(this._drager);
		}

        private addParticle():void
        {
			this._loadID++;
			D5SpriteSheet.getInstance(this._src+'.png',this);
			//RES.getResByUrl(this._src+'.png', this.onTextureComplete, this);
        }
		public onSpriteSheepReady(data:IDisplayer):void
		{
			if (this._spriteSheet) this._spriteSheet.unlink();
			this._spriteSheet = data;
			if(!this.contains(this._monitor)) this.addChild(this._monitor);
			this.onLoadComplate();
			this.addEventListener(egret.Event.ENTER_FRAME, this.runAction, this);
		}
		private runAction(e:egret.Event):void
		{
			if(egret.getTimer()-this._lastRender<this._spriteSheet.renderTime) return;
			this._lastRender = egret.getTimer();
			this._monitor.texture = this._spriteSheet.getTexture(0,this._playFrame);

			this._playFrame++;
			if(this._playFrame>=this._spriteSheet.totalFrame) this._playFrame=0;
		}
        //private onTextureComplete(data:egret.Texture):void
        //{
		//	this._sheet = new egret.SpriteSheet(data);
		//	RES.getResByUrl(this._src+'.json', this.onDataComplate, this);
        //}
        //
		//private onDataComplate(data:any):void
		//{
		//	//{"X":-59,"shadowY":12,"FrameWidth":120,"shadowX":20,"Direction":1,"Time":120,"Frame":4,"Y":-114,"FrameHeight":120}
		//	this._totalFrame = parseInt(<string><any>data.Frame);
		//	this._renderTime = parseInt(<string><any>data.Time);
		//	this._shadowX = parseInt(<string><any>data.shadowX);
		//	this._shadowY = parseInt(<string><any>data.shadowY);
		//	if (this._shadowY >= this._shadowX) this._shadowY = data.shadowX * 0.5;
		//	this._totalDirection = parseInt(<string><any>data.Direction);
		//	switch (parseInt(<string><any>data.Direction)) {
		//		case 1:
		//			this._totalDirection = 2;
		//			break;
		//		case 5:
		//			this._totalDirection = 8;
		//			break;
		//		case 3:
		//			this._totalDirection = 4;
		//			break;
		//	}
		//	this._gX = parseInt(<string><any>data.X);
		//	this._gY = parseInt(<string><any>data.Y);
		//	this._frameW = parseInt(<string><any>data.FrameWidth);
		//	this._frameH = parseInt(<string><any>data.FrameHeight);
        //
		//	//console.log("[D5SpriteSheepINIT] renderTime:",this._renderTime,",shadowY:",this._shadowY);
        //
		//	var i:number;
		//	var l:number;
        //
		//	if (data.uv) {
		//		//console.log("[D5SpriteSheepINIT] totalFrame:",this._totalFrame,",uvdata nums:",data.uv.length);
		//		for (l = 0; l < this._totalDirection; l++) {
		//			for (i = 0; i < this._totalFrame; i++) {
		//				var uvLine:number = l < 5 ? l : 8 - l;
		//				var uv:any = data.uv[uvLine * this._totalFrame + i];
		//				if (uv == null) {
		//					console.log("[D5SpriteSheepINIT] can not find uv config line:", l, ",frame:", i, "===========================");
		//				} else {
		//					this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height, l < 5 ? uv.offX : -uv.width - uv.offX, uv.offY);
		//				}
		//			}
		//		}
		//	} else {
		//		for (l = 0; l < this._totalDirection; l++) {
		//			for (i = 0; i < this._totalFrame; i++) {
		//				this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, data.FrameWidth, data.FrameHeight, data.X, data.Y);
		//			}
		//		}
		//	}
		//}
		//public getTexture(dir:number,frame:number):egret.Texture
		//{
		//	return this._sheet==null ? null : this._sheet.getTexture('frame'+dir+'_'+frame);
		//}
		public setZoom(value:number){
			if(this._zoom==value) return;
			this._zoom = value;
			this.invalidate();
		}
		
		private onLoadComplate():void
        {
			//if(this._w==0){
			//	this._w = data.width;
			//	this._h = data.height;
			//}
			if(this._drager) this.addChild(this._drager);
			this.invalidate();
			this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
		}
		
		public draw():void
        {
			if(this._zoom!=1) this.scaleX = this.scaleY = this._zoom;
			
			this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
		}
	}
}