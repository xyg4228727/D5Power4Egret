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

	export class D5ScriptCommand{
		/**
		 * 普通命令
		 */ 
		public static COMMAND:number = 0;
		/**
		 * 条件判断
		 */ 
		public static IF:number = 1;
		/**
		 * 分支语句
		 */ 
		public static SWITCH:number = 2;
		/**
		 * 循环语句
		 */ 
		public static FOR:number = 3;
		/**
		 * 等待条件达成
		 */ 
		public static WAITFOR:number = 4;
		
		private _type:number = 0;
		
		private _command:string;
		
		private _params:Array<any>;
		
		private _commandList:Array<D5ScriptCommand>;
		
		public constructor(type:number=0){
			this._type=type;
		}
		
		
		public get type():number{
			return this._type;
		}
		
		public addCommand(data:D5ScriptCommand):void{
			if(this._commandList==null) this._commandList = [];
			this._commandList.push(data);
		}
		
		public set command(s:string){
			this._command = s;
		}
		
		public get command():string{
			return this._command;
		}
		
		public get commandList():Array<D5ScriptCommand>{
			return this._commandList;
		}
		
		public set params(arr:Array<any>){
			this._params = arr;
		}
		
		public get params():Array<any>{
			return this._params;
		}
		
		public toString():string{
			var result:string = "[D5ScriptCommand] type:"+this._type+",command:"+this._command+',params:['+this._params+'],sonCommand:';
			if(this._commandList!=null){
				var length:number = this._commandList.length;
				for(var i:number = 0;i < length;i++){
					var obj:D5ScriptCommand = this._commandList[i];
			}
				}
			return result;
		}
	}
}