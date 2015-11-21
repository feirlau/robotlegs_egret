module fl {
	export interface IMediator {
		preRegister();
		onRegister();
		preRemove();
		onRemove();
		getViewComponent():any;
		setViewComponent(viewComponent:any);
	}
	export var IMediator:string = "fl.IMediator";
}

