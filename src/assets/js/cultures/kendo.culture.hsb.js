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
    kendo.cultures["hsb"] = {
        name: "hsb",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ".",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n %","n %"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "",
                abbr: "",
                pattern: ["-n $","n $"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "???"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["njed??ela","p??nd??ela","wutora","srjeda","??tw??rtk","pjatk","sobota"],
                    namesAbbr: ["nje","p??n","wut","srj","??tw","pja","sob"],
                    namesShort: ["n","p","w","s","??","p","s"]
                },
                months: {
                    names: ["januar","februar","m??rc","apryl","meja","junij","julij","awgust","september","oktober","nowember","december"],
                    namesAbbr: ["jan","feb","m??r","apr","mej","jun","jul","awg","sep","okt","now","dec"]
                },
                AM: [""],
                PM: [""],
                patterns: {
                    d: "d. M. yyyy",
                    D: "dddd, 'dnja' d. MMMM yyyy",
                    F: "dddd, 'dnja' d. MMMM yyyy H.mm.ss",
                    g: "d. M. yyyy H.mm",
                    G: "d. M. yyyy H.mm.ss",
                    m: "d. MMMM",
                    M: "d. MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "H.mm",
                    T: "H.mm.ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": ". ",
                ":": ".",
                firstDay: 1
            }
        }
    }
})(this);
}));