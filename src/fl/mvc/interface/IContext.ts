module fl {
	export interface IContext {

		eventDispatcher:egret.IEventDispatcher;
		
		injector:fl.IInjector;
		reflector:fl.IReflector;
		contextView:egret.DisplayObjectContainer;
		commandMap:fl.ICommandMap;
		mediatorMap:fl.IMediatorMap;
		viewMap:fl.IViewMap;
		
		createChildInjector():fl.IInjector;
	}

	export var IContext:string = "fl.IContext";
}

