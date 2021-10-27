(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider, $compileProvider) {
		// Put your custom configurations here
		$httpProvider.defaults.timeout = 6000000;
        $httpProvider.interceptors.push(['$q', function ($q) {
			return {
				'responseError': function (rejection) {
                    var defer = $q.defer();
                    //rejection.status === 500 || 
					if (rejection.status === -1) {
						// window.location.href = '/pages/errors/error-500';
					    return rejection;

					} else if (rejection.status === 401 || rejection.status === 403) {
						//window.location.href = '/pages/auth/login';
						//alert(rejection.status);
						console.log(rejection);
						//debugger;
						localStorage.clear();
						
						window.location.href = window.location.href;
					}
					else {
						defer.reject(rejection);
						return defer.promise;
					}
				}
			};
        }]);

		$httpProvider.interceptors.push(['$q', function ($q) {
			return {
				'request': function (config) {
					//console.log('request');
                    config.timeout = 6000000;// 60 * 60 * 1000;
        			return config;
				}
			};
        }]);


        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
    }

})();