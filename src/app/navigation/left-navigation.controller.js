(function () {
    'use strict';

    angular
        .module('app.navigation')
        .controller('LeftNavigationController', LeftNavigationController);

    /** @ngInject */
    function LeftNavigationController(UserProfileApi) {
        var vm = this;

        vm.userInfo = {};
        getUserInfo();

        function getUserInfo() {
              
            vm.userInfo = UserProfileApi.getUserInfo();
            vm.userInfo.isAdmin=vm.userInfo.roles.indexOf("Administrator")!=-1;
               
            vm.userInfo.isVCoPMCN = vm.userInfo.roles.indexOf("VCoP MCN")!=-1;
            vm.userInfo.isSMEUser = vm.userInfo.roles.indexOf("SME User")!=-1;
            vm.userInfo.isTechnicalAlertAdmin = vm.userInfo.roles.indexOf("Technical Alert Administrator")!=-1;
          };

        }

})();