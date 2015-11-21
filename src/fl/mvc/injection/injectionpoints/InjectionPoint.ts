module fl {
	export class InjectionPoint extends egret.HashObject {


		public constructor(injector:fl.Injector)
		{
			super();
		}

		public applyInjection(target:any,injector:fl.Injector):any
		{
			return target;
		}
	}
}

