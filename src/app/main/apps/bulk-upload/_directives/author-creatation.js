/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('authorCreatation', authorCreatation);

    /** @ngInject */
    function authorCreatation(SearchApi) {
        return {
            restrict: 'AE',
            scope: {
                idx: '@',
                kdid: '@',
                type: '@',
                isvalid: '=',
                getValueCreatation: '&',
            },
            controller: function ($scope, $timeout) {
                $scope.newauthor = true;

                $scope.authorID = null;
                $scope.authorName = null;
                $scope.author = {
                    dataTextField: "displayName",
                    dataValueField: "name",
                    filter: "contains",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchUser(options, []);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                    select: function (e) {
                        $scope.authorID = e.dataItem.name;
                        $scope.authorName = e.dataItem.displayName;
                    }
                };

            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/author-creatation.html',
        };
    }
})();
