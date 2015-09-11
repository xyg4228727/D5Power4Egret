module d5power
{
    export interface IController
    {
        walkTo(posx:number,posy:number):void;
        unsetupListener():void;
        setupListener():void;
        clearPath():void
        dispose():void;
        gravityRun():void;
        run():void;
        changeDirectionByAngle(angle:number):void;
	    pause():void;
	    start():void;
    }
}
