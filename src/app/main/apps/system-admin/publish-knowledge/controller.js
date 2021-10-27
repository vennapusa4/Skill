(function () {
  'use strict';

  angular
    .module('app.systemAdmin')
    .controller('AdminSystemPublishKnowledgeController', AdminSystemPublishKnowledgeController);

  /** @ngInject */
  function AdminSystemPublishKnowledgeController($scope, $timeout, MasterDataGameMechanicsApi, $window, $state) {

    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
    $scope.publishingKnowledge = function() {
      $('#publishKnowledge').modal('show');
    }

    $scope.showConfirm = function () {
      $('#publishKnowledge').modal('hide');
      $('#confirmPublish').modal('show');
    }

    $scope.showDone = false;
    $scope.submittingSkip = function() {
      $scope.showDone = true;
    }
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
          return MasterDataGameMechanicsApi.getAllLevels(options, $scope.Keyword);
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          MasterDataGameMechanicsApi.deleteLevel({ id: e.data.id }).then(function (data) {
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
            levelName: {
              type: "string"
            },
            description: {
              type: "string"
            },
            badgeImageUrl: {
              type: "string"
            },
            pointsRequired: {
              type: "number"
            },
            numberOfUsers: {
              type: "number"
            }
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
        { template: '<kendo-button ng-click="publishingKnowledge()" class="k-grid-validate">Publish</kendo-button>' },
        {
          name: "pdf",
          iconClass: "c-icon icon-export",
          text: "Export to Excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "Game Mechanics_Level.xlsx"
      },
      pdf: {
        allPages: true,
        filterable: true,
        fileName: "Game Mechanics_Level.pdf",
        paperSize: "A4",
        landscape: true,
        scale: 0.75
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
          }
        },
        {
          field: "levelName",
          title: "title",
          width: "20%",
          template: function(x) {
            return '<a>' + x.levelName + '</a>'
          }
        },
        {
          field: "pointsRequired",
          title: "type",
          template: "Best Practice"
        },
        {
          field: "pointsRequired",
          title: "discipline",
          template: "Change Mgmt"
        },
        {
          field: "pointsRequired",
          title: "author",
          template: "Tan LK (PROD/ABF)"
        },
        {
          field: "pointsRequired",
          title: "submitter",
          template: "Tan LK (PROD/ABF)"
        },
        {
          field: "pointsRequired",
          title: "status",
          template: "Submitted"
        },
        {
          field: "pointsRequired",
          title: "date created",
          template: "26 OCT 2020"
        }
      ]
    };

    $scope.editItem = function (itemId) {
      // $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: itemId });
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
          $(this).find(".k-grid-toolbar").clone(true, true).insertBefore($(".k-grid-pager", this));
        }
      });

      // Trigger grid action
      $(".k-grid-edit").addClass("k-state-disabled");
      $('.k-grid-edit').on('click', function (e) {
        if ($scope.isCheckedMulti) return;
        // $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: $scope.selectItemId });
      });

      $('.k-grid-add').on('click', function (e) {
        // $state.go('appAdmin.gameMechanicsAdmin.levelBuild');
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

        MasterDataGameMechanicsApi.deleteMultiLevels(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });

      $("#menu-system-admin").addClass('current');
      // $('.selectpicker').selectpicker();

    }, 1000);

  }

})();
