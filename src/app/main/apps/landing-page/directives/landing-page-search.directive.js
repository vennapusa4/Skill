/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('landingPageSearch', landingPageSearch);

    /** @ngInject */
    function landingPageSearch(SearchApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope, $rootScope, $state, $timeout) {

                $scope.keyword = '';
                $scope.SearchCategory= 'ALL';

                $scope.Source = {
                    placeholder: "What do you want to learn today?",
                    template: '#:data.text#',
                    // template: '<a href="#:data.linkUrl#">#:data.text#</a>',
                    dataTextField: "text",
                    dataValueField: "id",
                    filter: "contains",
                    groupTemplate: "#:data.slice(36)#",
                    fixedGroupTemplate: "#:data.slice(36)#",
                    minLength: 3,
                    delay : 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                //debugger;
                                //console.log(SearchApi.getSuggestions(options))
                                return SearchApi.getSuggestions(options, $scope.SearchCategory)
                            }
                        },
                        group: { field: "sortOrder" },
                        sort: {field: 'sortOrder'}
                    },
                    open: function (e) {
                        $timeout(function () {
                            $('.k-animation-container #Search-list').each(function () {
                                $(this).addClass('multiselect_panel');
                            });
                        }, 100, false);
                    },
                    select: function (e) {
                        debugger;
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
                            case "Sources":
                                SearchApi.AddSearchText(e.dataItem.text);
                                $state.go('app.SearchPage.knowledge', { docType: "All" , Sources: e.dataItem.text+","+e.dataItem.id+","+e.dataItem.uid});
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
                        $state.go('app.SearchPage.knowledge', { docType: "All" , searchKeyword : $scope.keyword });
                    }
                };

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.keyword = "";
                });
            },
            templateUrl: 'app/main/apps/landing-page/directives/landing-page-search.html',
        };
    }
})();