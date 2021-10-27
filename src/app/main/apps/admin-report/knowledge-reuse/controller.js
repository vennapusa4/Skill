(function () {
    'use strict';

    angular
        .module('app.adminReport')
        .controller('AdminReportKnowledgeReuseController', AdminReportKnowledgeReuseController);

    /** @ngInject */
    function AdminReportKnowledgeReuseController($scope, $timeout, adminReportAPI, KnowledgeManagementApi, appConfig, $window, $state) {
        var vm = this;
        $scope.Keyword = '';
        $scope.isSearch = false;
        $scope.pageSize = 10;
        $scope.checkedIds = {};
        $scope.selectItemId = null;
        $scope.isCheckedMulti = false;
        vm.FeedbackLoopStatus = [];
        $scope.checkedIds = {};
        vm.statusUpdate = "";

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
                    $("#header-chb").prop('checked', false);
                    if ($scope.isSearch) {
                        options.data.skip = 0;
                        $scope.isSearch = false;
                    }
                    return adminReportAPI.getAllKnowledgeReuse(options, $scope.Keyword, $scope.filterBy.filters.length>0?$scope.filterBy:null , $scope.gridDataSource.total());
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
                        knowledgeTitle: {
                            type: "string"
                        },
                        reuseCriteria: {
                            type: "string"
                        },
                        locationProjectName:{
                            type: "string"
                        },
                        source: {
                            type: "string"
                        },
                        remarks: {
                            type: "string"
                        },
                        status: {
                            type: "string"
                        },
                    }
                }
            }
        });
        $scope.allKnowledges = [];
        $scope.currentKnowledge = null;

        vm.FeedbackLoopStatus = appConfig.feedbackLoopStatuses;
        $scope.statusList = [];
        for (var status in appConfig.feedbackLoopStatuses) {
            if (appConfig.feedbackLoopStatuses.hasOwnProperty(status)) {
                var value = appConfig.feedbackLoopStatuses[status];

                $scope.statusList.push(value.name);
                
            }
        }

        $scope.reuseCriteriaList = appConfig.reuseCriteria;
        $scope.sourceFilterList = appConfig.source;

        $scope.viewReplicator = function (data) {
            var redirect = $state.href('app.ProfilePage.profile', { user : data });
            $window.open(redirect, '_blank');
        }

        $scope.viewAuditTrail = function (data) {
            $scope.currentKnowledge = data;
            console.log($scope.currentKnowledge);
            $('#auditTrail').modal('show');
        }


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
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export to Excel"
                },
                
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

                if (e.model.isNew()) {
                    e.container.kendoWindow("title", "Add New");
                }
                else {
                    e.container.kendoWindow("title", "Edit");
                }

                    var postData = {
                        id : e.model.id,
                        statusId : vm.statusUpdate.value
                    };
                    
                    adminReportAPI.updateKnowledgeReuse(postData).then(function (data) {
                        if (data.result == true)
                            $scope.gridDataSource.read();
                    });
            },
            excel: {
                allPages: true,
                fileName:  "Knowledge-Reuse.xlsx"
            },
            excelExport: function (e) {
                e.preventDefault();
    
                var data_columns = [
                    { name: 'Title', width: 500 },
                    { name: 'Reuse Criteria', width: 150 },
                    { name: 'Source', width: 150 },
                    { name: 'Replicator', width: 150 },
                    { name: 'Remarks', width: 300 },
                    { name: 'Status', width: 150 },
                ];
    
                var rows = [{
                  cells: [
                    { value: "Title" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Reuse Criteria" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Source" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Replicator", background: "#7a7a7a",color: '#fff', },
                    { value: "Remarks" ,background: "#7a7a7a",color: '#fff',},
                    { value: "Status" ,background: "#7a7a7a",color: '#fff',},
                  ]
                }];
    
                var data = e.data;
                  for (var i = 0; i < data.length; i++){
    
                    // Push single row for every record.
                    rows.push({
                      cells: [
                        { value: data[i].knowledgeTitle },
                        { value: data[i].reuseCriteria },
                        { value: data[i].source },
                        { value: data[i].replicator.displayName},
                        { value: data[i].remarks },
                        { value: data[i].status },
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
    
    
                kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "KnowledgeReuse.xlsx"});
           
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
                    filterable: false,
                    attributes: {
                      "class": "check_cell",
                    }
                  },
           
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
                    field: "reuseCriteria",
                    title: "Reuse Criteria",
                    filterable: {
                        operators: {
                            string: {
                                eq: "Equals To",
                            }
                          },
                        ui:reuseCriteriaFilter
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
                    field: "Replicator",
                    title: "Replicator",
                    filterable: {
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        }
                    },
                    template: "<a href='javascript: void(0)' ng-click='viewReplicator(#:replicator.id#)'> #:replicator.displayName#</a>"},
                    {
                    field: "locationProjectName",
                    title: "Location / Project Name",
                    width: "20%",
                    filterable: {
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        }
                    }
              
                },
                {
                    field: "remarks",
                    title: "Remarks",
                    filterable: {
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        }
                    }
              
                },
                {
                    field: "status",
                    title: "Status",
                    filterable: {
                        operators: {
                            string: {
                                eq: "Equals To",
                            }
                          },
                        ui: statusFilter
                    }
                },
                {
                    title: "Audit Trail",
                    template: function (dataItem) {
                        return "<a href='javascript: void(0)' ng-click='viewAuditTrail(dataItem)'><img src='/assets/icons/new-icons/km-audit-trail-icon.svg' style='width: 30px; margin-left: 24px;'></a>";
                    }
                    
                }
            ],
        };

        $scope.Search = function () {
            $scope.isSearch = true;
            $scope.gridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
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

        function reuseCriteriaFilter(element) {
            element.kendoDropDownList({
                dataSource: $scope.reuseCriteriaList,
                optionLabel: "--Select Value--"
            });
         }
         function sourceFilter(element) {
            element.kendoDropDownList({
                dataSource: $scope.sourceFilterList,
                optionLabel: "--Select Value--"
            });
         }
         function statusFilter(element) {
            element.kendoDropDownList({
                dataSource: $scope.statusList,
                optionLabel: "--Select Value--"
            });
         }
  
        $scope.updateKnowledge = function() {
            console.log(vm.statusUpdate);
            var postData = {
                id: $scope.currentKnowledge.id,
                statusId: vm.statusUpdate
            }
            if(vm.statusUpdate != "") {
                adminReportAPI.updateKnowledgeReuse(postData).then(function(res){
                    logger.success('Knowledge Reuse Status Updated!');
                    $scope.gridDataSource.fetch();
                    $('#auditTrail').modal('hide');
                }).catch(function(e){
                    logger.error(e.data.message);
                });
                vm.statusUpdate = "";
            } else {
                $('#auditTrail').modal('hide');
            }
        }

        $scope.switchStatus = function (e) {
            console.log(e);
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
              
              adminReportAPI.deleteKnowledgeReuse(ids).then(function (data) {
                if (data.result)
                  $scope.gridDataSource.read();
              });
            });
          }, 1000);

    }
})();
