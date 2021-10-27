(function () {
  'use strict';

  angular
    .module('app.masterData')
    .controller('MasterKDRatingCommentsController', MasterKDRatingCommentsController);

  /** @ngInject */
  function MasterKDRatingCommentsController($scope, $timeout, MDRatingCommentsApi, $window, InsightsCommonService) {
    var vm = this;
    $scope.ApplyFilterFromMasterData = function (item, pageId) {
      InsightsCommonService.applyFilterForMasterData(item, "KDRatingComments", pageId);
    }
    $scope.ratingLevel= [ 1 , 2 , 3, 4, 5];
    $scope.ratingComments = []
    $scope.ratingObj = {
      rating:"",
      comment: ""
    }
    $scope.rating = "";
    $scope.showRatingError = false;
    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;
    $scope.isSearch = false;
    vm.isEdit = false;
    $scope.addComment = function(comment){
      if(comment!= ""){
    $scope.ratingComments.push(comment);
      $scope.ratingObj.comment = "";
      }
  
    }

    $scope.removeComment = function(comment){
      var index = $scope.ratingComments.indexOf(comment);
      $scope.ratingComments.splice(index, 1); 
    }

    $scope.getSelectedRating = function(rating){
      $scope.rating = rating
      $scope.showRatingError = false;
    }
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
          if ($scope.isSearch) {
            options.data.skip = 0;
            $scope.isSearch = false;
          }
          return MDRatingCommentsApi.getAll(options, $scope.Keyword ,$scope.gridDataSource.total() );
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          MDRatingCommentsApi.deleteItem({ id: e.data.id }).then(function (data) {
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
            typeId: {
              type: "number"
            },
            comments: {
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
          text: "Export to excel"
        }
      ], excel: {
        allPages: true,
        filterable: true,
        fileName: "PreDefinedRatingComments.xlsx"
      },
      excelExport: function (e) {

        e.preventDefault();

        var data_columns = [
            { name: 'Star Rating', width: 110 },
            { name: 'Predefined Comments', width: 300 },

        ];

        var rows = [{
          cells: [
            { value: "Star Rating" ,background: "#7a7a7a",color: '#fff' , textAlign: "center"},
            { value: "Predefined Comments" ,background: "#7a7a7a",color: '#fff',},
          ]
        }];

        
        var data = e.data;
        for (var i = 0; i < data.length; i++){
          // Push single row for every record.
          rows.push({
            cells: [
              { value: data[i].typeId +" STAR", textAlign: "center"},
              { value: data[i].comments },
            ]
          })
        }
        var workbook = new kendo.ooxml.Workbook({
        sheets: [
          {
            columns: data_columns,
            rows: rows
          },
          ],
          });

      kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "PreDefinedRatingComments.xlsx"});
    

        
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
          field: "typeId",
          title: "Star Rating",
          template: function (dataItem) {
            return "<span style='cursor: pointer'>" + dataItem.typeId + " STAR" + "</span>";
          }
        },
        {
          field: "comments",
          title: "Predefined Comments",
          template: function (dataItem) {
            return "<span style='cursor: pointer'>" + dataItem.comments + "</span>";
          }
        },
      ],
      editable: {
        mode: "popup",
        template: kendo.template($("#editorTemplate").html())
      },
      beforeEdit: function (e) {
        $scope.rating = e.model.typeId;
        $scope.ratingObj.comment = e.model.comments;
          vm.isEdit = true;
      },
      edit: function (e) {
        if (e.model.isNew()) {
          vm.isEdit = false;
          $scope.ratingObj.comment = "";
          $("a.k-grid-update")[0].innerHTML = "<span class='k-icon k-i-check'></span> Save";
          e.container.kendoWindow("title", "Add New Predefined Rating");
        }
        else {
          e.container.kendoWindow("title", "Edit Predefined Rating");
        }
      },
      save: function (e) {
        e.preventDefault();
        var formData = {
          id: e.model.id,
          typeId: $scope.rating,
          predefinedComments: $scope.ratingComments
        };

        var updateData = {
          id: e.model.id,
          typeId: e.model.typeId,
          comments: $scope.ratingObj.comment
        };

        if (e.model.isNew()) {

          if($scope.rating == ""){
            $scope.showRatingError = true
          }
          else{
            MDRatingCommentsApi.addRatingComments(formData).then(function (data) {
              if (data.result) {
                $scope.gridDataSource.read();
              }
            });
          }
        
        } else {

          MDRatingCommentsApi.updateRatingComments(updateData).then(function (data) {
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
        
        MDRatingCommentsApi.deleteMultiRatingComments(ids).then(function (data) {
          if (data.result)
            $scope.gridDataSource.read();
        });
      });
    }, 1000);
  }

})();
