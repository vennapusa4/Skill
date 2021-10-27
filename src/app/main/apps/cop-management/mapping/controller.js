(function () {
  'use strict';

  angular
    .module('app.copManagement')
    .controller('AdminCopMappingController', AdminCopMappingController);

  /** @ngInject */
  function AdminCopMappingController($scope, $timeout, AdminSettingCoPApi, KnowledgeDiscoveryApi, $state) {

    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
    $scope.activeCoPList = [];
    $scope.activeCoPList = [];
    $scope.inactiveCoPList = [];

    $scope.copStatus = true;
    $scope.getCoPlist = function(){
      AdminSettingCoPApi.GetMappingCOPs().then(function (coplist) {
        coplist.forEach(function(cop){
          if(cop.isActive){
            $scope.activeCoPList.push({name : cop.name , copId : cop.copId ,isActive : cop.isActive , selected:false });
          }
          else{
            $scope.inactiveCoPList.push({name : cop.name , copId : cop.copId ,isActive : cop.isActive , selected:false });
          }
        });
        $scope.activeCoPList = $scope.activeCoPList.sort(compare);
        $scope.inactiveCoPList = $scope.inactiveCoPList.sort(compare);
        
     },function (error) {
       logger.error(error);
     });
    }
    $scope.getCoPlist();
    $scope.showCoPList = function(){
      $scope.CoPList = null;
      if($scope.copStatus == true){
        $scope.CoPList = $scope.activeCoPList;
        $scope.activeCoPList.forEach(function(activeCop){
          activeCop.selected = false;
        });
      } else{
        $scope.CoPList = $scope.inactiveCoPList;
        $scope.inactiveCoPList.forEach(function(inactiveCop){
          inactiveCop.selected = false;
        });
      }
    }

    function compare(a, b) {
      const bandA = a.name.toUpperCase();
      const bandB = b.name.toUpperCase();
    
      var comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    function compareDiscipline(a, b) {
      const bandA = a.disciplineName.toUpperCase();
      const bandB = b.disciplineName.toUpperCase();
    
      var comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    $scope.showCoPList();
    $scope.selectedIndex = '';
    $scope.selectedCoP = '';
    $scope.selectedCoPID = '';
    $scope.selectedDiscipline = [];

    $scope.switchCop = function (index, cop) {
     
      $scope.selectedIndex = index;
      $scope.selectedCoP = cop
      $scope.selectedCoPID = cop.copId;
      $scope.unselectedSubDiscipline = [];
      if($scope.copStatus == true){
        $scope.activeCoPList.forEach(function(activeCop){
          activeCop.selected = false;
        });
        $scope.activeCoPList[index].selected = true;

      }
      else{
        $scope.inactiveCoPList.forEach(function(activeCop){
          activeCop.selected = false;
        });
        $scope.inactiveCoPList[index].selected = true;

      }

      //getMappedDisciplines

      $scope.selectedDiscipline = [];
      $scope.selectedSubDiscipline = [];
      $scope.selectedDisciplineID = [];
      $scope.unselectedDiscipline = [];
      $scope.allDisciplines = [];

      AdminSettingCoPApi.GetMappedDisciplines(cop.copId).then(function (disciplines) { 
        $scope.selectedDiscipline = [];
        disciplines.forEach(function(discipline){

          $scope.allDisciplines.push(discipline);

          if(discipline.isChecked){
            $scope.selectedDiscipline.push({name : discipline.name , disciplineId : discipline.disciplineId ,isChecked : discipline.isChecked  });
          }
          else{
            $scope.unselectedDiscipline.push({name : discipline.name , disciplineId : discipline.disciplineId ,isChecked : discipline.isChecked });
          }
        });
        $scope.selectedDiscipline = $scope.selectedDiscipline.sort(compare);
        $scope.unselectedDiscipline = $scope.unselectedDiscipline.sort(compare);
        $scope.subDisciplines = [];
        $scope.selectedDiscipline.forEach(function(discipline){
            $scope.selectedDisciplineID.push(discipline.disciplineId);          
        });
        AdminSettingCoPApi.GetMappedSubDiscipline(cop.copId, $scope.selectedDisciplineID).then(function (subdisciplines) {  
          $scope.selectedSubDiscipline = [];
          $scope.newsubDiscipline  = [];
          subdisciplines.forEach(function(subdiscipline){
             $scope.selectedSubDiscipline.push({subDisciplineId : subdiscipline.subDisciplineId , name: subdiscipline.name , disciplineId : subdiscipline.disciplineId ,disciplineName : subdiscipline.disciplineName ,isChecked : subdiscipline.isChecked });
          });
          $scope.subDisciplines = [];
          $scope.newsubDiscipline  = [];
         $scope.subDisciplines = $scope.selectedSubDiscipline.reduce(function (r, a) {
              r[a.disciplineName] = r[a.disciplineName] || [];
              r[a.disciplineName].push(a);
              return r;
          }, Object.create(null));

          $scope.subDisciplines = Object.keys($scope.subDisciplines).sort().reduce(
            function(obj, key){ 
              obj[key] = $scope.subDisciplines[key]; 
              return obj;
            }, 
            {}
          );
          for(var key in $scope.subDisciplines) {
            $scope.subDisciplines[key] = $scope.subDisciplines[key].sort(compare);
          }

       
      })
         
    });

  

  }

$scope.unselectedSubDiscipline = []
$scope.newDisciplineId = [];
$scope.newsubDiscipline = [];
$scope.onDisciplineSelected = function(discipline){
  
  $scope.newDisciplineId.push( discipline.disciplineId);

  if(discipline.isChecked == true){

    AdminSettingCoPApi.GetMappedSubDiscipline($scope.selectedCoPID,$scope.newDisciplineId).then(function (newsubdisciplines) {  
     // $scope.unselectedSubDiscipline = [];
      newsubdisciplines.forEach(function(subdiscipline){
          $scope.unselectedSubDiscipline.push({subDisciplineId : subdiscipline.subDisciplineId , name: subdiscipline.name , disciplineId : subdiscipline.disciplineId ,disciplineName : subdiscipline.disciplineName ,isChecked : subdiscipline.isChecked });
      });

      $scope.newsubDiscipline = $scope.unselectedSubDiscipline.reduce(function (r, a) {
        r[a.disciplineName] = r[a.disciplineName] || [];
        r[a.disciplineName].push(a);
        return r;
    }, Object.create(null));

    console.log($scope.newsubDiscipline);
    $scope.newDisciplineId = [];
    });
  }
  else{
    $scope.subDisciplineToRemove = [];
    AdminSettingCoPApi.GetMappedSubDiscipline($scope.selectedCoPID,$scope.newDisciplineId).then(function (newsubdisciplines) {  
           
      newsubdisciplines.forEach(function(subDiscipline){

        $scope.subDisciplineToRemove.push({
          "subDisciplineId": subDiscipline.subDisciplineId,
          "name": subDiscipline.name,
          "isChecked": false,
          "disciplineId":subDiscipline.disciplineId,
          "disciplineName": subDiscipline.disciplineName,
          "copId": $scope.selectedCoPID
        }) 

        });

        $scope.postData =  $scope.subDisciplineToRemove

        AdminSettingCoPApi.MapCopDiscipline($scope.postData ).then(function (data) {  
          if(data.result){
            $scope.selectedSubDiscipline = [];
            $scope.unselectedDiscipline = [];
            $scope.switchCop($scope.selectedIndex ,$scope.selectedCoP );
          }
        },function (error) {
          logger.error(error);
        });

    });  
  }
}

$scope.onSubDisciplineSelected = function(subDiscipline){

 // if(subDiscipline.isChecked){
    $scope.postData = [
      {
        "subDisciplineId": subDiscipline.subDisciplineId,
        "name": subDiscipline.name,
        "isChecked": subDiscipline.isChecked,
        "disciplineId": subDiscipline.disciplineId,
        "disciplineName": subDiscipline.disciplineName,
        "copId": $scope.selectedCoPID
      }
    ]
    AdminSettingCoPApi.MapCopDiscipline($scope.postData ).then(function (data) {  
      if(data.result){
        logger.success("Saved Successfully");
        $scope.selectedDiscipline = [];
        $scope.selectedSubDiscipline = [];
        $scope.unselectedDiscipline = [];

        $scope.switchCop($scope.selectedIndex ,$scope.selectedCoP );
      }
      
    },function (error) {
      logger.error(error);
    });
  //}
  //else{
    // $scope.postData = [
    //   {
    //     "subDisciplineId": subDiscipline.subDisciplineId,
    //     "name": subDiscipline.name,
    //     "isChecked": false,
    //     "disciplineId": subDiscipline.disciplineId,
    //     "disciplineName": subDiscipline.disciplineName,
    //     "copId": $scope.selectedCoPID
    //   }
    // ]
    // AdminSettingCoPApi.MapCopDiscipline($scope.postData ).then(function (data) {  
    //   if(data.result){
    //     logger.success("Saved Successfully");
    //     $scope.selectedDiscipline = [];
    //     $scope.selectedSubDiscipline = [];
    //     $scope.unselectedDiscipline = [];
    //     $scope.switchCop($scope.selectedIndex ,$scope.selectedCoP );
    //   }
    // },function (error) {
    //   logger.error(error);
    // });
  //}
 
}

$("#menu-cop-management").addClass('current');
$scope.exportToExcel = function(){

  $scope.dataToExport = [];
  $scope.exportSubDiscipline = [];
  $scope.exportDiscipline = [];
  $scope.exportedselectedDisciplineID = [];
  $scope.exporteddiscipline = "" ;
  $scope.subDiscipline = "";

  AdminSettingCoPApi.getMappedDataForExport().then(function (coplist) {

    coplist.forEach(function(cop){
      $scope.dataToExport.push({"Cop Name": cop.name , "CoP Status": cop.copStatus,"Discipline": cop.discipline,  "Sub Discipline": cop.subDiscipline} )
      
    });
    if ($scope.dataToExport.length > 0) {
      var mystyle = {
        headers: true,
       
        columns: [
          { title: 'CoP Name', width: 300 },
          { title: 'CoP Status', width: 200 },
          { title: 'Discipline', width: 250 },
          { title: 'SubDisciplines', width: 230 }
        ],
      };
      alasql('SELECT * INTO XLSX("COP.xlsx",?) FROM ?', [mystyle, $scope.dataToExport.sort()]);
    }

  },function (error) {
    logger.error(error);
  });
  }


}

})();
