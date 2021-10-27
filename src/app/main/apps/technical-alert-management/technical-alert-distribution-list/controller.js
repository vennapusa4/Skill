(function () {
  "use strict";

  angular
    .module("app.technicalAlert")
    .controller(
      "AdminTechnicalAlertDistributionListController",
      AdminTechnicalAlertDistributionListController
    );

  /** @ngInject */
  function AdminTechnicalAlertDistributionListController(
    $scope,
    $state,
    $window,
    $timeout,
    EmailApi,
    appConfig ,
    UserProfileApi,
    logger
  ) {
    var vm = this;
    $scope.filterUserType = [];
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
    EmailApi.getDistributionListUserTypes().then(function (data) {
      $scope.distributionListUserTypes = data.distributionListUserType;
      data.distributionListUserType.forEach(function(userType){
        $scope.filterUserType.push(userType.name);
      });
    });
    vm.LstUserTypes;
    $scope.roles = [];
      UserProfileApi.getAllDropdownAdminUser().then(function (totalData) {
          // get list userTypes
          vm.LstUserTypes = totalData.roles;
          $.each(vm.LstUserTypes, function (index, value) {
              value.title = value.name;
              $scope.roles.push(value.name);
          });
      });
   
  

    $scope.pageSize = 20;

    vm.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          debugger;
          return EmailApi.getDistributionList(
            options,
            $scope.Keyword,
            $scope.DistributionListUserTypeId,
            "TA",
            $scope.filterBy.filters.length>0?$scope.filterBy:null,
            vm.gridDataSource.total()
          );
        },
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
            id: { type: "number" },
            name: { type: "string" },
            userType: { type: "object" },
            disciplines: { type: "object" },
            disciplineName: { type: "string" },
            location: { type: "object" },
            locationName: { type: "string" },
            businessSectorName : {type:"string"},
            userTypeName: {type:"string"},
            subDisciplineName : {type: "string"}
             
          },
        },
      },
    });

    $scope.gridOptions = {
      pageable: {
        pageSize: $scope.pageSize,
      },
      scrollable: false,
      sortable: false,
      filterable: {
        extra: false,
        operators: {
          string: {
              eq: "Is equal to",
          }
      },
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
      dataBound: onDataBound,
      dataSource: vm.gridDataSource,
      columns: [
        {
          title: "Select All",
          headerTemplate:
            "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
          template: function (dataItem) {
            return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>";
          },
          width: "30px",
          attributes: {
            class: "check_cell",
          },
        },
        {
          field: "name",
          title: "Name",
          width: "300px",
          filterable: {
            operators: {
                    string: {
                        contains: "Contains",
                    }
                }
        },
          template: "<strong>#:data.name#</strong>",
        },
        {
          field: "userTypeName",
          title: "Role(s)",
          editable: false,
          filterable: {
        
            ui: userRolesFilter
         },
          template: function (dataItem) {
            var result = "";
            if (dataItem.userType != null && dataItem.userType.length > 0) {
              $.each(dataItem.userType, function (index, value) {
                result = result + value.title + "<br />";
              });
            }
            return result;
          },
        },
        {
          field: "businessSectorName",
          title: "Business Sector",
          filterable: { 
            dataSource: {
                transport: {
                    read: {
                        url: appConfig.SkillApi + 'api/Lookup/AllBusinessSectors',
                        method : "GET",
                        data: {
                            field: "businessSectorName"
                        }
                    }
                }
            },
            multi: true,
            search: true,
          //  dataSource: vm.SubDsciplineSource,
            checkAll: false
            
        },
         // template: "#:data.businessSector.name#"
          
        },
        {
          field: "distributionListUserTypeName",
          title: "User Type",
          filterable: { 
            multi: true,
            search:true,
           dataSource: [{
            distributionListUserTypeName: "Project Manager",
                        },
                        {
                          distributionListUserTypeName: "Plant Manager",
                        }
                        
                        ],
                        checkAll: false
        }
       
        },
        {
          field: "disciplineName",
          title: "Discipline",
          editable: false,
          filterable: {
              dataSource: {
                  transport: {
                      read: {
                          url: appConfig.SkillApi + 'api/Lookup/Disciplines',
                          method : "POST",
                          data: {
                              field: "disciplineName"
                          }
                      }
                  }
              },
              multi: true,
              search: true,
          }
        },
        {
          field: "subDisciplineName",
          title: "Sub-Discipline",
                    editable: false,
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllSubDisciplines',
                                    method : "POST",
                                    data: {
                                        field: "subDisciplineName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                      //  dataSource: vm.SubDsciplineSource,
                       // checkAll: false
                        
                    },
          // template: function (dataItem) {
          //   var result = "";
          //   if (
          //     dataItem.disciplines != null &&
          //     dataItem.disciplines.length > 0 &&
          //     dataItem.disciplines[0].subDisciplineResponses != null &&
          //     dataItem.disciplines[0].subDisciplineResponses.length > 0
          //   ) {
          //     $.each(dataItem.disciplines[0].subDisciplineResponses, function (
          //       index,
          //       value
          //     ) {
          //       result = result + value.title + "<br />";
          //     });
          //   }
          //   return result;
          // },
        },
        {
          field: "locationName",
          title: "Location",
                    editable: false,
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/Locations',
                                    method : "GET",
                                    data: {
                                        field: "locationName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        checkAll: false,
                        search:true
                    }
        },
      ],
      toolbar: [
        { template: '<kendo-button ng-click="vm.validate()" class="k-grid-add">Add New</kendo-button>' },
      //  "edit",
        "delete",
        {
          name: "excel",
          iconClass: "c-icon icon-export",
          text: "Export to excel",
        },
       // { template: '<select><option>Default View</option</select>' },
      ],
      // excelExport: exportGridWithTemplatesContent,
      excelExport: function (e) {
        e.preventDefault();
        exportToExcel();
      },
    };

    function userTypeFilter(element) {
      element.kendoDropDownList({
          dataSource: $scope.filterUserType,
          optionLabel: "--Select Value--"
      });
   }

   function userRolesFilter(element) {
    element.kendoDropDownList({
        dataSource:  $scope.roles,
  
        optionLabel: "--Select Value--"
    });
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

    function exportToExcel() {
      EmailApi.exportDistributionListToExcel($scope.Keyword, "TA");
    }

    function onDataBound(e) {
      var view = this.dataSource.view();
      for (var i = 0; i < view.length; i++) {
        if ($scope.checkedIds[view[i].id]) {
          this.tbody
            .find("tr[data-uid='" + view[i].uid + "']")
            .addClass("k-state-selected")
            .find(".checkbox")
            .attr("checked", "checked");
        }
      }
    }

    $scope.Search = function () {
      vm.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize,
      });
    };

    $scope.checkedIds = {};

    $scope.checkItem = function (data) {
      if (data.CheckItem) {
        $scope.checkedIds[data.id] = data.id;
        $scope.selectItemId = data.id;
      } else {
        try {
          delete $scope.checkedIds[data.id];
        } catch (ex) {}
        $scope.selectItemId = $scope.checkedIds
          ? $scope.checkedIds[Object.keys($scope.checkedIds)[0]]
          : null;
      }

      $scope.isCheckedMulti = Object.keys($scope.checkedIds).length > 1;
      var selectchk = $(
        ".grid table input.k-checkbox:not(.header-checkbox):checked"
      );
      if (selectchk.length == 1) {
        $(".k-grid-edit").removeClass("k-state-disabled");
      } else {
        $(".k-grid-edit").addClass("k-state-disabled");
      }
      var selectnonechk = $(
        ".grid table input.k-checkbox:not(.header-checkbox)"
      );
      $("#header-chb").prop(
        "checked",
        selectchk.length == selectnonechk.length
      );
    };

    $scope.headerChbChangeFunc = function () {
      var checked = $("#header-chb").prop("checked");
      $scope.isCheckedMulti = checked;
      $(".row-checkbox").each(function (idx, item) {
        if (checked != $(item).prop("checked")) $(item).trigger("click");
      });
    };

    $timeout(function () {
      $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

      $(".grid table").each(function () {
        $(this).wrap('<div class="table-responsive" />');
      });

      $(".grid").each(function () {
        if ($(this).find(".k-grid-toolbar").length < 2) {
          $(this)
            .find(".k-grid-toolbar")
            .clone(true, true)
            .insertBefore($(".k-grid-pager", this));
        }
      });
      $(".k-grid-add").on("click", function (e) {
        $state.go("appAdmin.technicalAlert.distributionListBuild");
      });

      $(".k-grid-delete").click(function (e) {
        if (!$scope.checkedIds) {
          return;
        }
        var confirm = $window.confirm(
          "Are you sure you want to delete this record?"
        );
        if (!confirm) {
          return;
        }
        var ids = _.map($scope.checkedIds, function (num, key) {
          return key;
        });
        if (ids.length <= 0) return;

        EmailApi.deleteDistributionListUsers(ids).then(function (data) {
          if (data.result) {
            $scope.Search();
          }
        });
      });

      $("#menu-technical-alert").addClass('current');
    }, 1000);
  }
})();
