(function () {
    'use strict';

    angular.module('app.myAccount')
        .directive('skillInputAutocomplete', skillInputAutocomplete);

    /** @ngInject */
    function skillInputAutocomplete() {

        return {
            restrict: 'AE',
            replace: true,
            scope: {
                path: '@',
                oldDatasource: '<',
                isdisabled: '='
            },
            controller: function ($scope, $timeout, SearchApi) {
                var _scope = $scope;
                $scope.keywords = [];
                if ($scope.oldDatasource && $scope.oldDatasource.length > 0) {
                    $scope.keywords = $scope.oldDatasource;
                }

                $scope.KeywordSource = {
                    dataTextField: "name",
                    dataValueField: "id",
                    filter: "contains",
                    autoBind: false,
                    readonly: $scope.isdisabled,
                    minLength: 1,
                    dataSource: {
                        serverFiltering: false,
                        transport: {
                            read: function (options) {
                                var searchText = _scope.KeywordControl.input.val();
                                var defer = null;
                                switch (_scope.path) {
                                    case 'areaOfExpertises':
                                        defer = SearchApi.searchAreaOfExpertise(searchText);
                                        break;
                                    case 'skills':
                                        defer = SearchApi.searchSkill(searchText);
                                        break;
                                    case 'experiences':
                                        defer = SearchApi.searchExperience(searchText);
                                        break;
                                    case 'division':
                                        defer = SearchApi.searchDivision(searchText);
                                        break;
                                    case 'department':
                                            defer = SearchApi.searchDepartment(searchText);
                                            break;
                                    case 'cops':
                                        defer = SearchApi.searchCOP(searchText);
                                        break;
                                    default:
                                        break;
                                }

                                if (defer) {
                                    defer.then(function (res) {
                                        if (res) {
                                            var result = _.unionBy(_scope.keywords, res, 'id');
                                            options.success(result);
                                        }
                                    });
                                }
                            }
                        },
                    },
                    open: function (e) {
                        setTimeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        }, 100);
                    },
                };

                $scope.$on('Submit', function (event, data) {
                    data.Set($scope.path, _.map($scope.keywords, function (o) {
                        return {
                            id: o.id,
                            name: o.name,
                        };
                    }));
                });

                function _addKeyword(val) {
                    var newRandomId = -Math.floor(Math.random() * Math.floor(2147483647)); // MaxNumber of Integer
                    var selectedVal = { id: newRandomId, name: val };
                    $scope.KeywordControl.dataSource.add(selectedVal);
                    if (!_.head(_.filter($scope.keywords, function (o) { return o.id === newRandomId }))) {
                        $scope.keywords.push(selectedVal);
                    }
                };

                $timeout(function () {
                    var inputKeyword = $scope.KeywordControl.input;
                    inputKeyword.on('keydown', function (e) {
                        if (e.keyCode === 13) {
                            e.preventDefault();
                            var newKeyword = _.trim(this.value);
                            if (newKeyword) {
                                $timeout(function () {
                                    _addKeyword(newKeyword);
                                });
                            }
                        } else {
                            var newKeyword = _.trim(this.value);
                            if (newKeyword) {
                                $timeout(function () {
                                    _scope.KeywordControl.dataSource.read();
                                }, 200);
                            }
                        }
                    });

                    inputKeyword.on('focusin', function (e) {
                        e.preventDefault();
                    });
                }, 1000);
            },
            templateUrl: 'app/main/apps/my-account/_directives/skill-input-autocomplete.html',
        };
    }
})();