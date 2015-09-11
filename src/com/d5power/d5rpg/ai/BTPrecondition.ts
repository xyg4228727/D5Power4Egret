/**
 * Created by Administrator on 2015/5/26.
 */
module d5power {
    export class BTPrecondition extends BTNode{
        public constructor()
        {
            super(null);
        }
        public Check():boolean
        {
            return true;
        }

        // Functions as a node
        public Tick ():number
        {
            var success:boolean = this.Check();
            if (success) {
                return BTConst.BTResult_Ended;
            }
            else {
                return BTConst.BTResult_Running;
            }
        }

    }
}