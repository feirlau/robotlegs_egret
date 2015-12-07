module fl {
	export class Mediator extends fl.MediatorBase {
		protected _eventDispatcher:egret.IEventDispatcher;
		protected _eventMap:fl.IEventMap;

		public constructor()
		{
			super();
		}

		protected updateContext()
		{
			super.updateContext();
			
			this._eventDispatcher = this.context.eventDispatcher;
		}
		
		public preRemove()
		{
			if(this._eventMap)
				this._eventMap.unmapListeners();
			super.preRemove();
		}

		public get eventDispatcher():egret.IEventDispatcher
		{
			return this._eventDispatcher;
		}

		public set eventDispatcher(value:egret.IEventDispatcher)
		{
			this._eventDispatcher = value;
		}

		protected get eventMap():fl.IEventMap
		{
			return this._eventMap || (this._eventMap = new EventMap(this.eventDispatcher));
		}

		protected set eventMap(value:fl.IEventMap)
		{
			this._eventMap = value;
		}

		protected dispatch(event:egret.Event):boolean
		{
			if(this.eventDispatcher.hasEventListener(event.type))
				return this.eventDispatcher.dispatchEvent(event);
			return false;
		}

		protected addViewListener(type:string,listener:Function,thisObject:any,eventClass:any = null,useCapture:boolean = false,priority:number = 0)
		{
			this.eventMap.mapListener(this.viewComponent,type,listener,thisObject,eventClass,useCapture,priority);
		}

		protected removeViewListener(type:string,listener:Function,thisObject:any,eventClass:any = null,useCapture:boolean = false)
		{
			this.eventMap.unmapListener(this.viewComponent,type,listener,thisObject,eventClass,useCapture);
		}

		protected addContextListener(type:string,listener:Function,thisObject:any,eventClass:any = null,useCapture:boolean = false,priority:number = 0)
		{
			this.eventMap.mapListener(this.eventDispatcher,type,listener,thisObject,eventClass,useCapture,priority);
		}

		protected removeContextListener(type:string,listener:Function,thisObject:any,eventClass:any = null,useCapture:boolean = false)
		{
			this.eventMap.unmapListener(this.eventDispatcher,type,listener,thisObject,eventClass,useCapture);
		}

	}
}
