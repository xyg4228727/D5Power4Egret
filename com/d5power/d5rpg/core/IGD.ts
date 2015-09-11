module d5power
{
    /**
     * 游戏对象基础数据
     */
    export interface IGD
    {
        /**
         * 重算坐标
         */
        run(gravity:boolean):void;
        /**
         * 当前坐标
         */
        $pos:egret.Point;
        /**
         * 当前X坐标
         */
        posX:number;
        /**
         * 当前Y坐标
         */
        posY:number;

        zOrder:number;

        linkMap:number;

        linkPosx:number;

        linkPosy:number;

        missionIndex:number;
        /**
         * 设置坐标
         * @param px
         * @param py
         */
        setPos(px:number,py:number):void;
        /**
         * 控制器
         */
        controller:IController;

        setController(ctrl:IController):void;

        /**
         * 设置角色素材
         * @param v 要使用的角色素材
         */
        setRespath(v:string):void;

        respath:string;

        /**
         * 设置角色素材集
         * @param dir   素材集所在目录
         */
        setResStyle(dir:string):void;

        resStyle:string;

        setNickname(v:string):void;

        nickname:string;

        dispose():void;

        deleting:boolean;

        setDeleting(v:boolean):void

        setInScreen(v:boolean):void

        inScreen:boolean;

        setDisplayer(data:IGO):void

        displayer:IGO;

        setAI(data:BTTree):void

        ai:BTTree;

        setAction(action:number):void;

        action:number;

        setDirection(direction:number):void;

        direction:number;

        speed:number;

        setSpeed(speed:number):void;

        camp:number;

        setCamp(value:number):void;

        setUid(id:number):void

        uid:number;

        setMonsterid(id:number):void

        monsterid:number;

        setSay(say:string):void;

        say:string;

        setScript(script:string):void;

        script:string;

        setJob(type:number,value:string,num:string):void;

        job_type:number;

        job_value:string;

        job_number:string;

        setWork(work:number):void;

        work:number;

        loadMission():void;

        renderMe():void;

        hp:number;

        setHp(value:number):void;

        maxHp:number;

        setMaxHp(value:number):void;
    }
}