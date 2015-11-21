module fl {
	export class Context extends fl.ContextBase implements fl.IContext {

		protected _injector:fl.IInjector;
		protected _reflector:fl.IReflector;
		protected _autoStartup:boolean = false;
		protected _contextView:egret.DisplayObjectContainer;
		protected _commandMap:fl.ICommandMap;
		protected _mediatorMap:fl.IMediatorMap;
		protected _viewMap:fl.IViewMap;

		public constructor(contextView:egret.DisplayObjectContainer = null,autoStartup:boolean = true)
		{
			super();
			this._contextView = contextView;
			this._autoStartup = autoStartup;
			if(this._contextView)
			{
				this.mapInjections();
				this.checkAutoStartup();
			}
		}

		public startup()
		{
			this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.STARTUP_COMPLETE));
		}

		public shutdown()
		{
			this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.SHUTDOWN_COMPLETE));
		}

		public get contextView():egret.DisplayObjectContainer
		{
			return this._contextView;
		}

		public set contextView(value:egret.DisplayObjectContainer)
		{
			if(value == this._contextView)
				return ;
			if(this._contextView)
				throw new ContextError(ContextError.E_CONTEXT_VIEW_OVR);
			this._contextView = value;
			this.mapInjections();
			this.checkAutoStartup();
		}

		protected get injector():fl.IInjector
		{
			return this._injector = this._injector || this.createInjector();
		}

		protected set injector(value:fl.IInjector)
		{
			this._injector = value;
		}

		protected get reflector():fl.IReflector
		{
			return this._reflector = this._reflector || new fl.Reflector();
		}

		protected set reflector(value:fl.IReflector)
		{
			this._reflector = value;
		}

		protected get commandMap():fl.ICommandMap
		{
			return this._commandMap = this._commandMap || new fl.CommandMap(this.eventDispatcher,this.createChildInjector(),this.reflector);
		}

		protected set commandMap(value:fl.ICommandMap)
		{
			this._commandMap = value;
		}

		protected get mediatorMap():fl.IMediatorMap
		{
			return this._mediatorMap = this._mediatorMap || new MediatorMap(this.contextView,this.createChildInjector(),this.reflector);
		}

		protected set mediatorMap(value:fl.IMediatorMap)
		{
			this._mediatorMap = value;
		}

		protected get viewMap():fl.IViewMap
		{
			return this._viewMap = this._viewMap || new ViewMap(this.contextView,this.injector);
		}

		protected set viewMap(value:fl.IViewMap)
		{
			this._viewMap = value;
		}

		protected mapInjections()
		{
			this.injector.mapValue(fl.IReflector,this.reflector);
			this.injector.mapValue(fl.IInjector,this.injector);
			this.injector.mapValue("egret.IEventDispatcher",this.eventDispatcher);
			this.injector.mapValue(egret.DisplayObjectContainer,this.contextView);
			this.injector.mapValue(fl.ICommandMap,this.commandMap);
			this.injector.mapValue(fl.IMediatorMap,this.mediatorMap);
			this.injector.mapValue(fl.IViewMap,this.viewMap);
			this.injector.mapClass(fl.IEventMap,fl.EventMap);
		}

		protected checkAutoStartup()
		{
			if(this._autoStartup && this.contextView)
			{
				this.contextView.stage?this.startup():this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this,false,0);
			}
		}

		protected onAddedToStage(e:egret.Event)
		{
			this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			this.startup();
		}

		protected createInjector():fl.IInjector
		{
			var injector:fl.IInjector = new fl.Injector();
			return injector;
		}

		protected createChildInjector():fl.IInjector
		{
			return this.injector.createChildInjector();
		}
	}
}