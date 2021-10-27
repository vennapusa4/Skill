(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('AutosaveService', AutosaveService);

    /** @ngInject */
    function AutosaveService($interval) {
        var job;
        function _Register(func) {
            //job = $interval(func, 120000, null, false, false, 0);
        }

        function _Destroy() {
            if (!_.isEmpty(job)) {
                $interval.cancel(job);
            }            
        }

        return {
            register: _Register,
            destroy: _Destroy
        };
    }

})();
