module d5power {
	/**
	 *
	 * @author 
	 *
	 */
	export interface IFightController {
    	clear():void;
		quitFight(f:IFighter):void;
		joinFight(doer:IFighter, target:IFighter):void;
		doHurt(doer:IFighter, target:IFighter):void;
		hurt_implements(doer:IFighter, target:IFighter, value:number):void;
		die(doer:d5power.IFighter, killer:d5power.IFighter):void;
		
	}
}
