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
    kendo.cultures["yo"] = {
        name: "yo",
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
                name: "",
                abbr: "",
                pattern: ["-$ n","$ n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "???"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["????k??","Aj??","??????????gun","???j?????\u0027r??","???j?????\u0027b?????","???t??","??b??m?????ta"],
                    namesAbbr: ["????k","Aj??","?????g","???jr","???jb","???ti","??b??"],
                    namesShort: ["????","Aj","?????","???j","???b","???t","??b"]
                },
                months: {
                    names: ["O???u Muharram","O???u Safar","O???u R Awwal","O???u R Aakhir","O???u J Awwal","O???u J Aakhira","O???u Rajab","O???u Sha\u0027baan","O???u Ramadhan","O???u Shawwal","O???u Dhul Qa\u0027dah","O???u Dhul Hijjah"],
                    namesAbbr: ["O???u Muharram","O???u Safar","O???u R Awwal","O???u R Aakhir","O???u J Awwal","O???u J Aakhira","O???u Rajab","O???u Sha\u0027baan","O???u Ramadhan","O???u Shawwal","O???u Dhul Qa\u0027dah","O???u Dhul Hijjah"]
                },
                AM: ["??w??r?????","??w??r?????","??W??R?????"],
                PM: ["Al?????","al?????","AL?????"],
                patterns: {
                    d: "d/M/yyyy",
                    D: "dddd, dd MMMM, yyyy",
                    F: "dddd, dd MMMM, yyyy h:mm:ss tt",
                    g: "d/M/yyyy h:mm tt",
                    G: "d/M/yyyy h:mm:ss tt",
                    m: "dd MMMM",
                    M: "dd MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM,yyyy",
                    Y: "MMMM,yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 0
            }
        }
    }
})(this);
}));