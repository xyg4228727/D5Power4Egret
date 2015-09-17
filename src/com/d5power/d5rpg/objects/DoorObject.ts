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
/**
 * Created by renhoward on 15/1/24.
 */
module d5power
{
    export class DoorObject extends GameObject
    {
        public static MAX_POOL_NUM:number = 5;
        private static _pool_door:Array<DoorObject>=[];

        public static getDoor():DoorObject
        {
            var obj:DoorObject;
            if(DoorObject._pool_door.length)
            {
                obj = DoorObject._pool_door.pop();
            }else{
                obj = new DoorObject();
            }
            obj._lock=false;
            obj._lastCheck=0;
            return obj;
        }

        private static backDoor(obj:DoorObject):void
        {
            if(DoorObject._pool_door.length<DoorObject.MAX_POOL_NUM && DoorObject._pool_door.indexOf(obj)==-1) DoorObject._pool_door.push(obj);
        }

        public constructor(){
            super();
        }

        private _lastCheck:number;
        private _lock:boolean;
        public renderAction():void
        {
            if(!this._lock && D5Game.me.timer-this._lastCheck>500 && egret.Point.distance(this._data.$pos,D5Game.me.player.$pos)<50)
            {
                this._lastCheck = D5Game.me.timer;
                this._lock = true;
                console.log("change Map");
                D5Game.me.changeMap(<number>this._data.linkMap,<number>this._data.linkPosx,<number>this._data.linkPosy);
            }
        }

        public dispose():void {
            if (this._spriteSheet)
            {
                this._spriteSheet.unlink();
                this._spriteSheet=null;
            }
            this._data = null;
            this._monitor.texture = null;
            this._drawAction = null;

            if(this.contains(this._monitor)) this.removeChild(this._monitor);
            DoorObject.backDoor(this);
        }
    }
}