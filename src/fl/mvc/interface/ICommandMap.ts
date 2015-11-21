module fl {
	export interface ICommandMap {

		detain(command:any);
		release(command:any);
		execute(commandClass:any,payload?:any,payloadClass?:any,named?:string);
		mapEvent(eventType:string,commandClass:any,eventClass?:any,oneshot?:boolean);
		unmapEvent(eventType:string,commandClass:any,eventClass?:any);
		unmapEvents();
		hasEventCommand(eventType:string,commandClass:any,eventClass?:any):boolean;
	}
	export var ICommandMap:string = "fl.ICommandMap";
}

