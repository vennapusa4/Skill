(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController($scope, $state, $rootScope, $stateParams, SearchApi) {

        $scope.keyword = $stateParams.keyword;
        $scope.keywordChange = $stateParams.keyword;

        // Private methods
        function _Search() {
            // if ($scope.keywordChange != '') {
            $scope.keyword = $scope.keywordChange;
            SearchApi.AddSearchText($rootScope.keyword);

            $state.transitionTo($state.current, $.extend($stateParams, { keyword: $scope.keyword }), {
                reload: false, inherit: false, notify: false
            });
            if ($state.current.name == 'app.search.knowledgeDiscovery') {
                $rootScope.$emit("SearchKnowledgeDiscovery", { keyword: $scope.keyword });
            }
            else if ($state.current.name == 'app.search.collection') {
                $rootScope.$emit("SearchCollection", { keyword: $scope.keyword });
            }
            else if ($state.current.name == 'app.search.expertDirectory') {
                $rootScope.$emit("SearchExpertDirectory", { keyword: $scope.keyword });
            }
            // }
        }

        // Publish methods
        $scope.Search = _Search;
    }
})();