module fl {
	export class InjectionConfig extends egret.HashObject {

		public request:any;
		public injectionName:string;
		private m_injector:fl.Injector;
		private m_result:fl.InjectionResult;

		public constructor(request:any,injectionName:string)
		{
			super();
			this.request = request;
			this.injectionName = injectionName;
		}

		public getResponse(injector:fl.Injector):any
		{
			var ij:fl.Injector = this.m_injector || injector;
			if(this.m_result)
			{
				return this.m_result.getResponse(ij);
			}
			var parentConfig:fl.InjectionConfig = ij.getAncestorMapping(this.request,this.injectionName);
			if(parentConfig)
			{
				return parentConfig.getResponse(injector);
			}
			return null;
		}

		public hasResponse(injector:fl.Injector):boolean
		{
			if(this.m_result)
			{
				return true;
			}
			var ij:fl.Injector = this.m_injector || injector;
			var parentConfig:fl.InjectionConfig = ij.getAncestorMapping(this.request,this.injectionName);
			return parentConfig != null;
		}

		public hasOwnResponse():boolean
		{
			return this.m_result != null;
		}

		public setResult(result:fl.InjectionResult)
		{
			if(this.m_result != null && result != null)
			{
				console.log('Warning: Injector already has a rule for type "' + fl.getClassName(this.request) + '", named "' + this.injectionName + '".\n ' + 'If you have overwritten this mapping intentionally you can use ' + '"injector.unmap()" prior to your replacement mapping in order to ' + 'avoid seeing this message.');
			}
			this.m_result = result;
		}

		public setInjector(injector:fl.Injector)
		{
			this.m_injector = injector;
		}

	}
}

