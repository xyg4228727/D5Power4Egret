/**
 * Created by Administrator on 2015/5/29.
 */
module d5power
{
    export class MonsterFlushData{
        /**
         * 怪物ID
         */
        public id:number;
        /**
         * 怪物是否停留
         */
        public stay:boolean;
        /**
         * 怪物行走范围
         */
        public walk_round:number;
        /**
         * 怪物刷新个数
         */
        public flush_num:number;
        /**
         * 怪物刷新范围
         */
        public flush_dis:number;
        /**
         * 怪物复活时间
         */
        public relive:number;
        /**
         * 怪物阵营设置
         */
        public campset:number;

        /**
         * 是否主动攻击
         */
        public autoAtk:boolean;

        public posx:number;

        public posy:number;

        public constructor()
        {

        }

        public format(monster:any):void
        {
            this.id = parseInt(monster.id);
            this.stay = parseInt(monster.stay)==0 ? false : true;
            this.walk_round = parseInt(monster.walk_round);
            this.flush_num = parseInt(monster.flush_num);
            this.flush_dis = parseInt(monster.flush_dis);
            this.relive = parseInt(monster.relive);
            this.campset = parseInt(monster.camp);
            this.autoAtk = parseInt(monster.autoAtk)==0 ? false : true;
            this.posx = parseInt(monster.posx);
            this.posy = parseInt(monster.posy);
        }
    }
}