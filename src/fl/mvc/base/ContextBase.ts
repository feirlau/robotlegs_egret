module fl {
	export class ContextBase extends egret.HashObject implements fl.IContext,egret.IEventDispatcher {

		protected _eventDispatcher:egret.IEventDispatcher;

		public constructor()
		{
			super();
			this._eventDispatcher = this.createEventDispatcher();
		}

		protected createEventDispatcher():egret.IEventDispatcher {
			return new egret.EventDispatcher(this);
		}

		public get eventDispatcher():egret.IEventDispatcher
		{
			return this._eventDispatcher;
		}

		public set eventDispatcher(value:egret.IEventDispatcher)
		{
			this._eventDispatcher = value;
		}

		public once(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0)
		{
			this.eventDispatcher.once(type,listener,thisObject,useCapture,priority);
		}

		public addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0)
		{
			this.eventDispatcher.addEventListener(type,listener,thisObject,useCapture,priority);
		}

		public dispatchEvent(event:egret.Event):boolean
		{
			if(this.eventDispatcher.hasEventListener(event.type))
				return this.eventDispatcher.dispatchEvent(event);
			return false;
		}

		public hasEventListener(type:string):boolean
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		public removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false)
		{
			this.eventDispatcher.removeEventListener(type,listener,thisObject,useCapture);
		}

		public willTrigger(type:string):boolean
		{
			return this.eventDispatcher.willTrigger(type);
		}

	}
}