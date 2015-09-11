/**
 * Created by Administrator on 2015/5/26.
 */
module d5power {
    export class BTTree
    {
        public constructor()
        {
        }
        public _root:BTNode = null;

        public isRunning:boolean = true;

        public static RESET:string = "Rest";

        private static _resetId:number;

        public start():void
        {
            this.Init();
            this._root.Activate();
        }
        public Update():void
        {
            if (!this.isRunning) return;

    //			if (database.GetData<bool>(RESET)) {
    //				Reset();
    //				database.SetData<bool>(RESET, false);
    //			}

            // Iterate the BT tree now!
            if (this._root.Evaluate()) {
                this._root.Tick();
            }
        }

        public OnDestroy():void
        {
            if (this._root != null) {
                this._root.Clear();
            }
        }

        // Need to be called at the initialization code in the children.
        protected Init():void
        {
    //			database = GetComponent<Database>();
    //			if (database == null) {
    //				database = gameObject.AddComponent<Database>();
    //			}

    //			_resetId = database.GetDataId(RESET);
    //			database.SetData<bool>(_resetId, false);
        }

        protected Reset():void
        {
            if (this._root != null) {
                this._root.Clear();
            }
        }
    }
}