(function () {
  'use strict';

  angular
    .module('app.masterData')
    .controller('MasterDataSubDisciplinesController', MasterDataSubDisciplinesController);

  /** @ngInject */
  function MasterDataSubDisciplinesController($scope, $window, $timeout, MasterDataSubDisciplineApi, InsightsCommonService) {
    $scope.ApplyFilterFromMasterData = function (item, pageId) {
      InsightsCommonService.applyFilterForMasterData(item, "Subdisciplines", pageId);
    }
    var vm = this;
    $scope.pageSize = 10;
    $scope.Keyword = '';
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
          return MasterDataSubDisciplineApi.getAll(options, $scope.Keyword);
        },
        update: function (e) {
          e.success();
        },
        create: function (e) {
          e.success();
        },
        destroy: function (e) {
          MasterDataSubDisciplineApi.deleteItem({ id: e.data.subDisciplineId }).then(function (data) {
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
          id: "subDisciplineId",
          fields: {
            disciplineName: {
              type: "string"
            },
            subDisciplineName: {
              type: "string"
            },
            totalKnowledge: {
              type: "number"
            },
            sumLessonsLearnt: {
              type: "number"
            },
            sumBestPractises: {
              type: "number"
            },
            sumPublication: {
              type: "number"
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
          text: "Add New"
        },
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to excel "
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "Sub-Disciplines.xlsx"
      },
      excelExport: function (e) {
        var sheet = e.workbook.sheets[0];
        _.set(sheet, 'columns', [
          { width: 300, autoWidth: false },
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
          }
        },
        {
          field: "disciplineName",
          title: "Discipline Name",
        },
        {
          field: "subDisciplineName",
          title: "Sub-discipline Name",
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
          title: "Best Practices",
          template: function (dataItem) {
            return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,3)'>" + dataItem.sumBestPractises + "</span>";
          }
        }
        ,
        {
          field: "sumPublication",
          title: "Publications",
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
          id: e.model.subDisciplineId,
          name: e.model.subDisciplineName,
          isDeleted: false
        };

        if (e.model.isNew()) {
          formData.id = $scope.disciplineId;
          if ($scope.disciplineId <= 0)
            return;

          MasterDataSubDisciplineApi.addNew(formData).then(function (data) {
            if (data.result) {
              $scope.disciplineId = 0;
              $scope.gridDataSource.read();
            }
          });
        } else {
          MasterDataSubDisciplineApi.update(formData).then(function (data) {
            if (data.result) {
              $scope.gridDataSource.read();
            }
          });
        }
      }
    };

    $scope.RuleTypes = {
      dataTextField: "subDisciplineName",
      dataValueField: "subDisciplineId",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return CommonApi.getAllRuleTypes(options);
          }
        }
      }
    };
    $scope.disciplineId = 0;
    $scope.Source = {
      dataTextField: "text",
      dataValueField: "id",
      filter: "contains",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return MasterDataSubDisciplineApi.getDisciplineSuggestions(options);
          }
        },
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
        });
      },
    };
    function _onOpen(e) {
      $timeout(function () {
        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
      });
    };

    function _onSelect(e) {
      var index = _.findIndex($scope.Disciplines, function (obj) { return obj.name == e.dataItem.name });
      if (index == -1) {
        $scope.disciplineId = e.dataItem.id;
      }
      $timeout(function () {
        $scope.Discipline = "";
      });
    };
    $scope.onOpen = _onOpen;
    $scope.onSelect = _onSelect;

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
        //$(".k-grid-delete").removeClass("k-state-disabled");
        $(".k-grid-edit").removeClass("k-state-disabled");
      } else {
        // $(".k-grid-delete").addClass("k-state-disabled");
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
          $(this).find(".k-grid-toolbar").clone(true, true).insertBefore($(".k-grid-pager", this));
        }
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

        MasterDataSubDisciplineApi.deleteMultiSubdiscipline(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });
    }, 1000);
  }


})();
