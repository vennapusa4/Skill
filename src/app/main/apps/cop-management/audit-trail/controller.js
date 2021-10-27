(function () {
  'use strict';

  angular
    .module('app.copManagement')
    .controller('AdminCopAuditTrailController', AdminCopAuditTrailController);

  /** @ngInject */
  function AdminCopAuditTrailController($scope, $timeout, AdminSettingCoPApi, $window, $state, logger) {
    var vm = this;
    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.checkedIds = {};
    $scope.selectItemId = null;
    $scope.isCheckedMulti = false;

    localStorage["kendo-grid-filter"]=null;
    $scope.filterBy = {
      logic: "and",
      filters: []
    };
    $scope.filterByOriginal = {
        logic: "and",
        filters: []
    };
  $scope.filters = [];
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          $scope.checkedIds = {};
          $("#header-chb").prop('checked', false);
          return AdminSettingCoPApi.GetInactiveCOP(options, $scope.Keyword, $scope.filterBy.filters.length>0?$scope.filterBy:null, $scope.gridDataSource.total());
        },
        update: function (e) {
          e.success();
        },
        destroy: function (e) {
          AdminSettingCoPApi.delete({ id: e.data.id }).then(function (data) {
            if (data.result) {
              logger.success('Successfully Deleted');
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
            copName: {
              type: "string"
            },
            category: {
              type: "string"
            },
            status: {
              type: "string"
            },
            aging: {
              type: "number"
            },
            statusChangeDate: {
              type: "date"
            },
            updatedBy: {
              type: "string"
            },
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
      filterable: true,
    filterMenuInit: function(e){
      e.container.on("click", "[type='reset']", function () {
          console.log(e);
          $scope.filterByOriginal.filters.forEach(function(filterArray , arrayIndex){
                //to remove all checked columns onClear
                for(var i= filterArray.filters.length ; i > 0 ; i--){
                  if(filterArray.filters[i - 1].field == e.field.charAt(0).toUpperCase()+ e.field.slice(1)){
                      var index = i-1;
                      filterArray.filters.splice(index,1);
                  }
              }
              
              if(filterArray.filters.length == 0){
                  $scope.filterByOriginal.filters.splice(arrayIndex,1);
                  $scope.filterBy.filters.splice(arrayIndex,1);
              }
          });

          if($scope.filterByOriginal.filters.length == 0){
              $scope.filterByOriginal = {
                  logic: "and",
                  filters: []
              };
          }

          var grid = $("#xgrid").data("kendoGrid");
          localStorage["kendo-grid-filter"] = kendo.stringify($scope.filterByOriginal);
          var options = localStorage["kendo-grid-filter"];
          if (localStorage["kendo-grid-filter"]!=JSON.stringify(grid.dataSource.filter()) && options!="null") {
              
              LoadGridFilters(options);
          }
          
      });
  },

  filter:function(e){

      e.preventDefault();
     if(e.filter==null){
         return;
     }
     debugger;
     var BreakException = {};
     var tempFilter=e.filter;
     $scope.filterByOriginal.filters.push(tempFilter);
     localStorage["kendo-grid-filter"] = kendo.stringify($scope.filterByOriginal);
      e.filter.filters.forEach(function(filter,index){
          if(filter.field!=null && filter.field.length>0)
          {
              filter.field=filter.field.charAt(0).toUpperCase() + filter.field.slice(1);
              $scope.filterBy.filters.forEach(function(existingFilter,existingIndex){
                  existingFilter.filters.forEach(function(existingField){
                      try
                      {
                          if(existingField.field==filter.field)
                          {
                              $scope.filterBy.filters.splice(existingIndex,1);
                              throw BreakException;
                          }
                      }
                      catch(e)
                      {
                          if (e !== BreakException) throw e;
                      }
                  });
              });
          }

             if(filter.field == "UserTypeName"){
               // filter.field = "SubmitterName";
                filter.operator = "contains"
             }
   
      });
      
     
      $scope.filterBy.filters.push(e.filter);
     
       var grid = $("#xgrid").data("kendoGrid");
      // localStorage["kendo-grid-options"] = kendo.stringify(grid.getOptions());
      // console.log(localStorage["kendo-grid-options"]);
      var options = localStorage["kendo-grid-filter"];
      if (localStorage["kendo-grid-filter"]!=JSON.stringify(grid.dataSource.filter()) && options!="null") {
          
          LoadGridFilters(options);
      }
      //$scope.filters.push(filter);
      //$scope.gridDataSource.fetch();
  },
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
 
        "delete",
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to excel"
        }
      ],
      excel: {
        allPages: true,
        filterable: true,
        fileName: "InactiveCoP.xlsx"
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
          field: "copName",
          title: "Cop Name",
          width: "20%",
          filterable: {
            extra:false,
            operators: {
                    string: {
                        contains: "Contains",
                    }
                }
        },
        },
        {
          field: "category",
          title: "Category",
          width: "20%",
          filterable: {
            extra:false,
            ui: categoryTypeFilter
         },
        },
        {
          field: "status",
          title: "Status",
          filterable: false

        },
        {
          field: "aging",
          title: "Aging (Days)",
          filterable: {
            extra:false,
            operators: {
              number:{
                  eq: "Equals to",
                   neq: "Is not equal to",
                   lt: "Less than",
                   gt: "Greater than"
                }
          }
        },
          
        },
        {
          field: "statusChangeDate",
          title: "Status change date",
          filterable: {
          operators: {
            date: {
              // eq :"Is equal",
              gt : "After",
              lt:"Before",
              }
            }
          }
        },
        {
          field: "updatedBy",
          title: "Update By",
          filterable: {
            extra:false,
            operators: {
                    string: {
                      contains: "Equals To"
                    }
                }
        },
        },
        {
          title: "Action",
              template: function (dataItem) {
                return '<div style="display: flex; justify-content: flex-start; align-items: center;"><span class="exportButton" ng-click="ExportMembers(\''+dataItem.copId+'\')" title="Export Members"><img src="/assets/icons/new-icons/export-icon.svg" style="width: 20px; margin-left: 10px;"></span><a href="javascript: void(0)" ng-click="viewAuditTrail(\''+dataItem.id+'\')" title="View Audit Trail"><img src="/assets/icons/new-icons/km-audit-trail-icon.svg" style="height: 21px; margin-left: 10px;"></a></div>';
              }
        }
      ]
    };

    function LoadGridFilters(filterString) {
      debugger;
      if (filterString != "") {
        var filters = JSON.parse(filterString);
        filters.filters.forEach(function(filter,index){
          filter.filters.forEach(function(existingFilter){
              existingFilter.field=existingFilter.field.charAt(0).toLowerCase() + existingFilter.field.slice(1);
          });
            
        });
        var grid = $("#xgrid").data("kendoGrid");
        parseFilterDateValues(filters,checkIfDate, grid);

        var datasource= $("#xgrid").getKendoGrid().dataSource;
        datasource.filter(filters);
      }
  }

    function parseFilterDateValues(expression, fieldTypeChecker, grid){
      if(expression.filters){
        parseFilterDateValues(expression.filters, fieldTypeChecker, grid);
      } else {
        expression.forEach(function(filter){
          if(fieldTypeChecker(grid, filter.field)){
            filter.value = kendo.parseDate(filter.value);
          }
        })
      }
  }

  function checkIfDate(grid, field){		
      return grid.dataSource.options.schema.model.fields[field]!=null?grid.dataSource.options.schema.model.fields[field].type === 'date':false;		
  }

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

        AdminSettingCoPApi.deleteMultiInactiveCOP(ids).then(function (data) {
          if (data.result){
            logger.success('Successfully Deleted');
            $scope.gridDataSource.read();
          }
            
        });
      });

      $("#menu-cop-management").addClass('current');
      // $('.selectpicker').selectpicker();

    }, 1000);
    $scope.category = [];
    AdminSettingCoPApi.GetAllCoPCategory().then(function (res) {
      if(res != null){
        res.forEach(function (category){
          $scope.category.push(category.name); 
        });
        $scope.category.push("Unparented Category"); 
      }
    }); 

    

    function categoryTypeFilter(element) {
      element.kendoDropDownList({
          dataSource: $scope.category,
          optionLabel: "--Select Value--"
      });
   }

   vm.currentCoP = null;
   $scope.viewAuditTrail = function (id) {

    AdminSettingCoPApi.getAuditTrail(id).then(function (res) {
      vm.currentCoP = [];
      if(res.length > 0 ){
        res.forEach(function(cop){
          vm.currentCoP.push(cop);
        });
        console.log(vm.currentCoP);
        $('#auditTrail').modal('show');
      }
     
    });
   
}

   $scope.CopMembers = [];
   $scope.ExportMembers = function(copId){

     AdminSettingCoPApi.getById(copId).then(function (res) {

       if(res.members != null){
         res.members.forEach(function (member) {
           $scope.CopMembers.push(member);
         });
       }

       var data_columns = [
         { name: 'Member Name', width: 350 },
     ];

     var rows = [{
       cells: [
         { value: "Member Name" ,background: "#7a7a7a",color: '#fff',}

       ]
     }];

     for (var i = 0; i < $scope.CopMembers.length; i++){

       // Push single row for every record.
       rows.push({
         cells: [
           { value: $scope.CopMembers[i].displayName },
          

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



     kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "MembersList.xlsx"});


     });

   }
  }

})();
