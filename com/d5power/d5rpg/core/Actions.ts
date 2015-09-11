
module d5power {

	export class Actions{
		/**
		 * 特殊状态：复活
		 */ 
		public static RELIVE:number = -1;
		/**
		 * Stop 停止
		 * */
		public static Stop:number=8; 
		/**
		 * Run 跑动
		 * */
		public static Run:number=1;
		/**
		 * Attack 物理攻击
		 * */
		public static Attack:number=2;
		/**
		 * 弓箭攻击
		 * */
		public static BowAtk:number=3;
		
		/**
		 * 坐下
		 */ 
		public static Sit:number = 4;
		
		/**
		 * 死亡
		 */ 
		public static Die:number = 5;
		
		/**
		 * 拾取
		 */ 
		public static Pickup:number = 6;
		
		/**
		 * 被攻击
		 */
		public static BeAtk:number = 7;
		
		/**
		 * 等待（备战）
		 */ 
		public static Wait:number = 8;

		
		public constructor(){
		}
	}
}