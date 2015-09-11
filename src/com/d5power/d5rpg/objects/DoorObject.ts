/**
 * Created by renhoward on 15/1/24.
 */
module d5power
{
    export class DoorObject extends GameObject
    {
        public static MAX_POOL_NUM:number = 5;
        private static _pool_door:Array<DoorObject>=[];

        public static getDoor():DoorObject
        {
            var obj:DoorObject;
            if(DoorObject._pool_door.length)
            {
                obj = DoorObject._pool_door.pop();
            }else{
                obj = new DoorObject();
            }
            obj._lock=false;
            obj._lastCheck=0;
            return obj;
        }

        private static backDoor(obj:DoorObject):void
        {
            if(DoorObject._pool_door.length<DoorObject.MAX_POOL_NUM && DoorObject._pool_door.indexOf(obj)==-1) DoorObject._pool_door.push(obj);
        }

        public constructor(){
            super();
        }

        private _lastCheck:number;
        private _lock:boolean;
        public renderAction():void
        {
            if(!this._lock && D5Game.me.timer-this._lastCheck>500 && egret.Point.distance(this._data.$pos,D5Game.me.player.$pos)<50)
            {
                this._lastCheck = D5Game.me.timer;
                this._lock = true;
                console.log("change Map");
                D5Game.me.changeMap(<number>this._data.linkMap,<number>this._data.linkPosx,<number>this._data.linkPosy);
            }
        }

        public dispose():void {
            if (this._spriteSheet)
            {
                this._spriteSheet.unlink();
                this._spriteSheet=null;
            }
            this._data = null;
            this._monitor.texture = null;
            this._drawAction = null;

            if(this.contains(this._monitor)) this.removeChild(this._monitor);
            DoorObject.backDoor(this);
        }
    }
}