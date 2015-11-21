module fl {
	export class InjectValueResult extends fl.InjectionResult {

		private m_value:any;

		public constructor(value:any)
		{
			super();
			this.m_value = value;
		}

		public getResponse(injector:fl.Injector):any
		{
			return this.m_value;
		}

	}
}