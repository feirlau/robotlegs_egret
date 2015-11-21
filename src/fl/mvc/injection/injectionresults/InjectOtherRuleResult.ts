module fl {
	export class InjectOtherRuleResult extends fl.InjectionResult {

		private m_rule:fl.InjectionConfig;

		public constructor(rule:fl.InjectionConfig)
		{
			super();
			this.m_rule = rule;
		}

		public getResponse(injector:fl.Injector):any
		{
			return this.m_rule.getResponse(injector);
		}

	}
}