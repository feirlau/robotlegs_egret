module fl {
	export class ViewMapBase extends egret.HashObject {

		protected _enabled:boolean = true;
		protected _contextView:egret.DisplayObjectContainer;
		protected injector:fl.IInjector;
		protected useCapture:boolean = false;
		protected viewListenerCount:number = 0;
		public context:fl.IContext;
		public constructor(context:fl.IContext)
		{
			super();
			this.context = context;
			this.injector = context.injector;
			this.useCapture = true;
			this.contextView = context.contextView;
		}

		public get contextView():egret.DisplayObjectContainer
		{
			return this._contextView;
		}

		public set contextView(value:egret.DisplayObjectContainer)
		{
			if(value != this._contextView)
			{
				this.removeListeners();
				this._contextView = value;
				if(this.viewListenerCount > 0)
					this.addListeners();
			}
		}

		public get enabled():boolean
		{
			return this._enabled;
		}

		public set enabled(value:boolean)
		{
			if(value != this._enabled)
			{
				this.removeListeners();
				this._enabled = value;
				if(this.viewListenerCount > 0)
					this.addListeners();
			}
		}

		protected addListeners()
		{
		}

		protected removeListeners()
		{
		}

		protected onViewAdded(e:egret.Event)
		{
		}

	}
}

