(function () {
    'use strict';

    angular
        .module('app.technicalAlert')
        .controller('AdminTechnicalAlertImplementationController', AdminTechnicalAlertImplementationController);

    /** @ngInject */
    function AdminTechnicalAlertImplementationController($scope, appConfig , KnowledgeManagementApi, $timeout, $window, Utils, CommonApi, BulkUploadApi, UserProfileApi, KnowledgeDiscoveryApi, SearchApi, logger, MasterDataGameMechanicsApi) {
        var vm = this;
        vm.pageSize = 10;
        vm.searchTerm = '';
        vm.isSearch = false;
        vm.bulk = {};
        vm.AllLLType = [];
        vm.AllStatus = [];
        vm.options = null;
        
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


        vm.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    vm.checkedIds = {};
                    vm.checkedItems = [];
                    $("#header-chb").prop('checked', false);
                    if (vm.isSearch) {
                        options.data.skip = 0;
                        vm.isSearch = false;
                    }
                  
                    vm.options = options;
                    return KnowledgeManagementApi.getTAImplementation(options, vm.searchTerm, $scope.filterBy.filters.length>0?$scope.filterBy:null, vm.gridDataSource.total(), vm.isWithReplication);
                },
              
             
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: vm.pageSize,
            schema: {
                data: function (e) {
                    return e.data;
                },
                total: "total",
                model: {
                    knowledgeDocumentId : "knowledgeDocumentId ",
                    fields: {
                        submitterName:{
                            type: "string"
                        },
                        knowledgeTitle: {
                            type: "string"
                        },
                        kdReferenceTitle : {
                            type: "string"
                        },
                        source: {
                            type: "string"
                        },
                        implementation: {
                            type: "string"
                        },

                        createdDate: {
                            type: "Date"
                        }
                    }
                }
            }
        });

        vm.search = function () {
            vm.isSearch = true;
            vm.gridDataSource.query({
                page: 1,
                pageSize: vm.pageSize
            });
        };

        //Grid definition
        vm.gridOptions = {
            pageable: {
                pageSize: vm.pageSize,
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
            dataBound: function (e) {
                var view = this.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (vm.checkedIds[view[i].id]) {
                        this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".checkbox")
                            .attr("checked", "checked");
                    }
                }
            },
            toolbar: [
               // { template: '<kendo-button ng-click="vm.validate()" class="k-grid-validate">Add New</kendo-button>' },
               // "edit",
               // "delete",
                // { template: '<kendo-button ng-click="vm.exportWithReplication()" class="k-button k-grid-export2"><span class="c-icon icon-export"></span>Export with replication</kendo-button>' },
                // { template: "<kendo-button class='k-grid-validate' style='margin-left:5px;'>Export to excel</kendo-button>" },
                {
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export to excel"
                }
            ],
            dataSource: vm.gridDataSource,
            columns: [
           
           
                {
                    field: "knowledgeTitle",
                    title: "Title",
                    width: "20%",
                    filterable: {
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        }
                    },
                    template: '<a href="/knowledge-discovery/#=knowledgeDocumentId#">#=knowledgeTitle#</a>'
                  
                },
                {
                    field: "kdReferenceTitle",
                    title: "Implementation Source",
                    filterable: {
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                          },
                    }
                },
                {
                    field: "source",
                    title: "Source",
                    filterable: {
                        operators: {
                            string: {
                                eq: "Equals To",
                            }
                          },
                        ui:sourceFilter
                    }
                },
                {
                    field: "submitter",
                    title: "Submitter",
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllSubmitters',
                                    method : "GET",
                                    data: {
                                        field: "submitter"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                      //  dataSource: vm.SubDsciplineSource,
                       // checkAll: false
                        
                    },
                    template: "<a href='javascript: void(0)' ng-click='viewSubmitter(#:submitter.id#)'> #:submitter.displayName#</a>"},
                    
                    {
                    field: "implementation",
                    title: "Implementation",
                    width: "20%",
                    filterable: { 
                        multi: true,
                                    search:true,
                                    dataSource: [{
                                        implementation: "Yes",
                                    },
                                    {
                                        implementation: "No",
                                    },
                                    ],
                                    checkAll: false
            
                                
            
                    }
              
                },
                
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#editorTemplate").html())
            },
            excel: {
                allPages: true,
                filterable: true,
                fileName: "TA-Implementation.xlsx"
            },
            excelExport: function (e) {
                e.preventDefault();
    
                var data_columns = [
                    { name: 'Title', width: 500 },
                    { name: 'Implementation Source', width: 150 },
                    { name: 'Source', width: 150 },
                    { name: 'Submitter', width: 150 },
                    { name: 'Implementation', width: 300 },
                ];
    
                var rows = [{
                  cells: [
                    { value: "Title" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Implementation Source" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Source" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Submitter", background: "#7a7a7a",color: '#fff', },
                    { value: "Implementation" ,background: "#7a7a7a",color: '#fff',},
                  ]
                }];
    
                var data = e.data;
                  for (var i = 0; i < data.length; i++){
    
                    // Push single row for every record.
                    rows.push({
                      cells: [
                        { value: data[i].knowledgeTitle },
                        { value: data[i].kdReferenceTitle },
                        { value: data[i].source },
                        { value: data[i].submitter.displayName},
                        { value: data[i].implementation },
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
    
                    e.workbook.sheets[0].rows.forEach(function(row) {
                      row.cells.forEach(function(cell) {
                          if (isNaN(cell.value) && cell.validation && cell.validation.dataType === "number") {
                              cell.value = "";
                          }
                      });
                  });
    
    
                kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "TA-Implementation.xlsx"});
           
              },
          
        };

        $scope.viewSubmitter = function (data) {
            var redirect = $state.href('app.ProfilePage.profile', { user : data });
            $window.open(redirect, '_blank');
        }

        $scope.sourceFilterList = appConfig.implementationSource;

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

        function sourceFilter(element) {
            element.kendoDropDownList({
                dataSource: $scope.sourceFilterList,
                optionLabel: "--Select Value--"
            });
         }

        function formatDate(date) {
            if (!date) return "";
            var monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
            date = new Date(date);
            var day = date.getDate();
            day = day <= 9 ? ('0' + day) : day
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + '-' + monthNames[monthIndex] + '-' + year;
        }


  


    }

})();
