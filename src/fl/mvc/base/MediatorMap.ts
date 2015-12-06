/// <reference path="ViewMapBase" />

module fl {
	export class MediatorMap extends fl.ViewMapBase implements fl.IMediatorMap {

		protected mediatorByView:fl.Dictionary;
		protected mappingConfigByView:fl.Dictionary;
		protected mappingConfigByViewClassName:fl.Dictionary;
		protected mediatorsMarkedForRemoval:fl.Dictionary;
		protected hasMediatorsMarkedForRemoval:boolean = false;
		protected reflector:fl.IReflector;

		public constructor(context:fl.IContext)
		{
			super(context);
			this.reflector = context.reflector;
			this.mediatorByView = new fl.Dictionary(true);
			this.mappingConfigByView = new fl.Dictionary(true);
			this.mappingConfigByViewClassName = new fl.Dictionary(false);
			this.mediatorsMarkedForRemoval = new fl.Dictionary(false);
		}

		public mapView(viewClassOrName:any,mediatorClass:any,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true)
		{
			var viewClassName:string = this.reflector.getFQCN(viewClassOrName);
			if(this.mappingConfigByViewClassName.getItem(viewClassName) != null)
				throw new fl.ContextError(fl.ContextError.E_MEDIATORMAP_OVR + ' - ' + mediatorClass);
			if(this.reflector.classExtendsOrImplements(mediatorClass,fl.IMediator) == false)
				throw new fl.ContextError(fl.ContextError.E_MEDIATORMAP_NOIMPL + ' - ' + mediatorClass);
			var config:MappingConfig = new MappingConfig();
			config.mediatorClass = mediatorClass;
			config.autoCreate = autoCreate;
			config.autoRemove = autoRemove;
			if(injectViewAs)
			{
				if(fl.isArray(injectViewAs))
				{
					config.typedViewClasses = injectViewAs.concat();
				}
				else if(!fl.isString(injectViewAs))
				{
					config.typedViewClasses = [injectViewAs];
				}
			}
			else if(viewClassOrName && !fl.isString(viewClassOrName))
			{
				config.typedViewClasses = [viewClassOrName];
			}
			fl.injectContextView(viewClassName, this.contextView);
			this.mappingConfigByViewClassName.setItem(viewClassName,config);
			if(autoCreate || autoRemove)
			{
				this.viewListenerCount++;
				if(this.viewListenerCount == 1)
					this.addListeners();
			}
			if(autoCreate && this.contextView && (viewClassName == fl.getClassName(this.contextView)))
				this.createMediatorUsing(this.contextView,viewClassName,config);
		}

		public unmapView(viewClassOrName:any)
		{
			var viewClassName:string = this.reflector.getFQCN(viewClassOrName);
			fl.uninjectContextView(viewClassName);
			var config:MappingConfig = this.mappingConfigByViewClassName.getItem(viewClassName);
			if(config && (config.autoCreate || config.autoRemove))
			{
				this.viewListenerCount--;
				if(this.viewListenerCount == 0)
					this.removeListeners();
			}
			this.mappingConfigByViewClassName.delItem(viewClassName);
		}

		public createMediator(viewComponent:any):fl.IMediator
		{
			return this.createMediatorUsing(viewComponent);
		}

		public registerMediator(viewComponent:any,mediator:fl.IMediator)
		{
			var mediatorClass:any = this.reflector.getClass(mediator);
			this.injector.hasMapping(mediatorClass) && this.injector.unmap(mediatorClass);
			this.injector.mapValue(mediatorClass,mediator);
			this.mediatorByView.setItem(viewComponent,mediator);
			this.mappingConfigByView.setItem(viewComponent,this.mappingConfigByViewClassName.getItem(fl.getClassName(viewComponent)));
			mediator.setViewComponent(viewComponent);
			mediator.preRegister();
		}

		public removeMediator(mediator:fl.IMediator):fl.IMediator
		{
			if(mediator)
			{
				var viewComponent:any = mediator.getViewComponent();
				var mediatorClass:any = this.reflector.getClass(mediator);
				this.mediatorByView.delItem(viewComponent);
				this.mappingConfigByView.delItem(viewComponent);
				mediator.preRemove();
				mediator.setViewComponent(null);
				this.injector.hasMapping(mediatorClass) && this.injector.unmap(mediatorClass);
			}
			return mediator;
		}

		public removeMediatorByView(viewComponent:any):fl.IMediator
		{
			return this.removeMediator(this.retrieveMediator(viewComponent));
		}

		public retrieveMediator(viewComponent:any):fl.IMediator
		{
			return this.mediatorByView.getItem(viewComponent);
		}

		public hasMapping(viewClassOrName:any):boolean
		{
			var viewClassName:string = this.reflector.getFQCN(viewClassOrName);
			return (this.mappingConfigByViewClassName.getItem(viewClassName) != null);
		}

		public hasMediatorForView(viewComponent:any):boolean
		{
			return this.mediatorByView.getItem(viewComponent) != null;
		}

		public hasMediator(mediator:fl.IMediator):boolean
		{
			for(var med_key_a in this.mediatorByView.map)
			{
				var med:fl.IMediator = this.mediatorByView.map[med_key_a][1];
				if(med == mediator)
					return true;
			}
			return false;
		}

		protected addListeners()
		{
			if(this.contextView && this.enabled)
			{
				this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE,this.onViewAdded,this,this.useCapture,0);
				this.contextView.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onViewRemoved,this,this.useCapture,0);
			}
		}

		protected removeListeners()
		{
			if(this.contextView)
			{
				this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onViewAdded,this,this.useCapture);
				this.contextView.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onViewRemoved,this,this.useCapture);
			}
		}

		protected onViewAdded(e:egret.Event)
		{
			if(this.mediatorsMarkedForRemoval.getItem(e.target))
			{
				this.mediatorsMarkedForRemoval.delItem(e.target);
				return ;
			}
			var viewClassName:string = fl.getClassName(e.target);
			var config:MappingConfig = <any>this.mappingConfigByViewClassName.getItem(viewClassName);
			if(config && config.autoCreate)
				this.createMediatorUsing(e.target,viewClassName,config);
		}

		protected createMediatorUsing(viewComponent:any,viewClassName:string = '',config:MappingConfig = null):fl.IMediator
		{
			var mediator:fl.IMediator = this.mediatorByView.getItem(viewComponent);
			if(mediator == null)
			{
				viewClassName = viewClassName || fl.getClassName(viewComponent);
				config = config || this.mappingConfigByViewClassName.getItem(viewClassName);
				if(config)
				{
					for(var claxx_key_a in config.typedViewClasses)
					{
						var claxx:any = config.typedViewClasses[claxx_key_a];
						this.injector.mapValue(claxx,viewComponent);
					}
					mediator = this.injector.instantiate(config.mediatorClass);
					mediator.context = this.context;
					for(var clazz_key_a in config.typedViewClasses)
					{
						var clazz:any = config.typedViewClasses[clazz_key_a];
						this.injector.unmap(clazz);
					}
					this.registerMediator(viewComponent,mediator);
				}
			}
			return mediator;
		}

		protected onViewRemoved(e:egret.Event)
		{
			var config:MappingConfig = this.mappingConfigByView.getItem(e.target);
			if(config && config.autoRemove)
			{
				this.mediatorsMarkedForRemoval.setItem(e.target,e.target);
				if(<any>!this.hasMediatorsMarkedForRemoval)
				{
					this.hasMediatorsMarkedForRemoval = true;
					egret.startTick(this.removeMediatorLater, this);
				}
			}
		}

		protected removeMediatorLater(value:number):boolean
		{
			this.hasMediatorsMarkedForRemoval = false;
			egret.stopTick(this.removeMediatorLater, this);
			for(var view_key_a in this.mediatorsMarkedForRemoval.map)
			{
				var view:egret.DisplayObject = this.mediatorsMarkedForRemoval.map[view_key_a][1];
				if(<any>!view.stage)
					this.removeMediatorByView(view);
				this.mediatorsMarkedForRemoval.delItem(view);
			}
			this.hasMediatorsMarkedForRemoval = false;
			return true;
		}

	}

	 export class MappingConfig extends egret.HashObject {

		public mediatorClass:any;
		public typedViewClasses:Array<any>;
		public autoCreate:boolean = false;
		public autoRemove:boolean = false;
	}
}