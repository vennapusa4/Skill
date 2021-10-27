(function () {
    'use strict';
  
    angular
      .module('app.cop')
      .controller('CopDirectoryController', CopDirectoryController);
  
    /** @ngInject */
    function CopDirectoryController($scope, CoPDirectoryAPI, LandingPageAPI , UserProfileApi,$state , profileAPI) {
      var vm = this;
      $scope.firstRow = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      $scope.secondRow = ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'],
      $scope.thirdRow = ['q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      $scope.directory = [];
      vm.newarray = [];
      $scope.sortedArray = [];

      vm.alphabet;
      vm.cops = [];

      function _onInit() {
        CoPDirectoryAPI.GetCoPDirectory().then(function (res) {
          res.sort(function(a, b){
            return a.copName.toLowerCase().localeCompare(b.copName.toLowerCase());
          }).forEach(function (cop) {
            $scope.directory.push(cop);
          });

          $scope.directory.forEach(function (cop) {
            vm.cops.push(cop);
          });
          
          for(var i =0 ; i < $scope.directory.length;i++){
            vm.alphabet = $scope.directory[i].copName.charAt(0);
            $scope.sortedArray = [];
            for(var j=vm.cops.length ; j > 0 ; j--){
              if(vm.cops.length != 0){
                if(vm.alphabet.toUpperCase() == vm.cops[0].copName.charAt(0).toUpperCase()){
                  $scope.sortedArray.push(vm.cops[0]);
                  vm.cops.splice(0 , 1);
                }
              }
            }
            if($scope.sortedArray.length != 0){
              vm.newarray.push({"alphabet": vm.alphabet , "cops": $scope.sortedArray});
            }
          
          }
          $scope.checker = Math.ceil(vm.newarray.length / 3);

          $scope.firstRow = vm.newarray.slice(0, $scope.checker);
          $scope.secondRow = vm.newarray.slice($scope.checker, ($scope.checker * 2));
          $scope.thirdRow = vm.newarray.slice(($scope.checker * 2), ($scope.checker * 3));
      

        });
    }


    $scope.requestToSubscribe = function(copID){
      $scope.userInfo = UserProfileApi.getUserInfo(); 

      $scope.postData = {
        userId : $scope.userInfo.userId,
        copId: copID
       }

      LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
          $state.go('app.ProfilePage.cop', { copid: copID});
       },function (error) {
         logger.error(error);
       });
    }

    $scope.requestToUnSubscribe = function(copID){
      $scope.userInfo = UserProfileApi.getUserInfo(); 

      $scope.postData = {
        requesterId : $scope.userInfo.userId,
        copId: copID,
        channelName : "General"
       }

       profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
        $state.go('app.ProfilePage.cop', { copid: copID});
      },function (error) {
        logger.error(error);
      });
      
    }




      _onInit();
    }
  
  })();
  