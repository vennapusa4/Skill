(function () {
  'use strict';

  angular
      .module('app.abbreviation')
      .controller('AbbreviationController', AbbreviationController);

  /** @ngInject */
  function AbbreviationController($scope, $http, $timeout,$stateParams, $location, $state, $window, abbreviationAPI) {
      var vm = this;
      vm.loading = false;
      vm.id = $stateParams.id;
      console.log('id '+vm.id);
      
      $scope.abbreviation = {};
      $scope.buttonText ="Save";
    
      $scope.pageSize = 50;
      $scope.Keyword = '';
      $scope.ColumnName='Acronym';
      $scope.Filter = '';

      $scope.isSearch = false;
      $scope.isEditOptionVisible = false;
      $scope.mode;//= { editMode = false};// = "delete";

      $scope.charList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      if($location.hash()) {
        $scope.Keyword = $location.hash();
      }
      $scope.$watch('mode.editMode', function (newValue, oldValue, scope) {
        console.log('edit mode changed to '+newValue + ' from '+oldValue);
        console.log(scope);
        //$scope.$digest();
        //$scope.$apply();
      });

      var templates = [{
        "id": 1,
        "type": "Type 1",
        "year": "Template 1"
      }, {
          "id": 1,
          "type": "Type 1",
          "year": "Template 1"
      }, {
          "id": 1,
          "type": "Type 1",
          "year": "Template 1"
      }];
      $scope.abbreviationToken = "";
      $http.defaults.headers.common['AbbreviationToken'] ="";
      $scope.getToken = function(){
        abbreviationAPI.getToken().then(function (data) {
          debugger;
          $scope.abbreviationToken = data.token;
          $http.defaults.headers.common['AbbreviationToken'] = data.token;
          // $scope.loadGridData();
          $scope.gridConfig();
          //$scope.getSearchResults();

          if(vm.id){
            $scope.showMyAbbreviation();
          }
        }, function (e) {
            console.log(e);
        });
      }
      $scope.getToken();

      // $scope.gridDataSource =new kendo.data.DataSource();
      // $scope.loadGridData = function(){
        $scope.gridDataSource = new kendo.data.DataSource({
          transport: {
            read: function (options) {
               return abbreviationAPI.getAllAbbreviations(options, $scope.Keyword, $scope.ColumnName, $scope.Filter);
            }
          },
          serverFiltering: true,
          serverSorting: true,
          serverPaging: true,
          pageSize: $scope.pageSize,
          schema: {
            data: function (e) {
              return e.data;
            },
            total: "total",
            model: {
              id: "id",
              fields: {
                acronym: {
                  type: "string"
                },
                definition: {
                  type: "string"
                }
              }
            }
          }
        });
      //}
      
      $scope.typeChanged = function(){
          $scope.getSearchResults();
      }
      $scope.selectedChar = function(ch){
          $scope.Filter = ch;
          $scope.getSearchResults();
      }
      $scope.getSearchResults = function(){
        debugger;
        if($scope.abbreviationToken && $scope.abbreviationToken.length >0){
          $("#grid").data("kendoGrid").dataSource.read();
        }
      }
      $scope.Search = function () {
        $scope.isSearch = true;
        $scope.gridDataSource.query({
          page: 1,
          pageSize: $scope.pageSize
        });
      }
      //Grid definition
      $scope.gridConfig = function(){
        $scope.mainGridOptions = {
          pageable: {
            pageSize: $scope.pageSize
          },
          scrollable: false,
          sortable: false,
          filter: true,
          dataBound: function (e) {
            var view = this.dataSource.view();
          },
          toolbar: false,
          excel: {
            allPages: true,
            filterable: true,
            fileName: "PerformanceReportTemplates.xlsx"
          },
          excelExport: function (e) {
            e.preventDefault();
          },
          dataSource: $scope.gridDataSource,
          columns: [
            {
              field: "acronym",
              title: "Acronym",
              width: '15%'
            },
            {
              field: "definition",
              title: "Definition",
            },
            {
              title: "Report",
              width: '10%',
              template: function (dataItem) {
                //   console.log(dataItem);
                return '<span class="c-icon icon-edit k-grid-edit likeButton" ng-click="edit(\''+dataItem.referenceId+'\')"></span>';
              }
            }
          ],
        };  
      }
     
      $scope.addNew = function(){
          $scope.abbreviation = {};
          $scope.isEditOptionVisible = false;
          $scope.mode = {editMode : "edit"};
          $scope.buttonText ="Save";
          $('#abbreviation-modal').modal('show');
      }
     
      $scope.dtypeChanged = function(a){
         $scope.mode = {editMode : a};
      }
      
      $scope.edit = function(id){
        $scope.mode = {editMode : "edit"};
         
          abbreviationAPI.getById(id).then(function (data) {
              if (data) {
                  $scope.isEditOptionVisible = true;
                  $scope.abbreviation = {id: data.id, acronym: data.acronym, definition: data.definition, referenceId: data.referenceId};

                  $scope.buttonText ="Submit";

                 
                  $('#abbreviation-modal').modal('show');
              }
          }, function (e) {
              console.log(e);
          });
          
      }
      $scope.deleteConfirmation = function(){
          console.log('delete');
      }

      $scope.saveAbbreviation = function(){
          if($scope.isEditOptionVisible){
              if($scope.mode.editMode == "delete"){
                  //logger.info('delete');
                  vm.loading = true;
                  abbreviationAPI.deleteAbbreviations($scope.abbreviation).then(function (data) {
                      vm.loading = false;
                      $('#abbreviation-modal').modal('hide');
                      $scope.$broadcast("myabrreviationReload", true);
                      logger.info("Request for delete accepted.");
                      $scope.getSearchResults();
                  });
              }
              else{
                  //logger.info('edit');
                  if($scope.abbreviation && $scope.abbreviation.acronym && $scope.abbreviation.acronym.length > 0 && $scope.abbreviation.definition && $scope.abbreviation.definition.length >0){
                      vm.loading = true;
                      abbreviationAPI.updateAbbreviations($scope.abbreviation).then(function (data) {
                          vm.loading = false;
                          $('#abbreviation-modal').modal('hide');
                          logger.info("Request for edit accepted.");
                          $('#thankyouAdd').modal('show');
                          $scope.$broadcast("myabrreviationReload", true);
                          $scope.getSearchResults();
                      });
                  }
                  else{
                      logger.error("Please fill the mendatory fields.");
                  }
                  
              }
          }
          else{
              //debugger;
              if($scope.abbreviation && $scope.abbreviation.acronym && $scope.abbreviation.acronym.length > 0 && $scope.abbreviation.definition && $scope.abbreviation.definition.length >0){
                  vm.loading = true;
                  abbreviationAPI.saveAbbreviations($scope.abbreviation).then(function (data) {
                      vm.loading = false;
                      $('#abbreviation-modal').modal('hide');
                      $('#thankyouAdd').modal('show');
                      logger.info("Request for add new accepted.");
                      $scope.getSearchResults();
                  });
              }
              else{
                  logger.error("Please fill the mendatory fields.");
              }
          }
      }

      $scope.closeDialog = function(){
          $scope.abbreviation = {};
          $('#abbreviation-modal').modal('hide');
          $('#thankyouAdd').modal('hide');
      }
      $scope.closeDelete = function(){
          $('#abbreviation-delete-modal').modal('hide');
      }

      // $('#abbreviation-modal').on('hidden', function(){
      //   $scope.editMode = 'delete';
      //   $scope.$apply();
      // });

      $scope.showMyAbbreviation = function(){
        $scope.$broadcast("myabrreviationReload", true);
        $('#myabbreviations').modal('show');
      }
      $scope.closeMyAbbreviationDialog = function(){
        $('#myabbreviations').modal('hide');
      }

      // if(vm.id){
      //   $scope.showMyAbbreviation();
      // }

    }
  
  })();
  