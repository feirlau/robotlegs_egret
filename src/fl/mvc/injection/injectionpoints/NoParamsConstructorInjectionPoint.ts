module fl {
	export class NoParamsConstructorInjectionPoint extends fl.InjectionPoint {


		public constructor()
		{
			super(null);
		}

		public applyInjection(target:any,injector:fl.Injector):any
		{
			return new target();
		}

	}
}