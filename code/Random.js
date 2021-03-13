export default class Random {
    //random number between min inclusive and max exclusive
    static randBetween(min, max) {
        return Math.floor(Math.random() * (min + max) - min);
    }

    //returns a randomized copy of the array.
    static shuffle(arr) {
        var ret = [];
        var len = arr.length;
        var temp = [];
        for(var i = 0; i < len; i++) {
            temp.push(arr[i]);
        }
        for(var i = 0; i < len; i++) {
            var rand = this.randBetween(0, temp.length);
            var spliced = temp.splice(rand, 1);
            for(var j = 0; j < spliced.length; j++) {
                ret.push(spliced[j]);
            }
        }
        return ret;
    }
}