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
    kendo.cultures["prs-AF"] = {
        name: "prs-AF",
        numberFormat: {
            pattern: ["n-"],
            decimals: 2,
            ",": ".",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["%n-","%n"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Afghani",
                abbr: "AFN",
                pattern: ["$n-","$n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "??"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["????????????","????????????","??????? ????????","???????? ????????","??????????????","????????","????????"],
                    namesAbbr: ["????????????","????????????","??????? ????????","???????? ????????","??????????????","????????","????????"],
                    namesShort: ["??","??","??","??","??","??","??"]
                },
                months: {
                    names: ["??????????","??????","???????? ????????????","???????? ????????????","?????????? ??????????","?????????? ????????????","??????","??????????","??????????","??????????","???? ????????????","???? ????????????"],
                    namesAbbr: ["??????????","??????","???????? ????????????","???????? ????????????","?????????? ??????????","?????????? ????????????","??????","??????????","??????????","??????????","???? ????????????","???? ????????????"]
                },
                AM: ["??.??","??.??","??.??"],
                PM: ["??.??","??.??","??.??"],
                patterns: {
                    d: "yyyy/M/d",
                    D: "yyyy, dd, MMMM, dddd",
                    F: "yyyy, dd, MMMM, dddd h:mm:ss tt",
                    g: "yyyy/M/d h:mm tt",
                    G: "yyyy/M/d h:mm:ss tt",
                    m: "d MMMM",
                    M: "d MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 6
            }
        }
    }
})(this);
}));