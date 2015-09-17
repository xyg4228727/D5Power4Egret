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

	export class MissionData{
		/**
		 * 承接类任务 ！
		 */ 
		public static TYPE_GET:number = 0;
		
		/**
		 * 交付类任务 ？
		 */ 
		public static TYPE_COMPLATE:number = 1;
		
		private _type:number = 0;
		/**
		 * 任务ID
		 */ 
		private _id:number = 0;
		/**
		 * 任务名
		 */ 
		private _name:string;
		/**
		 * 任务内容
		 */ 
		private _info:string;
		/**
		 * NPC对话内容
		 */ 
		private _npc_said:string;
        /**
         *未完成 对话内容
         */
        private _uncompDialog:string;
		/**
		 * 相关NPC
		 */ 
		private _npc_id:number = 0;
		/**
		 * 是否完成
		 */ 
		private _iscomplate:boolean=false;
		/**
		 * 任务需求
		 */ 
		private _need:Array<MissionBlock>;
		/**
		 * 任务奖励
		 */ 
		private _give:Array<MissionBlock>;
		
		/**
		 * 任务完成后脚本
		 */ 
		private _complate_script:string;
		
		/**
		 * 领取类任务，直接可以完成，文字显示接受
		 */ 
		private static GIVE:number = 0;
		/**
		 * 完成类任务，需要满足条件才能完成。
		 */ 
		private static MISS:number = 1;

		public constructor(id:number = 0){
			this._id = id;
		}
		
		public formatFromJson(data:any):void
		{
            var block:MissionBlock;
            this._need = [];
            this._give = [];

            this._name = data.name;
            this._type = data.type;
            this._info = data.info;
            this._npc_id = data.npc;
            this._id = data.id;
            this._npc_said = data.say;
            this._complate_script = data.complateScript;
            this._uncompDialog = data.uncomp;

            var obj:any;
            var i:number;
            if(data.need)
            {
                for(i=0;i<data.need.length;i++)
                {
                    obj = data.need[i];
                    block = new MissionBlock();
                    block.type = parseInt(obj.type);
                    block.value = obj.value;
                    block.num = obj.num;
                    this._need.push(block);
                }
            }

            var obj:any;
            if(data.give)
            {
                for(i=0;i<data.give.length;i++)
                {
                    obj = data.give[i];
                    block = new MissionBlock();
                    block.type = parseInt(obj.type);
                    block.value = obj.value;
                    block.num = obj.num;
                    this._give.push(block);
                }
            }

		}
		
		public get complate_script():string{
			return this._complate_script;
		}
		
		/**
		 * 任务类型 0-接 1-交
		 */ 
		public get type():number{
			return this._type;
		}
		/**
		 * 任务名
		 */ 
		public get name():string{
			return this._name;
		}
		/**
		 * 任务ID
		 */ 
		public get id():number{
			return this._id;
		}
		/**
		 * 任务信息
		 */ 
		public get info():string{
			return this._info;
		}
		/**
		 * NPC任务对话
		 */ 
		public get npc_said():string{
			return this._npc_said;
		}

        /**
         * NPC 未完成对话
         */
        public get uncompDialog():string{
            return this._uncompDialog;
        }
		/**
		 * NPC关联
		 */ 
		public get npc_id():number{
			return this._npc_id;
		}
		/**
		 * 任务条件
		 */ 
		public get need():Array<MissionBlock>{
			return this._need;
		}
		/**
		 * 任务奖励
		 */ 
		public get give():Array<MissionBlock>{
			return this._give;
		}

		public get giveString():string
		{
			var givestr:string = '';
			var len:number = this.give.length;
			for(var i:number = 0;i < len;i++)
			{
				var temp:MissionBlock = this.give[i];
				givestr+=MissionNR.getChinese(temp.type)+'x'+temp.num;
			}
			return givestr;
		}


		public get needString():string{
			var needstr:string = '';
			var length:number = this._need.length;
			for(var i:number = 0;i < length;i++){
				var need:MissionBlock = this._need[i];
				needstr+=MissionNR.getChinese(need.type)+"()";
			}
			
			return needstr;
		}
		/**
		 * 任务是否完成
		 */ 
		public get isComplate():boolean{
			return this._iscomplate;
		}
		
		/**
		 * 增加完成条件 
		 */ 
		public addNeed(need:MissionBlock):void{
			if(this._need == null) this._need = [];
			if(need.type==0 && need.value==null) return;
			this._need.push(need);
		}
		/**
		 * 增加奖励内容
		 */ 
		public addGive(give:MissionBlock):void{
			if(this._give == null) this._give = [];
			if(give.type==0 && give.value==null) return;
			this._give.push(give);
		}
		/**
		 * 检查当前任务是否完成
		 */ 
		public check(checker:IMissionDispatcher):boolean{
			if(this._type==MissionData.GIVE) return true;
			
			this._iscomplate=true;
			if(this._need!=null){
				var length:number = this._need.length;
				for(var i:number = 0;i < length;i++){
					var need:MissionBlock = this._need[i];
					switch(need.type){
						case MissionNR.N_ITEM_NEED:
						case MissionNR.N_ITEM_TACKED:
							this._iscomplate = this._iscomplate && checker.hasItemNum(parseInt(need.value))>=parseInt(need.num);
							break;
						case MissionNR.N_MONSTER_KILLED:
							this._iscomplate = this._iscomplate && checker.killMonseterNum(parseInt(need.value))>=parseInt(need.num);
							break;
						case MissionNR.N_PLAYER_PROP:
							this._iscomplate = this._iscomplate && checker.userPro(need.value,parseInt(need.num));
							break;
						case MissionNR.N_MISSION:
							this._iscomplate = this._iscomplate && checker.hasMission(parseInt(need.value));
							break;
						case MissionNR.N_TALK_NPC:
							this._iscomplate = this._iscomplate && checker.hasTalkedWith(parseInt(need.value));
							break;
						case MissionNR.N_BUFF:
							this._iscomplate = this._iscomplate && checker.hasBuff(parseInt(need.value));
							break;
						case MissionNR.N_EQU:
							this._iscomplate = this._iscomplate && checker.hasEqu(parseInt(need.value));
							break;
						case MissionNR.N_SKILL:
							this._iscomplate = this._iscomplate && checker.hasSkill(parseInt(need.value),0);
							break;
						case MissionNR.N_SKILL_LV:
							this._iscomplate = this._iscomplate && checker.hasSkill(parseInt(need.value),parseInt(need.num));
							break;
						case MissionNR.N_SKIN:
							this._iscomplate = this._iscomplate && checker.hasSkin(need.value);
							break;
						default:
							if(checker.hasChecker(need.type)) this._iscomplate = this._iscomplate && checker.publicCheck(need.type,need.value,need.num);
							break;
					}
				}
			}
			return this._iscomplate;
		}
		
		/**
		 * 完成任务
		 */ 
		public complate(checker:IMissionDispatcher):boolean{
			if(!this.check(checker)) return false;

			d5power.D5Game.me.characterData.deleteMission(this);
			
			if(this._need!=null){
				var length:number = this._need.length;
				for(var i:number = 0;i < length;i++){
					var need:MissionBlock = this._need[i];
					switch(need.type){
						case MissionNR.N_ITEM_NEED:
							(<RPGI.MyCharacterData>(d5power.D5Game.me.characterData)).delItem(parseInt(need.value),parseInt(need.num));
							break;
					}
				}
			}

			if(this._give!=null){
				var length1:number = this._give.length;
				for(var i1:number = 0;i1 < length1;i1++){
					var give:MissionBlock = this._give[i1];
                    MissionData.reward(give,checker);
				}
			}
			return true;
		}
        public static  reward(give:MissionBlock,checker:IMissionDispatcher):void
        {
            switch(give.type)
                {
                case MissionNR.R_ITEM:
                    checker.getItem(<number><any>(give.value),<number><any>(give.num),0,false);
                    break;
                case MissionNR.R_MONEY:
                    checker.getMoney(parseInt(give.value));
                    d5power.D5Game.me.missionLoaded();
//                    d5power.D5Game.me.characterData.addMissionById(parseInt("1"));
                    break;
                case MissionNR.R_EXP:
                    checker.getExp(parseInt(give.value));
                    break;
                case MissionNR.R_MISSION:
                    d5power.D5Game.me.characterData.addMissionById(parseInt(give.Value));
                    break;
            }
        }
        
		
		public toString():string{
			return "任务名："+this._name+"\n任务编号："+this._id+"\n任务类型："+this._type+"\n任务说明:"+this._info;
		}
	}
}