(function () {
    'use strict';

    angular
        .module('app.knowledgeManagement')
        .controller('KnowledgeManagementCollections', KnowledgeManagementCollections);

    /** @ngInject */
    function KnowledgeManagementCollections($scope, KnowledgeManagementApi, $timeout, $window, $rootScope ,  $state) {
        var vm = this;
    vm.category = [];
    vm.CopExcelData = [];

    $scope.searchfield = "";
    vm.categoryList = [];
    $scope.collections = [];

    $scope.unparentCategory ={
      "id": 0,
      "name": "Unparented Category"
    }

    KnowledgeManagementApi.getCollections().then(function (res) {
      if(res != null){
        $scope.collections = res.result;
      }
    }).catch (function(err){
    })
    ; 
    // AdminSettingCoPApi.ExportExcel().then(function (res) {
    //   res.sort(function(a, b){
    //     return a.copCategoryName.toLowerCase().localeCompare(b.copCategoryName.toLowerCase());
    //   }).forEach(function (data){
    //     vm.CopExcelData.push({"Cop Category Name": data.copCategoryName , "CoP Name": data.copName,"Number of Subscribers in General Channel": data.numberOfSubscribers,  "Number of Members in CoP Members Private Channel": data.numberOfMembers ,"Number of Active Channels in COP" : data.numberOfCopChannels, "CoP Type" : data.copType, "CoP Status" : data.copStatus} )
    //   });
    // });

    vm.collectionExport = [];
    $scope.exportAllToExcel = function () {
      if ($scope.collections.length > 0) {

        $scope.collections.forEach(function(data){
          vm.collectionExport.push({"Collection Name": data.collectionName , "Views": data.totalViewsCount, "Likes": data.totalLikesCount,  "Shares": data.totalSharesCount ,"Save" : data.totalSaveLibraryCount})

        })
      

        var mystyle = {
          headers: true,
          autoWidth: false,
          columns: [
            { title: 'Collection Name', width: 300 },
            { title: 'Views', width: 300 },
            { title: 'Likes', width: 200 },
            { title: 'Shares', width: 250 },
            { title: 'Save', width: 230 }
          ],
        };
        alasql('SELECT * INTO XLSX("Collections.xlsx",?) FROM ?', [mystyle, vm.collectionExport.sort()]);
      }

    }


    // $scope.loadComponent = function (category_id) {
    //   $rootScope.$broadcast('loadDirective', category_id);
    // }

    $scope.getSearchResults = function () {
      var grid;
      var filters = [];


      $scope.collections.forEach(function(category) {

        grid = $("#grid" + category.collectionId).data("kendoGrid")
        if ($scope.searchfield != "") {
          filters = UpdateSearchFilters(filters, "kdTitle", "contains", $scope.searchfield, "and");
          grid.dataSource.filter(filters);
          $timeout(function(){
            if ($("#grid" + category.collectionId + " table tbody tr td").length > 0) {
              $("#" + category.collectionId).addClass("in");
              $('div[href="#' + category.collectionId + '"]').attr("aria-expanded", "true");
            }
            else{
              $("#" + category.collectionId).removeClass("in");
              $('div[href="#' + category.collectionId + '"]').attr("aria-expanded", "false");
            }
          }, 500)
        }
        else {
          grid.dataSource.filter({});
        }
        if (grid.dataSource.hasChanges() === true ) {
          var recordsOnCurrentView = grid.dataSource.view().length;
          console.log(recordsOnCurrentView);
          
          if (recordsOnCurrentView > 0 && $scope.searchfield != "") {
           
            $("#" + category.collectionId).css("height", "auto")
            $("#" + category.collectionId).addClass("in");
            $("#" + category.collectionId).attr("aria-expanded", "true");
            $("#" + category.collectionId).prev().attr("aria-expanded", "true");
            $("#" + category.collectionId).prev().removeClass("collapsed");
          }
          else if (recordsOnCurrentView == 0 && $scope.searchfield != "") {
            $("#" + category.collectionId).removeClass("in");
            $("#" + category.collectionId).attr("class", "cop-collapse collapse");
            $("#" + category.collectionId).attr("aria-expanded", "false");
            $("#" + category.collectionId).prev().attr("aria-expanded", "false");
            $("#" + category.collectionId).prev().addClass("collapsed");
          }
          else if (recordsOnCurrentView > 0 && $scope.searchfield == "") {
            $("#" + category.collectionId).removeClass("in");
            $("#" + category.collectionId).attr("class", "cop-collapse collapse");
            $("#" + category.collectionId).attr("aria-expanded", "false");
            $("#" + category.collectionId).prev().attr("aria-expanded", "false");
            $("#" + category.collectionId).prev().addClass("collapsed");
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
