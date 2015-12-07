module fl {
	export interface IEventMap {

		mapListener(dispatcher:egret.IEventDispatcher,type:string,listener:Function,thisObject:any,eventClass?:any,useCapture?:boolean,priority?:number);
		unmapListener(dispatcher:egret.IEventDispatcher,type:string,listener:Function,thisObject:any,eventClass?:any,useCapture?:boolean);
		unmapListeners();
	}

	export var IEventMap:string = "fl.IEventMap";
}

