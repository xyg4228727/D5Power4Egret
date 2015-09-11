/**
 * Created by Administrator on 2015/5/27.
 */
module d5power {
    export class BTParallelFlexible extends BTNode {
        private _activeList:Array<boolean> = [];
        public constructor(precondition:d5power.BTPrecondition = null) {
            super(precondition);
        }
        protected DoEvaluate ():boolean
        {
            var numActiveChildren:number = 0;
            for (var i:number=0; i<this.children.length; i++) {
                var child:BTNode = this.children[i];
                if (child.Evaluate()) {
                    this._activeList[i] = true;
                    numActiveChildren++;
                }
                else {
                    this._activeList[i] = false;
                }
            }
            if (numActiveChildren == 0) {
                return false;
            }
            return true;
        }

        public Tick ():number
        {
            var numRunningChildren:number = 0;
            for (var i:number=0; i<this._children.length; i++) {
                var active:Boolean = this._activeList[i];
                if (active) {
                    var result:number = this._children[i].Tick();
                    if (result == BTConst.BTResult_Running) {
                        numRunningChildren++;
                    }
                }
            }
            if (numRunningChildren == 0) {
                return BTConst.BTResult_Ended;
            }
            return BTConst.BTResult_Running;
        }

        public AddChild(aNode:BTNode):void
        {
            super.AddChild (aNode);
            this._activeList.push(false);
        }

        public RemoveChild (aNode:BTNode):void
        {
            var index:number = this._children.indexOf(aNode);
            this._activeList.splice(index,1);
            super.RemoveChild (aNode);
        }

        public Clear ():void
        {
            super.Clear ();
            var child:BTNode;
            for(var i:number = 0;i <this.children.length;i++)
            {
                child = this.children[i];
                child.Clear();
            }
        }
    }
}