
module d5power {

	export interface IUserInfoContainer{
		addDisplayer(ui:IUserInfoDisplayer):void;
		removeDisplayer(ui:IUserInfoDisplayer):void;
		getPro(name:string):any;
	}
}