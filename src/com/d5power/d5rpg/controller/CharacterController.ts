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
    export class CharacterController implements IController
    {
        public static TALK_DISTANCE:number = 200;
        

        private static _me:CharacterController;
        public static getInstance(igd:IGD):CharacterController
        {
            if(CharacterController._me==null)
            {
                CharacterController._me = new CharacterController();
            }
            CharacterController._me._target = igd;
            CharacterController._me.setupListener();
            return CharacterController._me;
        }
        protected _endTarget:egret.Point;
        protected _nextTarget:egret.Point;
        protected _target:IGD;
        protected _path:Array<any>;
        protected _step:number;
        protected _onWalkComplate:Function;
        protected _onWalkComplateThisObj:any;
        protected _onWalkComplateParams:Array<any>;
        protected _isPause:boolean;

        public constructor()
        {
            //if(CharacterController._me!=null)
            //{
            //    this.error();
            //}
        }

	    public pause():void
	    {
	        this._isPause = true;
	    }

	    public start():void
	    {
	        this._isPause = false;
	    }

        public setupListener():void
        {
            D5Game.me.touchReciver.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        }

        public unsetupListener():void
        {
            D5Game.me.touchReciver.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        }

        public run():void
        {
            if(this._path!=null && this._path[this._step]!=null)
            {
                //console.log("[CharacterController] Running");
                //if(this._target.action==Actions.Stop) this._target.action = Actions.Run;
                if(this._target.action==Actions.Wait) this._target.setAction(Actions.Run);

                this._nextTarget = this._step==this._path.length ? this._endTarget : D5Game.me.map.tile2WorldPostion(this._path[this._step][0],this._path[this._step][1]);


                var radian:number = GMath.getPointAngle(this._nextTarget.x-this._target.posX,this._nextTarget.y-this._target.posY);
                var angle:number = GMath.R2A(radian)+90;

                var xisok:boolean=false;
                var yisok:boolean=false;

                var xspeed:number = this._target.speed*Math.cos(radian);
                var yspeed:number = this._target.speed*Math.sin(radian);


                if(Math.abs(this._target.posX-this._nextTarget.x)<=xspeed){
                    xisok=true;
                    xspeed=0;
                }

                if(Math.abs(this._target.posY-this._nextTarget.y)<=yspeed){
                    yisok=true;
                    yspeed=0;
                }

                this._target.setPos(this._target.posX+xspeed,this._target.posY+yspeed);
                if(xisok && yisok){
                    // 走到新的位置点 更新区块坐标
                    this._step++;
                    if(this._step>=this._path.length){
                        this._target.setAction(Actions.Wait);
                        this._path=null;
                        this._step=1;

                        if(this._onWalkComplate!=null) this._onWalkComplate.apply(this._onWalkComplateThisObj,this._onWalkComplateParams);
                        this.clearWalkComplate();
                    }
                }else{
                    this.changeDirectionByAngle(angle);
                }
            }
        }

        /**
         * 根据角度值修改角色的方向
         */
        public changeDirectionByAngle(angle:number = 0):void{
            if(this._target==null) return;
            if(angle<-22.5) angle+=360;

            //_me.Angle = angle;
            //console.log("[CharacterContorller] change direction by angle:",angle);
            if(angle>=-22.5 && angle<22.5){
                this._target.setDirection(Direction.Up);
            }else if(angle>=22.5 && angle<67.5){
                this._target.setDirection(Direction.RightUp);
            }else if(angle>=67.5 && angle<112.5){
                this._target.setDirection(Direction.Right);
            }else if(angle>=112.5 && angle<157.5){
                this._target.setDirection(Direction.RightDown);
            }else if(angle>=157.5 && angle<202.5){
                this._target.setDirection(Direction.Down);
            }else if(angle>=202.5 && angle<247.5){
                this._target.setDirection(Direction.LeftDown);
            }else if(angle>=247.5 && angle<292.5){
                this._target.setDirection(Direction.Left);
            }else{
                this._target.setDirection(Direction.LeftUp);
            }
        }

        public dispose():void
        {
            this.unsetupListener();
            this._path=null;
            this._endTarget=null;
            this._step=1;
            this._target=null;
            this._nextTarget=null;
            this.clearWalkComplate();
        }

        public clearPath():void
        {

        }

        public setComplateFun(fun:Function,thisObj:any=null,...params):void
        {
            this._onWalkComplate = fun;
            this._onWalkComplateThisObj = thisObj;
            this._onWalkComplateParams = params;
        }

        public onTouch(e:egret.TouchEvent):void
        {
            // 以下代码for横版跳
//	        if(this._isPause) return;
//            if(this._jumpTime<CharacterController.JUMP_MAX)
//            {
//                this._gravitySpeed=-CharacterController.JUMP_POWER;
//                this._target.setPos(this._target.posX,this._target.posY+this._gravitySpeed);
//                this._jumpTime++;
//            }
//
//            return;
	        if(this._isPause) return;
//            if(this._jumpTime<CharacterController.JUMP_MAX)
//            {
//                this._gravitySpeed=-CharacterController.JUMP_POWER;
//                this._target.setPos(this._target.posX,this._target.posY+this._gravitySpeed);
//                this._jumpTime++;
//            }
//
//            return;
            //console.log("[CharacterController] get touch evet");
            // 检查是否点到某对象
            var clicker:IGD = D5Game.me.getClicker(e.stageX,e.stageY);
            if(clicker!=null){
                this.clickSomeBody(clicker);
                return;
            }
            //console.log("[CharacterController] get touch evet2");
            // 计算世界坐标
            this._endTarget = D5Game.me.map.getWorldPostion(e.stageX,e.stageY).clone();

            // 自动清掉后续动作，因为是在控制移动
            this.clearWalkComplate();

            this.walk2Target();
            d5power.ItemOpt.me.dispose();
            d5power.ItemTip.me.dispose();
        }

        public walkTo(posx:number,posy:number):void
        {
            // 计算世界坐标
            this._endTarget = new egret.Point(posx,posy);

            // 自动清掉后续动作，因为是在控制移动
            this.clearWalkComplate();

            this.walk2Target();
        }

        public clearWalkComplate():void{
            this._onWalkComplate = null;
            this._onWalkComplateParams = null;
            this._onWalkComplateThisObj = null;
        }

        /**
         * 控制角色走向某点
         * 请在本方法执行前设置_endTarget
         *
         * @return	移动成功，则返回true，移动失败返回false(目标点无法到达)
         */
        public walk2Target():boolean{
            //console.log("[CharacterController] into walk2target");
            // 检查目标点是否可移动
            if(this._endTarget.x == this._target.posX && this._endTarget.y == this._target.posY)
                return false;
            var p:egret.Point = D5Game.me.map.Postion2Tile(this._endTarget.x,this._endTarget.y).clone();
            var p0:egret.Point = D5Game.me.map.Postion2Tile(this._target.posX,this._target.posY);
      
            this._path = new Array<any>();
            if(D5Game.me.g)
            {
                if(!D5Game.me.map.getRoadPass(p.x,p.y))
                {
                    this._path = [[p.x,p.y],[p0.x,p0.y]];
                    this._step=1;
                    this._target.inG = true;
                    this._target.speedY = 3;
                    return true;
                }
            }
            
            
            if(!D5Game.me.map.getRoadPass(p.x,p.y))
            {
                  return false;
            }
                // 得出路径
                var nodeArr:Array<any> = D5Game.me.map.find(p0.x,p0.y,p.x,p.y);
                if(nodeArr==null){
                    return false;
                }else{
                    for(var i:number=0,j:number=nodeArr.length;i<j;i++){
                        this._path.push([nodeArr[i].x,nodeArr[i].y]);
                    }
                }
                this._step=1;
                // 向服务器发送同步数据
                this.tellServerMove(this._endTarget);
                //this._target.setAction(Actions.Run);
                return true;

        }

        public tellServerMove(target:egret.Point):void
        {
            // 移动通知
            this.checkQuiteFight();
            D5Game.me.canclePickup();
        }
        public checkQuiteFight():void
        {
            if((<IFighter><any>this._target.displayer).target!=null)
            {
                (<MyGame>(d5power.D5Game.me)).fightController.quitFight(<IFighter><any>this._target.displayer);
            }
        }
        /**
         * 点击到了某对象
         * @param	o	触发点击事件的GameObject
         */
        public clickSomeBody(o:IGD):void{
            // mission click
            //if(o instanceof NCharacterObject && o['uid']>0) D5Game.me.missionCallBack(<NCharacterObject><any> o);

            // do some thing
            if(o!=this._target && egret.Point.distance(o.$pos,this._target.$pos)>CharacterController.TALK_DISTANCE)
            {
                var i:number = 0;
                this.clearWalkComplate();


                var result:egret.Point = D5Game.me.map.getPointAround(o.$pos,this._target.$pos,CharacterController.TALK_DISTANCE);
                if(result==null)
                {
                    alert("无法接近，请靠近一些");
                }else{
                    this._endTarget = result;
                    this.walk2Target();
                    this.setComplateFun(this.clickSomeBody,this,o);
                }
                return;
            }else{
                // 朝向目标
                var angle:number = GMath.getPointAngle(o.posX-this._target.posX,o.posY-this._target.posY);
                this.changeDirectionByAngle(GMath.R2A(angle)+90);

                //<IFighter><any>o.displayer == null
                if(o.work == GOData.WORK_MONSTER)
                {
                    (<MyGame>(d5power.D5Game.me)).fightController.joinFight(<IFighter><any>this._target.displayer,<IFighter><any>o.displayer);
                    return;
                }

                if(o.job_type == GOData.JOB_COLLECTION)
                {
                    trace("采集中。。。");
                    D5Game.me.collectionWithNPC(o);
                }
                else
                {
                    D5Game.me.talkWithNPC(o);
                }

            }

            console.log("[CharacterController] Cick Some body");
        }
        public getNeer(px:number,py:number,f:Function,targetObj:any,doer:IFighter,target:IFighter):void
        {
            this._target.setAction(Actions.Wait);
            // 得出路径
            var p0:egret.Point = D5Game.me.map.Postion2Tile(this._target.posX,this._target.posY).clone();
            var p:egret.Point = D5Game.me.map.Postion2Tile(px,py);
            var nodeArr:Array<any> = D5Game.me.map.find(p0.x,p0.y,p.x,p.y);
            if(nodeArr==null)
            {
                return;
            }else{
                this.clearWalkComplate();
                this._onWalkComplate = f;
                this._onWalkComplateThisObj = targetObj;
                this._onWalkComplateParams = [doer,target];
                this._path = new Array();
                var i:number;
                for(i=0;i<nodeArr.length;i++)
                {
                    this._path.push([nodeArr[i].x,nodeArr[i].y]);
                }
            }
            this._step=1;
        }

        private error():void
        {
            throw new Error("[CharacterController] please just get instance throw static function getInstance()");
        }
    }
}
