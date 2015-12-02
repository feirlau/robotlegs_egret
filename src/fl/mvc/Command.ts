module fl {
	export class Command extends egret.HashObject {

		public context:fl.IContext;
		public eventDispatcher:egret.IEventDispatcher;

		public constructor()
		{
			super();
		}

		public execute()
		{
		}

		protected dispatch(event:egret.Event):boolean
		{
			if(this.eventDispatcher.hasEventListener(event.type))
				return this.eventDispatcher.dispatchEvent(event);
			return false;
		}

	}
}

