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
module d5power
{
    export class EffectObject extends egret.DisplayObjectContainer implements ISpriteSheetWaiter
    {
        public static MAX_POOL_NUM:number = 5;
        private static _pool_event:Array<EffectObject>=[];

        public static getObject():EffectObject
        {
            var obj:EffectObject;
            if(EffectObject._pool_event.length)
            {
                obj = EffectObject._pool_event.pop();
            }else{
                obj = new EffectObject();
            }
            return obj;
        }

        private static backEffect(obj:EffectObject):void
        {
            if(EffectObject._pool_event.length<EffectObject.MAX_POOL_NUM && EffectObject._pool_event.indexOf(obj)==-1) EffectObject._pool_event.push(obj);
        }

        public constructor(){
            super();
        }
        public get loadID():number
        {
            return this._loadID;
        }
        private _lastRender:number;
        private _data:EffectImplementData;
        private _playFrame:number=0;
        private _totalframe:number;
        public _spriteSheet:IDisplayer;
        protected _monitor:egret.Bitmap;
        private _loadID:number=0;
        private _sheet:egret.SpriteSheet;
        private _res:string;
        protected _drawAction:Function;
        private _liveStart:number = 0;
        public setup(data:EffectImplementData):void
        {
            this._data = data;
            var res:string = this._data.res;
            if(res.indexOf('.json')!=-1)
            {
                this._res = res.substr(0,res.length-5);
                this._loadID++;
                D5SpriteSheet.getInstance(this._res+'.png',this);
            }
            else if(res.indexOf('.png')!=-1)
            {
                this._res = res
                RES.getResByUrl(this._res, this.onTextureComplete, this);
            }
            this._liveStart = egret.getTimer();
        }
        private onTextureComplete(data:egret.Texture):void
        {
            this._monitor = new egret.Bitmap(data);
            this._totalframe = 5;
            this._drawAction = this.draw;
            if(!this.contains(this._monitor)) this.addChild(this._monitor);
        }

        public onSpriteSheepReady(data:IDisplayer):void
        {
            if (this._spriteSheet) this._spriteSheet.unlink();
            this._spriteSheet = data;
            this._totalframe = this._spriteSheet.totalFrame;
            this._drawAction = this.drawJson;
            if(!this.contains(this._monitor)) this.addChild(this._monitor);
        }


        private _lastCheck:number;
        private _effectImplData:EffectImplementData;
        public renderAction():void
        {
            this._drawAction!=null ? this._drawAction() : 0;
        }
        private draw():void
        {
            var t:number = egret.getTimer();

            if(this._data.live>0 && t-this._liveStart>this._data.live)
            {
                this.dispose();
                return;
            }


            var cost_time:number = (t - this._liveStart) /this._data.playSpeed;
            if (this._playFrame != cost_time)
            {
                this._playFrame = cost_time;
                if(this._data.alphaSpeed!=0)
                {
                    this._monitor.alpha+=this._data.alphaSpeed;
                    if(this._monitor.alpha<=0)
                    {
                        this.dispose();
                        return;
                    }
                }

                if(this._data.zoomSpeed!=0)
                {
                    this._monitor.scaleX+=this._data.zoomSpeed;
                    this._monitor.scaleY+=this._data.zoomSpeed;
                }

                if(this._data.rotationSpeed!=0)
                {
                    this.rotation+=this._data.rotationSpeed;
                }

                //if(this._data.moveSpeed!=0)
                //{
                //    this._monitor.x+=Math.cos(this._data.moveAngle)*this._data.moveSpeed;
                //    this._monitor.y+=Math.sin(this._data.moveAngle)*this._data.moveSpeed;
                //
                //    _bmpPos2.x = this._monitor.x;
                //    _bmpPos2.y = this._monitor.y;
                //}
                //
                //if(this._playFrame==this._data.sonFrame && this._data.sonFrameDeep>0)
                //{
                //    var obj:EffectObject = this.clone(true);
                //    obj._sonDeep = --_sonDeep;
                //    obj.x = this.x+this._data.sonSpeed*Math.cos(this._data.sonAngle);
                //    obj.y = this.y+this._data.sonSpeed*Math.sin(_sonAngle);
                //    obj.openAutoRender();
                //}

                if(this._playFrame==this._totalframe-1 && this._totalframe>0)
                {
                    this.dispose();
                }
            }
        }
        private drawJson():void
        {
            if(egret.getTimer()-this._lastRender<this._spriteSheet.renderTime) return;
            this._lastRender = egret.getTimer();
            var direction:number = 0;
            this._monitor.texture = this._spriteSheet.getTexture(direction,this._playFrame);
            if(this._spriteSheet.uvList)
            {
                this._monitor.x = this._spriteSheet.uvList[direction*this._spriteSheet.totalFrame+this._playFrame].offX;
                this._monitor.y = this._spriteSheet.uvList[direction*this._spriteSheet.totalFrame+this._playFrame].offY;
            }
            else
            {
                this._monitor.x = this._spriteSheet.gX;
                this._monitor.y = this._spriteSheet.gY;
            }

            this._playFrame++;
            if(this._playFrame>=this._spriteSheet.totalFrame) this._playFrame=0;
        }
        /**
         * @param	allPro	是否克隆全部属性
         */
        public clone(allPro:boolean=false):EffectObject
        {
            var p:EffectObject = EffectObject.getObject();
            p.x = this.x;
            p.y = this.y;

            p.setup(this._data);
            return p;
        }

        public dispose():void
        {

            EffectObject.backEffect(this);
        }
    }
}
