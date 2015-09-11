module d5power {
	/**
	 *
	 * @author 
	 *
	 */
	export class D5BitmapNumber extends D5Component {

        private data:D5UIResourceData;
        private _align: number = 0;
        private _box: D5HBox;
        private _numic: any;
		public constructor() {
            super();
            this._box = new D5HBox();
//            this._box.setPadding(0);
            this._numic = {};
            this.addChild(this._box);
		}
		
		public setAlign(v:number):void
		{
            this._align = v;
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
		}

		public setValue(v:number):void
		{
            var str: string = v + '';
            var len: number = str.length;

            var bitmap: egret.Bitmap;
            var pnumber: string;
            this._box.removeChildren();
            for(var i: number = 0;i < len;i++){
                pnumber = str.substr(i,1);
                bitmap = <egret.Bitmap>this._numic[pnumber];
                if(!bitmap) 
                {
                    bitmap = new egret.Bitmap();
                    this._numic[pnumber] = bitmap;
                }
                bitmap.texture = this.data.getResource(parseInt(pnumber))
                this._box.addChild(bitmap);
            }
            
            this.invalidate();
		}

        public setPadding(v:number):void
        {
            this._box.setPadding(v);
            this.invalidate();
        }
		
		public draw():void
		{
            switch(this._align)
            {
                case D5Text.CENTER:
                this._box.x = -this._box.width >> 1;
                break;
                case D5Text.RIGHT:
                this._box.x = -this._box.width;
                break;
            }
            super.draw();
		}
	}
}
