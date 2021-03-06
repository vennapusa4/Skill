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
    kendo.cultures["ti-ER"] = {
        name: "ti-ER",
        numberFormat: {
            pattern: ["-n"],
            decimals: 1,
            ",": ",",
            ".": ".",
            groupSize: [3,0],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 1,
                ",": ",",
                ".": ".",
                groupSize: [3,0],
                symbol: "%"
            },
            currency: {
                name: "Eritrean Nakfa",
                abbr: "ERN",
                pattern: ["-$n","n$"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "ERN"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["????????????","?????????","?????????","?????????","?????????","?????????","?????????"],
                    namesAbbr: ["????????????","?????????","?????????","?????????","?????????","?????????","?????????"],
                    namesShort: ["??????","??????","??????","??????","??????","??????","??????"]
                },
                months: {
                    names: ["??????","????????????","????????????","????????????","????????????","??????","?????????","?????????","???????????????","????????????","?????????","????????????"],
                    namesAbbr: ["??????","????????????","????????????","????????????","????????????","??????","?????????","?????????","???????????????","????????????","?????????","????????????"]
                },
                AM: ["?????????","?????????","?????????"],
                PM: ["????????? ?????????","????????? ?????????","????????? ?????????"],
                patterns: {
                    d: "d/M/yyyy",
                    D: "dddd '???' MMMM d '????????????' yyyy",
                    F: "dddd '???' MMMM d '????????????' yyyy h:mm:ss tt",
                    g: "d/M/yyyy h:mm tt",
                    G: "d/M/yyyy h:mm:ss tt",
                    m: "MMMM d",
                    M: "MMMM d",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 1
            }
        }
    }
})(this);
}));