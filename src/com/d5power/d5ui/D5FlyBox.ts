
module d5power {

	export class D5FlyBox extends D5Component
    {
		public static LEFT:number = 0;
		public static CENTER:number = 1;
		
		private _maxWidth:number = 0;
		private _usedWidth:number = 0;
		private _usedHeight:number = 0;
		private _paddingx:number = 5;
		private _paddingy:number = 5;
		
		private _align:number = 0;
		
		/**
		 * 提供给编辑器使用的背景
		 */ 
		private _editorBG:egret.Shape;
		
		/**
		 * 原始X坐标
		 */ 
		private _zerox:number = 0;


		/**
		 * @pararm	w	最大的自动换行宽度
		 */ 
		public constructor()
        {
            super();
		}
		
		/**
		 * 设置对齐模式
		 */ 
		public setMode(values:number):void
        {
			this._align = values;
			this.redraw();
		}
		
		public setX(value:number):void
        {
//			super.x = value;
			this._zerox = this.x;
		}

		
		public setPaddingx(num:number = 0):void
        {
			this._paddingx = num;
			this.redraw();
		}
		
		public setPaddingy(num:number = 0):void
        {
			this._paddingy = num;
			this.redraw();
		}
		
		public getPaddingx():number
        {
			return this._paddingx;
		}
		
		public getPaddingy():number
        {
			return this._paddingy;
		}
		
		/**
		 * 设置最大宽度，当内容超过最大宽度后，即会自动换行
		 */ 
		public setMaxWidth(w:number = 0):void
        {
			this._maxWidth = w;
			this.redraw();
		}
		
		public get maxWidth():number{
			return this._maxWidth;
		}
		
		public get $maxWidth():number{
			return this._maxWidth;
		}

        public parseToXML():string
        {
            var result:string = "<D5FlyBox name='"+this.name+"' x='"+this.x+"' y='"+this.y+"' maxWidth='"+this._maxWidth+"'/>\n";
            return result;
        }

		public setEditorMode():void{
			if(this._editorBG!=null) return;
			this._editorBG = new egret.Shape();
			this.addChild(this._editorBG);
			this.updateEditorBG();
		}
		
		
		public addChild(child:egret.DisplayObject):egret.DisplayObject{
			var obj:egret.DisplayObject = super.addChild(child);
			obj.addEventListener(egret.Event.RESIZE,this.redraw,this);
			this.redraw();
			return obj;
		}
		
		public removeChild(child:egret.DisplayObject):egret.DisplayObject{
			var obj:egret.DisplayObject = super.removeChild(child);
			obj.removeEventListener(egret.Event.RESIZE,this.redraw,this);
			this.redraw();
			return obj;
		}
		
		private redraw(e:Event=null):void{
			this._usedWidth = 0;
			this._usedHeight = 0;
			var obj:egret.DisplayObject;
			
			var perMaxHeight:number = 0;
			for(var i:number = 0,j:number=this.numChildren;i<j;i++){
				obj = this.getChildAt(i);
				
				if(this._usedWidth+this._paddingx+obj.width>this._maxWidth){
					this._usedHeight+=perMaxHeight+this._paddingy;
					perMaxHeight = 0;
					this._usedWidth = 0;
				}
				
				obj.x = this._usedWidth;
				obj.y = this._usedHeight;
				
				
				perMaxHeight = perMaxHeight < obj.height ? obj.height : perMaxHeight;

				this._usedWidth+=obj.width+this._paddingx;
			}
			
//			if(this._align==D5FlyBox.CENTER){
//				super.x = parseInt((this._maxWidth-this._w)>>1)+this._zerox;
//			}
			
			if(this._editorBG!=null) this.updateEditorBG();
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
	
		
		private updateEditorBG():void{
			 this._editorBG.graphics.clear();
			 this._editorBG.graphics.lineStyle(1,0);
			 this._editorBG.graphics.beginFill(0xffffff,.5);
			 this._editorBG.graphics.drawRect(0,0,this._maxWidth,this._usedHeight<20 ? 20 : this._usedHeight);
			 this._editorBG.graphics.endFill();
		}
	}
}