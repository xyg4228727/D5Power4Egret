/**
 * Created by Administrator on 2015/5/27.
 */
module d5power {
    export class BTParallel extends BTNode {
        public _type:number;
        protected _results:Array<any>;
        public constructor(type:number,precondition:d5power.BTPrecondition = null) {
            this._type = type;
            super(precondition);
        }
        protected  DoEvaluate ():boolean
        {
            var child:BTNode;
            for(var i:number = 0;i <this.children.length;i++)
            {
                child = this.children[i];
                if (!child.Evaluate()) {
                    return false;
                }
            }
            return true;
        }

        public Tick ():number
        {
            var endingResultCount:number= 0;

            for (var i:number=0; i<this.children.length; i++) {

                if (this._type == BTConst.Parallel_And) {
                    if (this._results[i] == BTConst.BTResult_Running) {
                        this._results[i] = this.children[i].Tick();
                    }
                    if (this._results[i] != BTConst.BTResult_Running) {
                        endingResultCount++;
                    }
                }
                else {
                    if (this._results[i] == BTConst.BTResult_Running) {
                        this._results[i] = this.children[i].Tick();
                    }
                    if (this._results[i] != BTConst.BTResult_Running) {
                        this.ResetResults();
                        return BTConst.BTResult_Ended;
                    }
                }
            }
            if (endingResultCount == this.children.length) {	// only apply to AND func
                this.ResetResults();
                return BTConst.BTResult_Ended;
            }
            return BTConst.BTResult_Running;
        }

        public  Clear():void
        {
            this.ResetResults();

            var child:BTNode;
            for(var i:number = 0;i <this.children.length;i++)
            {
                child = this.children[i];
                child.Clear();
            }
        }

        public AddChild ( aNode:BTNode):void
        {
            super.AddChild (aNode);
            this._results.push(BTConst.BTResult_Running);
        }

        public RemoveChild(aNode:BTNode):void
        {
            var index:number = this._children.indexOf(aNode);
            this._results.splice(index,1);
            super.RemoveChild (aNode);
        }

        private ResetResults ():void
        {
            for (var i:number=0; i<this._results.length; i++) {
                this._results[i] = BTConst.BTResult_Running;
            }
        }
    }
}

