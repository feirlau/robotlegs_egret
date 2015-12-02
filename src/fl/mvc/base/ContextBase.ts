module fl {
	export class ContextBase extends egret.HashObject implements fl.IContext,egret.IEventDispatcher {

		protected _eventDispatcher:egret.IEventDispatcher;
		protected _injector:fl.IInjector;
		protected _reflector:fl.IReflector;
		protected _contextView:egret.DisplayObjectContainer;
		protected _commandMap:fl.ICommandMap;
		protected _mediatorMap:fl.IMediatorMap;
		protected _viewMap:fl.IViewMap;
		
		public constructor()
		{
			super();
			this._eventDispatcher = this.createEventDispatcher();
		}
		
		public get contextView():egret.DisplayObjectContainer
		{
			return this._contextView;
		}

		public set contextView(value:egret.DisplayObjectContainer)
		{
			this._contextView = value;
		}
		
		public get injector():fl.IInjector
		{
			return this._injector = this._injector || this.createInjector();
		}
		protected createInjector():fl.IInjector {
			return null;
		}
		public set injector(value:fl.IInjector)
		{
			this._injector = value;
		}
		public createChildInjector():fl.IInjector
		{
			return this.injector.createChildInjector();
		}
		
		public get reflector():fl.IReflector
		{
			return this._reflector = this._reflector || this.createReflector();
		}
		protected createReflector():fl.IReflector {
			return null;
		}
		public set reflector(value:fl.IReflector)
		{
			this._reflector = value;
		}
		
		public get commandMap():fl.ICommandMap
		{
			return this._commandMap;
		}

		public set commandMap(value:fl.ICommandMap)
		{
			this._commandMap = value;
		}

		public get mediatorMap():fl.IMediatorMap
		{
			return this._mediatorMap;
		}

		public set mediatorMap(value:fl.IMediatorMap)
		{
			this._mediatorMap = value;
		}

		public get viewMap():fl.IViewMap
		{
			return this._viewMap;
		}

		public set viewMap(value:fl.IViewMap)
		{
			this._viewMap = value;
		}
		
		protected createEventDispatcher():egret.IEventDispatcher {
			return new egret.EventDispatcher(this);
		}

		public get eventDispatcher():egret.IEventDispatcher
		{
			return this._eventDispatcher;
		}

		public set eventDispatcher(value:egret.IEventDispatcher)
		{
			this._eventDispatcher = value;
		}

		public once(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0)
		{
			this.eventDispatcher.once(type,listener,thisObject,useCapture,priority);
		}

		public addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0)
		{
			this.eventDispatcher.addEventListener(type,listener,thisObject,useCapture,priority);
		}

		public dispatchEvent(event:egret.Event):boolean
		{
			if(this.eventDispatcher.hasEventListener(event.type))
				return this.eventDispatcher.dispatchEvent(event);
			return false;
		}

		public hasEventListener(type:string):boolean
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		public removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false)
		{
			this.eventDispatcher.removeEventListener(type,listener,thisObject,useCapture);
		}

		public willTrigger(type:string):boolean
		{
			return this.eventDispatcher.willTrigger(type);
		}

	}
}