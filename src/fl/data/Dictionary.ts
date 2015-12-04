/**
 * Created by huitao on 2015/6/25.
 */
module fl {


    export class Dictionary {
        public map:Array<any> = new Array<any>();

        public constructor(weak?:boolean) {
        }

        public getItem(key, val?:any):any {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) return this.map[i][1];
            }
            if(val) {
                this.map.push([key, val]);
            }
            return val;
        }

        public setItem(key, val):any {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    this.map[i][1] = val;
                    return;
                }
            }
            this.map.push([key, val]);
            return val;
        }

        public delItem(key):any {
            var item:any;
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    item = this.map[i][1];
                    this.map.splice(i, 1);
                    break;
                }
            }
            return item;
        }

        public hasOwnProperty(key) {
            if(this.map == undefined || this.map.length == undefined)
            {
                return false;
            }
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    return true;
                }
            }
            return false;
        }
    }

}