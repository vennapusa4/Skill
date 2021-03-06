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
    kendo.cultures["sms-FI"] = {
        name: "sms-FI",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": "??",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n %","n %"],
                decimals: 2,
                ",": "??",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Euro",
                abbr: "EUR",
                pattern: ["-n $","n $"],
                decimals: 2,
                ",": "??",
                ".": ",",
                groupSize: [3],
                symbol: "???"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["p????sspei??vv","vu??ssargg","m????ibargg","se??rad","neljdpei??vv","pi??tn??c","sue??vet"],
                    namesAbbr: ["p??","vu","m??","se","ne","pi","su"],
                    namesShort: ["p??","v","m","s","n","pi","s"]
                },
                months: {
                    names: ["o????ee??jjm????n","t????lvvm????n","p????zzl????ttam-m????n","njuh????m????n","vue??ssm????n","??ie??ssm????n","suei??nnm????n","p????r????m????n","????h????m????n","k??lggm????n","skamm-m????n","rosttovm????n"],
                    namesAbbr: ["o????ee??jjm????n","t????lvvm????n","p????zzl????ttam-m????n","njuh????m????n","vue??ssm????n","??ie??ssm????n","suei??nnm????n","p????r????m????n","????h????m????n","k??lggm????n","skamm-m????n","rosttovm????n"]
                },
                AM: [""],
                PM: [""],
                patterns: {
                    d: "d.M.yyyy",
                    D: "MMMM d'. p. 'yyyy",
                    F: "MMMM d'. p. 'yyyy H:mm:ss",
                    g: "d.M.yyyy H:mm",
                    G: "d.M.yyyy H:mm:ss",
                    m: "MMMM d'. p. '",
                    M: "MMMM d'. p. '",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "H:mm",
                    T: "H:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": ".",
                ":": ":",
                firstDay: 1
            }
        }
    }
})(this);
}));