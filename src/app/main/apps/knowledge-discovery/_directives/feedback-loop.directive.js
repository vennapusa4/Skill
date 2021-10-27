/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('feedbackLoop', feedbackLoop);

    /** @ngInject */
    function feedbackLoop( $timeout) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
              project: '=',
              remarks: '=',
              users:'=ngModel',
              selected: '=',
              replicationselected: '=',
              repeatableselected: '=',
              showreplicationremarkerror : '=',
              showreplicatemyarearemarkerror: '=',
              ifnull: '='
            },
            controller: function ($scope, $state, $timeout,SearchApi ) {
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";

               console.log("project in feedback"+$scope.selected)
               $scope.users = [];
               $scope.initialLocation = 

               function initLocation (data) {
                   var location;
                   var title;

                   if(data) {
                       console.log(data);
                       location = [data.latitude, data.longitude];
                       title = data.title;
                   } else {
                    location = [3.1570, 101.7120];
                    title = 'KLCC';
                   }
                    window.setTimeout(function () {
                      $("#mapKDDetail").kendoMap({
                        center: location,
                        zoom: 6,
                        layers: [{
                            type: "tile",
                            urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                          subdomains: ["a", "b", "c"],
                        }],
                        markers: [{
                          location: location,
                          shape: "pinTarget",
                          tooltip: {
                              content: title,
                              showOn: "click"
                          },
                        }],
                      });
                    });
      
                    window.setInterval(function () {
                      try {
                        $("#mapKDDetail")
                          .css({ width: "100%", height: "150px" })
                          .data("kendoMap").resize();
                      } catch (e) {
      
                      }
                    }, 2000);
                }
                $scope.Search = "";
                $scope.User = "";

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
                      
                        $scope.initialLocation(e.dataItem);
                        $scope.project = e.dataItem.title;
                    }
                };
              
                $scope.Focal = {
                    dataTextField: "displayName",
                    dataValueField: "name",
                    filter: "contains",
                    minLength: 2,
                    delay: 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchUserForPointAdmin(options, $scope.users);
                               // return AdminSettingCoPApi.GetAllUsers(options, $scope.modelValue);
                            }
                        },
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                };

                function _onOpen(e) {
                    $timeout(function () {
                        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                    });
                };

                function _onSelect(e) {
                    var index = _.findIndex($scope.users, function (obj) { return obj.id == e.dataItem.id });
                    if (index == -1) {
                       
                            $scope.users.push({ "id": e.dataItem.id, "displayName": e.dataItem.displayName });
                        
                    }

                    $timeout(function () {
                        $('#user-list').parents("span").children(".k-clear-value").trigger('click');
                        $scope.User = "";
                      }, 500);
                };

                function _Remove(idx) {
                    $scope.users.splice(idx, 1);
                };

                $scope.initialLocation();

                $scope.removeError = function(input){
                    if(input == "replication"){
                        $scope.showreplicationremarkerror = false;

                    }else if(input == "repeatable"){
                        $scope.showreplicatemyarearemarkerror = false;
                    }
                }
                $scope.onOpen = _onOpen;
                $scope.onSelect = _onSelect;
                $scope.Remove = _Remove;
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/feedback-loop.html',
            
        };
    }
})();
