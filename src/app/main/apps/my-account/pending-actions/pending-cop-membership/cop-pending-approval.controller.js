(function () {
  'use strict';

  angular
      .module('app.myAccount')
      .controller('copPendingApprovalController', copPendingApprovalController);

  /** @ngInject */
  function copPendingApprovalController($state , AdminSettingCoPApi , profileAPI,$scope , $stateParams) {
      var vm = this;
      vm.pendingMemberships = [];
      $scope.CountStatus = {
        totalPendingAction: 0,
        totalPendingValidation: 0,
        totalPendingEndorsement: 0,
        totalMembershipRequest : 0
    };


    function getNotificationCount() {
      profileAPI.getPendingActionsCount().then(function (data) {
        $scope.CountStatus = data;
      });
      };
     getNotificationCount();


      AdminSettingCoPApi.GetPendingCopMembershipList().then(function (pendingApproval) {
        if (pendingApproval != null && pendingApproval.length > 0) {
         // vm.countPendingCopMembershipApproval = pendingApproval.length;
          pendingApproval.forEach(function (pending){
            vm.pendingMemberships.push(pending);
          })
         
        }
        }, function (error) {
          console.log(error);
        });

        vm.approveMembership = function(channelID){

          profileAPI.approveChannel(channelID).then(function () {
              logger.success("Request Approved Successfully");
              vm.pendingMemberships = [];
              $state.transitionTo($state.current, $stateParams, {reload: true});

              
          });

        }
        
    
  }
})();