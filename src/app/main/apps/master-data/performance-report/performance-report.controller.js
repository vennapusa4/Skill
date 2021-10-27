(function () {
    'use strict';
  
    angular
      .module('app.performanceReport')
      .controller('PerformanceReortController', PerformanceReortController);
  
    /** @ngInject */
    function PerformanceReortController($scope, $state, $window, performanceReportAPI) {
      var vm = this;
    
      $scope.pageSize = 10;
      $scope.Keyword = '';
      $scope.isSearch = false;

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
    

      $scope.gridDataSource = new kendo.data.DataSource({
        transport: {
          read: function (options) {
             return performanceReportAPI.getAllPerformanceReportTemplates(options, $scope.Keyword);
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
              year: {
                type: "string"
              },
              typperfReportTypeNamee: {
                type: "string"
              }
            }
          }
        }
      });
  
      $scope.Search = function () {
        $scope.isSearch = true;
        $scope.gridDataSource.query({
          page: 1,
          pageSize: $scope.pageSize
        });
      }
      //Grid definition
      $scope.mainGridOptions = {
        pageable: {
          pageSize: $scope.pageSize,
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
            field: "year",
            title: "Year",
          },
          {
            field: "perfReportTypeName",
            title: "Type",
          },
          {
            title: "Action",
            template: function (dataItem) {
              return '<span class="c-icon icon-edit k-grid-edit" ng-click="viewTemplate(\''+dataItem.id+'\')"></span>';
            }
          }
        ],
      };  
      
      $scope.viewTemplate = function (typeID) {
        $state.go('appAdmin.performanceReport.performanceReportUpload', { id: typeID});
      }
    }
  
  })();
  