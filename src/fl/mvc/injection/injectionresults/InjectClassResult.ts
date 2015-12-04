/// <reference path="InjectionResult" />

module fl {
	export class InjectClassResult extends fl.InjectionResult {

		private m_responseType:any;

		public constructor(responseType:any)
		{
			super();
			this.m_responseType = responseType;
		}

		public getResponse(injector:fl.Injector):any
		{
			return injector.instantiate(this.m_responseType);
		}

	}
}
