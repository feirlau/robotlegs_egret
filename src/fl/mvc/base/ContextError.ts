module fl {
	export class ContextError implements Error {

		public static E_COMMANDMAP_NOIMPL:string;
		public static E_COMMANDMAP_OVR:string;
		public static E_MEDIATORMAP_NOIMPL:string;
		public static E_MEDIATORMAP_OVR:string;
		public static E_EVENTMAP_NOSNOOPING:string;
		public static E_CONTEXT_INJECTOR:string;
		public static E_CONTEXT_REFLECTOR:string;
		public static E_CONTEXT_VIEW_OVR:string;

		public message:string;
		public name:string;

		public constructor(message:string = "",id:number = 0)
		{
			this.message = message;
			this.name = String(id);
		}

	}
}

fl.ContextError.E_COMMANDMAP_NOIMPL = 'Command Class does not implement an execute() method';
fl.ContextError.E_COMMANDMAP_OVR = 'Cannot overwrite map';
fl.ContextError.E_MEDIATORMAP_NOIMPL = 'Mediator Class does not implement IMediator';
fl.ContextError.E_MEDIATORMAP_OVR = 'Mediator Class has already been mapped to a View Class in this context';
fl.ContextError.E_EVENTMAP_NOSNOOPING = 'Listening to the context eventDispatcher is not enabled for this EventMap';
fl.ContextError.E_CONTEXT_INJECTOR = 'The ContextBase does not specify a concrete IInjector. Please override the injector getter in your concrete or abstract Context.';
fl.ContextError.E_CONTEXT_REFLECTOR = 'The ContextBase does not specify a concrete IReflector. Please override the reflector getter in your concrete or abstract Context.';
fl.ContextError.E_CONTEXT_VIEW_OVR = 'Context contextView must only be set once';
