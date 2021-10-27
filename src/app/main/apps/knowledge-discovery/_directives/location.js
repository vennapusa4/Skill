/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('locationInfo', locationInfo);

    /** @ngInject */
    function locationInfo(SearchApi) {
        return {
            restrict: 'AE',
            scope: {},
            controller: function ($scope, $timeout) {

              $scope.Questions = {};
              $scope.selectedFromList = false;
              $scope.showLocationError = false;
              $scope.locationId = null;
              $scope.location = null;
              $scope.Questions.locationMessage = $scope.$parent.Questions.locationMessage;              

              $scope.$on('changeQuestionsLanguage', function (event, data) {
                $scope.Questions.locationMessage = $scope.$parent.Questions.locationMessage;
              });
              
              $scope.validateLocation = function(){
                  if($scope.selectedFromList == true){
                    $scope.$emit("validateLocation" , $scope.locationId);
                  }
                  else{
                      if($scope.location == "" || $scope.location == null){
                        $scope.locationId = "";
                        $scope.$emit("validateLocation" ,$scope.locationId);
                      }
                   
                  }
                  $scope.selectedFromList = false;
              }
                
           

                $scope.Source = {
                    dataTextField: "title",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchLocation(options);
                            }
                        },
                        group: { field: "group" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                        });
                    },
                    select: function (e) {
                        $scope.selectedFromList = true;
                        $scope.locationId = e.dataItem.id;
                        
                    },
                    change: function (e) {
                        if($scope.selectedFromList == true){
                            $scope.$emit("validateLocation" , $scope.locationId);
                          }
                          else{
                            $scope.locationId = "";
                            $scope.$emit("validateLocation" ,$scope.locationId);
                          }
                          $scope.selectedFromList = false;                    
                    },
                };

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.locationId = data.Get('locationId');
                    
                    if ($scope.locationId !== null) {
                        $scope.location = _.head(_.filter(data.Get('locations'), ['id', $scope.locationId])).locationName;
                    }
                       $timeout(function () {
                        $scope.$emit("validateLocation" , $scope.locationId);
                      }, 2000);
                    offGet();
                });

                $scope.$on('Submit', function (event, data) {
               
                    data.Set('locationId', $scope.locationId);
                });
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/location.html',
        };
    }
})();
