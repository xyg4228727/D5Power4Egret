//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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