(function () {
  'use strict';

  angular
    .module('app.adminSetting')
    .controller('CopAdministrationController', CopAdministrationController);

  /** @ngInject */
  function CopAdministrationController($scope, AdminSettingCoPApi, $window, $rootScope ,  $state) {
    var vm = this;
    vm.category = [];
    vm.CopExcelData = [];

    $scope.searchfield = "";
    vm.categoryList = [];

    $scope.unparentCategory ={
      "id": 0,
      "name": "Unparented Category"
    }

    AdminSettingCoPApi.GetAllCoPCategory().then(function (res) {
      if(res != null){
        res.forEach(function (category){
          vm.categoryList.push(category); 
        });
        vm.categoryList.push($scope.unparentCategory); 
      }
    }); 
    AdminSettingCoPApi.ExportExcel().then(function (res) {
      res.sort(function(a, b){
        return a.copCategoryName.toLowerCase().localeCompare(b.copCategoryName.toLowerCase());
      }).forEach(function (data){
        vm.CopExcelData.push({"Cop Category Name": data.copCategoryName , "CoP Name": data.copName,"Number of Subscribers in General Channel": data.numberOfSubscribers,  "Number of Members in CoP Members Private Channel": data.numberOfMembers ,"Number of Active Channels in CoP" : data.numberOfCopChannels, "CoP Type" : data.copType, "CoP Status" : data.copStatus} )
      });
    });


    $scope.exportAllToExcel = function () {
      if (vm.CopExcelData.length > 0) {
        var mystyle = {
          headers: true,
         
          columns: [
            { title: 'CoP Category', width: 300 },
            { title: 'CoP Name', width: 300 },
            { title: 'Number of Memebrs', width: 200 },
            { title: 'Number of Subscribers in General Channel', width: 250 },
            { title: 'Number of Active Channel', width: 230 },
            { title: 'CoP Type', width: 120 },
            { title: 'Cop Status', width: 120 },
          ],
        };
        alasql('SELECT * INTO XLSX("COP.xlsx",?) FROM ?', [mystyle, vm.CopExcelData.sort()]);
      }

    }


    $scope.loadComponent = function (category_id) {
      $rootScope.$broadcast('loadDirective', category_id);
    }

    $scope.getSearchResults = function () {
      var grid;
      var filters = [];


      vm.categoryList.forEach(function(category) {

        grid = $("#grid" + category.id).data("kendoGrid")
        if ($scope.searchfield != "") {
          filters = UpdateSearchFilters(filters, "copName", "contains", $scope.searchfield, "and");
          grid.dataSource.filter(filters);
        }
        else {
          grid.dataSource.filter({});
        }

        if (grid.dataSource.hasChanges() === true ) {
          var recordsOnCurrentView = grid.dataSource.view().length;
          
          if (recordsOnCurrentView > 0 && $scope.searchfield != "") {
           
            $("#" + category.id).css("height", "auto")
            $("#" + category.id).addClass("in");
            $("#" + category.id).attr("aria-expanded", "true");
            $("#" + category.id).prev().attr("aria-expanded", "true");
            $("#" + category.id).prev().removeClass("collapsed");
          }
          else if (recordsOnCurrentView == 0 && $scope.searchfield != "") {
            $("#" + category.id).removeClass("in");
            $("#" + category.id).attr("class", "cop-collapse collapse");
            $("#" + category.id).attr("aria-expanded", "false");
            $("#" + category.id).prev().attr("aria-expanded", "false");
            $("#" + category.id).prev().addClass("collapsed");
          }
          else if (recordsOnCurrentView > 0 && $scope.searchfield == "") {
            $("#" + category.id).removeClass("in");
            $("#" + category.id).attr("class", "cop-collapse collapse");
            $("#" + category.id).attr("aria-expanded", "false");
            $("#" + category.id).prev().attr("aria-expanded", "false");
            $("#" + category.id).prev().addClass("collapsed");
          }
        } 
        else{

        }
      });

   

    }

    function UpdateSearchFilters(filters, field, operator, value, logic) {
      var newFilter = { field: field, operator: operator, value: value };

      if (filters.length == 0) {
        filters.push(newFilter);
      }
      else {
        var isNew = true;
        var index = 0;

        for (index = 0; index < filters.length; index++) {
          if (filters[index].field == field && filters[index].operator == operator) {
            isNew = false;
            break;
          }
        }

        if (isNew) {
          filters.push(newFilter);
        }
        else {
          filters[index] = newFilter;
        }
      }

      return filters;
    }

  }

})();
