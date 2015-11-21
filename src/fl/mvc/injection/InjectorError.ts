module fl {
	export class InjectorError extends Error {


		public constructor(message:any = "",id:any = 0)
		{
			super(message);
			this.name = id;
		}

	}
}
