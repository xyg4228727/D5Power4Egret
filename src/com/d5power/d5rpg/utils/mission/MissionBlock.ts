
module d5power {

	export class MissionBlock{		
		/**
		 * 类型
		 */ 
		public type:number = 0;
		
		/**
		 * 值
		 */ 
		public value:string;
		
		/**
		 * 数量
		 */ 
		public num:string;
		
		public constructor(){
		}
		
		public get Type():number{
			return this.type;
		}
		
		public get Value():string{
			return this.value;
		}
		
		public get Num():string{
			return this.num;
		}
		
        public format(t:number,v:string,n:string):void
        {
            this.type = t;
            this.value = v;
            this.num = n;
        }
		
		public toString():string{
			return "类型："+this.type+"值："+this.value+"数量："+this.num;
		}
	}
}