module d5power
{
    export class D5Button extends D5Component
    {
        private a:egret.Bitmap;

        private data:D5UIResourceData;

        private _lable:d5power.D5Text;

        private sound:string;
       
        private _callback2:Function;

        protected _icon:D5Bitmap;

        protected _iconAutoFly:boolean=false;

        public constructor()
        {
            super();
        }

        public showIcon(v:boolean):void
        {
            if(this._icon) this._icon.visible = v;
        }

        public get iconDisplay():Boolean
        {
            return this._icon==null ? false : this._icon.visible;
        }

        public setIcon(url:string,xpos:number=0,ypos:number=0):void
        {
            if(url=='')return;
            if(!this._icon)this._icon = new D5Bitmap();
            this._icon.setSkin(url);
            this._icon.x = xpos;
            this._icon.y = ypos;
            if(this._icon.x==0 && this._icon.y==0) this._iconAutoFly = true;

            if(this.width!=0) this.flyIcon();
        }

        private flyIcon():void
        {
            if(this._icon)
            {
                if(this.contains(this._icon))
                    this.setChildIndex(this._icon,this.numChildren-1);
                else
                    this.addChild(this._icon);

                if(this._lable && this.contains(this._lable) && this.contains(this._icon) && this._iconAutoFly)
                {
                    this._icon.x = (this.a.width-this._icon.width-this._lable.width) >> 1;
                    this._lable.x = this._icon.x + this._icon.height;
                }else{
                    if(this._icon.x==0){
                        this._icon.x = (this.width-this._icon.width)>>1;
                    }
                    if(this._icon.y==0){
                        this._icon.y = (this.height-this._icon.height)>>1;
                    }
                }
            }
        }

        public setLable(lab:string):void
        {
            if(this._lable==null)
            {
                this._lable = new d5power.D5Text();
                this._lable.setFontSize(d5power.D5Style.default_btn_lable_size);
                this._lable.setFontBold(d5power.D5Style.default_btn_lable_bold);
                if(d5power.D5Style.default_btn_lable_border!=-1) this._lable.setFontBorder(d5power.D5Style.default_btn_lable_border);
                this.addChild(this._lable);
            }

            this._lable.setText(lab);
            this._lable.setWidth(lab.length * 12);
            this._lable.setHeight(12);
        }

        private autoLableSize():void
        {
            if(this._lable==null || this.a==null) return;
            this._lable.x = Math.abs(this.a.width-this._lable.width) / 2;
            this._lable.y = Math.abs(this.a.height-this._lable.height) / 2;
        }

        public enabled(b:boolean):void
        {
            this.touchEnabled = b;
            if(b) {
                this.a.texture = this.data.getResource(0);
            }
            else{
                if(this.data.buttonType==2)
                {
                    this.a.texture = this.data.getResource(0);
                }
                else
                {
                    this.a.texture = this.data.getResource(3);
                }
            }
            this.invalidate();
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            this.data = D5UIResourceData.getData(name);
            if(this.data==null)
            {
                trace("[D5Button]No Resource"+name);
                return;
            }

            if(this.a==null)this.a = new egret.Bitmap();
            this.a.texture = this.data.getResource(0);

            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.btnDown,this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,this.btnUp,this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClick,this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.btnOutSide,this);

            this.invalidate();

        }
        public setSound(sound:string):void
        {
            sound = sound.replace('resource/','')
            this.sound = sound;
        }

        private btnDown(evt:egret.TouchEvent):void
        {
            if(this.data.buttonType==2) {
                this.a.texture = this.data.getResource(1);
            }else{
                this.a.texture = this.data.getResource(2);
            }
            this.invalidate();
        }

        private btnUp(evt:egret.TouchEvent):void
        {
            this.a.texture = this.data.getResource(0);
  
            this.invalidate();
        }
        private btnOutSide(evt:egret.TouchEvent): void
        {
            this.a.texture = this.data.getResource(0);
            this.invalidate();
        }
        
        private btnClick(evt:egret.TouchEvent): void 
        {
            var sound:egret.Sound = RES.getRes(this.sound);
            if(sound)sound.play();
            if(this._callback2!=null && this.enabled){
                    this._callback2(evt);
            }
            this.invalidate();
        }

        public draw():void
        {
            if(this.a==null)
            {

            }else{

                if(!this.contains(this.a)) {
                    this.addChildAt(this.a,0);

                }
            }


            super.draw();
            if(this._lable != null)
            {
                this.addChild(this._lable);
                this.autoLableSize();
            }
        }
        public  setCallback(fun:Function):void
        {
            this._callback2 = fun;
        }


    }
}
