module fl {
	export interface IInjector {
		mapValue(whenAskedFor:any,useValue:any,named?:string):any;
		mapClass(whenAskedFor:any,instantiateClass:any,named?:string):any;
		mapSingleton(whenAskedFor:any,named?:string):any;
		mapSingletonOf(whenAskedFor:any,useSingletonOf:any,named?:string):any;
		mapRule(whenAskedFor:any,useRule:any,named?:string):any;
		injectInto(target:any);
		instantiate(clazz:any):any;
		getInstance(clazz:any,named?:string):any;
        createChildInjector():IInjector;
		unmap(clazz:any,named?:string);
		hasMapping(clazz:any,named?:string):boolean;
	}

    export var IInjector:string = "fl.IInjector";
}

