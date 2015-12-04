/// <reference path="ViewMapBase" />

module fl {
	export class ViewMap extends fl.ViewMapBase implements fl.IViewMap {

		protected mappedPackages:Array<any>;
		protected mappedTypes:fl.Dictionary;
		protected injectedViews:fl.Dictionary;

		public constructor(context:fl.IContext)
		{
			super(context);
			this.mappedPackages = new Array();
			this.mappedTypes = new fl.Dictionary(false);
			this.injectedViews = new fl.Dictionary(true);
		}

		public mapPackage(packageName:string)
		{
			if(this.mappedPackages.indexOf(packageName) == -1)
			{
				this.mappedPackages.push(packageName);
				this.viewListenerCount++;
				if(this.viewListenerCount == 1)
					this.addListeners();
			}
		}

		public unmapPackage(packageName:string)
		{
			var index:number = this.mappedPackages.indexOf(packageName);
			if(index > -1)
			{
				this.mappedPackages.splice(index,1);
				this.viewListenerCount--;
				if(this.viewListenerCount == 0)
					this.removeListeners();
			}
		}

		public mapType(type:any)
		{
			if(this.mappedTypes.getItem(type))
				return ;
			this.mappedTypes.setItem(type,type);
			this.viewListenerCount++;
			if(this.viewListenerCount == 1)
				this.addListeners();
			if(this.contextView && fl.is(this.contextView,type))
				this.injectInto(this.contextView);
		}

		public unmapType(type:any)
		{
			var mapping:any = <any>this.mappedTypes.getItem(type);
			this.mappedTypes.delItem(type);
			if(mapping)
			{
				this.viewListenerCount--;
				if(this.viewListenerCount == 0)
					this.removeListeners();
			}
		}

		public hasType(type:any):boolean
		{
			return (this.mappedTypes.getItem(type) != null);
		}

		public hasPackage(packageName:string):boolean
		{
			return this.mappedPackages.indexOf(packageName) > -1;
		}

		protected addListeners()
		{
			if(this.contextView && this.enabled)
				this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE,this.onViewAdded,this,this.useCapture,0);
		}

		protected removeListeners()
		{
			if(this.contextView)
				this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onViewAdded,this,this.useCapture);
		}

		protected onViewAdded(e:egret.Event)
		{
			var target:egret.DisplayObject = (<egret.DisplayObject>(e.target));
			if(this.injectedViews.getItem(target))
				return ;
			for(var type_key_a in this.mappedTypes.map)
			{
				var type:any = this.mappedTypes.map[type_key_a][1];
				if(fl.is(target,type))
				{
					this.injectInto(target);
					return ;
				}
			}
			var len:number = this.mappedPackages.length;
			if(len > 0)
			{
				var className:string = fl.getClassName(target);
				for(var i:number = 0;i < len; i++)
				{
					var packageName:string = <any>this.mappedPackages[i];
					if(className.indexOf(packageName) == 0)
					{
						this.injectInto(target);
						return ;
					}
				}
			}
		}

		protected injectInto(target:egret.DisplayObject)
		{
			this.injector.injectInto(target);
			this.injectedViews.setItem(target,true);
		}

	}
}