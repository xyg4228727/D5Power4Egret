module d5power {
	export interface IDisplayer {
		/**
		 * 渲染

		render():void;
		/**
		 * 更换素材

		change(f:string,onloaded:Function=null,frame:number=-1,framebak:Function=null):void;
		/**
		 * 是否循环动作

		loop:void
		/**
		 * 更换动作接口

		action:void;
		/**
		 * 更换方向接口

		direction:void;
		
		/**
		 * 获得位图显示对象

		monitor:egret.DisplayObject
		
		shadow:egret.Shape;
		
		renderDirection:number;
		
		effectDirection:number
		
		playFrame:number;
		
		totalFrame:number;
		/**
		 * 重置播放帧数

		resetFrame():void;

        dispose();
         */
        getTexture(dir:number,frame:number):egret.Texture;
        setup(res:string):void;
        unlink():void;
        name:string;
        renderTime:number;
        totalFrame:number;
        totalDirection:number;
        shadowX:number;
        shadowY:number;
        /**
         * 重心坐标X
         */
        gX:number;
        /**
         * 重心坐标Y
         */
        gY:number;
        /**
         * 帧宽
         */
        frameWidth:number;
        /**
         * 帧高
         */
        frameHeight:number;
	}
}