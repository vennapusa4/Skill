/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillNavbarSearch', skillNavbarSearch);

    /** @ngInject */
    function skillNavbarSearch(SearchApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope, $rootScope, $state, $timeout) {

                $scope.keyword = '';

                $scope.Source = {
                    placeholder: "What do you want to learn today?",
                    template: '#:data.text#',
                    // template: '<a href="#:data.linkUrl#">#:data.text#</a>',
                    dataTextField: "text",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 4,
                    delay : 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.getSuggestions(options)
                            }
                        },
                        group: { field: "type" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            $('.k-animation-container #Search-list').each(function () {
                                $(this).addClass('multiselect_panel');
                            });
                        }, 100, false);
                    },
                    select: function (e) {

                        switch (e.dataItem.type) {
                            case "Knowledges":    //Original
                                //case "Titles":   //New Added
                                SearchApi.AddSearchText(e.dataItem.text);
                                $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: e.dataItem.id });
                                break;
                            case "Authors":
                                SearchApi.AddSearchText(e.dataItem.text);
                                $state.go('app.ProfilePage.profile', { user : e.dataItem.id });
                                break;
                            case "Projects":
                                SearchApi.AddSearchText(e.dataItem.text);
                                //$state.go('app.search.knowledgeDiscovery', { type: e.dataItem.type, id: e.dataItem.id, typetext: e.dataItem.text });
                                $state.go('app.SearchPage.knowledge', { docType: "All" , Projects: e.dataItem.text+","+e.dataItem.id+","+e.dataItem.uid});
                                break;
                            case "Equipments":
                                SearchApi.AddSearchText(e.dataItem.text);
                               // $state.go('app.search.knowledgeDiscovery', { type: e.dataItem.type, id: e.dataItem.id, typetext: e.dataItem.text });
                                $state.go('app.SearchPage.knowledge', { docType: "All" , Equipments: e.dataItem.text+","+e.dataItem.id+","+e.dataItem.uid});
                                break;
                            case "Wells":
                                SearchApi.AddSearchText(e.dataItem.text);
                              //  $state.go('app.search.knowledgeDiscovery', { type: e.dataItem.type, id: e.dataItem.id, typetext: e.dataItem.text });
                                $state.go('app.SearchPage.knowledge', { docType: "All" , Wells: e.dataItem.text+","+e.dataItem.id+","+e.dataItem.uid});
                                break;
                            case "Collections":
                                    SearchApi.AddSearchText(e.dataItem.text);
                                    $state.go('app.collectionDetail', { id: e.dataItem.id });
                                    break;
                            case "Knowledge Types":
                                SearchApi.AddSearchText(e.dataItem.text);
                                $state.go('app.SearchPage.knowledge', { docType: e.dataItem.text });
                                break;
                            case "Disciplines":
                                SearchApi.AddSearchText(e.dataItem.text);
                                $state.go('app.SearchPage.knowledge', { docType: "All" , Disciplines: e.dataItem.text+","+e.dataItem.id+","+e.dataItem.uid});
                                break;
                            default:
                                $scope.keyword = e.dataItem.text;
                                $scope.Search();
                                break;
                        }

                        // $scope.keyword = '';
                    },
                };

                $scope.Search = function () {
                    if ($scope.keyword != '') {
                        SearchApi.AddSearchText($scope.keyword);
                        $state.go('app.search.knowledgeDiscovery', { keyword: $scope.keyword });
                    }
                };

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.keyword = "";
                });
            },
            templateUrl: 'app/main/directives/skill-navbar-search.html',
        };
    }
})();