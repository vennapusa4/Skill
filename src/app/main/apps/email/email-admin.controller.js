(function () {
    'use strict';

    angular
        .module('app.email')
        .controller('EmailAdminController', EmailAdminController);

    /** @ngInject */
    function EmailAdminController($scope, $window, $state, EmailApi, logger) {
        var vm = this;

        // LAYOUT
        function clearLayout() {
            $scope.layout_grid = false;
            $scope.layout_list = false;
            $scope.layout_map = false;
        }

        function resetLayout() {
            clearLayout();
            var screenWidth = $window.innerWidth;
            if (screenWidth < 700) {
                $scope.layout_list = true;
            } else {
                $scope.layout_grid = true;
            }
        }
        resetLayout();

        $scope.selectLayout = function (type) {
            clearLayout();
            $scope[type] = true;
        }
        $scope.tabChange = function () {
            resetLayout();
        }

        if ($state.current.name === 'appAdmin.emailAdmin') {
            $state.go('appAdmin.emailAdmin.typeOfEmail', {});
        }
        $scope.$on('SetLayoutAfterFilter', function (event, args) {
            $scope.selectLayout('display_grid');
        });
        $scope.setClass = function (className) {
            var currentStateName = $state.current.name;
            if (currentStateName.indexOf('Filter') != -1) {
                currentStateName = currentStateName.replace('Filter', '');
            }
            if (currentStateName == className) {
                return 'active';
            }
            return '';
        }
    }
})();