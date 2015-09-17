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