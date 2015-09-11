/**
 * Created by Administrator on 2015/6/15.
 */
module d5power {
    export class UFlyFont extends egret.DisplayObjectContainer
    {
        private static _pool:Array<any> = new Array<any>();

        public static getInstance(scene:egret.DisplayObjectContainer,skillName:string):UFlyFont
        {
            var obj:UFlyFont;
            if(this._pool.length==0)
            {
                obj = new UFlyFont();
            }else{
                obj = this._pool.pop();
            }
            obj.alpha = 1;
            obj._scene = scene;
            obj.buildBuffer(skillName);
            return obj;
        }

        private static inPool(target:UFlyFont):void
        {
            if(this._pool.indexOf(target)==-1) this._pool.push(target);
        }

        private _scene:egret.DisplayObjectContainer;
        protected  _shower:egret.Sprite;
        private  stayTime:number;
        private  xspeed:number;
        private  yspeed:number ;

        /**
         * @param	scene		场景
         * @param	skillName	技能名称
         * @param	color		字体颜色
         */
        public constructor()
        {
            super();
        }

        protected buildBuffer(name:string):void
        {
            if(this._shower)
            {
                //if(this._shower.parent)this._shower.parent.removeChild(this._shower);
                //this._shower = null;
                this._shower.removeChildren();
            }
            this._shower = new NumberBitmap(name);
            this.addChild(this._shower);

            this.xspeed = Math.random()>0.5 ? 2 : -2;
            this.yspeed = 3;
        }
        public setPos(x:number,y:number):void
        {
            this.x = x;
            this.y = y;
            this._scene.addChild(this);
            this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrameHander,this);
        }

        private onEnterFrameHander():void
        {
            this.y-=this.yspeed;
            this.x+=this.xspeed;

            if((this.alpha-0.01)>0)
            {
                this.alpha-=0.01;
            }else{
                this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrameHander,this);
                if(this.parent)this.parent.removeChild(this);
                UFlyFont.inPool(this);
                return;
            }
            this.yspeed-=0.08;
        }
    }
}
