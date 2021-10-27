(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource, appConfig, $http) {

        var api = {
            getDomains: $resource(appConfig.SSOApi + 'api/Domains'),
            login: $resource(appConfig.SkillApi + 'api/Account/Login'),
            logout: $resource(appConfig.SkillApi + 'api/Account/Logout'),
            user: {
                profile: $resource(appConfig.SkillApi + 'api/User/Profile')
            }
        };

        function deleteItem(url, data) {

            return $http({
                method: 'DELETE',
                url: appConfig.SkillApi + url,
                data: data,
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            }).then(function (response) {
                return response;
            }).catch(function (response) {
                return response;
            })
        }

        return api;
    }

})();