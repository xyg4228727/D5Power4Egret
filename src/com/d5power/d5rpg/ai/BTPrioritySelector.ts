/**
 * Created by Administrator on 2015/5/26.
 */
module d5power {
    export class BTPrioritySelector extends BTNode {

        public constructor(precondition:d5power.BTPrecondition = null) {
            super(precondition);
        }
        private _activeChild:d5power.BTNode;


        // selects the active child
        protected DoEvaluate ():boolean
        {
            var child:BTNode;
            for(var i:number = 0;i <this.children.length;i++)
            {
                child = this.children[i];
                if (child.Evaluate()) {
                    if (this._activeChild != null &&this. _activeChild != child) {
                        this._activeChild.Clear();
                    }
                    this._activeChild = child;
                    return true;
                }
            }

            if (this._activeChild != null) {
                this._activeChild.Clear();
                this._activeChild = null;
            }

            return false;
        }

        public Clear():void{
        if (this._activeChild != null) {
            this._activeChild.Clear();
            this._activeChild = null;
        }

    }

        public Tick ():number{
        if (this._activeChild == null) {
            return BTConst.BTResult_Ended;
        }

        var  result:number = this._activeChild.Tick();
        if (result != BTConst.BTResult_Running) {
            this._activeChild.Clear();
            this._activeChild = null;
        }
        return result;
    }
    }
}