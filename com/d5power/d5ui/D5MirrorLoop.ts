module d5power
{
    export class D5MirrorLoop extends D5Component
    {
        private front:egret.Bitmap;

        private enter:egret.Bitmap;

        private after:egret.Bitmap;


        public constructor()
        {
            super();
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5MirrorLoop]No Resource"+name);
                return;
            }

            if(D5UIResourceData._typeLoop == 0)   //x轴D5UIResourceData._typeLoop == 0
            {
                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleX = -1;
            }else{

                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleY = -1;
            }

            this.invalidate();

        }

        public draw():void
        {
            if(this.front==null)
            {

            }else{

                if(!this.contains(this.front)) {

                    this.addChildAt(this.front,0);
                    this.addChildAt(this.enter,0);
                    this.addChildAt(this.after,0);
                }
            }

            if(D5UIResourceData._typeLoop == 0)
            {
                this.enter.x = this.front.width;
                this.enter.width = this._w - this.front.width * 2;
                this.after.x = this._w;
            }else{
                this.enter.y = this.front.height;
                this.enter.height = this._h - this.front.height * 2;
                this.after.y = this._h;
            }

            super.draw();

        }



    }
}
