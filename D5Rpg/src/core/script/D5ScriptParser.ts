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

	export class D5ScriptParser{		
		public static _noticer:INoticer;
		/**
		 * 变量集合
		 */ 
		public static _vars:any = {};
		
		/**
		 * 默认运行时间间隔
		 */ 
		private _runSpeed:number = 500;
		
		/**
		 * 上一次的运行时间
		 */ 
		private _lastRunTime:number = 0;

		private _nowUrl:string;
		
		/**
		 * 脚本终止运行标签
		 */ 
		private _break:boolean=false;
		
		/**
		 * 命令集
		 */ 
		private _command:D5ScriptCommand;
		/**
		 * 解析前的脚本序列
		 */ 
		private _scriptArr:Array<any>;
		/**
		 * 解析行号
		 */ 
		private _lineno:number = 0;
		
		/**
		 * 是否进入运行状态
		 */ 
		public _running:boolean=false;
		
		/**
		 * 运行行号
		 */ 
		private _runLine:number = 0;

        public stage:egret.Stage;
		
		public constructor(stage:egret.Stage){
            this.stage = stage;
		}
		
		public number(name:string,value:any=0):void{
			D5ScriptParser._vars[name] = value;
		}
		
		public string(name:string,value:string):void{
			D5ScriptParser._vars[name] = value;
		}
		
		public add(name:string):void{
			if(D5ScriptParser._vars[name]){
				D5ScriptParser._vars[name]++;
			}else{
				trace("[D5ScriptParser] Please define "+name+" first.");
			}
		}
		
		public print(...params):void{
            for(var k:number=0;k<params.length;k++){
				var value:string = params[k];
				if(D5ScriptParser._vars[value]) params[k] = D5ScriptParser._vars[value];
			}
			trace(params);
		}
		
		/**
		 * 等待
		 */ 
		public wait(sec:number = 0):void{
			this._lastRunTime=egret.getTimer()+sec*1000;
			trace("[Wait]");
		}
		
		/**
		 * 跳转到指定行
		 */ 
		public goto(line:number = 0):void{
            line -= 1;
            if(line<0) line = 0;
			if(line>=this._command.commandList.length){
				throw new Error("[D5ScriptParser] can not jump to a not exist line,line no. is "+line+",total line is "+this._command.commandList.length);
			}
			
			this._runLine = line-1; // 由于运行完一行后，行号会自动+1，因此跳转时必须减1
		}
		
		/**
		 * 从当前行开始跳转指定行
		 */ 
		public jump(number:number = 0):void{
			var line:number = this._runLine+number;
			if(line>=this._command.commandList.length || line<0){
				throw new Error("[D5ScriptParser] can not jump to a not exist line,line no. is "+line+",total line is "+this._command.commandList.length);
			}
			
			this._runLine = line-1;
		}

		
		/**
		 * 更新状态
		 */ 
		public runScript(url:string=''):void{
			if(this._running){
				if(D5ScriptParser._noticer!=null) D5ScriptParser._noticer.notice("当前正有一个脚本运行，目前不支持多脚本运行");
				return;
			}
			// 只有第0个任务可以纳入新手引导
			if(this._nowUrl != url && url!=''){
				this._command = null
				this._nowUrl = url;

                RES.getResByUrl(url,this.onComplate,this);
				return;
			}
			
			if(this._command!=null){
				this._break = false;
				
				if(this.stage==null) throw new Error("[D5ScriptParser] can not run without stage setted.please set stage first.");
				
				this.start();
			}else{
				this._runLine = 0;
				this._lineno=0;
				this._command = new D5ScriptCommand();
				this.Parse(this._command);
				this.runScript();
			}
		}
		
		/**
		 * 通过文本进行配置
		 */ 
		public configTxt(str:string):void{
			var reg:RegExp;
			reg = /\t/g;
			str = str.replace(reg,'');
			
			reg = /\r/g;
			str = str.replace(reg,"\n");
			
			reg = /\r\n/g;
			str = str.replace(reg,"\n");
			
			reg = /\n/g;
			
			// 初始化脚本数据
			var temp:Array<any> = str.split(reg);

            this._scriptArr = new Array<any>();
			var length:number = temp.length;
			for(var i:number = 0;i < length;i++){
				var s:string = temp[i];
				// 剔除注释
				if(s.substr(0,1)=='#' || s=='' || s=='\r' || s=='\n' || s=='\r\n') continue;
                this._scriptArr.push(s);
			}
			
			
			this.runScript();
		}
		
		public stop():void{
            this.pause();
			this._lastRunTime = 0;
			this._command = null;
			this._nowUrl = '';
			this._runLine = 0;
			this._lineno = 0;
			this._scriptArr = [];
			this._break = false;
            //this.stage = null;

		}
		
		public pause():void{
            this.stage.removeEventListener(egret.Event.ENTER_FRAME,this.running,this);
			this._running = false;
		}
		
		public start():void{
			if(this._running) return;
            this.stage.addEventListener(egret.Event.ENTER_FRAME,this.running,this);
			this._running = true;
		}
		
		public runComplate():void{
			trace("[D5ScriptParser] 脚本执行完毕");
		}
		
		/**
		 * 执行程序
		 */ 
		private running(e:Event):void{
			if(!this._break && egret.getTimer()-this._lastRunTime>this._runSpeed){
				if(this._runLine>=this._command.commandList.length){
					this.stop();
					this.runComplate();
					return;
				}
				var comm:D5ScriptCommand = this._command.commandList[this._runLine];
				this.exec(comm);
				this._runLine++;
			}
		}
		
		private exec(command:D5ScriptCommand):void{
			var needLoop:boolean = false;
			if(this._break) return;
			switch(command.type){
				case D5ScriptCommand.IF:
					// IF语句 逻辑处理
					var p:string = command.params[0];


					if(this[p] && this[p] instanceof Function){
						var j:number=command.params.length;
						if(j==1){
							needLoop = this[p].apply(this);
						}else{
							var args:Array<any> = new Array<any>();
							for(var i:number=1;i<j;i++) args.push(command.params[i]);
							needLoop = this[p].apply(this,args);
							trace(needLoop,"RUN");
						}
					}else{
						
						if(command.params.length>1){
							trace("[D5ScriptParser] No Supported IF mode.There are only support ONE chance.");
							return;
						}
						
						// 首先取出所有的命令、函数
						var reg:RegExp = /^[a-zA-Z_]*\([0-9a-zA-Z,]*\)|^[a-zA-Z0-9_]*/g;
						
						// 第一次匹配
						var runner:Array<any> = p.match(reg);
						
						// 不包含任何符合条件的函数或参数则报错
						if(runner==null || runner.length==0){
							trace("[D5ScriptParser] Can not found any command.");
							return;
						}
						
						// 按参数/函数进行切割，剩余部分为右侧（包含运算符和判断值）
						var params:Array<any> = p.split(runner[0]);
						
						// 条件判断运算符左边的内容
						var left:string = runner[0];
						// 条件判断运算符
						var doer:string;
						// 条件判断运算符右边的内容
						var right:string;
						
						// 进行二次切割，判断是否存在运算符
						var reg2:RegExp = />|<|!=|==|>=|<=/g;
						var runner2:Array<any> = params[1].toString().match(reg2);
						
						if(runner2.length==0){
							// 唯一命令
							right = params[1];
							doer = runner[0];
						}else if(runner.length==1){
							// 条件判断命令
							var rightArr:Array<any> = params[1].toString().split(runner2[0]);
							right = rightArr[1]
							doer = runner2[0];
						}else{
							// 超出支持范畴
							throw new Error("[D5ScriptParser] There are only support ONE runner.");
						}
						
						//trace(left,doer,'RIGHT:',right);
						
						// 处理函数
						
						var funreg:RegExp = /\([0-9a-zA-Z,]*\)/g;
						var funRunner:Array<any> = left.match(funreg);

						// 函数参数的纯净名（不带参数的）
						var funName:string = left.replace(funreg,'');
						
						if(funRunner && funRunner.length>1) throw new Error("[D5ScriptParser] Function format error.");
						
						
						var funParam:string;
						
						if(funRunner==null || funRunner.length==0){
							funParam = '';
						}else{
							var funStr:string = funRunner[0];
							funParam = funStr.substr(1,funStr.length-2);
						}
						
						// 如果没有参数
						if(funParam==''){
							if(this[funName]){
								left = this[funName] instanceof Function ? this[funName]() : this[funName];
							}else if(D5ScriptParser._vars[funName]){
								left = D5ScriptParser._vars[funName];
							}
						}else{
							// 如果有参数	
							if(this[funName] && this[funName] instanceof Function){
								left = this[funName].apply(this,funParam.split(','));
							}
						}
						
						needLoop = true;
						switch(doer){
							case '>':
								
								trace('[D5ScriptParser] Check '+left+' > '+right);
								if(parseInt(left)<=parseInt(right)) needLoop=false;
								break;
							case '<':
								
								trace('[D5ScriptParser] Check '+left+'<'+right);
								if(parseInt(left)>=parseInt(right)) needLoop=false;
								break;
							
							case '==':
								
								trace('[D5ScriptParser] Check '+left+'=='+right);
								if(left!=right) needLoop=false;
								break;
							
							case '!=':
								
								trace('[D5ScriptParser] Check '+left+'!='+right);
								if(left==right) needLoop=false;
								break;
							
							case '>=':
								
								trace('[D5ScriptParser] Check '+left+'>='+right);
								if(parseInt(left)<parseInt(right)) needLoop=false;
								break;
							case '<=':
								trace('[D5ScriptParser] Check '+left+'<='+right);
								if(parseInt(left)>parseInt(right)) needLoop=false;
								break;
							default:
								throw new Error("Can not understand your runner ");
								break;
							
						}
					}// for no function mode
					break;
				case D5ScriptCommand.SWITCH:
					
					// SWITCH处理
					var checker:any = this[command.params[0].toString()];
					
					var length1:number = command.commandList.length;
					for(var i1:number = 0;i1 < length1;i1++){
						var son:D5ScriptCommand = command.commandList[i1];
					
				}
					break;
				case D5ScriptCommand.FOR:
					// IF语句 逻辑处理
					if(command.params.length!=2){
						throw new Error("No Supported FOR mode.There are only support TWO params.");
					}
					var start:number = command.params[0];
					var end:number = command.params[1];
					
					var list:Array<D5ScriptCommand> = command.commandList; 
					if(list!=null && list.length>0){
						for(var i:number = start;i<end;i++){
							var length2:number = list.length;
							for(var i2:number = 0;i2 < length2;i2++){
								var obj:D5ScriptCommand = list[i2];
						}
							}
					}
					
					break;
				default:
					if(this[command.command] && this[command.command] instanceof Function){
						try{
							(<Function><any> (this[command.command])).apply(this,command.params);
						}catch(e){
							trace("[D5ScriptParser] can not run function "+command.command+",Error code:"+e.message);
						}
					}else{
						trace("[D5ScriptParser] can not found the function "+command.command);
					}
					break;
			}

            if(needLoop)
            {
                var list2:Array<D5ScriptCommand> = command.commandList;
                if(list2!=null && list2.length>0)
                {
                    for(var i:number=0;i<list2.length;i++) this.exec(list2[i]);
                }
            }
		}
		
		/**
		 * 脚本词法解析
		 */ 
		private Parse(block:D5ScriptCommand=null):void{
			var s:string;
			var temp:Array<any>;
			
			var breakStatus:boolean = true;
			while(breakStatus){
				s = this.D5ScriptAt(this._scriptArr);
				if(s==null) break;

                var strKey:string = "[*string*]";
                // 匹配字符串
                var ts:string = s.replace(/\"(.*)\"/g,strKey);
				temp = ts.split(' ');

                // 取出字符串内容
                var stringArr:Array<any> = s.match(/\"(.*)\"/g);


                // 剔除无效空位
                var findStr:number = 0;
				for(var i:number=temp.length-1;i>=0;i--)
                {
                    if(temp[i]==strKey)
                    {
                        temp[i] = stringArr[findStr].replace(/\"/g,'');
                        findStr++;
                    }else if(temp[i]==undefined || temp[i]=='') {
                        temp.splice(i, 1);
                    }
                }
				
				var sblock:D5ScriptCommand=null;
				
				switch(temp[0]){
					case 'if':
						sblock = new D5ScriptCommand(D5ScriptCommand.IF);
						this.Parse(sblock);
						break;
					case 'endif':
						breakStatus = false;
						break;
					
					
					case 'switch':
						sblock = new D5ScriptCommand(D5ScriptCommand.SWITCH);
                        this.Parse(sblock);
						break;
					case 'endswitch':
						breakStatus = false;
						break;
					
					case 'for':
						sblock = new D5ScriptCommand(D5ScriptCommand.FOR);
                        this.Parse(sblock);
						break;
					case 'endfor':
						breakStatus = false;
						break;
					
					default:
						sblock = new D5ScriptCommand();
						break;
				}
				
				if(sblock!=null){
					sblock.command = temp.shift();
					if(temp.length>1) throw new Error("[D5ScriptParser] Too many params.There have "+temp.length+' params.content is:'+temp);
					sblock.params = temp[0]==null ? null : temp[0].toString().split(',');
					block.addCommand(sblock);
				}
			}
		}
		
		private onComplate(data:any):void{
			var str:string = <string>data;
			this.configTxt(str);
		}
		
		/**
		 * 脚本词法提取
		 */ 
		private D5ScriptAt(arr:Array<any>):string{
			var s:string = arr[this._lineno];
			this._lineno++;
			return s;
		}

		private error():void{
			throw new Error('D5ScriptParser is a single class.can not instance again.');
		}
		
	}
}