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

module d5power {
    export class D5Game extends egret.DisplayObjectContainer {
        /**
         * 游戏中的每“米”对应程序中的像素值
         */ 
        public static MI:number = 50;
        /**
         * 游戏资源服务器，留空则为本地素材相对路径
         */ 
        public static RES_SERVER:string = '';
        /**
         * 游戏资源的保存目录
         */ 
        public static ASSET_PATH:string = 'resource/assets';
        
        private _dataList:Array<IGD>;
        protected _screenList:Array<IGD>;
        private _g: D5Gravity;
        private _characterData:CharacterData;
        private _missionDispatcher:IMissionDispatcher;

        protected _container_map:egret.DisplayObjectContainer;
        protected _container_far: egret.DisplayObjectContainer;
        protected _container_bottom:egret.DisplayObjectContainer;
        protected _container:egret.DisplayObjectContainer;
        protected _container_top:egret.DisplayObjectContainer;
        protected _touch_layer:egret.Sprite;

        private _timer:number;
        private _readyBack:Function;
        protected _map:IMap;
        protected _player:IGD;
        protected _startX:number;
        protected _startY:number;
        private _camera:ICamera;
        private _screenW:number;
        private _screenH:number;
        private _lastZorder:number=0;

        private _firstEnter:boolean = true;

        /**
         * 怪物刷新配置
         */
        protected _monsterConf:Array<MonsterFlushData>;

        /**
         * 采集条
         */
        private  _pickup:d5power.ProgBar;
        private _dialog:d5power.DialogBox;
        private _itemopt: d5power.ItemOpt;


//        private _dialog:IDialog;
        /**
         * 当前的渲染进度
         */
        private _nowRend:number;
        
        private _runAction:any;

        private static _me:D5Game;


        public static get me():D5Game {
            return D5Game._me;
        }
        
        public runScript(url:string):void
        {

        }

        public constructor(mapid:number,startx:number,starty:number,onReady:Function = null) {
            super();
            if (D5Game._me) this.error();
            this.touchEnabled = true;
            D5Game._me = this;

            this._runAction = this.run;
            this._startX = startx;
            this._startY = starty;

            this.buildMap(mapid);
            this._readyBack = onReady;
            this._camera = new D5Camera();

            this._container_map = new Layer();
            this._container = new Layer();
            this._container_far = new Layer();
            this._container_bottom = new Layer();
            this._container_top = new Layer();
            this._touch_layer = new egret.Sprite();
            this._touch_layer.touchEnabled=true;


            this.addChild(this._container_map);
            this.addChild(this._container_far);
            this.addChild(this._container_bottom);
            this.addChild(this._container);
            this.addChild(this._container_top);
            this.addChild(this._touch_layer);

            this._dataList = [];
            this._screenList = [];

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.install, this);
            /**
             * 重力跳跃测试
             */ 
            var that = this;
            document.addEventListener("keydown",function(event){

                        if(that._g &&event.keyCode == 32 ) 
                        {
                            that.player.inG = true;
                            that.player.speedY = -20;
                        }
                    }
              )
        }

        public openGravity():void
        {
            if(!this._g)
            {
                this._g = new D5Gravity();
                this._g.initGravity(0.8);
            }
        }
        
        /**
         * 重力感应控制器 
         */ 
        public get g():D5Gravity
        {
            return this._g;
        }

        public setCharacterData(data:CharacterData)
        {
            if(this._characterData!=null)
            {
                return;
            }
            
            this._characterData = data;
        }

        public setMissionDispatcher(data:IMissionDispatcher):void
        {
            if(this._missionDispatcher!=null) return;
            this._missionDispatcher = data;
        }

        public get missionDispatcher():IMissionDispatcher
        {
            return this._missionDispatcher;
        }

        public get characterData ():CharacterData
        {
            return this._characterData;
        }

        public initUI():void
        {

        }
        public showPackage(): void
        {

        }
        public showMission(): void
        {

        }
        public showSkill(b:d5power.D5MirrorBox = null): void
        {

        }
        public showScript(): void
        {

        }

//        public setDialogUI(ui:IDialog):void
//        {
//            this._dialog = ui;
//        }
        public notice(msg:string):void
        {
            new d5power.Notice(D5Game.me.stage,msg);
        }

        public collectionWithNPC(igd:IGD):void
        {
            if(this.contains(this._pickup))return;
            this._pickup = new d5power.ProgBar(this.pickupItem,parseInt(igd.job_number)<=0 ? RPGI.ConfigCenter.me.pickupTime : parseInt(igd.job_number),this);
            this._pickup.data = igd;
            this._pickup.x = (this.stage.stageWidth-this._pickup.setWidth())>>1;
            this._pickup.y = this.stage.stageHeight*0.7;
            this.addChild(this._pickup);
        }
        private pickupItem():void
        {
            var npc:GOData = <GOData>this._pickup.data;
            if(npc==null)return;
            var itemid:number = parseInt(npc.job_value);

            var item:RPGI.ItemData = RPGI.ConfigCenter.me.getItemData(itemid);

            npc.setDeleting(true);
            npc.setInScreen(false);

            this._pickup.breakout();
            if(this._pickup.parent) this._pickup.parent.removeChild(this._pickup);
            this._pickup = null;

            if(item==null) return;
//            if((<RPGI.MyCharacterData>(D5Game._me.characterData)).getItem(itemid,1))
            if(RPGI.Global.userdata.getItem(itemid,1))
            {
                this.notice("获得["+item.name+"] x1");
            }else{
                this.notice("采集["+item.name+"] 失败！");
            }

        }
        public canclePickup():void
        {
            if(this._pickup==null) return;
            this._pickup.breakout();
            if(this._pickup.parent) this._pickup.parent.removeChild(this._pickup);
            this._pickup = null;
        }
        public pickup(time:number,callback:Function):void
        {
            this._pickup = new d5power.ProgBar(this.canclePickup,time,this);
            this._container_bottom.addChild(this._pickup);
        }
//------------------------华丽丽的分割线-----------------------------------------
        public scriptWithNPC(igd:d5power.IGD):void
        {
            RPGI.RPGIScriptController.run(igd.script,this.stage);
        }
        public talkWithNPC(igd:IGD):void
        {
            if(igd.script && igd.script!="")
            {
                this.scriptWithNPC(igd);
                return;
            }

            var data:RPGI.NpcData = RPGI.ConfigCenter.me.getNpcConf(igd.uid);
            var headurl:string;
            data ? headurl = data.skin:headurl='';
            if(igd.missionIndex != -1)
                this.missionDialog(headurl,igd);
            else
                this.dialog(headurl,igd.nickname,igd.say);
        }

        private missionDialog(headurl:string,igd:IGD):void
        {
            this.closeDialog();
            var mdata:MissionData = D5Game.me.characterData.getMissionByIndex(igd.missionIndex);
            if( mdata)
            {
                this._dialog = new d5power.MissionDialog(this.stage,headurl,igd.nickname,mdata.npc_said,igd.missionIndex);
                this.addChild(this._dialog);
                this._dialog.setNpc(igd);
                //this._dialog.x = (this.stage.stageWidth - this._dialog.setWidth())/2;
                //this._dialog.y = (this.stage.stageHeight - this._dialog.setHeight())/2;
            }else
            {
                this.dialog(headurl,igd.nickname,igd.say);
            }

        }

        public dialog(url:string,nickname:string,say:string):void
        {
            this.closeDialog();
            if(this._dialog==null)
            {
                this._dialog = new d5power.DialogBox(this.stage,url,nickname,say);
            }else{
                if(url=='null' || url==null) url='';
                this._dialog.configDialog(url,nickname,say);
            }
            this.addChild(this._dialog);
            //this._dialog.x = (this.stage.stageWidth - this._dialog.setWidth())/2;
            //this._dialog.y = (this.stage.stageHeight - this._dialog.setHeight())/2;
        }

        public closeDialog():void
        {
            if(this._dialog)
            {
                this._dialog.dispose();
                if(this._dialog.parent) this._dialog.parent.removeChild(this._dialog);
                this._dialog = null;
            }
        }
        //
        ///**
        // * 绘制一个特定颜色的背景
        // */
        //
        //private _storyBackGround:egret.Shape;
        //private _storyBGColor:number;
        //public openBg(color:number = 0):void
        //{
        //    this._storyBGColor = color;
        //    if(this._storyBackGround==null)
        //    {
        //        this._storyBackGround = new egret.Shape();
        //        this.addChild(this._storyBackGround);
        //    }else{
        //        this._storyBackGround.graphics.clear();
        //    }
        //    this._storyBackGround.graphics.beginFill(color,1);
        //    this._storyBackGround.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
        //    this._storyBackGround.graphics.endFill();
        //    this._storyBackGround.alpha = 0;
        //    egret.Tween.get(this._storyBackGround, {
        //        loop: false,//设置循环播放
        //        onChange: null,//设置更新函数
        //        onChangeObj: this//更新函数作用域
        //    })
        //        .to({alpha: 1}, 1000)//设置2000毫秒内 rotation 属性变为360
        //}
        //
        ///**
        // * 绘制好的特定背景渐隐
        // */
        //public closeBg():void
        //{
        //    if(this._storyBackGround)
        //    {
        //        egret.Tween.get(this._storyBackGround, {
        //            loop: false,//设置循环播放
        //            onChange: null,//设置更新函数
        //            onChangeObj: this//更新函数作用域
        //        })
        //            .to({alpha: 0}, 500)//设置2000毫秒内 rotation 属性变为360
        //            .call(this.cleanBgFunction, this);//设置回调函数及作用域，可用于侦听动画完成
        //    }
        //}
        //
        //private cleanBgFunction():void
        //{
        //    if(this._storyBackGround)
        //    {
        //        this._storyBackGround.graphics.clear();
        //        this._storyBackGround.parent.removeChild(this._storyBackGround);
        //        this._storyBackGround=null;
        //    }
        //}
        //private _tim:egret.Timer;
        //private _num:number = 0;
        //private h:number;
        ///**
        // * 打开电影模式
        // */
        //private _movieMask:egret.Sprite;
        //private _movieMashSize:number;
        //public openMovieMode(size:number):void
        //{
        //    this._movieMashSize = size;
        //    if(this._movieMask)
        //    {
        //        this.cleanMovieMask();
        //    }
        //
        //    this._movieMask = new egret.Sprite();
        //    this.addChild(this._movieMask);
        //    this.h = this.stage.stageHeight * this._movieMashSize;
        //    for(var i:number=0;i< 2;i++)
        //    {
        //        var shape:egret.Shape = new egret.Shape();
        //        shape.graphics.beginFill(0x000000);
        //        shape.graphics.drawRect(0,0,this.stage.stageWidth,this.h);
        //        shape.graphics.endFill();
        //        this._movieMask.addChild(shape);
        //    }
        //
        //    this._movieMask.getChildAt(0).y = this.h * -1;
        //    this._movieMask.getChildAt(1).y = this.stage.stageHeight - this.h;
        //
        //    if(this._tim)
        //    {
        //        this._tim.stop();
        //        this._tim.removeEventListener(egret.TimerEvent.TIMER,this.moveMc,this);
        //        this._tim = null;
        //    }
        //    this._tim = new egret.Timer(10);
        //    this._tim.addEventListener(egret.TimerEvent.TIMER,this.moveMc,this);
        //    this._tim.start();
        //}
        //
        //private moveMc(evt:egret.TimerEvent):void
        //{
        //    this._num++;
        //    this._movieMask.getChildAt(0).y += (this.h / 100);
        //    this._movieMask.getChildAt(1).y = this.stage.stageHeight - (this._num - 1) * (this.h / 100);
        //    if(this._num >= 101)
        //    {
        //        this._tim.stop();
        //        this._tim.removeEventListener(egret.TimerEvent.TIMER,this.moveMc,this);
        //        this._tim = null;
        //        this._num = 0;
        //    }
        //}
        //
        ///**
        // * 关闭电影模式
        // */
        //public cleanMovieMask():void
        //{
        //    if(this._movieMask)
        //    {
        //        for(var j:number=1;j >= 0;j--)
        //        {
        //            var shape:egret.Shape = <egret.Shape>this._movieMask.getChildAt(j);
        //            shape.graphics.clear();
        //            this._movieMask.removeChild(shape);
        //            shape=null;
        //        }
        //
        //        this._movieMask.parent.removeChild(this._movieMask);
        //        this._movieMask=null;
        //    }
        //}
        ///**
        // * 播放字幕
        // * @param	content		字幕内容
        // * @param	place		出现位置。目前默认为0，底部出现
        // * @param	posx		特定位置出现，与place冲突，优先选择特定位置
        // * @param	posy		特定位置出现，与place冲突，优先选择特定位置
        // */
        //private _showFontTime:egret.Timer;
        //private _storyFont:D5Text;
        //public showFont(content:String,place:number=0,posx:number=0,posy:number=0):void
        //{
        //    this.cleanFont();
        //    this._storyFont = new D5Text();
        //    this.addChild(this._storyFont);
        //    this._storyFont.setTextColor(0x9F9265);
        //    this._storyFont.setFontSize(24);
        //    this._storyFont.setFontBold(true);
        //    this._storyFont.setWrapFlg(1);
        //    this._storyFont.height = 30;
        //    this._storyFont.width = this.stage.stageWidth - 60;
        //    if(posx!=0 || posy!=0)
        //    {
        //        this._storyFont.x = posx;
        //        this._storyFont.y = posy;
        //    }else{
        //        this._storyFont.x = 30;
        //        this._storyFont.y = this.stage.stageHeight - 60;
        //    }
        //
        //    this._showFontTime = new egret.Timer(20);
        //    this._showFontTime.addEventListener(egret.TimerEvent.TIMER,timerIng,this);
        //    this._showFontTime.start();
        //    var index:number = 0;
        //    function timerIng(evt:egret.TimerEvent):void
        //    {
        //        this._storyFont.setText(content.substring(0,index));
        //        if(index>=content.length)
        //        {
        //            this._showFontTime.stop();
        //            this._showFontTime.removeEventListener(egret.TimerEvent.TIMER,timerIng,this);
        //        }
        //
        //        index++;
        //    }
        //}
        //
        //public cleanFont():void
        //{
        //    if(this._storyFont)
        //    {
        //        this._storyFont.parent.removeChild(this._storyFont);
        //        this._storyFont=null;
        //    }
        //
        //    if(this._showFontTime)
        //    {
        //        this._showFontTime.stop();
        //        this._showFontTime=null;
        //    }
        //}
//------------------------华丽丽的分割线-----------------------------------------

        public get timer():number
        {
            return this._timer;
        }

        public get screenWidth():number {
            return this._screenW;
        }

        public get screenHeight():number {
            return this._screenH;
        }

        public get camera():ICamera {
            return this._camera;
        }

        public get map():IMap {
            return this._map;
        }

        public get dataList():Array<IGD> {
            return this._dataList;
        }

        public get player():IGD {
            return this._player;
        }
        public  getIGDByUid(id:number):d5power.IGD
        {
            var data:Array<d5power.IGD> = this._dataList;
            for(var i:number = 0;i<data.length;i++)
            {
                if(data[i].uid==id)
                {
                    return data[i];
                }
            }
            return null;
        }
        public setPlayer(data:IGD){
            this._player = data;
            this.add2Screen(data);
        }

        public addObject(data:IGD):void {
            this._dataList.push(data);
        }

        public removeObject(index:number):void {
            var data:IGD = this._dataList[index];
            data.dispose();
            this._dataList.splice(index, 1);
        }

        public getClicker(px:number,py:number):IGD
        {
            var i:number,j:number;
            var testList:Array<IGD> = new Array<IGD>();

            var igd:IGD;
            for(i=0,j=this._screenList.length;i<j;i++)
            {
                igd = this._screenList[i];
                if(igd.work!=GOData.WORK_DOOR && igd!=this._player && igd.displayer.hitTestArea(px,py)) testList.push(igd);
            }

            var shortY = function(a:IGD,b:IGD):number
            {
                if(a.zOrder>b.zOrder)
                    return 1;
                else if(a.zOrder==b.zOrder)
                    return 0;
                else
                    return -1;
            }

            testList.sort(shortY);
            return testList[0];
        }

        /**
         * 任务加载完成后触发
         */
        public missionLoaded():void
        {
            var igd:IGD;
            for(var i:number = 0,j:number=this._screenList.length;i<j;i++)
            {
                igd = this._screenList[i];
                igd.loadMission();
            }
        }

        /**
         * 将某个角色添加进游戏场景
         * @param data          角色数据
         */
        public add2Screen(data:IGD):void {
            if(!data.inScreen)
            {
                data.setInScreen(true);
                console.log("[D5Game] in screen");
                // 这里需要关联GameObject进
                data.setDisplayer(data.work == GOData.WORK_DOOR? DoorObject.getDoor() : GameObject.getInstance());
                this._screenList.push(data);
                this._container.addChild(<egret.DisplayObject><any>data.displayer);
                if(data.work == GOData.WORK_NPC) data.loadMission();
                if(this._g) this._g.addObject(data);
            }
        }

        public remove4Screen(data:IGD):void {
            data.setInScreen(false);
            if (data.displayer == null) return;
            var index:number = this._screenList.indexOf(data);
            if (index != -1) this.remove4ScreenByIndex(index);
        }

        public remove4ScreenByIndex(index:number):void {
            var data:IGD = this._screenList[index];
            if(this._container.contains(<egret.DisplayObject><any>data.displayer)) this._container.removeChild(<egret.DisplayObject><any>data.displayer);
            data.setDisplayer(null);
            this._screenList.splice(index, 1);
        }


        public changeMap(tomap:number, tox:number, toy:number):void {
            this.reset();
            this._startX = tox;
            this._startY = toy;
            this.enterMap(tomap);
        }

        /**
         * 创建NPC
         * @param    s            位图资源名
         * @param    resname        缓冲池资源名
         * @param    name        NPC姓名
         * @param    pos            目前所在位置
         */
        public createNPC(s:string, nickname:string, pos:egret.Point):IGD {
            var data:GOData = GOData.getInstance();
            data.setRespath(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/mapRes/' + s);
            data.setDirection(Direction.Down);
            data.setNickname(nickname);
            data.setWork(GOData.WORK_NPC);
            if (pos != null) data.setPos(pos.x, pos.y);

            this.addObject(data);

            return data;
        }
        public createRoad(s:string, pos:egret.Point):IGD {
            var data:GOData = GOData.getInstance();
            data.setRespath(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/mapRes/' + s);
            data.setDirection(Direction.Down);
            data.setWork(GOData.WORK_DOOR);
            if (pos != null) data.setPos(pos.x, pos.y);

            this.addObject(data);

            return data;
        }

        /**
         * 根据配置文件进行场景的数据初始化
         */
        public setup(data:any):void {
            this._monsterConf = new Array<any>();
            this._map.setContainer(this._container_map);
            this._map.setup(
                parseInt(data.id),
                parseInt(data.mapW),
                parseInt(data.mapH),
                parseInt(data.tileX),
                parseInt(data.tileY),
                this.init,
                this
            );

            if(data.gravity == "1") this.openGravity();
            
            if(data.far) {
                for(var i: number = 0;i < data.far.length;i++) {
                    var far: any = data.far[i];
                    if(far.far != "") {
                        var fartype: number = 0;
                        if(far.farType != "") fartype = parseInt(far.farType);
                        this._map.setupFar(far.far,fartype,this._container_far,parseInt(far.farX),parseInt(far.farY));
                        break;
                    }
                }
            }
            
            if(data.tiled) {
                for(var i: number = 0;i < data.tiled.length;i++) {
                    var tiled: any = data.tiled[i];
                    if(tiled.tiled != "") {
                        var temp: number = 0;
                        if(tiled.tiledType != "") temp = parseInt(tiled.tiledType);
                        var layer_arr: Array<any> = new Array<any>();
                        if(tiled.tiledLayer != null) {
                            for(var m: number = 0,n: number = tiled.tiledLayer.length;m < n;m++) {
                                var layer: any = tiled.tiledLayer[m];
                                layer_arr.push(layer);
                            }
                        }

                        this._map.setupTiled(tiled.tiled,temp,layer_arr,this._container_bottom);
                        break;
                    }
                }
            }
            for(var i:number = 0;i < data.monster.length;i++){
                var monster:any = data.monster[i];
                var conf:MonsterFlushData = new MonsterFlushData();
                conf.format(monster);
                this._monsterConf.push(conf);
            }


            var length:number = data.npc.length;
            for(var i:number = 0;i < length;i++){
                var npc:any = data.npc[i];
                var obj:GOData = GOData.getInstance();
                obj.setDirection(Direction.Down);
                obj.setRespath(D5Game.RES_SERVER+D5Game.ASSET_PATH+"/mapRes/"+npc.res);
                obj.setNickname(npc.name);
                obj.setPos(npc.posx,npc.posy);
                obj.setUid(npc.uid);
                obj.setSay(npc.say);
                obj.setScript(npc.script);
                obj.setWork(GOData.WORK_NPC);
                if(npc.job!=null) obj.setJob(parseInt(npc.job.type),npc.job.value,npc.job.num);
                this.addObject(obj);
            }
            var len:number = data.roadpoint.length;
            for(var i:number = 0;i < len;i++){
                var door:any = data.roadpoint[i];
                var obj:GOData = GOData.getInstance();
                obj.setDirection(Direction.Down);
                obj.setRespath(D5Game.RES_SERVER+D5Game.ASSET_PATH+"/mapRes/"+door.res);
                obj.setLink(door.toMap,door.toX,door.toY);
                obj.setPos(door.posx,door.posy);
                obj.setWork(GOData.WORK_DOOR);
                this.addObject(obj);
            }
        }
        
        public flushMoster():void
        {

        }
        public init():void {
            this.flushMoster();
            this.initUI();
            console.log("[D5Game] Engine is ready.enjoy~");
            this.buildPlayer();

            if (this._player) {
                this._player.setPos((<number>this._startX), (<number>this._startY));
                if (this._player.controller) this._player.controller.setupListener();
                this._camera.update();
            } else {
                this._camera.lookAt(this._startX, this._startY);
            }

            if (this._readyBack != null) {
                this._readyBack();
                this._readyBack = null;
            }

            if(this._firstEnter)
            {
                this._firstEnter = false;
                if(RPGI.ConfigCenter.me.startScript)
                {
                    RPGI.RPGIScriptController.run(RPGI.ConfigCenter.me.startScript,this.stage);
                }
            }

	    // 本代码务必在最后运行。由于设置了角色后，需要通过camera.update方法更新0点位置。只有在正确设置了0点后，再开始渲染，才能保证不会由于镜头瞬间跳跃，区块加载异步处理而导致的花屏。
	    this.play();
        }

        public get touchReciver():egret.Sprite
        {
            return this._touch_layer;
        }

        /**
         * 创建角色，请在子类中重写本方法，创建角色
         * 创建成功后，请通过setPlayer方法，设置为主角
         */
        public buildPlayer():void {

        }

        public play():void {
            this.addEventListener(egret.Event.ENTER_FRAME, this._runAction, this);
        }

        public stop():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._runAction, this);
        }

        private run(e:egret.Event = null):void {

            this._timer = egret.getTimer();

            this._map.render(false);

            this._map.runPos(this._dataList);
            
            if(this._g != null) this._g.run();

            for(var i:number=this._screenList.length-1;i>=0;i--)
            {
                if(this._screenList[i].deleting || !this._screenList[i].inScreen) this._screenList.splice(i,1);
            }


            var needOrder:Boolean = this._timer - this._lastZorder > this._camera.zorderSpeed;

            if (needOrder) {
                this._screenList.sort(function (objA, objB):number {
                    return objA.zOrder > objB.zOrder ? 1 : -1;
                });
                var child:egret.DisplayObject;	// 场景对象

                var max:number = this._screenList.length;
                var item:egret.DisplayObject; // 循环对象

                while (max--) {
                    item = <egret.DisplayObject><any>this._screenList[max].displayer;

                    if (max < this._container.numChildren) {
                        child = this._container.getChildAt(max);
                        if (child != item) {
                            this._container.setChildIndex(item, max);
                        }
                    }
                }
                this._lastZorder = this._timer;
                this._camera.reCut();
            }

            var render:IGD;

            while (true) {
                render = this._screenList[this._nowRend];

                if (render == null) {
                    this._nowRend = 0;
                    break;
                }

                render.renderMe();
                this._nowRend++;

                if (egret.getTimer() - this._timer > D5Camera.RenderMaxTime) break;
            }

            //if(this._player) this._player.setPos(this._player.posX+2,this._player.posY);
            this._camera.update();
        }

        protected buildMap(id:number):void
        {
            this._map = new D5Map(id);
        }

        private reset():void {
            this.stop();
            this.map.clear();
            var i:number;
            for (i = this._screenList.length - 1; i >= 0; i--) this.remove4ScreenByIndex(i);
            for (i = this._dataList.length - 1; i >= 0; i--) this.removeObject(i);


            this._player=null;
            this._camera.setFocus(null);
        }

        private onResize(e:egret.Event):void {
            this._screenW = this.stage.stageWidth;
            this._screenH = this.stage.stageHeight;

            this._touch_layer.graphics.clear();
            this._touch_layer.graphics.beginFill(0,0);
            this._touch_layer.graphics.drawRect(0,0,this._screenW,this._screenH);
            this._touch_layer.graphics.endFill();
            this._touch_layer.width = this._screenW;
            this._touch_layer.height = this._screenH;
        }

        private install(e:egret.Event):void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.install, this);
            this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.onResize(null);
            this.enterMap();
        }

        private enterMap(mapid:number = -1):void {
            RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + "/tiles/" + (mapid == -1 ? this._map.id : mapid) + "/mapconf.json", this.setup, this);
        }

        private error():void {
            throw new Error("[D5Game] Please get instance by (get me) function.");
        }

    }
}
