/**
 * Created by Administrator on 2015/5/29.
 */
module d5power
{
    export interface IFighter {
        pushTo(pushDis:number,pushA:number):void;

        setAtkSpeedTemp(value:number):void;

        setAtkSpeed(value:number):void;

        fightDis:number;

        Pos:egret.Point;

        setAction(v:number):void;

        atkSpeed:number;

        setAtkSpeed(v:number):void;

        lastAtk:number;

        atk:number;

        def:number;

        camp:number;

        vit:number;

        str:number;

        agi:number;

        dex:number;

        cri:number;

        job:number;

        luk:number;

        rpos:number;

        viewTarget:IFighter;

        setTarget(v:IFighter):void;

        target:IFighter;

        int:number;

        changeHp():void;

        //baseKongfu:number;

        hurt(v:number, doer:IFighter):void

        controller:any;

        removeAllBuff():void;

        giveBuff(id:number,doer:IFighter):void

        quiteFight():void;
    }
}