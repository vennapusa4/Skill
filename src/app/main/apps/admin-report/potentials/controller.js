(function () {
  'use strict';

  angular
    .module('app.adminReport')
    .controller('AdminReportPotentials', AdminReportPotentials);

  /** @ngInject */
  function AdminReportPotentials($scope, $timeout, adminReportAPI, $window, $state,appConfig) {

    $scope.pageSize = 10;
    $scope.Keyword = '';
    $scope.isSearch = false;
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
  $scope.creationTypes = [];
  var type;
  for (type in appConfig.creationTypes) {
      if (appConfig.creationTypes.hasOwnProperty(type)) {
          var value = appConfig.creationTypes[type];

          $scope.creationTypes.push(value);
          
      }
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
          return adminReportAPI.getAllValueTracking(options, $scope.Keyword, $scope.filterBy.filters.length>0?$scope.filterBy:null, $scope.gridDataSource.total());
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
            title: {
              type: "string"
            },
            valueTypeName: {
              type: "string"
            },
            remarks: {
              type: "string"
            },
            amount: {
              type: "number"
            },
            valueCreationName: {
              type: "string"
            },
            endorsed: {
              type: "string"
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
      filterable: {
        extra: false,
      
    },
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
        fileName: "PotentialValueTracking.xlsx"
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
          field: "title",
          title: "Title",
          filterable: {
            operators: {
              string: {
                  contains: "Contains",
              }
            }
          },
  
          template: '<a href="/knowledge-discovery/#=id#">#=title#</a>'
      },
        {
          field: "valueTypeName",
          title: "Value Type",
          filterable: { 
            dataSource: {
                transport: {
                    read: {
                        url: appConfig.SkillApi + 'api/Lookup/ValueTypes',
                        method : "POST",
                        data: {
                            field: "valueTypeName"
                        }
                    }
                }
            },
            multi: true,
            search: true,
            checkAll:false

        }
        },
        {
          field: "remarks",
          title: "Remark",
          filterable: {
            operators: {
              string: {
                  contains: "Contains",
              }
            }
          },
          width: "30%"
          
        },
        {
          field: "amount",
          title: "amount (M)",
          filterable: {
            extra: false,
            operators:{
              number:{
                eq: "Is equal to",
                 neq: "Is not equal to",
                 lt: "Less than",
                 gt: "Greater than"
              }
            }
        },
        },
        {
          field: "valueCreationName",
          title: "Value Creation Type",
          filterable: { 
            dataSource: {
                transport: {
                    read: {
                        url: appConfig.SkillApi + 'api/Lookup/ValueCreationTypes',
                        method : "POST",
                        data: {
                            field: "valueCreationName"
                        }
                    }
                }
            },
            multi: true,
            search: true,
            checkAll:false
            
          },
          
        },

        {
          field: "endorsed",
          title: "Endorsed",
          filterable: { 
            dataSource: [{
              endorsed: "Yes",
            },
            {
              endorsed: "No",
            }
            ],
        
            multi: true,
            search: true,
            checkAll:false
            
          },
          
        },

        

        {
          title: "Audit Trail",
          template: function (dataItem) {
              return "<a href='javascript: void(0)' ng-click='viewAuditTrail(dataItem)'><img src='/assets/icons/new-icons/km-audit-trail-icon.svg' style='width: 30px; margin-left: 24px;'></a>";
          }
          
      }
      ]
    };

    
    $scope.Search = function () {
      $scope.isSearch = true;
      $scope.gridDataSource.query({
          page: 1,
          pageSize: $scope.pageSize
      });
  }

    $scope.viewAuditTrail = function (data) {
      $scope.currentKnowledge = data;
      console.log($scope.currentKnowledge);
      $('#auditTrail').modal('show');
  }

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

  
  function valueCreationTypeFilter(element) {
    element.kendoDropDownList({
        dataSource: $scope.creationTypes,
        optionLabel: "--Select Value--"
    });
 }

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
        $state.go('appAdmin.gameMechanicsAdmin.levelBuild', { id: $scope.selectItemId });
      });

      $('.k-grid-add').on('click', function (e) {
        $state.go('appAdmin.gameMechanicsAdmin.levelBuild');
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

      $("#menu-admin-report").addClass('current');
      // $('.selectpicker').selectpicker();

    }, 1000);

  }

})();
