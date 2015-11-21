module fl {
	export class Injector extends egret.HashObject implements fl.IInjector {

		public static INJECTION_POINTS_CACHE:fl.Dictionary;
		private m_parentInjector:fl.Injector;
		private m_mappings:fl.Dictionary;
		private m_injecteeDescriptions:fl.Dictionary;
		private m_attendedToInjectees:fl.Dictionary;

		public constructor()
		{
			super();
			this.m_mappings = new fl.Dictionary();
			this.m_injecteeDescriptions = fl.Injector.INJECTION_POINTS_CACHE;
			this.m_attendedToInjectees = new fl.Dictionary(true);
		}

		public mapValue(whenAskedFor:any,useValue:any,named:string = ""):any
		{
			var config:InjectionConfig = this.getMapping(whenAskedFor,named);
			config.setResult(new InjectValueResult(useValue));
			return config;
		}

		public mapClass(whenAskedFor:any,instantiateClass:any,named:string = ""):any
		{
			var config:InjectionConfig = this.getMapping(whenAskedFor,named);
			config.setResult(new InjectClassResult(instantiateClass));
			return config;
		}

		public mapSingleton(whenAskedFor:any,named:string = ""):any
		{
			return this.mapSingletonOf(whenAskedFor,whenAskedFor,named);
		}

		public mapSingletonOf(whenAskedFor:any,useSingletonOf:any,named:string = ""):any
		{
			var config:InjectionConfig = this.getMapping(whenAskedFor,named);
			config.setResult(new InjectSingletonResult(useSingletonOf));
			return config;
		}

		public mapRule(whenAskedFor:any,useRule:any,named:string = ""):any
		{
			var config:InjectionConfig = this.getMapping(whenAskedFor,named);
			config.setResult(new InjectOtherRuleResult(useRule));
			return useRule;
		}

		public getMapping(whenAskedFor:any,named:string = ""):InjectionConfig
		{
			var requestName:string = fl.getClassName(whenAskedFor);
			var config:InjectionConfig = <any>this.m_mappings.getItem(requestName + '#' + named);
			if(!config)
			{
				config = this.m_mappings.setItem(requestName + '#' + named,new InjectionConfig(whenAskedFor,named));
			}
			return config;
		}

		public injectInto(target:any)
		{
			if(this.m_attendedToInjectees.getItem(target))
			{
				return ;
			}
			this.m_attendedToInjectees.setItem(target,true);
		}

		public instantiate(clazz:any):any
		{
			var injecteeDescription:InjecteeDescription = <any>this.m_injecteeDescriptions.getItem(clazz);
			if(!injecteeDescription)
			{
				injecteeDescription = this.getInjectionPoints(clazz);
			}
			var injectionPoint:fl.InjectionPoint = injecteeDescription.ctor;
			var instance:any = injectionPoint.applyInjection(clazz,this);
			this.injectInto(instance);
			return instance;
		}

		public unmap(clazz:any,named:string = "")
		{
			var mapping:InjectionConfig = this.getConfigurationForRequest(clazz,named);
			if(!mapping)
			{
				throw new InjectorError('Error while removing an injector mapping: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
			}
			mapping.setResult(null);
		}

		public hasMapping(clazz:any,named:string = ''):boolean
		{
			var mapping:InjectionConfig = this.getConfigurationForRequest(clazz,named);
			if(!mapping)
			{
				return false;
			}
			return mapping.hasResponse(this);
		}

		public getInstance(clazz:any,named:string = ''):any
		{
			var mapping:InjectionConfig = this.getConfigurationForRequest(clazz,named);
			if(!mapping || !mapping.hasResponse(this))
			{
				throw new InjectorError('Error while getting mapping response: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
			}
			return mapping.getResponse(this);
		}

		public createChildInjector():fl.Injector
		{
			var injector:fl.Injector = new fl.Injector();
			injector.setParentInjector(this);
			return injector;
		}

		public setParentInjector(parentInjector:fl.Injector)
		{
			if(this.m_parentInjector && !parentInjector)
			{
				this.m_attendedToInjectees = new fl.Dictionary(true);
			}
			this.m_parentInjector = parentInjector;
			if(parentInjector)
			{
				this.m_attendedToInjectees = parentInjector.attendedToInjectees;
			}
		}

		public getParentInjector():fl.Injector
		{
			return this.m_parentInjector;
		}

		public static purgeInjectionPointsCache()
		{
			fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);
		}

		public getAncestorMapping(whenAskedFor:any,named:string = null):InjectionConfig
		{
			var parent:fl.Injector = this.m_parentInjector;
			while(parent)
			{
				var parentConfig:InjectionConfig = parent.getConfigurationForRequest(whenAskedFor,named,false);
				if(parentConfig && parentConfig.hasOwnResponse())
				{
					return parentConfig;
				}
				parent = parent.getParentInjector();
			}
			return null;
		}

		public get attendedToInjectees():fl.Dictionary
		{
			return this.m_attendedToInjectees;
		}

		public set attendedToInjectees(value:fl.Dictionary)
		{
			this.m_attendedToInjectees = value;
		}

		private getInjectionPoints(clazz:any):InjecteeDescription
		{
			var injectionPoints:Array<any> = [];
			var ctorInjectionPoint:fl.InjectionPoint = new NoParamsConstructorInjectionPoint();
			var injecteeDescription:InjecteeDescription = new InjecteeDescription(ctorInjectionPoint,injectionPoints);
			this.m_injecteeDescriptions.setItem(clazz,injecteeDescription);
			return injecteeDescription;
		}

		private getConfigurationForRequest(clazz:any,named:string,traverseAncestors:boolean = true):InjectionConfig
		{
			var requestName:string = fl.getClassName(clazz);
			var config:InjectionConfig = this.m_mappings.getItem(requestName + '#' + named);
			if(<any>!config && traverseAncestors && this.m_parentInjector && this.m_parentInjector.hasMapping(clazz,named))
			{
				config = this.getAncestorMapping(clazz,named);
			}
			return config;
		}

	}

	 class InjecteeDescription extends egret.HashObject {

		public ctor:fl.InjectionPoint;
		public injectionPoints:Array<any>;

		public constructor(ctor:fl.InjectionPoint,injectionPoints:Array<any>)
		{
			super();
			this.ctor = ctor;
			this.injectionPoints = injectionPoints;
		}

	}
}

fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);
