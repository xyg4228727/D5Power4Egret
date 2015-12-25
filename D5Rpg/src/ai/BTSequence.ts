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