/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
   'use strict';

   angular.module('app.landingPage')
       .directive('gridFiltering', gridFiltering);

   /** @ngInject */
   function gridFiltering() {

       return {
           restrict: 'E',
           scope: {
            foptions: '=',
            sorting: '='
          },
           controller: function ($scope ,$state, $location, $timeout) {
            $scope.isActive = 'list';
            var checkSorting = localStorage.getItem('peopleSorting');
                if(checkSorting !== undefined && checkSorting !== null) {
                  if(checkSorting == 'HighestContributor') {
                    $scope.selectSortby = "HighestContributor";
                  } 
                  if(checkSorting == 'HighestEngagement') {
                    $scope.selectSortby = "HighestEngagement";
                  } 
                  else {
                    $scope.selectSortby = $scope.sorting[0].id;
                  }
                    $timeout(function(){
                        localStorage.removeItem('peopleSorting');
                    }, 1000);
                } else {
                    $scope.selectSortby = $scope.sorting[0].id;
                }
                $scope.$emit('onSortingChange');
            // if($location.$$path == "/new-search/people"){
            //     if($state && $state.params.tag == "People I Follow"){
            //         $location.search({'sortBy':'HighestContributor','tags':["People I Follow"]});
            //     }
            //     else{
            //         $scope.selectSortby = "" +$scope.selectSortby;
            //         $location.search('sortBy', $scope.selectSortby);
            //     }
            //     $scope.$emit('onSortingChange');
            // }
            $scope.changeView = function(data) {
                $scope.isActive = data;
                $scope.$emit('changeView', $scope.isActive);
            }
            $scope.sortingBy = function () {
                $location.search('sortBy', $scope.selectSortby);
                $scope.$emit('onSortingChange');
            }
            $scope.changeTag = function(data) {
                if(data.value == 'All') {
                    $location.search('tags', null);
                    $scope.foptions.forEach(function(element) {
                        if(element.value != 'All') {
                            element.selected = false;
                        } else {
                            element.selected = true;
                        }
                    }); 
                    if($location.$$path === "/new-search/people"){
                        $scope.$emit('onTaggingChange');
                    }
                } else {
                    var allfinder = $scope.foptions.find(function(x) { return x.value === 'All'});
                    if(allfinder!= undefined && allfinder != null){
                        allfinder.selected = false;
                    }
                    var querybuilder = [];
                    if($location.$$path === "/new-search/people" ||$location.$$path === "/profile/edit-profile"){
                        // -----------for single select tag of filter in people page

                        // $scope.foptions.forEach(function(element) {
                        //     if(element.value != data.value) {
                        //         element.selected = false;
                        //     }
                        // });
                        var check = $scope.foptions.some(function(e){
                            return e.selected == true;
                        });
                        if(!check){
                            querybuilder.push("All");
                        }
                    }
                    $scope.foptions.forEach(function(element) {
                        if(element.value != 'All' && element.selected) {
                            querybuilder.push(element.name);
                        }
                    });
                    $location.search('tags', querybuilder);
                    $scope.$emit('onTaggingChange');
                }
            }
            var queryUrl = $location.search();
            if(queryUrl.sortBy !== undefined && queryUrl.sortBy !== null) {
                $scope.selectSortby = queryUrl.sortBy;
              }
              if(queryUrl.tags !== undefined && queryUrl.tags !== null) {
                  var isAll = $scope.foptions.find(function(x) {return x.name == 'All'});
                  if(isAll){
                    isAll.selected = false;
                  }
                  if(Array.isArray(queryUrl.tags)) {
                    queryUrl.tags.forEach(function(element) {
                        var checker = $scope.foptions.find(function(x) {return x.name == element});
                        checker.selected = true;

                    })
                  } else {
                        var checker = $scope.foptions.find(function(x) {return x.name == queryUrl.tags});
                        checker.selected = true;
                  }
              }

              
           },
           templateUrl: 'app/main/directives/grid-filtering.html'
       };
   }
})();
