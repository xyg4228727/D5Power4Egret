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