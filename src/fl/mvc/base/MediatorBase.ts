module fl {
	export class MediatorBase extends egret.HashObject implements fl.IMediator {
		public static  UIComponentClass:string;
		protected viewComponent:any;
		protected removed:boolean = false;
		protected _context:fl.IContext;
		public constructor()
		{
			super();
		}

		public get context():fl.IContext
		{
			return this._context;
		}

		public set context(value:fl.IContext)
		{
			this._context = value;
			this.updateContext();
		}
		protected updateContext()
		{
		}
		
		public preRegister()
		{
			this.removed = false;
			if(fl.is(this.viewComponent, fl.MediatorBase.UIComponentClass) && !this.viewComponent["$UIComponent"][29/* initialized */])
			{
				(<egret.IEventDispatcher>(this.viewComponent)).addEventListener("creationComplete", this.onCreationComplete,this,false,0);
			}
			else
			{
				this.onRegister();
			}
		}

		public onRegister()
		{
		}

		public preRemove()
		{
			this.removed = true;
			this.onRemove();
		}

		public onRemove()
		{
		}

		public getViewComponent():any
		{
			return this.viewComponent;
		}

		public setViewComponent(viewComponent:any)
		{
			this.viewComponent = viewComponent;
		}

		protected onCreationComplete(e:egret.Event)
		{
			(<egret.IEventDispatcher>(e.target)).removeEventListener('creationComplete',this.onCreationComplete,this,false);
			if(!this.removed)
				this.onRegister();
		}

	}
}

fl.MediatorBase.UIComponentClass = 'eui.UIComponent';