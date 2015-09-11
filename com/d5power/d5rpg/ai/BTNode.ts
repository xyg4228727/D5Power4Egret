/**
 * Created by Administrator on 2015/5/26.
 */
module d5power {
    export class BTNode {
        public  name:string;

        protected  _children:Array<BTNode>;

        public get children():Array<BTNode>
        {
            return this._children;
        }


        // Used to check the node can be entered.
        public  precondition:d5power.BTPrecondition;

        //public  database:Database;

        // Cooldown function.
        public  interval:number = 0;
        private   _lastTimeEvaluated:number = 0;

        public activated:boolean;
        public constructor(precondition:d5power.BTPrecondition = null)
        {
            this.precondition = precondition;
        }
        public Activate():void
        {
            if (this.activated) return ;

            //			Init();

            if (this.precondition != null) {
                this.precondition.Activate();
            }
            if (this._children != null) {
                var child:BTNode;
                for(var i:number = 0;i <this._children.length;i++)
                {
                    child = this._children[i];
                    child.Activate();
                }
            }
            this.activated = true;
        }

        public Evaluate():boolean
        {
            var coolDownOK:boolean = this.CheckTimer();

            return this.activated && coolDownOK && (this.precondition == null || this.precondition.Check()) && this.DoEvaluate();
        }

        protected DoEvaluate():boolean
        {
            return true;
        }

        public Tick ():number
        {
            return BTConst.BTResult_Ended;
        }

        public Clear():void
        {

        }

        public AddChild (aNode:BTNode):void
        {
            if (this._children == null) {
                this._children = new Array<BTNode>();
            }
            if (aNode != null) {
                this._children.push(aNode);
            }
        }

        public RemoveChild (aNode:BTNode):void
        {
            if (this._children != null && aNode != null)
            {
                var index:number = this._children.indexOf(aNode);
                this._children.splice(index,1);
            }
        }

        // Check if cooldown is finished.
        private CheckTimer():boolean
        {
            if(egret.getTimer()-this._lastTimeEvaluated > this.interval) {
                this._lastTimeEvaluated = egret.getTimer();
                return true;
            }
            return false;
        }
    }
}