/**
 * Created by Administrator on 2015/5/26.
 */
module d5power {
    export class BTAction extends BTNode {
        private _status:number = BTConst.BTActionStatus_Ready;
        public constructor(precondition:d5power.BTPrecondition = null)
        {
            super(precondition);
        }
        protected Enter ():void
        {
        }

        protected  Exit ():void
        {
        }

        protected Execute():number
        {
            return BTConst.BTResult_Running;
        }
         public Clear():void
        {
            if (this._status != BTConst.BTActionStatus_Ready) {	// not cleared yet
                this.Exit();
                this._status = BTConst.BTActionStatus_Ready;
            }
        }

        public Tick ():number
        {
            var result:number = BTConst.BTResult_Ended;
            if (this._status == BTConst.BTActionStatus_Ready) {
                this.Enter();
                this._status = BTConst.BTActionStatus_Running;
            }
            if (this._status == BTConst.BTActionStatus_Running) {		// not using else so that the status changes reflect instantly
                result = this.Execute();
                if (result != BTConst.BTResult_Running) {
                    this.Exit();
                    this._status = BTConst.BTActionStatus_Ready;
                }
            }
            return result;
        }

        public AddChild(aNode:BTNode):void
        {
        //			Debug.LogError("BTAction: Cannot add a node into BTAction.");
        }

        public RemoveChild(aNode:BTNode):void
        {
        //			Debug.LogError("BTAction: Cannot remove a node into BTAction.");
        }
    }
}