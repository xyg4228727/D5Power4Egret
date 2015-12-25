module d5power {
	/**
	 *
	 * @author 
	 *
	 */
	export class D5Gravity {
    
        private JUMP_POWER:number = 5;
        private JUMP_MAX:number = 2;
    	
        private _objects: Array<IGD>=[];
    	
        private _gy: number;
        private _gx: number;
        
		public constructor() {
		}
		
		public initGravity(gy:number,gx:number=0,jumppower:number=5):void
		{
            this._gy = gy;
            this._gx = gx;
		}
		
		public addObject(e:IGD):void
		{
            if(this._objects.indexOf(e) == -1) this._objects.push(e);
		}
		
		public removeObject(e:IGD):void
		{
            var id: number = this._objects.indexOf(e);
            if(id != -1) this._objects.splice(id,1);
		}
		
		public clearObject():void
		{
            this._objects = [];
		}
		
		public get counts():number
		{
            return this._objects.length;
		}
		
		public run():void
		{
    		// 更新所有的静态物体的位置
            var i: number;
            var j: number;
            var obj:IGD;
            var px: number;
            var py: number;
            var hit: boolean;
            for(i = this._objects.length;i > 0;i--){
                obj = this._objects[i-1];
                if(!obj.inG) continue;
                if(!obj.inScreen) this._objects.splice(i,1);
                obj.speedX += this._gx;
                obj.speedY += this._gy;
                px = obj.posX + obj.speedX;
                py = obj.posY + obj.speedY;
                var p: egret.Point = D5Game.me.map.Postion2Tile(px,py);
                if(obj.speedY > 0&&D5Game.me.map.getRoadPass(p.x,p.y)) 
                {
                     obj.inG = false;
                     obj.speedX = 0;
                     obj.speedY = 0;
                }
            }
            
		}
	}
}
