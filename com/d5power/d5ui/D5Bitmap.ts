module d5power
{
    export class D5Bitmap extends D5Component
    {
        private bit:egret.Bitmap;

        private _url:string;

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
                trace("[D5Bitmap]No Resource"+name);
                var texture:egret.Texture = RES.getRes(name);
                if(texture)
                {
                    this.bit = new egret.Bitmap();
                    this.bit.texture = texture;
                    this.invalidate();
                }
                return;
            }
            if(this.bit == null) 
            {
                this.bit = new egret.Bitmap();
            }
            this.bit.texture = data.getResource(0);

            this.invalidate();
        }

        public setSrc(url:string):void
        {
            this._url = url;
            this.changeParticle();
        }

        private changeParticle():void
        {
            //RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            //RES.loadConfig("resource/resource.json",  "resource/");
            //RES.loadGroup("preload");
            RES.getResByUrl(this._url, this.onComplete, this);
        }
        private onComplete(data:any):void
        {
            trace(this.bit,"D5Bitmap46--------------",this._url);
            if(this.bit == null) this.bit = new egret.Bitmap();
            this.bit.texture = data;
            this.addChild(this.bit);
            if(data==null)
            {
                trace(this.name,'resource hot found ==============');
                return;
            }
            this.setSize(this.bit.texture.textureWidth,this.bit.texture.textureHeight);
            //this.invalidate();
        }

        public draw():void
        {
            if(this.bit==null)
            {

            }else{
                if(!this.contains(this.bit)) {
                    this.addChildAt(this.bit,0);

                }

            }

            super.draw();
        }

    }
}