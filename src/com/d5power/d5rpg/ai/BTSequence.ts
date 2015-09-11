/**
 * Created by Administrator on 2015/5/27.
 */
module d5power {
    export class BTSequence extends BTNode {

        public constructor(precondition:d5power.BTPrecondition = null) {
            super(precondition);
        }
        private _activeChild:d5power.BTNode;
        private _activeIndex:number = -1;

        protected DoEvaluate ():boolean
        {
            if (this._activeChild != null) {
                var result:boolean = this._activeChild.Evaluate();
                if (!result) {
                    this._activeChild.Clear();
                    this._activeChild = null;
                    this._activeIndex = -1;
                }
                return result;
            }
            else {
                return this.children[0].Evaluate();
            }
        }

        public Tick ():number
        {
        // first time
            if (this._activeChild == null) {
                this._activeChild = this.children[0];
                this._activeIndex = 0;
            }

            var result:number = this._activeChild.Tick();
            if (result == BTConst.BTResult_Ended) {	// Current active node over
                this._activeIndex++;
                if (this._activeIndex >= this.children.length) {	// sequence is over
                    this._activeChild.Clear();
                    this._activeChild = null;
                    this._activeIndex = -1;
                }
                else {	// next node
                    this._activeChild.Clear();
                    this._activeChild = this.children[this._activeIndex];
                    result = BTConst.BTResult_Running;
                }
            }
            return result;
        }

        public  Clear ():void
        {
            if (this._activeChild != null) {
                this._activeChild = null;
                this._activeIndex = -1;
            }

            var child:BTNode;
            for(var i:number = 0;i <this.children.length;i++)
            {
                child = this.children[i];
                child.Clear();
            }
    }
    }
}