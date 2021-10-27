/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('pendingActions', pendingActions);

    /** @ngInject */
    function pendingActions() {

        return {
            restrict: 'E',
            scope: {
            },
            controller: function ($scope,  profileAPI) {
                var vm = this;
                $scope.isShowNotification = false;

                $scope.task = {
                    totalMembershipRequest: 0,
                    totalPendingAction: 0,
                    totalPendingEndorsement: 0,
                    totalPendingValidation: 0
                };
                $scope.events = [];

                $scope.closing = function(){
                    $scope.task = {
                        totalMembershipRequest: 0,
                        totalPendingAction: 0,
                        totalPendingEndorsement: 0,
                        totalPendingValidation: 0
                    };
                }

                $scope.closingEvent = function () {
                    $scope.events = [];
                }

                profileAPI.getPendingActionsCount().then(function (data) {
                      if(data && data.totalPendingAction){
                        $scope.task = data;
                        $scope.isShowNotification = true;
                      }
                  });
                profileAPI.getUpcomingEvents().then(function (res) {
                    if (res != null || res != "") {
                        res.forEach(function (event) {
                            var splitter = event.startDate.split("/");
                            var newDate = splitter[1] + '/' + splitter[0] + '/' + splitter[2];
                            event.actualDate = new Date(newDate);
                            $scope.events.push(event);
                        });
                        $scope.events = $scope.events.sort(function(a, b) {
                           return a.actualDate - b.actualDate; 
                        });
                        console.log($scope.events);
                    }
                });

            },
            templateUrl: 'app/main/apps/profile-page/directives/pending-actions.html'
            
        };
    }
})();
