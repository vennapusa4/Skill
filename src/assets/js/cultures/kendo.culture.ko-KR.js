/** 
 * Kendo UI v2017.1.223 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2017 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/

(function(f){
    if (typeof define === 'function' && define.amd) {
        define(["kendo.core"], f);
    } else {
        f();
    }
}(function(){
(function( window, undefined ) {
    kendo.cultures["ko-KR"] = {
        name: "ko-KR",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSize: [3],
            percent: {
                pattern: ["-n %","n %"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Korean Won",
                abbr: "KRW",
                pattern: ["-$n","$n"],
                decimals: 0,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "???"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["?????????","?????????","?????????","?????????","?????????","?????????","?????????"],
                    namesAbbr: ["???","???","???","???","???","???","???"],
                    namesShort: ["???","???","???","???","???","???","???"]
                },
                months: {
                    names: ["1???","2???","3???","4???","5???","6???","7???","8???","9???","10???","11???","12???"],
                    namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12"]
                },
                AM: ["??????","??????","??????"],
                PM: ["??????","??????","??????"],
                patterns: {
                    d: "yyyy-MM-dd",
                    D: "yyyy'???' M'???' d'???' dddd",
                    F: "yyyy'???' M'???' d'???' dddd tt h:mm:ss",
                    g: "yyyy-MM-dd tt h:mm",
                    G: "yyyy-MM-dd tt h:mm:ss",
                    m: "M'???' d'???'",
                    M: "M'???' d'???'",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "tt h:mm",
                    T: "tt h:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "yyyy'???' M'???'",
                    Y: "yyyy'???' M'???'"
                },
                "/": "-",
                ":": ":",
                firstDay: 0
            }
        }
    }
})(this);
}));