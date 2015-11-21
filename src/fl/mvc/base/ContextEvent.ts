module fl {
	export class ContextEvent extends egret.Event {

		public static STARTUP:string;
		public static STARTUP_COMPLETE:string;
		public static SHUTDOWN:string;
		public static SHUTDOWN_COMPLETE:string;
		protected _body:any;

		public constructor(type:string,body:any = null)
		{
			super(type);
			this._body = body;
		}

		public get body():any
		{
			return this._body;
		}

		public set body(value:any)
		{
			this.body = value;
		}

		public clone():egret.Event
		{
			return new fl.ContextEvent(this.type,this.body);
		}

	}
}

fl.ContextEvent.STARTUP = 'startup';
fl.ContextEvent.STARTUP_COMPLETE = 'startupComplete';
fl.ContextEvent.SHUTDOWN = 'shutdown';
fl.ContextEvent.SHUTDOWN_COMPLETE = 'shutdownComplete';
