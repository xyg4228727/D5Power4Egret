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
    export class D5Camera implements ICamera {
        /**
         * 分布渲染时间限制。每次渲染的最大允许占用时间，单位毫秒
         */
        public static RenderMaxTime:number = 10;

        /**
         * 摄像机可视区域
         */
        private static _cameraView:egret.Rectangle;

        /**
         * 是否需要重新裁剪
         */
        public static $needreCut:boolean;

        private _cameraCutView:egret.Rectangle;

        private _zorderSpeed:number = 600;
        /**
         * 视口左上角对应的世界坐标X
         */
        public _zeroX:number = 0;
        /**
         * 视口左上角对应的世界坐标Y
         */
        public _zeroY:number = 0;
        /**
         * 镜头注视
         */
        public _focus:IGD;

        public _timer:egret.Timer;

        public _moveSpeed:number=1;

        private _moveStart:egret.Point;
        private _moveEnd:egret.Point;
        private _moveAngle:number = 0;
        private _moveCallBack:Function;

        public static get needreCut():boolean {
            return D5Camera.$needreCut;
        }

        public constructor() {
            if (D5Camera._cameraView == null) D5Camera._cameraView = new egret.Rectangle();
            this._cameraCutView = new egret.Rectangle();
        }

        public get zeroX():number {
            return isNaN(this._zeroX) ? 0 : this._zeroX;
        }

        public get zeroY():number {
            return isNaN(this._zeroY) ? 0 : this._zeroY;
        }

        public setZero(x:number, y:number):void {

            this._zeroX = x;
            this._zeroY = y;

            var value:number = D5Game.me.map.width - D5Game.me.screenWidth;
            this._zeroX = this._zeroX < 0 ? 0 : this._zeroX;
            this._zeroX = this._zeroX > value ? value : this._zeroX;

            value = D5Game.me.map.height - D5Game.me.screenHeight;
            this._zeroY = this._zeroY < 0 ? 0 : this._zeroY;
            this._zeroY = this._zeroY > value ? value : this._zeroY;

        }

        public update():void {
            if (this._focus) {
                this._zeroX = this._focus.posX - (D5Game.me.screenWidth >> 1);
                this._zeroY = this._focus.posY - (D5Game.me.screenHeight >> 1);
                //console.log("[D5Camera] update in _fouces",this._zeroX,this._zeroY,this._focus.posX,this._focus.posY);
                var value:number = D5Game.me.map.width - D5Game.me.screenWidth;
                this._zeroX = this._zeroX < 0 ? 0 : this._zeroX;
                this._zeroX = this._zeroX > value ? value : this._zeroX;

                value = D5Game.me.map.height - D5Game.me.screenHeight;
                this._zeroY = this._zeroY < 0 ? 0 : this._zeroY;
                this._zeroY = this._zeroY > value ? value : this._zeroY;

            }

            D5Camera._cameraView.x = this._zeroX;
            D5Camera._cameraView.y = this._zeroY;

            D5Camera._cameraView.width = D5Game.me.screenWidth;
            D5Camera._cameraView.height = D5Game.me.screenHeight;
        }

        /**
         * 镜头注视
         */
        public setFocus(o:IGD):void {
            this._focus = o;
            this.update();
            this.reCut();
        }

        public get focus():IGD {
            return this._focus;
        }

        /**
         * 镜头移动速度
         */
        public set moveSpeed(s:number) {
            this._moveSpeed = s;
        }

        /**
         * 镜头视野矩形
         * 返回镜头在世界地图内测区域
         */
        public static get cameraView():egret.Rectangle {
            return D5Camera._cameraView;
        }

        /**
         * 镜头裁剪视野
         */
        public get cameraCutView():egret.Rectangle {
            var zero_x:number = this._zeroX;
            var zero_y:number = this._zeroY;

            if (zero_x > 0)zero_x -= D5Game.me.map.tileWidth * 2;
            if (zero_x > 0)zero_y -= zero_y - D5Game.me.map.tileHeight * 2;

            zero_x = zero_x < 0 ? 0 : zero_x;
            zero_y = zero_y < 0 ? 0 : zero_y;


            this._cameraCutView.x = zero_x;
            this._cameraCutView.y = zero_y;
            this._cameraCutView.width = D5Game.me.screenWidth + D5Game.me.map.tileWidth * 2;
            this._cameraCutView.height = D5Game.me.screenHeight + D5Game.me.map.tileHeight * 2;

            return this._cameraCutView;
        }

        /**
         * 镜头向上
         * @param    k    倍率
         */
        public moveNorth(k:number = 1):void {
            if (this._moveSpeed == 0 || this._zeroY == 0) return;
            this.setFocus(null);
            this.setZero(this._zeroX, this._zeroY - this._moveSpeed * k);
            this.reCut();
        }

        /**
         * 镜头向下
         */
        public moveSourth(k:number = 1):void {
            if (this._moveSpeed == 0) return;
            this.setFocus(null);
            this.setZero(this._zeroX, this._zeroY + this._moveSpeed * k);
            this.reCut();
        }

        /**
         * 镜头向左
         */
        public moveWest(k:number = 1):void {
            if (this._moveSpeed == 0 || this._zeroX == 0) return;
            this.setFocus(null);
            this.setZero(this._zeroX - this._moveSpeed * k, this._zeroY);
            this.reCut();
        }

        /**
         * 镜头向右
         */
        public moveEast(k:number = 1):void {
            if (this._moveSpeed == 0) return;
            this.setFocus(null);
            this.setZero(this._zeroX + this._moveSpeed * k, this._zeroY);
            this.reCut();
        }

        public move(xdir:number, ydir:number, k:number = 1):void {
            this.setFocus(null);
            this.setZero(this._zeroX + this._moveSpeed * xdir * k, this._zeroY + this._moveSpeed * ydir * k);
            this.reCut();
        }

        /**
         * 镜头观察某点
         */
        public lookAt(x:number, y:number):void {
            this.setFocus(null);
            this.setZero(x - (D5Game.me.screenWidth >> 1), y - (D5Game.me.screenHeight >> 1));
            this.reCut();
        }

        public flyTo(x:number, y:number, callback:Function = null):void {
            if (this._timer != null) {
                console.log("[D5Camera] Camera is moving,can not do this operation.");
                return;
            }
            this.setFocus(null);
            this._moveCallBack = callback;

            this._moveStart = new egret.Point(this._zeroX - (D5Game.me.screenWidth >> 1), this._zeroY - (D5Game.me.screenHeight >> 1));

            this._moveEnd = new egret.Point(x - (D5Game.me.screenWidth >> 1), y - (D5Game.me.screenHeight >> 1));

            this._timer = new egret.Timer(50);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
            this._timer.start();
        }

        public moveCamera(e:egret.TimerEvent):void {
            var xspeed:number = (this._moveEnd.x - this._moveStart.x) / 5;
            var yspeed:number = (this._moveEnd.y - this._moveStart.y) / 5;
            this._moveStart.x += xspeed;
            this._moveStart.y += yspeed;
            this.setZero(this._moveStart.x, this._moveStart.y);
            if ((xspeed > -.5 && xspeed < .5) && (yspeed > -.5 && yspeed < .5)) {
                //_scene.Map.$Center = _moveEnd;
                this._moveEnd = null;
                this._timer.stop();
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
                this._timer = null;
                this.reCut();
                if (this._moveCallBack != null) this._moveCallBack();
            }
        }

        public get zorderSpeed():number {
            return this._zorderSpeed;
        }

        public reCut():void {
            var list:Array<IGD> = D5Game.me.dataList;
            var length:number = list.length;
            var obj:IGD;
            var contains:boolean;
            //console.log("[D5Camera] there are ",length,"objects.");
            for (var i:number = 0; i < length; i++) {
                obj = list[i];
                if (obj == D5Game.me.player) continue;
                contains = D5Camera.cameraView.containsPoint(obj.$pos);
                //console.log("[D5Camera] check ",obj.$pos,D5Camera.cameraView);
                if (!obj.inScreen && contains) {
                    D5Game.me.add2Screen(obj);
                } else if(obj.inScreen && !contains) {
                    D5Game.me.remove4Screen(obj);
                }
            }
        }
    }
}
