module fl {
	export interface IReflector {

		classExtendsOrImplements(classOrClassName:any,superclass:any):boolean;
		getClass(value:any):any;
		getFQCN(value:any,replaceColons?:boolean):string;
	}

	export var IReflector:string = "fl.IReflector";
}

