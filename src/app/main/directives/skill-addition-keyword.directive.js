/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillAdditionKeyword', skillAdditionKeyword);

    /** @ngInject */
    function skillAdditionKeyword($timeout) {

        return {
            restrict: 'AE',
            scope: {
                data: '='
            },
            controller: function ($scope) {
                $scope.keywords = [];

                $scope.$watch('data', function (newVal, oldVal) {
                    initKeyword();
                });

                $scope.Cancel = function () {
                    initKeyword();
                    $scope.ClosePanel();
                };

                $scope.Apply = function () {
                    $scope.data = _.join($scope.keywords, ',');
                };

                $scope.KeywordSource = {
                    dataTextField: "title",
                    dataValueField: "title",
                    valuePrimitive: true,
                    filter: "contains",
                    autoBind: true,
                    minLength: 1,
                    dataSource: [],
                    filtering: function (e) {
                        if (e.filter) {
                            if (_.endsWith(e.filter.value, ' ')) {
                                addKeyword(_.trim(e.filter.value));
                            }
                        }
                    },
                    open: function (e) {
                        e.preventDefault();
                    }
                };

                function initKeyword() {
                    if (!_.isEmpty($scope.data)) {
                        $scope.keywords = [];
                        _.forEach(_.split($scope.data, ','), function (o) {
                            addKeyword(o);
                        });
                    }
                };

                function addKeyword(val) {
                    $scope.KeywordControl.dataSource.add({ title: val });
                    if (!_.head(_.filter($scope.keywords, function (o) { return o.title === val }))) {
                        $scope.keywords.push(val);
                    }
                };

                $timeout(function () {
                    initKeyword();

                    var inputKeyword = $scope.KeywordControl.input;
                    inputKeyword.on('keydown', function (e) {
                        if (e.keyCode === 13) {
                            e.preventDefault();
                            var newKeyword = _.trim(this.value);
                            $timeout(function () {
                                addKeyword(newKeyword);
                            });
                        }
                    });

                    inputKeyword.on('focusin', function (e) {
                        e.preventDefault();
                    });
                }, 1000);
            },
            templateUrl: 'app/main/directives/skill-addition-keyword.html',
            link: function ($scope, $element) {
                $scope.ClosePanel = function () {
                    $($element).find(".k-header").click();
                }
            }
        };
    }
})();