
module d5power {

	export class D5HoverText extends D5Text{
		/**
		 * 鼠标经过颜色
		 */ 
		private _hoverColor:number = 0;
		/**
		 * 鼠标经过透明度
		 */ 
		private _hoverAlpha:number;
		/**
		 * 鼠标经过是否提示
		 */ 
		private _hover:boolean;
		
		/**
		 * 是否选定状态
		 */ 
		private _isHover:boolean;

		/**
		 *数据
		 */
		private _data:any;
		
		public get className():string{
			return 'D5HoverText';
		}

		public constructor(_text:string='', fontcolor:number=-1, bgcolor:number=-1, border:number=-1, size:number=12){
			super(_text, fontcolor, bgcolor, border, size);
			this.touchChildren = true;
			this.touchEnabled = true;
		}
		
		public init(e:Event=null):void{
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
			this.addEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
		}
		
		private onRemove(e:Event):void{
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
			this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
		}
		
		/**
		 * 设置状态
		 */ 
		public setHover(colorV:number,alphaV:number):void{
			this._hover = true;
			this._hoverColor = colorV;
			this._hoverAlpha = alphaV;
			this.unhover();
			
			if(!this.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)){
				this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
				this.addEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
				this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
			}
		}
		
		public hover():void{
			if(!this._hover) return;
			this.graphics.clear();
			this.graphics.beginFill(this._hoverColor,this._hoverAlpha);
			this.graphics.drawRect(0,0,this._textField.width,this._textField.height);
			this.graphics.endFill();
			this._isHover = true;
		}
		
		public unhover():void{
			if(!this._hover) return;
			this.graphics.clear();
			this.graphics.beginFill(this._hoverColor,0);
			this.graphics.drawRect(0,0,this._textField.width,this._textField.height);
			this.graphics.endFill();
			
			this._isHover = false;
		}
		
		public get isHover():boolean{
			return this._isHover;
		}
		
		public onMouse(e:egret.TouchEvent):void{
			switch(e.type){
				case egret.TouchEvent.TOUCH_BEGIN:
					this.hover();
					break;
				case egret.TouchEvent.TOUCH_END:
					this.unhover();
					break;
			}
		}
		public setData(data:any):void
		{
			this._data = data;
		}
		public get data():any
		{
			return this._data;
		}
	}
}