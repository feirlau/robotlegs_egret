module fl {
	export class InjectSingletonResult extends fl.InjectionResult {

		private m_responseType:any;
		private m_response:any;

		public constructor(responseType:any)
		{
			super();
			this.m_responseType = responseType;
		}

		public getResponse(injector:fl.Injector):any
		{
			return this.m_response = this.m_response || this.createResponse(injector);
		}

		private createResponse(injector:fl.Injector):any
		{
			return injector.instantiate(this.m_responseType);
		}

	}
}