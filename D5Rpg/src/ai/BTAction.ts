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