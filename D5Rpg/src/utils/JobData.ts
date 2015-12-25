module d5power {
	/**
	 * 职业配置数据
	 * @author 
	 *
	 */
	export class JobData {
		public constructor() {
		}
        /**
         *职业标示id
         */       
        public  id:number;
        /**
        * 职业名称
        */
        public name:string = "";
        
        /**
        * 职业皮肤
        */ 
        public skin:string = "";
        
        
        public  format(xml:any):void
        {
            this.id = parseInt(xml.id);
            this.name = <string><any>(xml.name);
            this.skin = <string><any>(xml.skin);
        }
        
        public  toString():string
        {
            return "阵营["+this.id+"]"+name;
        }
	}
}
