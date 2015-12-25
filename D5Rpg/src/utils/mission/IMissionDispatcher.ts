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

	export interface IMissionDispatcher{

		missionNum:number;
		getMissionByIndex(index:number):any;
		getMissionById(id:number):MissionData;
		onAddMission(f:Function,thisobj:any):void;
		addMissionById(mission_id:number):void;
		setStartMission(v:number);
		startMission:number;
		flushMission():void;
		hasMission(mid:number):boolean;
		hasMissionById(id:number):boolean;
		lastMissionid:number;
		deleteMission(m:any):void;

		publicCheck(type:number,value:string,num:string):boolean
		/**
		 * 是否具备某个条件的独立检查器
		 */ 
		hasChecker(type:number):boolean
		/**
		 * 是否具备某个任务
		 */ 
		hasMission(mid:number):boolean
		/**
		 * 检查某物品数量
		 */ 
		hasItemNum(itemid:number):number;
		/**
		 * 是否和某NPC对话过
		 */ 
		hasTalkedWith(npcid:number):boolean;
		/**
		 * 杀死怪物数量
		 */ 
		killMonseterNum(monsterid:number):number;
		/**
		 * 玩家属性达到
		 */ 
		userPro(pro_name:string,value:number):boolean;
		/**
		 * 给玩家属性
		 */
		addPro(pro_name:string,value:number):boolean;
		/**
		 * 得到某物品
		 */ 
		getItem(itemid:number,num:number,packageid:number,equ:boolean):boolean;
		
		/**
		 * 获得经验
		 */ 
		getExp(num:number):void;
		
		/**
		 * 获得某个任务
		 */  
		addMissionById(id:number):void;
		/**
		 * 获得游戏币
		 */ 
		getMoney(num:number):boolean;
		/**
		 * 拥有BUFF
		 */ 
		hasBuff(id:number):boolean;
		/**
		 * 装备了某道具
		 */ 
		hasEqu(id:number):boolean;
		
		/**
		 * 是否具备某技能
		 * @param		lv 为0时不判断级别，否则需要等级大等于
		 */ 
		hasSkill(id:number,lv:number):boolean;
		
		/**
		 * 是否具备某皮肤
		 */ 
		hasSkin(path:string):boolean;
//		/**
//		 * 可见某任务
//		 */ 
//		function getCanSeeMission(id:uint):void;
//		/**
//		 * 不可见某任务
//		 */ 
//		function lostCanSeeMission(id:uint):void; 
	}
}