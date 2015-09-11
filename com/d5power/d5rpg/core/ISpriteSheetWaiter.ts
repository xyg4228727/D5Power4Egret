module d5power
{
    export interface ISpriteSheetWaiter
    {
        onSpriteSheepReady(data:IDisplayer):void;
        loadID:number;
    }
}