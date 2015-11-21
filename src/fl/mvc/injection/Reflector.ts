module fl {
	export class Reflector extends egret.HashObject implements fl.IReflector {


		public constructor()
		{
			super();
		}

		public classExtendsOrImplements(classOrClassName:any,superclass:any):boolean
		{
			var actualClass:any;
			if(fl.isString(classOrClassName))
			{
				try
				{
					actualClass = egret.getDefinitionByName(<string>classOrClassName);
				}
				catch(e)
				{
					throw new Error("The class name " + classOrClassName + " is not valid because of " + e + "\n" + e.getStackTrace());
				}
			}
			else
			{
				actualClass = classOrClassName;
			}
			if(!actualClass)
			{
				throw new Error("The parameter classOrClassName must be a valid Class " + "instance or fully qualified class name.");
			}

			return fl.is(actualClass, superclass);
		}

		public getClass(value:any):any
		{
			if(fl.isClass(value))
			{
				return value;
			}
			return value.constructor;
		}

		public getFQCN(value:any,replaceColons:boolean = false):string
		{
			return fl.getClassName(value, replaceColons);
		}

	}
}

