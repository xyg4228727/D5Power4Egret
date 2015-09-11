module d5power {
	/**
	 * tiled 图片纹理集
	 * @author 
	 *
	 */
	export class TiledResourceData {
    	
        private static _resource:egret.SpriteSheet;
        
        private static _resourceLib:any={};
        
        private static _name:string;
        private static _bitmap: egret.Texture;
		public constructor() {
		}
	
        public static setupResLib(name:string,bitmap: egret.Texture,tiledset:TiledTileSet) 
        {
            this._bitmap = bitmap;
            if(!TiledResourceData._bitmap)
                return;
            var spritesheet:egret.SpriteSheet = new egret.SpriteSheet(bitmap);
            var data: Array<any>;
            if(TiledResourceData._resourceLib[name])
            {
                data = TiledResourceData._resourceLib[name];
            }else
            {
                data = new Array<any>();
            }
            
            var num: number = 0;
            for(var i: number = 0;i < tiledset.numCols;i++)
                {
                    for(var j: number = 0;j < tiledset.numRows;j++)
                    {
                    
                        spritesheet.createTexture(name+tiledset.firstGID+num,j*tiledset.tileWidth,i*tiledset.tileHeight,tiledset.tileWidth,tiledset.tileHeight);
                        var txt: egret.Texture = spritesheet.getTexture(name+tiledset.firstGID+num);
                        data[tiledset.firstGID + num] = txt;
                        num++;
                  }
             }
            TiledResourceData._resourceLib[name] = data;
        }
    
        public static getResource(name:string,id:number):egret.Texture
        {
//            if(TiledResourceData._resourceLib[name])
//            {
//                var res: egret.SpriteSheet = <egret.SpriteSheet><any>TiledResourceData._resourceLib[name];
//                if(res && id > 0)
//                {
//                    return res.getTexture(name + id);
//                }else
//                {
//                    return null;
//                }
//            }else{
//                return null;
//            }
            
            if(TiledResourceData._resourceLib[name])
            {
                var data: Array<any> = TiledResourceData._resourceLib[name];
                var txt: egret.Texture;
                txt = data[id] ? <egret.Texture><any>data[id]:null;
                return txt;   
            }else
            {
                return null;
            }
            
        }
	}
}
