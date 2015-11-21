module fl {
	export class InjectionType extends egret.HashObject {

		public static VALUE:number;
		public static CLASS:number;
		public static SINGLETON:number;
	}
}

fl.InjectionType.VALUE = 0;
fl.InjectionType.CLASS = 1;
fl.InjectionType.SINGLETON = 2;
