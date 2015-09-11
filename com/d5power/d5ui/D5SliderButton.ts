module d5power
{
    export class D5SliderButton extends D5Component
    {
        private button:egret.Bitmap;

        private front:egret.Bitmap;

        private enter:egret.Bitmap;

        private after:egret.Bitmap;

        private data:D5UIResourceData;

        private box:d5power.D5MirrorBox;

        private text:d5power.D5Text;

        private vBox:d5power.D5VBox;

        private cell:d5power.ListCell;

        private _arrCell:Array<ListCell> = [];

        private _dataArr:Array<string> = [];

        public constructor()
        {
            super();
        }

        public setDataName(arr:Array<string>):void
        {
            this._dataArr = arr;
        }

        public get dataName():Array<string>
        {
            return this._dataArr;
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            this.data = D5UIResourceData.getData(name);
            if(this.data==null)
            {
                trace("No Resource");
                return;
            }

            this.front = new egret.Bitmap();
            this.front.texture = this.data.getResource(0);

            this.enter = new egret.Bitmap();
            this.enter.texture = this.data.getResource(1);
            this.enter.fillMode = egret.BitmapFillMode.REPEAT;

            this.after = new egret.Bitmap();
            this.after.texture = this.data.getResource(0);
            this.after.scaleX = -1;

            this.button = new egret.Bitmap();
            this.button.texture = this.data.getResource(2);

            this.touchEnabled = this.button.touchEnabled = true;
            this.button.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.btnDown,this);
            this.button.addEventListener(egret.TouchEvent.TOUCH_END,this.btnUp,this);

            this.invalidate();

        }

        public setTable(info:string):void
        {
            if(this.text == null)
            {
                this.text = new d5power.D5Text();
                this.text.setWidth(this._w - this.button.width);
                this.text.setTextColor(0xff0000);
                this.text.setText(info);
            }else{
                this.text.setTextColor(0xff0000);
                this.text.setText(info);
            }
        }

        private btnDown(evt:egret.TouchEvent):void
        {
            this.button.texture = this.data.getResource(4);
            this.invalidate();

            if(this.box == null)
            {
                this.box = new d5power.D5MirrorBox();
                this.box.setSkin('box0');
                this.box.x = 0;
                this.box.y = this.button.height;
                this.box.setSize(this._w,100);
                this.addChild(this.box);

                this.vBox = new d5power.D5VBox();
                this.vBox.x = 5;
                this.vBox.y = 10;

            }else{
                this.box.visible = !this.box.visible;
            }

            if(this.box.visible)
            {
                this.showList(this._dataArr);
            }
        }

        public showList(arr:Array<string>):void
        {
            this.cleanCell();
            for(var i:number=0; i < arr.length ; i++)
            {
                this.cell = new d5power.ListCell();
                this.cell.showCell(this._w,arr[i]);
                this._arrCell.push(this.cell);
                this.vBox.addChild(this.cell);
                this.cell.setBtnID(i);

                this.cell.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.changeName,this);
            }
            this.box.setSize(this._w,this._dataArr.length * 25);
        }

        private changeName(evt:egret.TouchEvent):void
        {
            this.box.visible = !this.box.visible;
            var id:number = evt.currentTarget.btnID;
            this.setTable(this._dataArr[id]);
        }

        private cleanCell():void
        {
            if( this._arrCell == null ||  this._arrCell.length == 0) return;
            for(var j:number=0; j <  this._arrCell.length; j++)
            {
                var obj:d5power.ListCell = <ListCell>this._arrCell[j];
                obj.dispose();
                if(obj.parent) obj.parent.removeChild(obj);
                obj = null;
            }
            this._arrCell.splice(0,this._arrCell.length);
        }

        private btnUp(evt:egret.TouchEvent):void
        {
            this.button.texture = this.data.getResource(2);
            this.invalidate();
        }

        public draw():void
        {
            if(this.front==null)
            {

            }else{
                if(!this.contains(this.front)) {
                    this.addChild(this.front);
                    this.addChild(this.enter);
                    this.addChild(this.after);
                    this.addChild(this.button);
                }
            }

            this.enter.x = this.front.width;
            this.enter.width = this._w - this.front.width * 2;
            this.after.x = this._w - this.front.width;
            this.button.x = this._w - this.button.width;

            super.draw();

            this.addChild(this.text);

            this.box.addChild(this.vBox);
        }


    }
}