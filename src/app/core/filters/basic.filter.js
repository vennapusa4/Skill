(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('shortName', shortName);

    /** @ngInject */
    function shortName() {
        return shortNameFilter;

        function shortNameFilter(input, Params) {
            var out = '';
            if (input) {
                if (input !== '' && Params === 2) {
                    var arr = input.split('@')[0].split('.');
                    for (var i = 0; i < arr.length; i++) {
                        out = out + arr[i].charAt(0).toUpperCase();
                    }
                } else {
                    out = input.charAt(0).toUpperCase();
                }
            } else {
                return 'A';
            }

            return out;
        }
    }

})();