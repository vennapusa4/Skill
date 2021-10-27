(function () {
  'use strict';

  angular
    .module('app.adminSetting')
    .controller('CopAdministrationAddController', CopAdministrationAddController);

  /** @ngInject */
  function CopAdministrationAddController($scope, AdminSettingCoPApi, $window, logger, $stateParams , $rootScope , $timeout, appConfig, Utils,  $state, CoPDirectoryAPI ) {
    var vm = this;
    $scope.AllUsers = [];
    $scope.GetUsers = [];
    $scope.submitted = false;
    $scope.disableSubmit = false;
    $scope.isNew = true;
    $scope.isActiveCop = true;
    $scope.disableOwners = false;
    $scope.copCategories = [];
    $scope.processedResult;
    $scope.uploadFile= {
      "lastModified": "",
      "lastModifiedDate":"",
      "name":"",
      "extension": "",
      "size":""
      
    }
    $scope.validExtension = true;

    $scope.copObj = {
      copId: $stateParams.id,
      copCategoryID: '',
      copName: "",
      copMailNickName: "",
      copDescription: "",
      champions: [],
      leaders: [],
      secretaries: [],
      copType: '2',
      copStatus: '1',
      members: [],
      image: null,
    //  isCrossCollaborated : false,
     // copId1: "",
     // copId2:""
    }
    $scope.CoverImage = "/assets/images/cop-default-img.jpg";
    vm.cops = [];
    $scope.directory = [];
    vm.cop2List = [];
    $scope.isCop1Selected = false;
    AdminSettingCoPApi.GetAllCoPCategory().then(function (res) {
      if(res != null){
        res.forEach(function (category){
          $scope.copCategories.push(category); 
        });
      }
    }); 
    /*
      CoPDirectoryAPI.GetCoPDirectory().then(function (res) {
        res.sort(function(a, b){
          return a.copName.toLowerCase().localeCompare(b.copName.toLowerCase());
        }).forEach(function (cop) {
          $scope.directory.push(cop);
        });

        $scope.directory.forEach(function (cop) {
          vm.cops.push(cop);
        });
      });

    $scope.getSelectedValueForCOP1 = function(){
      console.log("COP1"+$scope.copObj.copId1);
      if($scope.copObj.copId1 != null){
        $scope.isCop1Selected = true;

        angular.forEach(vm.cops, function(cop, key) {
          if(cop.copId == $scope.copObj.copId1){
            console.log("cop"+cop.copName + "index"+key);
          }
          else{
            vm.cop2List.push(cop);
          }
        });

      }


    }
    */
    $scope.SaveData = function () {
      AdminSettingCoPApi.addNew($scope.copObj).then(function (data) {
         logger.success("Save successfully!");
        $timeout(function () {
          $state.go('appAdmin.copManagement.management');
        }, 2000);
      },function (error) {
        logger.error(error.data.message);
        $scope.disableSubmit = false;
      });
  }


    $scope.UpdateData = function () {
      //debugger;
      $scope.copObj.members= [];
      $scope.copObj.image = "";
      //debugger;

      AdminSettingCoPApi.update($scope.copObj).then(function (data) {
        logger.success("Updated successfully!");
        $timeout(function () {
          $state.go('appAdmin.copManagement.management');
      }, 2000);
      },function (error) {
        logger.error(error.data.message);
        $scope.disableSubmit = false;
     
      });

    }
    function _onInit() {

      if ($stateParams.id) {
        $rootScope.title = 'Edit CoP';
        $scope.isNew = false;
        AdminSettingCoPApi.getById($stateParams.id).then(function (res) {

          $scope.copObj.copId = res.copId;
          $scope.copObj.copCategoryID = res.copCategoryId;
          $scope.copObj.copName = res.copName;
          $scope.copObj.copMailNickName = res.copMailNickName
          $scope.copObj.copDescription = res.copDescription;
          $scope.copObj.copType = res.copType;
          $scope.copObj.copStatus = res.copStatus;
          $scope.copObj.image = res.image ;
        //  $scope.copObj.isCrossCollaborated = res.isCrossCollaborated,
         // $scope.copObj.copId1 = res.copId1,
          //$scope.copObj.copId2 = res.copId2
          /*
          CoPDirectoryAPI.GetCoPDirectory().then(function (res) {
            res.sort(function(a, b){
              return a.copName.toLowerCase().localeCompare(b.copName.toLowerCase());
            }).forEach(function (cop) {
              $scope.directory.push(cop);
            });
    
            $scope.directory.forEach(function (cop) {
              vm.cops.push(cop);
              if(cop.copId == $scope.copObj.copId1){
              }
              else{
                vm.cop2List.push(cop);
              }

            });
          });
          */

          if($scope.copObj.copStatus == 1){
            $scope.isActiveCop = true;
            $scope.disableOwners = false;

            if(res.champions != null){
              res.champions.forEach(function (champion) {
                $scope.copObj.champions.push(champion);
              });
            }
            if(res.leaders != null){
              res.leaders.forEach(function (leaders) {
                $scope.copObj.leaders.push(leaders);
              });
            }
            if(res.secretaries != null){
              res.secretaries.forEach(function (secretary) {
                $scope.copObj.secretaries.push(secretary);
              });
            }
            if(res.members != null){
              res.members.forEach(function (member) {
                $scope.copObj.members.push(member);
              });
            }
         
          }
          else{
            $scope.isActiveCop = false;
            $scope.disableOwners = true;
          }
  

        },function (error) {
          console.log(error);
        });
      }
      else {
        $scope.isNew = true;
        $scope.disableOwners = false;
       
      }

  
    }

     $scope.openFile = function(event) {
      
    
        var input = event.target;
        var reader = new FileReader();
        var filename = input.files[0].name.split('.');
        $scope.uploadFile.name = filename[0];
        $scope.uploadFile.extension = "."+filename[1];
        $scope.uploadFile.size = input.files[0].size ;

           var obj = Utils.validateFile($scope.uploadFile, appConfig.allowImageExtension);
     
          if (obj.extension && obj.size) {
            reader.onload = function(){
              var result = reader.result;
              var indexOfFirstPart = result.indexOf(',') + 1;
              $scope.processedResult = result.substr(indexOfFirstPart, result.length);
              $scope.copObj.image = $scope.processedResult;
              $scope.CoverImage = "";
              $scope. $apply();
            };
            reader.readAsDataURL(input.files[0]);
            
            $scope.validExtension = true;
           
          }
          else{
            $scope.validExtension = false;
          }
    };

    function _Submit(isValid) {

      if (isValid) {
        $scope.submitted = true;
        if($scope.copObj.image == null){
          //1. Convert Default Image into Base64 and Aassign to copObj.image
        $scope.copObj.image = appConfig.defaultCoPCoverImageBase64;
        }
  
        if($scope.copObj.copStatus == 2){
          var inactiveAlert = $window.confirm("You are about to Inactive the Cop, this action can not be undone. Are you sure you want to deactivate it?");
          if(inactiveAlert == true){
            if ($scope.copObj.copStatus != 2 && $scope.copObj.champions.length != 0 && $scope.copObj.leaders.length != 0 && $scope.copObj.secretaries.length != 0) {
              $scope.disableSubmit = true;
              event.preventDefault();
              if ($stateParams.id) {
                $scope.UpdateData();
              }
              else {
                   $scope.SaveData();
              }
            }
            else if($scope.copObj.copStatus == 2)
            {
              $scope.copObj.champions = [];
              $scope.copObj.leaders = [];
              $scope.copObj.secretaries = [];
              //InActive will always in Edit Mode
              $scope.UpdateData();
          
            } 
          }
        }
        else{
          if ($scope.copObj.copStatus != 2 && $scope.copObj.champions.length != 0 && $scope.copObj.leaders.length != 0 && $scope.copObj.secretaries.length != 0) {
            $scope.disableSubmit = true;
            event.preventDefault();
            if ($stateParams.id) {
              $scope.UpdateData();
            }
            else {
                 $scope.SaveData();
            }
          }
          else if($scope.copObj.copStatus == 2)
          {
            $scope.copObj.champions = [];
            $scope.copObj.leaders = [];
            $scope.copObj.secretaries = [];
            //InActive will always in Edit Mode
            $scope.UpdateData();
        
          } 
        }
      }


    }
    
    _onInit();
    $scope.OnInit = _onInit;
    $scope.Submit = _Submit;

    $scope.changedValue = function(value) {
     

      if(value == 2){
       // $scope.copObj.champions = [];
        //$scope.copObj.leaders = [];
       // $scope.copObj.secretaries = [];
        $scope.isActiveCop = false;
        $scope.disableOwners = true;
        $scope.$broadcast("changeDisableState",$scope.disableOwners);
      }
      else{
        $scope.isActiveCop = true;
        $scope.disableOwners = false;
        $scope.$broadcast("changeDisableState",$scope.disableOwners);
      }
    }

    $scope.removeImage = function(){
      if( $scope.copObj.image != "" || $scope.copObj.image != null ){
        $scope.copObj.image = null;
        $scope.processedResult = null;
        $scope.validExtension = true;
        $scope.CoverImage = "/assets/images/cop-default-img.jpg";
        document.getElementById("inputFileToLoad").value = "";
      }     
    }



  }



})();
