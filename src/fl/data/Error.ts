module fl {
    export class Error {
        public name:string;
        public message:string;
        
        public constructor(message:any = "",name:any = 0)
		{
            this.name = name;
            this.message = message;
        }
    }
}