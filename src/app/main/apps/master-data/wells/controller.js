(function () {
  'use strict';

  angular
    .module('app.masterData')
    .controller('MasterDataWellsController', MasterDataWellsController);

  /** @ngInject */
  function MasterDataWellsController($scope, $window, $timeout, WellApi, InsightsCommonService) {
    $scope.ApplyFilterFromMasterData = function (item, pageId) {
      InsightsCommonService.applyFilterForMasterData(item, "Wells", pageId);
    }
    $scope.pageSize = 10;
    $scope.keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
    $scope.isSearch = false;
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
          if ($scope.isSearch) {
            options.data.skip = 0;
            $scope.isSearch = false;
          }
          return WellApi.getAll(options, $scope.keyword);
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          WellApi.deleteItem(e.data.id).then(function (data) {
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

    $scope.search = function () {
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
        "edit",
        "delete",
        {
          name: "create",
          iconClass: "c-icon icon-new",
          text: "Add New</strong>"
        },
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "Wells.xlsx"
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
          title: "Wells Name",
        },
        {
          field: "totalKnowledge",
          title: "Total Knowledge",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,1)'>" + dataItem.totalKnowledge + "</span>";
          }
        },
        {
          field: "sumLessonsLearnt",
          title: "Lessons Learnt",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,2)'>" + dataItem.sumLessonsLearnt + "</span>";
          }
        },
        {
          field: "sumBestPractises",
          title: "Best Practises",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,3)'>" + dataItem.sumBestPractises + "</span>";
          }
        },
        {
          field: "sumPublication",
          title: "Publication",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,4)'>" + dataItem.sumPublication + "</span>";
          }
        }
      ],
      editable: {
        mode: "popup",
        template: kendo.template($("#editorTemplate").html())
      },
      edit: function (e) {
        if (e.model.isNew()) {
          e.container.kendoWindow("title", "Add New");
        }
        else {
          e.container.kendoWindow("title", "Edit");
        }
      },
      save: function (e) {
        e.preventDefault();
        var formData = {
          "id": e.model.id,
          "name": e.model.name
        };
        var formData1 = {
          "name": e.model.name
        };
        if (e.model.isNew()) {
          formData1.isDeleted = false;
          WellApi.addWell(formData1).then(function (data) {
            if (data.result) {
              $scope.gridDataSource.read();
            }
          });
        } else {
          formData.isDeleted = false;
          WellApi.updateWell(formData).then(function (data) {
            if (data.result) {
              $scope.gridDataSource.read();
            }
          });
        }
      }
    };

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
      var selectchk = $(".grid table input.k-checkbox:checked");
      if (selectchk.length == 1) {
        // $(".k-grid-delete").removeClass("k-state-disabled");
        $(".k-grid-edit").removeClass("k-state-disabled");
      } else {
        //   $(".k-grid-delete").addClass("k-state-disabled");
        $(".k-grid-edit").addClass("k-state-disabled");
      }
      var selectnonechk = $(".grid table input.k-checkbox");
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
        $(this).find(".k-grid-toolbar").clone().insertBefore($(".k-grid-pager", this));
      });
      // $(".k-grid-delete").addClass("k-state-disabled");
      $(".k-grid-edit").addClass("k-state-disabled");
      $('.k-grid-edit').on('click', function (e) {
        if ($scope.isCheckedMulti) return;
        var trEl = $('input#chk_' + $scope.selectItemId).closest('tr');
        $scope.grid.editRow(trEl);
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

        WellApi.deleteMultiWell(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });
    }, 1000);
  }
})();
