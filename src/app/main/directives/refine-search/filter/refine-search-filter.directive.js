/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';
 
    angular.module('app.SearchPage')
        .directive('refineSearchFilter', refineSearchFilter);
 
    /** @ngInject */
    function refineSearchFilter() {
 
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                sorting: '=',
                location : "=",
                view: '='
           },
            controller: function ($scope , $location) {
             $scope.isActive = 'list';
             $scope.showViews = true;

             if($location.$$path == '/new-search/collection' || $location.$$path == '/new-search/media') {
                $scope.showViews = false;
             }

             if($location.$$url == '/new-search/knowledge?docType=Technical%20Alerts') {
                for(i = 0 ; i < $scope.filter.length; i++){
                    if($scope.filter[i].value == "Validated"){
                        $scope.filter.splice(i,1);
                    }
                }
                
             }
             
             console.log($location.$$path);
             $scope.displayMap = false;
             if($scope.view) {
                $scope.isActive = $scope.view;
            }
            if($scope.sorting.length > 0) {
                 $scope.selectSortby = $scope.sorting[0].id;
            }
 
             $scope.changeView = function(data) {
                 $scope.isActive = data;
                 $scope.$emit('changeView', $scope.isActive);
             }
             $scope.sortingBy = function () {
                 $location.search('sortBy', $scope.selectSortby); 
                 $scope.$emit('onSortingChange');
             }
             $scope.showMap=function(){
                 if($scope.displayMap)
                 {
                     $scope.displayMap=false;
                 }
                 else
                 {
                    $scope.displayMap=true;
                 }
             }
             $scope.changeTag = function(element) {
            
                        if(element.name == 'All') {
                            $scope.filter.forEach(function(element) {
                                if(element.value != 'All') {
                                    element.selected = false;
                                } else {
                                    element.selected = true;
                                }
                            });
                            $location.search('isEndorsed', null);
                            $location.search('isValidated', null);
                            $location.search('withVideo', null);
                            $location.search('withAudio', null);
                            $location.search('withValue', null);
                            $location.search('withReplication', null);
                            $scope.$emit('onAdditionalFilterChange');
                        } else {
                            if(element.name == "Endorsed"){
                                if(element.selected) {
                                    $location.search('isEndorsed', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('isEndorsed', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                             }
                             if(element.name == "Validated"){
                                if(element.selected) {
                                    $location.search('isValidated', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('isValidated', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                             }
                             else if(element.value == "WithVideo")
                             {
                                if(element.selected) {
                                    $location.search('withVideo', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('withVideo', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                    
                             }
                             else if(element.value == "WithAudio")
                             {
                                if(element.selected) {
                                    $location.search('withAudio', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('withAudio', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                             }
                             else if(element.value == "WithValue")
                             {
                                if(element.selected) {
                                    $location.search('withValue', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('withValue', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                             }
                             else if(element.value == "WithReplication")
                             {
                                if(element.selected) {
                                    $location.search('withReplication', false);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                                else{
                                    $location.search('withReplication', true);
                                    $scope.$emit('onAdditionalFilterChange');
                                }
                            }
                            var counter = 0;
                            $scope.filter.forEach(function(element) {
                                if(element.value != 'All') {
                                    if(element.selected == true) {
                                        counter = counter + 1;
                                    }

                                } 
                            });
                            if(counter > 0) {
                                $scope.filter.forEach(function(element) {
                                    if(element.value == 'All') {
                                        element.selected = false;
                                    }
                                });
                            } else {
                                $scope.filter.forEach(function(element) {
                                    if(element.value == 'All') {
                                        element.selected = true;
                                    }
                                });
                            }
                        }   
  
             }

             var queryUrl = $location.search();
             if(queryUrl.sortBy !== undefined && queryUrl.sortBy !== null) {
                 $scope.selectSortby = queryUrl.sortBy;
               }
               if(queryUrl.filter !== undefined && queryUrl.filter !== null) {

                   if(Array.isArray(queryUrl.filter)) {
                     queryUrl.filter.forEach(function(element) {
                         var checker = $scope.filter.find(function(x) {return x.name == element});
                         checker.selected = true;
 
                     })
                   } else {
                         var checker = $scope.filter.find(function(x) {return x.name == queryUrl.filter});
                         checker.selected = true;
                   }
               } else{
                   //Setting Default Value
               // var checker = $scope.filter.find(function(x) {return x.selected == true});
                //checker.selected = true;

      
                    //  $scope.filter.forEach(function(element) {
                    //     if(element.value == "Endorsed"){
                    //         if(element.selected) {
                    //             $location.search('isEndorsed', true);
                    //         }
                    //         else{
                    //             $location.search('isEndorsed', false);
                    //         }
                    //      }
                    //      else if(element.value == "WithVideo")
                    //      {
                    //         if(element.selected) {
                    //             $location.search('withVideo', true);
                    //         }
                    //         else{
                    //             $location.search('withVideo', false);
                    //         }
                
                    //      }
                    //      else if(element.value == "WithAudio")
                    //      {
                    //         if(element.selected) {
                    //             $location.search('withAudio', true);
                    //         }
                    //         else{
                    //             $location.search('withAudio', false);
                    //         }
                    //      }
                    //      else if(element.value == "WithValue")
                    //      {
                    //         if(element.selected) {
                    //             $location.search('withValue', true);
                    //         }
                    //         else{
                    //             $location.search('withValue', false);
                    //         }
                    //      }
                    //      else if(element.value == "WithReplication")
                    //      {
                    //         if(element.selected) {
                    //             $location.search('withReplication', true);
                    //         }
                    //         else{
                    //             $location.search('withReplication', false);
                    //         }
                    //     }
                    //  });
                    
                    //  $location.search('sortBy', $scope.selectSortby); 
              
               }
               if(queryUrl.withReplication !== undefined) {
                $scope.filter.forEach(function(element) {
                    if(element.value == 'All') {
                        element.selected = false;
                    }
                    if(element.value == 'WithReplication') {
                        element.selected = true;
                    }
                });
               }
               if(queryUrl.withValue !== undefined) {
                $scope.filter.forEach(function(element) {
                    if(element.value == 'All') {
                        element.selected = false;
                    }
                    if(element.value == 'WithValue') {
                        element.selected = true;
                    }
                });
               }
               if(queryUrl.isEndorsed !== undefined) {
                $scope.filter.forEach(function(element) {
                    if(element.value == 'All') {
                        element.selected = false;
                    }
                    if(element.value == 'Endorsed') {
                        element.selected = true;
                    }
                });
               }

            },
            templateUrl: 'app/main/directives/refine-search/filter/refine-search-filter.html'
        };
    }
 })();
 