(function () {
    'use strict';

    angular
        .module('app.footer')
        .controller('FooterController', FooterController);

    /** @ngInject */
    function FooterController($scope, $state) {

        $scope.isShowProfile = false;
        
        function checker() {
            if($state.current.name === 'app.ProfilePage' || $state.current.name === 'app.ProfilePage.cop' || $state.current.name === 'app.ProfilePage.interest' || $state.current.name === 'app.ProfilePage.feeds' || $state.current.name === 'app.ProfilePage.profile' || $state.current.name === 'app.ProfilePage.editProfile' || $state.current.name === 'app.ProfilePage.bookmark' || $state.current.name === 'app.ProfilePage.actions') {
                $scope.isShowProfile = true;
            } else {
                $scope.isShowProfile = false;
            }
        }

        $scope.$on('$stateChangeSuccess', function () {
            checker();
        });

        checker();

    }

})();