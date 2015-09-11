/**
 * Created by Administrator on 2015/8/24.
 */
module d5power {
    export class MonsterConfData {
        /**
         * 怪物ID
         */
        public id:number;
        /**
         * 怪物名
         */
        public name:string;
        /**
         * 怪物等级
         */
        public lv:number;
        /**
         * 怪物贴图
         */
        public skin:String;

        public constructor()
        {
        }

        /**
         * 格式化对象
         */
        public formatObject(data:any):void
        {
            this.id = data.id;
            this.name = data.name;
            this.lv = data.lv;
            this.skin = data.skin;
        }

        public format(data:any):void
        {
            this.id = parseInt(data.id);
            this.name = String(data.name);
            this.lv = parseInt(data.lv);
            this.skin = String(data.skin);
        }

    }
}