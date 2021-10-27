(function () {
    'use strict';

    angular
        .module('app.insights')
        .controller('InsightsPeopleController', InsightsPeopleController);

    /** @ngInject */
    function InsightsPeopleController($mdSidenav, $scope, $filter, $rootScope, api, $state, msNavigationService, dialog, InsightsApi, SearchApi, appConfig, InsightsCommonService, UserProfileApi) {
        InsightsCommonService.clearSegmentLabels();
        InsightsCommonService.clearAuditLogs();
        $scope.userInfo = UserProfileApi.getUserInfo();

        var vm = this;
        vm.globalFromDate = new Date(1, 1, 1900);
        vm.globalToDate = new Date();
        vm.globalDefaultFilter = "year";
        vm.globalFilter = "All";
        vm.showGlobalDropdown = false;

        function getQuarter(date) {
            var quarter = Math.floor((date.getMonth() + 3) / 3);
            return quarter;
        }
        vm.globalFilterDate = function (startDate, endDate, period) {
            vm.globalFromDate = startDate._d;
            vm.globalToDate = endDate._d;
            vm.globalDefaultFilter = period;
            vm.globalFilterLabel = period;

            var month = vm.globalFromDate.getMonth() + 1;
            var year = vm.globalFromDate.getFullYear();
            switch (period) {
                case 'month': {
                    vm.globalToDate = new Date(year, month, 0);
                    vm.globalFilter = month + "/" + year;
                    break;
                }
                case 'quarter': {
                    var quarter = getQuarter(vm.globalFromDate);
                    vm.globalToDate = new Date(year, quarter * 3, 0);
                    vm.globalFilter = "Quarter " + quarter;
                    break;
                }
                case 'year': {
                    vm.globalToDate = new Date(year, 12, 0);
                    vm.globalFilter = "Year " + year;
                    break;
                }
                default:
            }
            $rootScope.$broadcast('globalFilterDateChange', { any: { fromDate: vm.globalFromDate, toDate: vm.globalToDate, defaultFilter: vm.globalDefaultFilter, label: vm.globalFilter } });
        }

        $scope.$on('globalFilterDateChangeSuccess', function (event, args) {
            vm.showGlobalDropdown = false;
        });

        $scope.exportPDF = function (element, fileName) {
            InsightsCommonService.exportPDF(element, fileName);
        }

        $scope.exportExcel = function (type) {
            InsightsCommonService.exportExcel(type);
        }

        // DatNT38 - Remove date filter
        vm.removeFilter = function (type) {
            vm.globalFromDate = new Date(1, 1, 1900);
            vm.globalToDate = new Date();
            vm.globalDefaultFilter = "year";
            vm.globalFilter = "All";
            vm.showGlobalDropdown = false;
            $rootScope.$broadcast('globalFilterDateChange', {
                any: {
                    fromDate: vm.globalFromDate,
                    toDate: vm.globalToDate,
                    defaultFilter: vm.globalDefaultFilter,
                    label: vm.globalFilter
                }
            });
            $(".range_filter").find('.start-date:first').removeClass('start-date');
        }
    }
})();
