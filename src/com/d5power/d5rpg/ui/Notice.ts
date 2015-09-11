/**
 * Created by Administrator on 2015/5/22.
 */
module d5power {
    export class Notice extends egret.Sprite
    {
        protected  delete_fun:Function;
        protected  _stayTime:number;

        public  STARTY:number = 80;

        private  noticeMap:Array<any> = [0,0,0,0,0,0];
        private  autoShift:number = 0;
        public constructor(stg:egret.Stage,content:string,dfun:Function=null,config:any=null)
        {
            super();
            this.delete_fun = dfun;
            this._stayTime=120;
            this.buildBuffer(content,config);

            // 开始自动寻找位置
            var fond:Boolean=false;
            for(var i:number = 0,j:number=this.noticeMap.length;i<j;i++)
            {
                if(this.noticeMap[i]==0)
                {
                    this.noticeMap[i] = this;
                    this.x = (stg.stageWidth - this.width)*.5;
                    this.y = this.STARTY+i*(this.height+5);
                    fond = true;
                    break;
                }
            }

            if(!fond)
            {
                (<d5power.Notice>this.noticeMap[this.autoShift])._stayTime = 0;
                this.noticeMap[this.autoShift] = this;
                this.x = (stg.stageWidth - this.width)*.5;
                this.y = this.STARTY+this.autoShift*(this.height+5);
                this.autoShift++;
                if(this.autoShift>=this.noticeMap.length) this.autoShift=0;
            }

            stg.addChild(this);
        }
        protected buildBuffer(content:string,config:any):void
        {
            var color:number = config==null || config.color==null ? 0x00FF00 : config.color;
            var padding:number = 1;

            var lable:d5power.D5Text = new d5power.D5Text('',color);
            lable.setHtmlText(content);
            lable.setFontBorder(config==null || config.borderColor==null ? 0x000000 : config.borderColor);
            lable.setFontSize(config==null || config.size==null ? 16 : config.size);
            if(config!=null && config.width!=null) lable.setWidth(config.width);
            lable.x = lable.y = padding;
            lable.setSize(200,25);
            lable.setTextAlign(1);

            if(config!=null && config.bgcolor!=null)
            {
                this.graphics.beginFill(config.bgcolor,(config!=null && config.bgalpha!=null ? .6 : config.bgalpha));
                this.graphics.drawRect(0,0,lable.width+padding*2,lable.height+padding*2);
                this.graphics.endFill();
            }

            this.addChild(lable);

            this.cacheAsBitmap=true;

            this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrameHander,this);

        }
        protected onEnterFrameHander(e:egret.Event):void
        {
            if(this._stayTime<=0)
            {
                if((this.alpha-0.05)>0)
                {
                    this.alpha-=0.05;
                }else{
                    this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrameHander,this);
                    if(this.parent)this.parent.removeChild(this);
                    if(this.delete_fun!=null) this.delete_fun(this);
                    var id:number = this.noticeMap.indexOf(this);
                    if(id!=-1)
                    {
                        this.noticeMap[id] = 0;
                    }
                    return;
                }
                return;
            }
            this._stayTime--;
        }


    }
}
