//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module d5power
{
    /**
     * 横向地图
     */
    export class D5HMap implements IMap
    {
        private static _pool:Array<egret.Bitmap> = [];

        private static getTile():egret.Bitmap
        {
            if(D5HMap._pool.length>0) return D5HMap._pool.pop();
            return new egret.Bitmap();
        }

        private static back2Pool(tile:egret.Bitmap):void
        {
            tile.texture = null;
            if(tile.parent) tile.parent.removeChild(tile);
            if(D5HMap._pool.indexOf(tile)==-1) D5HMap._pool.push(tile);
        }

        private _mapid:number;
        private _mapWidth:number;
        private _mapHeight:number;
        private _tileW:number;
        private _tileH:number;
        private _onReady:Function;
        private _onReadyThis:any;

        private _tempPoint:egret.Point;
        private _roadArr:Array<Array<number>>;
        private _roadW:number = 60;
        private _roadH:number = 30;
        private _sheet:egret.SpriteSheet;
        private _layer_far:egret.DisplayObjectContainer;
        private _layer_middle:egret.DisplayObjectContainer;
        private _layer_neer:egret.DisplayObjectContainer;


        private _far:Array<egret.Bitmap>;
        private _middle:Array<egret.Bitmap>;
        private _neer:Array<egret.Bitmap>;

        public constructor(id:number) {
            this._mapid = id;
            this._tempPoint = new egret.Point();
            this._tileList = [];
        }

        public clear():void
        {

        }

        public runPos(dataList:Array<IGD>):void
        {
            for (var i:number = dataList.length - 1; i >= 0; i--) dataList[i].deleting ? D5Game.me.removeObject(i) : dataList[i].run();
        }

        private _rightFar:egret.Bitmap;
        private _rightMiddle:egret.Bitmap;
        private _posX:number = 0;
        private _speed:number = 6.6;
        private _nowStartX:number = 0;
        private _tileList:Array<egret.Bitmap>;
        public render(flush:boolean = false):void
        {
            this._posX+=this._speed;
            var startx:number = parseInt(<string><any>(this._posX / this._roadW));
            this.makeData(startx);

            var newRightFar:egret.Bitmap;
            var newRightMiddle:egret.Bitmap;
            for(var i:number=0;i<3;i++)
            {
                this._far[i].x-=this._speed*.12;
                if(this._far[i].x<-this._far[i].width)
                {
                    newRightFar = this._far[i];
                }

                this._middle[i].x-=this._speed*.6;
                if(this._middle[i].x<-this._middle[i].width)
                {
                    newRightMiddle = this._middle[i];
                }
            }

            if(newRightMiddle)
            {
                newRightMiddle.x = this._rightMiddle.x+this._rightMiddle.width;
                this._rightMiddle = newRightMiddle;
                this._layer_middle.cacheAsBitmap=true;
            }

            if(newRightFar)
            {
                newRightFar.x = this._rightFar.x+this._rightFar.width;
                this._rightFar = newRightFar;
                this._layer_far.cacheAsBitmap=true;
            }

            for(i=this._tileList.length-1;i>=0;i--)
            {
                newRightFar = this._tileList[i];
                newRightFar.x-=this._speed;
                if(newRightFar.x<=-newRightFar.width)
                {
                    D5HMap.back2Pool(newRightFar);
                    this._tileList.splice(i,1);
                }
            }
        }

        public reset():void
        {

        }

        public setContainer(container:egret.DisplayObjectContainer):void
        {
            container.removeChildren();
            if(this._layer_far==null)
            {
                this._layer_far = new egret.DisplayObjectContainer();
                this._layer_middle = new egret.DisplayObjectContainer();
                this._layer_neer = new egret.DisplayObjectContainer();
            }else{
                this._layer_far.removeChildren();
                this._layer_middle.removeChildren();
                this._layer_neer.removeChildren();
            }

            container.addChild(this._layer_far);
            container.addChild(this._layer_middle);
            container.addChild(this._layer_neer);
        }

        public setTileFormat(s:string):void
        {

        }

        public setup(id:number, w:number, h:number, tw:number, th:number, onReady:Function, onReadyThis:any):void {
            this._mapid = id;
            this._mapHeight = h;
            this._mapWidth = w;
            this._tileW = tw;
            this._tileH = th;
            this._onReady = onReady;
            this._onReadyThis = onReadyThis;

            RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/tiles/' + this._mapid + '/map.png', this.onResLoaded, this);
        }

        public setupTiled(name:string,type:number,data:Array<any>,container:egret.DisplayObjectContainer):void
        {
            
        }
        public setupFar(name:string,type:number,container:egret.DisplayObjectContainer,far_x:number,far_y:number):void{
            
        }
        
        public get id():number {
            return this._mapid;
        }

        public get width():number {
            return this._mapWidth;
        }

        public get height():number {
            return this._mapHeight;
        }

        public get tileWidth():number {
            return this._tileW;
        }

        public get tileHeight():number {
            return this._tileH;
        }

        public get roadWidth():number
        {
            return this._roadW;
        }

        public get roadHeight():number
        {
            return this._roadH;
        }

        public find(xnow:number,ynow:number,xpos:number,ypos:number):Array<any>
        {
            return null;
        }

        public getPointAround(center:egret.Point,from:egret.Point,r:number):egret.Point
        {
           return null;
        }

        public getRoadPass(px:number,py:number):boolean
        {
            if(this._roadArr==null) return true;
            if(this._roadArr[py]==null || this._roadArr[py][px]!=0) return false;
            return true;
        }

        public isInAlphaArea(px:number,py:number):boolean
        {
            return false;
        }

        /**
         * 根据世界坐标获取在屏幕内的坐标
         */
        public getScreenPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = x - D5Game.me.camera.zeroX;
            this._tempPoint.y = y - D5Game.me.camera.zeroY;
            return this._tempPoint;
        }

        /**
         * 根据屏幕某点坐标获取其在世界（全地图）内的坐标
         */
        public getWorldPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = D5Game.me.camera.zeroX + x;
            this._tempPoint.y = D5Game.me.camera.zeroY + y;

            return this._tempPoint;
        }

        /**
         * 根据路点获得世界（全地图）内的坐标
         */
        public tile2WorldPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = x * this._roadW + this._roadW * .5;
            this._tempPoint.y = y * this._roadH + this._roadH * .5;
            return this._tempPoint;
        }

        /**
         * 世界地图到路点的转换
         */
        public Postion2Tile(px:number, py:number):egret.Point {
            this._tempPoint.x = Math.floor(px / this._roadW);
            this._tempPoint.y = Math.floor(py / this._roadH);
            return this._tempPoint;
        }


        private onResLoaded(data:egret.Texture):void
        {
            this._sheet = new egret.SpriteSheet(data);
            RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/tiles/' + this._mapid + '/resconf.json', this.onDataComplate, this);
        }


        private onDataComplate(data:any):void
        {
            if(data.uv)
            {
                //console.log("[D5SpriteSheepINIT] totalFrame:",this._totalFrame,",uvdata nums:",data.uv.length);
                for(var i:number=0,j:number=data.uv.length;i<j;i++)
                {
                    this._sheet.createTexture(data.uv[i].name, data.uv[i].x, data.uv[i].y, data.uv[i].width, data.uv[i].height,0,0);
                }
            }

            this._far = [];
            this._middle = [];

            this._far[0] = new egret.Bitmap();
            this._far[1] = new egret.Bitmap();
            this._far[2] = new egret.Bitmap();

            this._far[0].texture = this._sheet.getTexture("far");
            this._far[1].texture = this._sheet.getTexture("far");
            this._far[2].texture = this._sheet.getTexture("far");

            this._rightFar = this._far[2];
            this._far[0].height = this._far[1].height = this._far[2].height = D5Game.me.screenWidth/this._rightFar.width*this._rightFar.height;
            this._far[0].width = this._far[1].width = this._far[2].width = D5Game.me.screenWidth;


            this._far[1].x=this._rightFar.width;
            this._far[2].x=this._rightFar.width*2;

            this._layer_far.addChild(this._far[0]);
            this._layer_far.addChild(this._far[1]);
            this._layer_far.addChild(this._far[2]);

            this._middle[0] = new egret.Bitmap();
            this._middle[1] = new egret.Bitmap();
            this._middle[2] = new egret.Bitmap();

            this._middle[0].texture = this._sheet.getTexture("middle");
            this._middle[1].texture = this._sheet.getTexture("middle");
            this._middle[2].texture = this._sheet.getTexture("middle");

            this._rightMiddle = this._middle[2];

            this._middle[0].height = this._middle[1].height = this._middle[2].height = D5Game.me.screenWidth/this._rightMiddle.width*this._rightMiddle.height;
            this._middle[0].width = this._middle[1].width = this._middle[2].width = D5Game.me.screenWidth;


            this._middle[1].x=this._rightMiddle.width;
            this._middle[2].x=this._rightMiddle.width*2;

            this._middle[0].y = this._middle[1].y = this._middle[2].y = this._rightFar.height*.3*1.5;

            this._layer_middle.addChild(this._middle[0]);
            this._layer_middle.addChild(this._middle[1]);
            this._layer_middle.addChild(this._middle[2]);

            this.resetRoad();


            if (this._onReady != null) {
                this._onReady.apply(this._onReadyThis);
            }
        }

        public resetRoad():void
        {
            this._roadArr=[];

            // 定义临时地图数据
            var h:number = Math.floor(D5Game.me.screenHeight / this._roadH);
            var w:number = Math.floor(D5Game.me.screenWidth / this._roadW)+2;

            var land:number =  Math.floor(D5Game.me.screenHeight*.25*3/this._roadH);
            var value:number;

            for (var y:number = 0; y < h; y++) {
                var arr:Array<number> = new Array<number>();
                for (var x:number = 0; x < w; x++) {

                    value = y!=land ? 0 : 1;

                    arr.push(value);
                    if(value==1)
                    {
                        this.drawTile(y,x,arr);
                    }
                }
                this._roadArr.push(arr);
            }
        }

        private _lastAdd:egret.Bitmap;
        protected drawTile(y:number,x:number,arr:Array<number>):void
        {
            var tile:egret.Bitmap;
            tile = D5HMap.getTile();

            if(x>0 && arr!=null && arr[x-1]==0)
            {
                tile.texture = this._sheet.getTexture("tile_left");
            }else if(arr==null || (x<arr.length-1 && arr[x+1]==0)){
                tile.texture = this._sheet.getTexture("tile_right");
            }else{
                tile.texture = this._sheet.getTexture("tile_middle")
            }
            tile.width = this._roadW;
            tile.height = this._roadW;
            tile.x = this._lastAdd==null ?  x*this._roadW : this._lastAdd.x+this._roadW;
            tile.y = y*this._roadH;
            this._lastAdd = tile;
            this._layer_neer.addChild(tile);
            this._tileList.push(tile);
        }

        private _count:number=0;
        private _rline:number;
        private makeData(startx:number):void
        {
            if(this._nowStartX==startx) return;
            this._nowStartX = startx;
            // 计数为0，重新计算当前随机生成的支撑类型
            if(this._count==0)
            {
                this._lastAdd=null;
                // 若当前值为-1，则为空白，那么后续必须生成支撑物。否则当前为支撑物，则后续必然是空白
                this._rline = this._rline==-1 ? 8+parseInt(<string><any>(3*Math.random())) : -1;
                // 若生成的是空白，则随机在1-4个，若是支撑物，则随机2-8个
                this._count = this._rline==-1 ? 1+parseInt(<string><any>(4*Math.random())) : 2+parseInt(<string><any>(8*Math.random()));
            }

            var value:number;
            for(var y:number=0,ym:number=this._roadArr.length;y<ym;y++)
            {
                var arr:Array<number> = this._roadArr[y];
                arr.shift();
                value = y!=this._rline ? 0 : 1;
                arr.push(value);
                if(value==1) this.drawTile(y,arr.length-1,this._count==1 ? null : arr);
            }

            this._count--;
        }
       public  setDeviceorientation(b:boolean):void
       {
           
       }

    }
}