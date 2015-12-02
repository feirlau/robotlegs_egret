module fl {
	export interface IMediator {
		preRegister();
		onRegister();
		preRemove();
		onRemove();
		getViewComponent():any;
		setViewComponent(viewComponent:any);
		
		context:fl.IContext;
	}
	export var IMediator:string = "fl.IMediator";
}

