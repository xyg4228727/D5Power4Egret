module d5power {

	export interface IGO
    {
		renderMe():void;
		deleteing:boolean;
		dispose():void;
		inScreen:boolean;
        x:number;
        y:number;
		parent:egret.DisplayObjectContainer;
        setupSkin(res:string);
        spriteSheet:IDisplayer;
        setupData(data:any);
        hitTestArea(px:number,py:number):boolean;
		showMissionStatus(index:number):void;
		camp:number;
	}
}