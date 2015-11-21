module fl {
	export class EventMap extends egret.HashObject implements fl.IEventMap {

		protected eventDispatcher:egret.IEventDispatcher;
		protected _dispatcherListeningEnabled:boolean = true;
		protected listeners:Array<any>;

		public constructor(eventDispatcher:egret.IEventDispatcher)
		{
			super();
			this.listeners = new Array();
			this.eventDispatcher = eventDispatcher;
		}

		public get dispatcherListeningEnabled():boolean
		{
			return this._dispatcherListeningEnabled;
		}

		public set dispatcherListeningEnabled(value:boolean)
		{
			this._dispatcherListeningEnabled = value;
		}

		public mapListener(dispatcher:egret.IEventDispatcher,type:string,listener:Function,eventClass:any = null,useCapture:boolean = false,priority:number = 0)
		{
			var _self__:any = this;
			if(this.dispatcherListeningEnabled == false && dispatcher == this.eventDispatcher)
			{
				throw new fl.ContextError(fl.ContextError.E_EVENTMAP_NOSNOOPING).message;
			}
			eventClass = eventClass || egret.Event;
			var params:any;
			var i:number = this.listeners.length;
			while(i--)
			{
				params = this.listeners[i];
				if(params["dispatcher"] == dispatcher && params["type"] == type && params["listener"] == listener && params["useCapture"] == useCapture && params["eventClass"] == eventClass)
				{
					return ;
				}
			}
			var callback:Function = <any>function (event:egret.Event)
			{
				_self__.routeEventToListener(event,listener,eventClass);
			};
			params = {dispatcher:dispatcher,type:type,listener:listener,eventClass:eventClass,callback:callback,useCapture:useCapture};
			this.listeners.push(params);
			dispatcher.addEventListener(type,callback,null,useCapture,priority);
		}

		public unmapListener(dispatcher:egret.IEventDispatcher,type:string,listener:Function,eventClass:any = null,useCapture:boolean = false)
		{
			eventClass = eventClass || egret.Event;
			var params:any;
			var i:number = this.listeners.length;
			while(i--)
			{
				params = this.listeners[i];
				if(params["dispatcher"] == dispatcher && params["type"] == type && params["listener"] == listener && params["useCapture"] == useCapture && params["eventClass"] == eventClass)
				{
					dispatcher.removeEventListener(type,params["callback"],null,useCapture);
					this.listeners.splice(i,1);
					return ;
				}
			}
		}

		public unmapListeners()
		{
			var params:any;
			var dispatcher:egret.IEventDispatcher;
			while(params = this.listeners.pop())
			{
				dispatcher = params["dispatcher"];
				dispatcher.removeEventListener(params["type"],params["callback"],null,params["useCapture"]);
			}
		}

		protected routeEventToListener(event:egret.Event,listener:Function,originalEventClass:any)
		{
			if(fl.is(event, originalEventClass))
			{
				listener(event);
			}
		}

	}
}