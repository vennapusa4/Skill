(function () {
  'use strict';

  angular
    .module('app.adminReport')
    .controller('AdminReportKeywordz', AdminReportKeywordz);

  /** @ngInject */
  function AdminReportKeywordz($scope, $timeout, adminReportAPI, $window, $location, $state, InsightsCommonService) {
    var vm = this;

    $scope.showDropdown = false;
    $scope.filter = "All";
    $scope.fromDate = new Date(1, 1, 1900);
    $scope.toDate = new Date();
    $scope.defaultFilter = "year";

    $("#menu-admin-report").addClass('current');
    $scope.pageSize = 100;
    $scope.Keyword = '';
    $scope.isActive = false;
    $scope.isSearch = false;
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;



    $scope.Search = function () {
      $scope.isSearch = true;
      $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    }
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        serverFiltering: true,
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
          if ($scope.isSearch) {
            options.data.skip = 0;
            $scope.isSearch = false;
          }
          return adminReportAPI.getSearchTermWithZeroResults(options, $scope.Keyword, $scope.gridDataSource.total());
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
            searchTerm: {
              type: "string"
            },
            resultCount: {
              type: "number"
            }
          }
        }
      }
    });

    $scope.removeSearchText = function(){
      $scope.Keyword = "";
    }

    //Grid definition
    $scope.mainGridOptions = {
      pageable: {
        pageSize: $scope.pageSize,
      },
      scrollable: false,
      sortable: false,
      filterable: false,
      dataBound: function (e) {
        var view = this.dataSource.view();
        for (var i = 0; i < view.length; i++) {
          if ($scope.checkedIds[view[i].id]) {
            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
              .addClass("k-state-selected")
              .find(".checkbox")
              .attr("checked", "checked");
          }
        }
      },
      toolbar: [
       
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to Excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "Search-ZeroResults.xlsx"
      },
      excelExport: function (e) {
        var sheet = e.workbook.sheets[0];
        _.set(sheet, 'columns', [
          { width: 300, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false },
          { width: 150, autoWidth: false }
        ]);
      },
  
      dataSource: $scope.gridDataSource,
      serverFiltering: true,
      columns: [
 
        {
          field: "searchTerm",
          title: "Search Term",
        },
        {
          field: "resultCount",
          title: "Frequency",
        }
      ]
    };


  }


})();
