/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.adminSetting')
        .directive('userSearch', userSearch);

    /** @ngInject */
    function userSearch() {

        return {
            restrict: 'E',
            scope: {
                modelValue: '=ngModel',
                field: "@",
                isActive: "="
            },
            controller: function ($scope, AdminSettingCoPApi, $timeout,SearchApi) {

             
                $scope.Search = "";
                $scope.User = "";
                $scope.option = "Scope" + $scope.field;

                $scope.disable;
                $scope.Scope = {
                    dataTextField: "displayName",
                    dataValueField: "name",
                    filter: "contains",
                    minLength: 2,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchUser(options, $scope.modelValue);
                               // return AdminSettingCoPApi.GetAllUsers(options, $scope.modelValue);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                };

                function _onOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _onSelect(e) {
                    var index = _.findIndex($scope.modelValue, function (obj) { return obj.id == e.dataItem.name });
                    if (index == -1) {
                        if($scope.modelValue.length < 2) {
                            $scope.modelValue.push({ "id": e.dataItem.name, "displayName": e.dataItem.displayName });
                        } else {
                            alert('Maximum User is 2..')
                        }
                    }

                    $timeout(function () {
                        $('.k-clear-value').trigger('click');
                        $scope.User = "";
                    }, 500);
                };

                function _Remove(idx) {
                    $scope.modelValue.splice(idx, 1);
                };

                $scope.onOpen = _onOpen;
                $scope.onSelect = _onSelect;
                $scope.Remove = _Remove;

            },
     
            templateUrl: 'app/main/apps/cop-administration/directives/user-search.html'

        };
    }
})();
