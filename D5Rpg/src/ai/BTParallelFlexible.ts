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