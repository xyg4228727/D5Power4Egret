/**
 * Created by Administrator on 2015/1/19.
 */
module d5power
{
    export interface ICharacterData
    {
        nickname:string;

        addDisplayer(ui:IUserInfoDisplayer):void
        removeDisplayer(ui:IUserInfoDisplayer):void
        updateDisplayers():void



    }
}