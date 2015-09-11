module d5power
{
    export interface ICamera
    {
        lookAt(px:number,py:number):void;
        reCut();
        update();
        setFocus(o:IGD):void;
        focus:IGD;
        zorderSpeed:number;
        zeroX:number;
        zeroY:number;
        moveNorth(k:number):void;
        moveSourth(k:number):void;
        moveWest(k:number):void;
        moveEast(k:number):void;
        move(xdir:number, ydir:number, k:number):void
    }
}