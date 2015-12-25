/**
 * Created by Administrator on 2015/6/1.
 */
module d5power {

    export class UserProData {

        public field:number;
        public name:string = "";

        public format(data:any):void {
            this.field = data.field;
            this.name = data.name;
         }

        public constructor()
        {
        }
    }
}