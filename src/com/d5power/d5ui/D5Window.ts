module d5power
{
    export class D5Window extends D5Component
    {
        private lt:egret.Bitmap;
        private t:egret.Bitmap;
        private rt:egret.Bitmap;
        private l:egret.Bitmap;
        private m:egret.Bitmap;
        private r:egret.Bitmap;
        private lb:egret.Bitmap;
        private b:egret.Bitmap;
        private rb:egret.Bitmap;

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
                trace("[D5Window]No Resource"+name);
                return;
            }

            this.lt = new egret.Bitmap();
            this.lt.texture = data.getResource(0);

            this.t = new egret.Bitmap();
            this.t.texture = data.getResource(1);
            this.t.fillMode = egret.BitmapFillMode.REPEAT;

            this.rt = new egret.Bitmap();
            this.rt.texture = data.getResource(2);

            this.l = new egret.Bitmap();
            this.l.texture = data.getResource(3);
            this.l.fillMode = egret.BitmapFillMode.REPEAT;

            this.m = new egret.Bitmap();
            this.m.texture = data.getResource(4);
            this.m.fillMode = egret.BitmapFillMode.REPEAT;

            this.r = new egret.Bitmap();
            this.r.texture = data.getResource(5);

            this.lb = new egret.Bitmap();
            this.lb.texture = data.getResource(6);

            this.b = new egret.Bitmap();
            this.b.texture = data.getResource(7);
            this.b.fillMode = egret.BitmapFillMode.REPEAT;

            this.rb = new egret.Bitmap();
            this.rb.texture = data.getResource(8);

            //trace(list[0].textureWidth.toString(),list[0].textureHeight.toString());
            this.invalidate();

        }

        public draw():void
        {
            if(this.l==null)
            {

            }else{
                if(!this.contains(this.l))
                {
                    this.addChildAt(this.lt,0);
                    this.addChildAt(this.t,0);
                    this.addChildAt(this.rt,0);
                    this.addChildAt(this.l,0);
                    this.addChildAt(this.m,0);
                    this.addChildAt(this.r,0);
                    this.addChildAt(this.lb,0);
                    this.addChildAt(this.b,0);
                    this.addChildAt(this.rb,0);
                }

                this.m.width = this.t.width = this.b.width = this._w-this.lt.width - this.rt.width;
                this.m.height = this.l.height = this.r.height = this._h-this.lt.height - this.lb.height;

                this.t.x = this.m.x = this.b.x = this.lt.width;
                this.rt.x = this.r.x = this.rb.x = this.lt.width + this.t.width;

                this.l.y = this.m.y = this.r.y = this.lt.height;
                this.lb.y = this.b.y = this.rb.y = this.lt.height + this.l.height;



            }

            super.draw();
        }
    }
}