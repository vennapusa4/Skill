(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .controller('KnowledgeDiscoveryController', KnowledgeDiscoveryController);

    /** @ngInject */
    function KnowledgeDiscoveryController($scope, $state, $window, KnowledgeDiscoveryApi, KnowledgeDocumentApi) {
        var vm = this;

        $scope.arrSortby = [{ value: 'Valuerealize', label: 'Value Realized' }, { value: 'MostView', label: 'Most View' }];
        $scope.selectSortby = $scope.arrSortby[0];
        $scope.sortBy = $scope.selectSortby.value;
        $scope.canvasOptions = {
            elementId: "myCanvas",
            width: 135,
            height: 50
        };
        $scope.contributions = {};

        //summary
        $scope.summary = {
            totalKnowledgeDocumentCount: 0,
            totalContributorsCount: 0,
            totalLocationsCount: 0,
            contributions: [],
            currentYear: (new Date()).getFullYear(),
        };
        KnowledgeDocumentApi.summary().then(function (data) {
            $scope.summary = data;
            $scope.summary.currentYear = (new Date()).getFullYear();
            $scope.contributions = _.map(data.contributions, function (o) { return { name: o.monthName, value: o.monthContributionsCounteach, year: o.year } });
            //_.map($scope.summary.contributions, function (item) {
            //    $scope.chartDatas[item.monthName] = item.monthContributionsCounteach;
            //});
            //ChartService.draw($scope.canvasOptions, chartDatas);
        });
        //end summary

        //Most Engaging
        $scope.mostEngaged = {
            kdId: 0,
            kdTitle: "",
            kdTypeName: "",
            disciplineName: "",
            contributorName: "",
            contributorImageUrl: "",
            commentCount: 0,
            shareCount: 0,
            totalLikesCount: 0,
            totalSaveLibraryCount: 0,
        };
        KnowledgeDiscoveryApi.mostEngaged().then(function (data) {
            $scope.mostEngaged = data;
        });

        //This Just In
        $scope.latest = {
            kdId: 0,
            kdTitle: "",
            kdTypeName: "",
            disciplineName: "",
            contributorName: "",
            contributorImageUrl: "",
            totalLikesCount: 0,
            totalSaveLibraryCount: 0,
            totalCommentCount: 0,
            totalShareCount: 0,
        };
        KnowledgeDocumentApi.latest().then(function (data) {
            $scope.latest = data;
        });

        // this is contributors
        $scope.contributors = { knowledgeDiscoveryData: [] };
        KnowledgeDocumentApi.contributors().then(function (data) {
            $scope.contributors.knowledgeDiscoveryData = data;
        });

        //Layout
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

        if ($state.current.name === 'app.knowledgeDiscovery') {
            $state.go('app.knowledgeDiscovery.allKnowledge', {});
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
