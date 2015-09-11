module d5power {
    export class GOData implements IGD {

        public static WORK_NORMAL:number = 0;
        public static WORK_NPC:number = 1;
        public static WORK_DOOR:number = 2;
        public static WORK_MONSTER:number = 3;

        public static JOB_COLLECTION:number = 1;
        private static _pool:Array<GOData>;
        private static _poolNum:number;

        public static initPool(num:number = 400):void {
            if (GOData._pool != null) {
                throw new Error("[GOData] initPool just can run one time.");
                return;
            }
            GOData._poolNum = num;
            GOData._pool = new Array<GOData>();
            for (var i:number = 0; i < GOData._poolNum; i++) GOData._pool.push(new GOData());
        }

        public static getInstance():GOData {
            if (GOData._pool.length > 0) return GOData._pool.pop();
            return new GOData();
        }

        private static back2pool(data:GOData):void {
            if (GOData._pool.length < GOData._poolNum && GOData._pool.indexOf(data) == -1) GOData._pool.push(data);
        }

        private _pos:egret.Point;
        private _controller:IController;
        private _respath:string;
        private _nickname:string;
        private _deleting:boolean;
        private _displayer:IGO;
        private _inScreen:boolean;
        private _direction:number;
        private _action:number;
        private _speed:number=3.0;
        private _uid:number = 0;
        private _say:string;
        private _script:string;
        private _job_type:number;
        private _job_value:string;
        private _job_num:string;
        private _resStyle:string;
        private _missionIndex:number;
        private _missionIndexList:Array<number>;
        private _work:number = 0;
        private _link_map:number;
        private _link_posx:number;
        private _link_posy:number;
        private _camp:number;
        private _hp:number;
        private _maxHp:number;
        private _sp:number;
        private _maxSp:number;

        private _monsterid:number;
        private _ai:BTTree;
        private _fighter:IFighter;

        /**
         * 排序调整
         */
        public _zOrderF:number = 0;

        public constructor() {
            this._pos = new egret.Point();
        }

        public loadMission():void
        {
            if(D5Game.me.characterData)
            {
                var m:MissionData;
                var num:number = D5Game.me.characterData.missionNum;

                this._missionIndex = -1;
                this._missionIndexList = new Array<number>();
                for(var i:number = 0;i<num;i++)
                {
                    m = D5Game.me.characterData.getMissionByIndex(i);
                    if(m.npc_id == this._uid)
                    {

                        if(m.type == MissionData.TYPE_COMPLATE && this._missionIndex==-1) this._missionIndex = i;
                        this._missionIndexList.push(i);
                    }
                }

                if(this._missionIndex==-1 && this._missionIndexList.length>0)
                {
                    this._missionIndex = this._missionIndexList[0];
                }

                if(this._displayer) this.displayer.showMissionStatus(this._missionIndex);
            }
        }

        public run(gravity:boolean):void {

            var targetx:number;
            var targety:number;
            var maxX:number = D5Game.me.map.width;
            var maxY:number = D5Game.me.map.height;

            if(gravity && this._controller) this._controller.gravityRun();

            if(D5Game.me.camera.focus==this){
                targetx = this._pos.x<(D5Game.me.screenWidth>>1) ? this._pos.x : (D5Game.me.screenWidth>>1);
                targety = this._pos.y<(D5Game.me.screenHeight>>1) ? this._pos.y : (D5Game.me.screenHeight>>1);

                targetx = this._pos.x>maxX-(D5Game.me.screenWidth>>1) ? this._pos.x-(maxX-D5Game.me.screenWidth) : targetx;
                targety = this._pos.y>maxY-(D5Game.me.screenHeight>>1) ? this._pos.y-(maxY-D5Game.me.screenHeight) : targety;
            }else{
                var target:egret.Point = D5Game.me.map.getScreenPostion(this._pos.x,this._pos.y);
                targetx = target.x;
                targety = target.y;
            }

            if(this._displayer) {
                this._displayer.x = parseInt(<string><any>targetx);
                this._displayer.y = parseInt(<string><any>targety);
            }

            if(this._controller) this._controller.run();
        }

        public setAction(action:number):void
        {
            this._action = action;
            if(this._resStyle!=null) this.setRespath(this._resStyle+'/'+action);
        }

        public get action():number
        {
            return this._action;
        }

        /**
         * 深度排序浮动
         */
        public setZOrderF(val:number) {
            this._zOrderF = val;
        }

        /**
         * 深度排序浮动
         */
        public zOrderF():number {
            return this._zOrderF;
        }

        /**
         * 获取坐标的深度排序
         */
        public get zOrder():number {
            //return zorder;
            return this.posY + this._zOrderF;
        }

        public setDirection(dir:number):void
        {
            this._direction = dir;
        }

        public get direction():number
        {
            return this._direction;
        }

        public setPos(px:number, py:number):void {
            this._pos.x = px;
            this._pos.y = py;
        }

        public get speed():number
        {
            return this._speed;
        }

        public setSpeed(speed:number):void
        {
            this._speed = speed;
        }

        public get $pos():egret.Point {
            return this._pos;
        }

        public get posX():number {
            return this._pos.x;
        }

        public get posY():number {
            return this._pos.y;
        }

        public setController(ctrl:IController) {
            this._controller = ctrl;
        }

        public get controller():IController {
            return this._controller;
        }

        public setRespath(v:string):void {
            this._respath = v;
            if(v!=null && v!='' && this._displayer)
            {
                this._displayer.setupSkin(this._respath);
            }
        }

        public get respath():string {
            return this._respath;
        }


        public setResStyle(dir:string):void
        {
            this._resStyle = dir;
            this.setAction(Actions.Wait);
        }

        public get resStyle():string
        {
            return this._resStyle;
        }

        public setLink(mapid:number,posx:number,posy:number)
        {
            this._link_map = mapid;
            this._link_posx = posx;
            this._link_posy = posy;
        }

        public get linkMap():number
        {
            return this._link_map;
        }

        public get linkPosx():number
        {
            return this._link_posx;
        }

        public get linkPosy():number
        {
            return this._link_posy;
        }

        public setNickname(v:string):void {
            this._nickname = v;
        }

        public get nickname():string {
            return this._nickname;
        }

        public setWork(value:number):void
        {
            this._work = value;
        }

        public get work():number
        {
            return this._work;
        }

        public isNpc():boolean
        {
            return this._work==GOData.WORK_NPC;
        }

        public isDoor():boolean
        {
            return this._work==GOData.WORK_DOOR;
        }

        public dispose():void {

            if(this._controller)
            {
                this._controller.dispose();
            }
            this._controller = null;
            this._deleting = false;
            this._work = GOData.WORK_NORMAL;
            this._inScreen=false;
            this._nickname=null;
            this._respath=null;
            this._resStyle=null;
            this.$pos.x = 0;
            this.$pos.y = 0;
            this.setJob(0,'','0');
            this.setDisplayer(null);
            this.setAI(null);
            this.setUid(0);
            GOData.back2pool(this);
        }

        public setInScreen(b:boolean):void
        {
            this._inScreen = b;
        }

        public get inScreen():boolean{
            return this._inScreen;
        }
        public setCamp(value:number):void
        {
            this._camp = value;
        }

        public get camp():number{
            return this._camp;
        }

        public get deleting():boolean {
            return this._deleting;
        }
        public setDeleting(b:boolean):void
        {
            this._deleting = b;
        }

        public setDisplayer(data:any):void
        {
            if(this._displayer!=null && data==null) this._displayer.dispose();
            this._displayer = data;

            if(this._displayer)
            {
                this._displayer.setupData(this);
                if(this.respath!=null && this.respath!='')
                {
                    this._displayer.setupSkin(this.respath);
                }
            }
        }

        public get displayer():IGO {
            return this._displayer;
        }
        public setAI(data:any):void
        {
            this._ai = data;
        }

        public get ai():BTTree {
            return this._ai;
        }

        public setUid(id:number):void
        {
            this._uid = id;
        }

        public get uid():number
        {
            return this._uid;
        }

        public setSay(say:string):void
        {
            this._say = say;
        }

        public get say():string
        {
            var missionData:MissionData = this._missionIndex==-1 ? null : D5Game.me.characterData.getMissionByIndex(this._missionIndex);
            return missionData==null ? this._say : missionData.npc_said;
        }
        public setScript(script:string):void
        {
            this._script = script;
        }

        public get script():string
        {
            return this._script;
        }

        public get missionIndex():number
        {
            return this._missionIndex;
        }

        public setJob(type:number,value:string,num:string):void
        {
            this._job_type = type;
            this._job_value = value;
            this._job_num = num;
        }

        public get job_type():number
        {
            return this._job_type
        }

        public get job_value():string
        {
            return this._job_value;
        }

        public get job_number():string
        {
            return this._job_num;
        }
        public renderMe():void
        {
            this.displayer.renderMe();
        }
        public setHp(value:number):void
        {
            if(value<0)
            {
                value = 0;
            }
            this._hp = value>this._maxHp?this._maxHp:value;
        }
        public get hp():number
        {
            return this._hp;
        }
        public setMaxHp(value:number):void
        {
            this._maxHp = value;
            this._hp = value;
        }
        public get maxHp():number
        {
            return this._maxHp;
        }
        public setSp(value:number):void
        {
            if(value<0)
            {
                value = 0;
            }
            this._sp = value>this._maxSp?this._maxSp:value;
        }
        public get sp():number
        {
            return this._sp;
        }
        public setMaxSp(value:number):void
        {
            this._maxSp = value;
            this._sp = value;
        }
        public get maxSp():number
        {
            return this._maxSp;
        }

        public setMonsterid(id:number):void
        {
            this._monsterid = id;
        }

        public get monsterid():number
        {
            return this._monsterid;
        }

    }
}