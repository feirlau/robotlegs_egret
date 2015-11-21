module fl {
	export class Command extends egret.HashObject {

		public contextView:egret.DisplayObjectContainer;
		public commandMap:fl.ICommandMap;
		public eventDispatcher:any;
		public injector:fl.IInjector;
		public mediatorMap:fl.IMediatorMap;

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

