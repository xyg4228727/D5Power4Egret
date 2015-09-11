/**
 * Created by Howard on 2015/1/20.
 */
module d5power
{
    export class SimpleDialog extends egret.DisplayObjectContainer implements IDialog
    {
        private _height:number = 120;
        private _padding:number = 5;
        private _shower:egret.TextField;
        private _npcTitle:egret.TextField;
        private _npcHead:egret.DisplayObjectContainer;
        private _content:Array<string>;
        private _container:egret.DisplayObjectContainer;
        private _sayStep:number=0;
        private _bg:egret.Shape;

        private _npcHeadSrc:string;
        private _npcNameSrc:string;
        private _fontSize:number = 14;
        public constructor(cont:egret.DisplayObjectContainer)
        {
            super();
            this._container = cont;
            this._shower = new egret.TextField();
            this._shower.size = this._fontSize;
            this._npcTitle = new egret.TextField();
            this._npcTitle.size = this._fontSize;
            this._npcHead = new egret.DisplayObjectContainer();
        }

        public configDialog(headUrl:string,npcname:string,npcSay:string):void
        {
	        D5Game.me.player.controller.pause();
            if(this._bg==null)
            {
                this._bg = new egret.Shape();
                this._bg.graphics.beginFill(0,.4);
                this._bg.graphics.drawRect(0,0,D5Game.me.screenWidth,this._height);
                this._bg.graphics.endFill();

                this.addChild(this._bg);

                this.y = D5Game.me.screenHeight-this._height;

                this._shower.width = D5Game.me.screenWidth-this._padding*2;


                this._npcTitle.width = this._shower.width;
                this._npcTitle.height = 20;
                this._npcTitle.y = this._padding;


                this._shower.height = this._height-this._padding*3-20;
                this._shower.y = this._npcTitle.y+20+this._padding;


                this.addChild(this._npcTitle);
                this.addChild(this._shower);

            }
            this._npcNameSrc = npcname;
            this._npcHeadSrc = headUrl;

            this._content = npcSay.split(/[\r|]/g);
            this._container.addChild(this);

            this._npcTitle.text = npcname;

            this._sayStep=0;
            this.play();


            D5Game.me.touchReciver.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickNext,this);
        }

        public dispose(e:egret.TouchEvent=null):void{
	    D5Game.me.player.controller.start();
            if(this.parent) this.parent.removeChild(this);
	    D5Game.me.touchReciver.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickNext,this);
        }

        private onClickNext(e:egret.TouchEvent):void
        {
            this._sayStep++;
            if(this._sayStep>=this._content.length)
            {
                this.dispose();
                return;
            }

            this.play();
        }

        private onHead(data:egret.Texture):void
        {
            this._npcHead.removeChildren();

            if(data!=null) this._npcHead.addChild(new egret.Bitmap(data));
        }

        private play():void
        {
            var content:string = this._content[this._sayStep];
            content = content.replace(/{/g,'<');
            content = content.replace(/}/g,'>');

            if(content.substr(0,3)=='[0]')
            {
                content = content.substr(3,content.length-3);
                this._npcTitle.text = D5Game.me.characterData.nickname;
            }

            this._shower.text = content;

            console.log("[SimpleDialog] play");
        }
    }
}
