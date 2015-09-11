
module d5power {

	export class GMath{
		public constructor(){
		}
		
		/**
		 * 获取某点的夹角
		 * 返回为弧度值
		 */ 
		public static getPointAngle(x:number,y:number):number{
			return Math.atan2(y,x);
		}
		
		/**
		 * 弧度转角度
		 */ 
		public static R2A(r:number):number{
			return r*180/Math.PI;
		}
		
		/**
		 * 角度转弧度
		 */ 
		public static A2R(a:number = 0):number{
			return a*Math.PI/180;	
		}
	}
}