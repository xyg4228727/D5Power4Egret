module d5power {

	export class D5HBox extends D5Component
    {
		public _padding:number = 5;
		
		/**
		 * 提供给编辑器使用的背景
		 */ 
		private _editorBG:egret.Shape;
		
		
		public autoFly:boolean=true;

		
		public constructor(){
			super();
		}
		
		public setEditorMode():void{
			if(this._editorBG!=null) return;
			this._editorBG = new egret.Shape();
			this._editorBG.graphics.clear();
			this._editorBG.graphics.lineStyle(1,0);
			this._editorBG.graphics.beginFill(0xff9900,.5);
			this._editorBG.graphics.drawRect(0,0,60,20);
			this._editorBG.graphics.endFill();
			this.addChild(this._editorBG);
		}

        public parseToXML():string
        {
            var result:string = "<D5HBox name='"+this.name+"' x='"+this.x+"' y='"+this.y+"'/>\n";
            return result;
        }


		/**
		 * Override of addChild to force layout;
		 */
		public addChildAt(child:egret.DisplayObject, index:number = 0) : egret.DisplayObject
        {
			super.addChildAt(child, index);
			child.addEventListener(egret.Event.RESIZE, this.onResize, this);
			this.invalidate();
			return child;
		}
		
		public addChild(child:egret.DisplayObject) : egret.DisplayObject
        {
			super.addChild(child);
			child.addEventListener(egret.Event.RESIZE, this.onResize, this);
			if(this.autoFly) this.invalidate();
			return child;
		}
		
		
		
		/**
		 * Override of removeChild to force layout;
		 */
		public removeChild(child:egret.DisplayObject):egret.DisplayObject
        {
			super.removeChild(child);
			child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			if(this.autoFly) this.invalidate();
			return child;
		}
		
		/**
		 * Override of removeChild to force layout;
		 */
		public removeChildAt(index:number = 0):egret.DisplayObject
        {
			var child:egret.DisplayObject = super.removeChildAt(index);
			child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
			if(this.autoFly) this.invalidate();
			return child;
		}
		
		public onResize(event:egret.Event):void
        {
			if(this.autoFly) this.invalidate();
		}
		
		/**
		 * Draws the visual ui of the component, in this case, laying out the sub components.
		 */
		public draw() : void
        {
			this._w = 0;
			this._h = 0;
			var xpos:number = 0;
			for(var i:number = 0; i < this.numChildren; i++){
				var child:egret.DisplayObject = this.getChildAt(i);
				child.x = xpos;
				xpos += child.width;
				xpos += this._padding;
				this._w += child.width;
				this._h = Math.max(this._h, child.height);
			}
			this._w += this._padding * (this.numChildren - 1);
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
		
		/**
		 * Gets / sets the spacing between each sub component.
		 */
		public setPadding(s:number){
			this._padding = s;
			this.invalidate();
		}
		public get padding():number{
			return this._padding;
		}
	}
}