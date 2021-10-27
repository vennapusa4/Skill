(function () {
  'use strict';

  angular
    .module('app.adminReport')
    .controller('AdminReportKeywordf', AdminReportKeywordf);

  /** @ngInject */
  function AdminReportKeywordf($scope, $timeout, KeywordApi, $window, InsightsCommonService) {
    var vm = this;

    $scope.showDropdown = false;
    $scope.filter = "All";
    $scope.fromDate = new Date(1, 1, 1900);
    $scope.toDate = new Date();
    $scope.defaultFilter = "year";

    $("#menu-admin-report").addClass('current');
    $scope.pageSize = 10;
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
          KeywordApi.getAll(options, $scope.Keyword ,$scope.gridDataSource.total() );
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          MasterDataGameMechanicsApi.deleteChallenge({ id: e.data.id }).then(function (data) {
            if (data.result) {
              $scope.gridDataSource.read();
            } else {
              e.error();
            }
          }, function () {
            e.error();
          });
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
            name: { type: "string" },
            totalKnowledge: { type: "number" },
            sumLessonsLearnt: { type: "number" },
            sumBestPractises: { type: "number" },
            sumPublication: { type: "number" }
          }
        }
      }
    });

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
        // {
        //   name: "create",
        //   iconClass: "c-icon icon-new",
        //   text: "Add New"
        // },
        // "edit",
        // "delete",
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to Excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "KeywordSearchFrequent.xlsx"
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
          title: 'Select All',
          headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
          template: function (dataItem) {
            return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
          },
          width: "30px",
          attributes: {
            "class": "check_cell",
          },
        },
        {
          field: "name",
          title: "Keywords Name",
        },
        {
          field: "count",
          title: "Total number of search",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,1)'>" + dataItem.count + "</span>";
          }
        },
      ]
    };

    $scope.editItem = function (itemId) {
      $state.go('appAdmin.gameMechanicsAdmin.challengeBuild', { id: itemId });
    }

    $scope.checkItem = function (data) {
      if (data.CheckItem) {
        $scope.checkedIds[data.id] = data.id;
        $scope.selectItemId = data.id;
      } else {
        try {
          delete $scope.checkedIds[data.id];
        } catch (ex) { }
        $scope.selectItemId = $scope.checkedIds ? $scope.checkedIds[Object.keys($scope.checkedIds)[0]] : null;
      }

      $scope.isCheckedMulti = Object.keys($scope.checkedIds).length > 1;
      var selectchk = $(".grid table input.k-checkbox:not(.header-checkbox):checked");
      if (selectchk.length == 1) {
        $(".k-grid-edit").removeClass("k-state-disabled");
      } else {
        $(".k-grid-edit").addClass("k-state-disabled");
      }
      var selectnonechk = $(".grid table input.k-checkbox:not(.header-checkbox)");
      $("#header-chb").prop('checked', selectchk.length == selectnonechk.length);
    };

    $scope.headerChbChangeFunc = function () {
      var checked = $("#header-chb").prop('checked');
      $scope.isCheckedMulti = checked;
      $('.row-checkbox').each(function (idx, item) {
        if (checked != $(item).prop("checked"))
          $(item).trigger('click');
      });
    };

    $timeout(function () {
      //Add title on toolbar
      $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

      $('.grid table').each(function () {
        $(this).wrap('<div class="table-responsive" />');
      });

      // Add toolbar after Grid, before pager
      $('.grid').each(function () {
        if ($(this).find('.k-grid-toolbar').length < 2) {
          if ($(this).find('.k-grid-toolbar').length < 2) {
            $(this).find(".k-grid-toolbar").clone(true, true).insertBefore($(".k-grid-pager", this));
          }
        }
      });
      // $(".k-grid-delete").addClass("k-state-disabled");
      $(".k-grid-edit").addClass("k-state-disabled");
      $('.k-grid-edit').on('click', function (e) {
        if ($scope.isCheckedMulti) return;
        $window.location.href = '/game-mechanics/admin-game-mechanics/challenges/build?id=' + $scope.selectItemId;
      });

      $('.k-grid-add').on('click', function (e) {
        $location.path('/game-mechanics/admin-game-mechanics/challenges/build');
      });

      $('.k-grid-delete').click(function (e) {
        if (!$scope.checkedIds) {
          return;
        }

        var confirm = $window.confirm("Are you sure you want to delete this record?");
        if (!confirm) {
          return;
        }

        var ids = _.map($scope.checkedIds, function (num, key) { return key; });
        if (ids.length <= 0) return;

        MasterDataGameMechanicsApi.deleteMultiChallenges(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });

      $('.k-grid-active').on('click', function (e) {
        $scope.isActive = !$scope.isActive;
        $scope.gridDataSource.read();
        if ($scope.isActive) {
          $('.k-grid-active span').attr('class', 'fa fa-check-square-o');
        } else {
          $('.k-grid-active span').attr('class', 'fa fa-square-o');
        }
      });
    }, 1000);

  }


})();
