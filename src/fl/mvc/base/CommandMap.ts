module fl {
	export class CommandMap extends egret.HashObject implements fl.ICommandMap {

		protected eventDispatcher:egret.IEventDispatcher;
		protected injector:fl.IInjector;
		protected reflector:fl.IReflector;
		protected eventTypeMap:fl.Dictionary;
		protected verifiedCommandClasses:fl.Dictionary;
		protected detainedCommands:fl.Dictionary;

		public constructor(eventDispatcher:egret.IEventDispatcher,injector:fl.IInjector,reflector:fl.IReflector)
		{
			super();
			this.eventDispatcher = eventDispatcher;
			this.injector = injector;
			this.reflector = reflector;
			this.eventTypeMap = new fl.Dictionary(false);
			this.verifiedCommandClasses = new fl.Dictionary(false);
			this.detainedCommands = new fl.Dictionary(false);
		}

		public mapEvent(eventType:string,commandClass:any,eventClass:any = null,oneshot:boolean = false)
		{
			var _self__:any = this;
			this.verifyCommandClass(commandClass);
			eventClass = eventClass || egret.Event;
			var eventClassMap:fl.Dictionary = this.eventTypeMap.getItem(eventType,new fl.Dictionary(false));
			var callbacksByCommandClass:fl.Dictionary = eventClassMap.getItem(eventClass,new fl.Dictionary(false));
			if(callbacksByCommandClass.getItem(commandClass))
			{
				throw new fl.ContextError(ContextError.E_COMMANDMAP_OVR + ' - eventType (' + eventType + ') and Command (' + commandClass + ')');
			}
			var callback:Function = function (event:egret.Event)
			{
				_self__.routeEventToCommand(event,commandClass,oneshot,eventClass);
			};
			this.eventDispatcher.addEventListener(eventType,callback,null,false,0);
			callbacksByCommandClass.setItem(commandClass,callback);
		}

		public unmapEvent(eventType:string,commandClass:any,eventClass:any = null)
		{
			var eventClassMap:fl.Dictionary = this.eventTypeMap.getItem(eventType);
			if(eventClassMap == null)
				return ;
			var callbacksByCommandClass:fl.Dictionary = eventClassMap.getItem(eventClass || egret.Event);
			if(callbacksByCommandClass == null)
				return ;
			var callback:Function = callbacksByCommandClass.getItem(commandClass);
			if(callback == null)
				return ;
			this.eventDispatcher.removeEventListener(eventType,callback,null,false);
			callbacksByCommandClass.delItem(commandClass);
		}

		public unmapEvents()
		{
			for(var forinvar__ in this.eventTypeMap.map)
			{
				var map = this.eventTypeMap.map[forinvar__];
				var eventType = map[0];
				var eventClassMap:fl.Dictionary = map[1];
				for(var callbacksByCommandClass_key_a in eventClassMap.map)
				{
					var callbacksByCommandClass:fl.Dictionary = eventClassMap.map[callbacksByCommandClass_key_a][1];
					for(var callback_key_a in callbacksByCommandClass.map)
					{
						var callback:Function = callbacksByCommandClass.map[callback_key_a][1];
						this.eventDispatcher.removeEventListener(eventType,callback,null,false);
					}
				}
			}
			this.eventTypeMap = new fl.Dictionary(false);
		}

		public hasEventCommand(eventType:string,commandClass:any,eventClass:any = null):boolean
		{
			var eventClassMap:fl.Dictionary = this.eventTypeMap.getItem(eventType);
			if(eventClassMap == null)
				return false;
			var callbacksByCommandClass:fl.Dictionary = eventClassMap.getItem(eventClass || egret.Event);
			if(callbacksByCommandClass == null)
				return false;
			return callbacksByCommandClass.getItem(commandClass) != null;
		}

		public execute(commandClass:any,payload:any = null,payloadClass:any = null,named:string = '')
		{
			this.verifyCommandClass(commandClass);
			if(payload != null || payloadClass != null)
			{
				payloadClass = payloadClass || this.reflector.getClass(payload);
				if(fl.is(payload,egret.Event) && payloadClass != egret.Event)
					this.injector.mapValue(egret.Event,payload);
				this.injector.mapValue(payloadClass,payload,named);
			}
			var command:any = this.injector.instantiate(commandClass);
			if(payload !== null || payloadClass != null)
			{
				if(fl.is(payload,egret.Event) && payloadClass != egret.Event)
					this.injector.unmap(egret.Event);
				this.injector.unmap(payloadClass,named);
			}
			command.execute();
		}

		public detain(command:any)
		{
			this.detainedCommands.setItem(command,true);
		}

		public release(command:any)
		{
			this.detainedCommands.delItem(command);
		}

		protected verifyCommandClass(commandClass:any)
		{
		}

		protected routeEventToCommand(event:egret.Event,commandClass:any,oneshot:boolean,originalEventClass:any):boolean
		{
			if(!(fl.is(event,originalEventClass)))
				return false;
			this.execute(commandClass,event);
			if(oneshot)
				this.unmapEvent(event.type,commandClass,originalEventClass);
			return true;
		}

	}
}