module fl {
	export interface IMediatorMap {
		mapView(viewClassOrName:any,mediatorClass:any,injectViewAs?:any,autoCreate?:boolean,autoRemove?:boolean);
		unmapView(viewClassOrName:any);
		createMediator(viewComponent:any):fl.IMediator;
		registerMediator(viewComponent:any,mediator:fl.IMediator);
		removeMediator(mediator:fl.IMediator):fl.IMediator;
		removeMediatorByView(viewComponent:any):fl.IMediator;
		retrieveMediator(viewComponent:any):fl.IMediator;
		hasMapping(viewClassOrName:any):boolean;
		hasMediator(mediator:fl.IMediator):boolean;
		hasMediatorForView(viewComponent:any):boolean;
		
		context:fl.IContext;
		contextView:egret.DisplayObjectContainer;
		enabled:boolean;
	}

	export var IMediatorMap:string = "fl.IMediatorMap";
}

