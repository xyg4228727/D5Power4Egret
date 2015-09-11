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