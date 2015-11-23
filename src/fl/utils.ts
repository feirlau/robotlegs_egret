/**
 * Created by feir on 2015/11/14.
 */
module fl {
    export function isNumber(value:any):boolean {
        var type:string = (typeof value);
        if(type === "object") {
            type = Object.prototype.toString.call(value);;
            return type === "[object Number]";
        } else {
            return type === "number";
        }
    }
    export function isString(value:any):boolean {
        var type:string = (typeof value);
        if(type === "object") {
            type = Object.prototype.toString.call(value);;
            return type === "[object String]";
        } else {
            return type === "string";
        }
    }
    export function isArray(value:any):boolean {
        if(Array.isArray) return Array.isArray(value);
        if(value) return Object.prototype.toString.call(value) === "[object Array]";
    }
    export function isObject(value:any):boolean {
        var type:string = (typeof value);
        return type === "object";
    }
    export function isClass(value:any):boolean {
        var type:string = (typeof value);
        return type === "function";
    }
    export function is(value:any, superValue:any) {
        if(value === superValue) return true;
        if(!value  || !superValue) return false;

        var types:Array<string>;
        if(isString(value)) {
            types = [value];
        } else {
            var proto:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
            types = proto ? proto.__types__ : null;
            if (!types) {
                return false;
            }
        }

        superValue = getClassName(superValue);

        return (types.indexOf(superValue) !== -1);
    }
    export function getClassName(value:any,replaceColons:boolean = false):string
    {
        var fqcn:string;
        if(fl.isString(value))
        {
            fqcn = value;
        }
        else
        {
            fqcn = egret.getQualifiedClassName(value);
        }
        return replaceColons?fqcn.replace('::','.'):fqcn;
    }

    //START: ------ string utils ------
    export function isWhitespace(character:string):boolean
    {
        switch(character)
        {
            case " " :
            case "\t" :
            case "\r" :
            case "\n" :
            case "\f" :
                return true;
            default :
                return false;
        }
    }

    export function substitute(str:string,...rest):string
    {
        if(str == null)
            return '';
        var len:number = rest.length;
        var args:Array<any>;
        if(len == 1 && fl.isArray(rest[0]))
        {
            args = rest[0];
            len = args.length;
        }
        else
        {
            args = rest;
        }
        for(var i:number = 0;i < len; i++)
        {
            str = str.replace(new RegExp("\\{" + i + "\\}","g"),args[i]);
        }
        return str;
    }

    export var LINE_BREAKS:RegExp;
    export function joinLines(value:string):string
    {
        fl.LINE_BREAKS.lastIndex = 0;
        return value?value.replace(fl.LINE_BREAKS,""):value;
    }

    export function toFixed(value:number,p:number = 2,trimZero:boolean = true):string
    {
        var tmpS:string = value.toFixed(p);
        if(trimZero && p > 0)
        {
            for(var i:number = tmpS.length - 1;i >= 0; i--)
            {
                var tmpC:string = tmpS.charAt(i);
                if(tmpC == '.')
                {
                    break;
                }
                else if(tmpC != '0')
                {
                    i++;
                    break;
                }
            }
            tmpS = tmpS.substring(0,i);
        }
        return tmpS;
    }

    export function replaceText(s:string,ft:string,tt:string):string
    {
        return s.split(ft).join(tt);
    }

    export function stringFullMatch(source:string,target:string):boolean
    {
        var tmpResult:boolean = <any>false;
        if(source == target)
        {
            tmpResult = true;
        }
        else if(source == null || target == null)
        {
            tmpResult = false;
        }
        else
        {
            var tmpReg:RegExp = new RegExp('^' + target + '$','m');
            tmpResult = (null != source.match(tmpReg));
        }
        return tmpResult;
    }

    export var COLOR_TEXT:string;
    export function formatHtml(s:string,color:any = null,size:any = null,bold:boolean = false,under:boolean = false,italic:boolean = false,face:string = "SimSun"):string
    {
        var sc:string = "";
        if(color != null)
        {
            sc = fl.getColorStr(fl.getColor(color));
            sc = "color='" + sc + "'";
        }
        var ss:string = "";
        if(size != null)
        {
            ss = "size='" + size + "'";
        }
        var sf:string = "";
        if(face != null)
        {
            sf = "face='" + face + "'";
        }
        var template:string = fl.substitute(fl.COLOR_TEXT,sc,ss,sf,s);
        if(bold)
        {
            template = "<b>" + template + "</b>";
        }
        if(under)
        {
            template = "<u>" + template + "</u>";
        }
        if(italic)
        {
            template = "<i>" + template + "</i>";
        }
        return template;
    }

    export function getWordWidth(value:string):number
    {
        var tmpResult:number = 0;
        for(var i:number = 0;i < value.length; i++)
        {
            var tmpC:number = value.charCodeAt(i);
            if(tmpC >= 0 && tmpC <= 126)
            {
                tmpResult += 1;
            }
            else
            {
                tmpResult += 2;
            }
        }
        return tmpResult;
    }

    export function strByteLen(str:string):number
    {
        var byteLen:number = 0;
        if(!str)
            return 0;
        var strLen:number = str.length;
        for(var i:number = 0;i < strLen; i++)
        {
            byteLen += str.charCodeAt(i) >= 0x7F?2:1;
        }
        return byteLen;
    }

    export function repeatStr(str:string,count:number):string
    {
        var s:string = "";
        for(var i:number = 0;i < count; i++)
        {
            s += str;
        }
        return s;
    }

    export var HTML_TAG:RegExp;
    export function complementByChar(str:string,length:number,char:string,ignoreHtml:boolean = true):string
    {
        var byteLen:number = fl.strByteLen(ignoreHtml?str.replace(fl.HTML_TAG,""):str);
        return str + fl.repeatStr(char,length - byteLen);
    }
    //END:------ string utils ------

    //START:------ color utils -----
    export function adjustBrightness(rgb:number,brite:number):number
    {
        var r:number = Math.max(Math.min(((rgb >> 16) & 0xFF) + brite,255),0);
        var g:number = Math.max(Math.min(((rgb >> 8) & 0xFF) + brite,255),0);
        var b:number = Math.max(Math.min((rgb & 0xFF) + brite,255),0);
        return (r << 16) | (g << 8) | b;
    }

    export function adjustBrightness2(rgb:number,brite:number):number
    {
        var r:number = 0;
        var g:number = 0;
        var b:number = 0;
        if(brite == 0)
            return rgb;
        if(brite < 0)
        {
            brite = (100 + brite) / 100;
            r = ((rgb >> 16) & 0xFF) * brite;
            g = ((rgb >> 8) & 0xFF) * brite;
            b = (rgb & 0xFF) * brite;
        }
        else
        {
            brite /= 100;
            r = ((rgb >> 16) & 0xFF);
            g = ((rgb >> 8) & 0xFF);
            b = (rgb & 0xFF);
            r += ((0xFF - r) * brite);
            g += ((0xFF - g) * brite);
            b += ((0xFF - b) * brite);
            r = Math.min(r,255);
            g = Math.min(g,255);
            b = Math.min(b,255);
        }
        return (r << 16) | (g << 8) | b;
    }

    export function rgbMultiply(rgb1:number,rgb2:number):number
    {
        var r1:number = <any>(rgb1 >> 16) & 0xFF;
        var g1:number = <any>(rgb1 >> 8) & 0xFF;
        var b1:number = <any>rgb1 & 0xFF;
        var r2:number = <any>(rgb2 >> 16) & 0xFF;
        var g2:number = <any>(rgb2 >> 8) & 0xFF;
        var b2:number = <any>rgb2 & 0xFF;
        return ((r1 * r2 / 255) << 16) | ((g1 * g2 / 255) << 8) | (b1 * b2 / 255);
    }

    export function getColorStr(color:number):string
    {
        var result:string = "#";
        result += color.toString(16);
        return result;
    }

    export function getColorInt(color:string):number
    {
        return Number("0x" + color.substr(1,color.length));
    }

    export function getColor(color:any):number
    {
        var n:number = 0;
        if(fl.isString(color))
        {
            if(String(color).charAt(0) == "#")
            {
                n = fl.getColorInt(color);
            }
            else
            {
                n = Number(color);
            }
        }
        else
        {
            n = Number(color);
        }
        return n;
    }
    //END:------ color utils -----
}

fl.LINE_BREAKS = new RegExp("[\r\n]+","img");
fl.COLOR_TEXT = "\<font {0} {1} {2}\>{3}\</font\>";
fl.HTML_TAG = /<[^>]+>/g;