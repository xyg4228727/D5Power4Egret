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
    export class EffectMakcer {
        private _data:EffectData;
        private _owner:IGD;
        private _target:IGD;
        private _keep_time:number;
        private frame:number = 0;
        private _posx:number;
        private _posy:number;
        public constructor(data:EffectData,keep:number = 0,posx:number=0,posy:number=0,doer:IGD=null,target:IGD=null,skill:number=0){
            this._owner = doer;
            this._target = target;
            this._data = data;
            this._posx = posx;
            this._posy = posy;
            this._keep_time = keep;
        }
        
        private _lastTime:number = 0;
        public render():void
        {
            var impl:EffectImplement;
            var obj:EffectObject;
            if(D5Game.me.timer-this._lastTime>120)
            {
                for(var i:number = 0;i<this._data.implements.length;i++)
                {
                    impl = this._data.implements[i];
                    if(this.frame==impl.startFrame)
                    {
                        if(impl.sonAngleAdd>0)
                        {

                        }
                        else
                        {
                            obj = EffectObject.getObject();
                            obj.setup(impl);
                        }
                    }
                }
                this.frame++;
            }
        }
    }
}
