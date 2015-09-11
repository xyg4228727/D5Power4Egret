module d5power
{
    export class ListCell extends egret.Sprite
    {
        private text:d5power.D5Text;

        private loop:d5power.D5MirrorLoop;

        private _id:number;

        public constructor()
        {
            super();
        }

        public setBtnID(id:number):void
        {
            this._id = id;
        }

        public get btnID():number
        {
           return this._id;
        }

        public showCell(w:number,msg:string):void
        {
            this.touchEnabled = true;

            this.loop = new d5power.D5MirrorLoop();
            this.loop.setSkin('loop0');
            this.loop.setSize(w,0);
            this.addChild(this.loop);

            this.text = new d5power.D5Text();
            this.text.setWidth(w);
            this.text.setFontSize(5);
            this.text.setTextColor(0xff0000);
            this.text.setText(msg);
            this.addChild(this.text);

        }

        public dispose():void
        {
            if(this.text.parent)  this.text.parent.removeChild( this.text);
            this.text = null;

            if(this.loop.parent) this.loop.parent.removeChild(this.loop);
            this.loop = null;
        }

    }
}
