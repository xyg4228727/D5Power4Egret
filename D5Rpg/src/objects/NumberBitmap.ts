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
 * Created by Administrator on 2015/6/15.
 */
module d5power {
    export class NumberBitmap extends egret.Sprite
    {
        private _content:string;
        private static NUMBERSTR:string = "-1269345780"
        private static _sheet:egret.SpriteSheet;

        public constructor(value:string)
        {
            super();
            this._content = value;
            if(NumberBitmap._sheet==null)
            {
                this.createTexture();
            }
            this.buildBitmap();
        }
        private createTexture():void
        {
            NumberBitmap._sheet = new egret.SpriteSheet(RES.getRes('number_png'));
            var name:string;
            for(var i:number = 0;i<NumberBitmap.NUMBERSTR.length;i++)
            {
                name = NumberBitmap.NUMBERSTR.charAt(i);
                NumberBitmap._sheet.createTexture(name,20*i,0,20,20,0,0,20,20);
            }
        }
        private buildBitmap():void
        {
            var bitmap:egret.Bitmap;
            var value:string;
            for(var i:number = 0;i<this._content.length;i++)
            {
                value = this._content.charAt(i);
                bitmap = new egret.Bitmap();
                bitmap.texture = NumberBitmap._sheet.getTexture(value);
                bitmap.x = 18*i;
                this.addChild(bitmap);
            }
            this.cacheAsBitmap = true;
        }
    }
}