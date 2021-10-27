(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('AccountApi', AccountApi);

    /** @ngInject */
    function AccountApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getDomains: $resource(appConfig.SSOApi + 'api/Domains'),
            login: $resource(appConfig.SkillApi + 'api/Account/Login'),
            getToken: $resource(appConfig.token_endpoint),
            getUser: $resource(appConfig.userinfo_endpoint),
            getDiscovery: $resource(appConfig.adfs_discovery_endpoint),
            logout: $resource(appConfig.SkillApi + 'api/Account/Logout'),
            user: {
                profile: $resource(appConfig.SkillApi + 'api/User/Profile')
            },
        };

        function getDomains() {

            var deferred = $q.defer();
            api.getDomains.query({},
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                    // console.log(data);
                }
            );

            return deferred.promise;
        }

        return {
            api: api,

            getDomains: getDomains
        };
    }

})();