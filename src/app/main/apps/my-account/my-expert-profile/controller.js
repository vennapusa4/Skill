(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('MyExpertProfileController', MyExpertProfileController);

    /** @ngInject */
    function MyExpertProfileController($scope, $state) {

        $scope.state = $state;
        switch ($state.current.name) {
            case 'app.myAccountUser.pendingActions':
                vm.status = 'Submit'
                vm.endorserStatus = 'Submit'
                break;
            case 'app.myAccountUser.pendingActions.pendingValidation':
                vm.status = 'Submit'
                vm.endorserStatus = ''
                break;
            case 'app.myAccountUser.pendingActions.pendingEndorsement':
                vm.status = ''
                vm.endorserStatus = 'Submit'
                break;
            default:
                break;
        }
    }
})();
