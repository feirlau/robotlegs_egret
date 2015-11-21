module fl {
	export class Actor extends egret.HashObject {

		protected _eventDispatcher:egret.IEventDispatcher;
		protected _eventMap:fl.IEventMap;

		public constructor()
		{
			super();
		}

		public get eventDispatcher():egret.IEventDispatcher
		{
			return this._eventDispatcher;
		}

		public set eventDispatcher(value:egret.IEventDispatcher)
		{
			this._eventDispatcher = value;
		}

		protected get eventMap():fl.IEventMap
		{
			return this._eventMap || (this._eventMap = new EventMap(this.eventDispatcher));
		}

		protected set eventMap(value:fl.IEventMap)
		{
			this._eventMap = value;
		}

		protected dispatch(event:egret.Event):boolean
		{
			if(this.eventDispatcher.hasEventListener(event.type))
				return this.eventDispatcher.dispatchEvent(event);
			return false;
		}

	}
}

