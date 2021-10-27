(function () {
    'use strict';

    angular
        .module('app.adminSetting')
        .factory('CoPDirectoryAPI', CoPDirectoryAPI);

    /** @ngInject */
    function CoPDirectoryAPI($resource, appConfig, $q , UserProfileApi, AdminSettingCoPApi) {
        var $q = $q; 
        var vm = this;
        vm.userInfo;
        
        var api = {
           GetCoPDirectory: $resource(appConfig.SkillApi + 'api/Admin/Cop/GetCoPDirectory' , {}, {
                query: { method: 'GET', isArray: true }
            })
        };

        function GetCoPDirectory() {
            //For Skill userID
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.GetCoPDirectory.query({ userID: vm.userInfo.email }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


     

        return {
            api: api,
            GetCoPDirectory: GetCoPDirectory,
        };
    }

})();