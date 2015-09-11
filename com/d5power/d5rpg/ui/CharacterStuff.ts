/**
 * Created by Administrator on 2015/6/11.
 */
module d5power {
    export class CharacterStuff extends egret.Shape
    {
        /**
         * 控制目标
         */
        protected _target:IGD;
        /**
         * 控制属性的变量名
         */
        protected _attName:string;
        /**
         * 控制属性的最大值的变量名
         */
        protected _attMaxName:string;

        /**
         * @param	target		所属游戏对象
         * @param	resource	渲染素材
         * @param	attName		挂接的游戏对象属性
         * @param	attMaxName	如果挂接属性有最大值，进行挂接
         */
        public constructor(target:IGD,attName:string='',attMaxName:string='')
        {
            super();
            this._target = target;

            if(attName!='' && this._target.hasOwnProperty(attName)) this._attName = attName;
            if(attMaxName!= '' && this._target.hasOwnProperty(attMaxName)) this._attMaxName = attMaxName;
        }
        /**
         * 渲染
         */
        public render(buffer:egret.Texture):void{}

        /**
         * 清空
         */
        public clear():void
        {

        }
    }
}