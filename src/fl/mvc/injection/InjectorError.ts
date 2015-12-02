module fl {
	export class InjectorError extends Error {


		public constructor(message:any = "",name:any = 0)
		{
			super(message, name);
		}

	}
}
