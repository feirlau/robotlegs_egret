module fl {
	export interface IViewMap {

		mapPackage(packageName:string);
		unmapPackage(packageName:string);
		hasPackage(packageName:string):boolean;
		mapType(type:any);
		unmapType(type:any);
		hasType(type:any):boolean;
		contextView:egret.DisplayObjectContainer;
		enabled:boolean;
	}

	export var IViewMap:string = "fl.IViewMap";
}

