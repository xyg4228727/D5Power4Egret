/**
 * Created by Administrator on 2015/6/5.
 */
module d5power
{
    export interface IBTData {
        setEnemyArray(value:Array<any>):void
        /**
         * 周围敌人列表
         */
        enemyArray:Array<any>;
        /**
         * 攻击目标
         */
        target:IFighter;
        /**
         * 是否被攻击
         */
        hasBeATk:boolean;


    }
}