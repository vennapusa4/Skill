/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.adminSetting')
    .directive('skillCustomGridCop', skillCustomGridCop);

  /** @ngInject */
  function skillCustomGridCop() {

    return {
      restrict: 'E',
      scope: {
        category: '=',
        keyword : '='
      },
      controller: function ($scope, AdminSettingCoPApi ,  $state, Utils , $timeout) {
        $scope.categoryName = "";
        var vm = this;
        $scope.cops = [];
        $scope.count = 0;
        $scope.pageSize = 10;
        $scope.selectItemId = null;
        $scope.isCheckedMulti = false;
        $scope.isSearch = false;
        vm.checkedIds = {};
        vm.checkedItems = [];

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

     // alert($scope.keyword);
        $scope.gridDataSource = new kendo.data.DataSource({
          transport: {
            read: function (options) {
              return AdminSettingCoPApi.GetAllCoPByCategorId(options, $scope.keyword, $scope.category.id, $scope.filterBy.filters.length>0?$scope.filterBy:null);
            },
            update: function (e) {
              e.success();
            },

          },
          serverFiltering: true,
          sort: { field: "copName", dir: "asc" },
          sortable: {
            mode: "single",
            allowUnsort: false
          },
          //  serverPaging: true,
          pageSize: $scope.pageSize,
          groupable: true,
          pageable: true,
          schema: {
            data: function (e) {
              return e.data;
            },
            total: "total",
            model: {
              copId: "copId",
              fields: {
                id: {
                  type: "number"
                },
                copId: {
                  type: "string"
                },
                category: {
                  type: "string"
                },
                copName: {
                  type: "string"
                },
                copType: {
                  type: "string"
                },
                copStatus: {
                  type: "string"
                },
                numberOfMembers: {
                  type: "number"
                },
                numberOfSubscribers: {
                  type: "number"
                },
                numberOfCopChannels: {
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

  
        // mainGridOptions  start
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
      
                var grid = $("#grid"+$scope.category.id).data("kendoGrid");
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
            
              var grid = $("#grid"+$scope.category.id).data("kendoGrid");
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
            console.log(view.length);
            console.log($scope.keyword);
            if($scope.keyword != "" && $scope.keyword != null  && view.length > 0){
              console.log("IT HAS DATA");
              $scope.$emit("expandSearchedCategory" , $scope.category.id)
            }
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
            fileName:  $scope.category.name + ".xlsx"
          },
          excelExport: function (e) {
            e.preventDefault();

            var data_columns = [
                { name: 'CoP Category', width: 300 },
                { name: 'CoP Name', width: 300 },
                { name: 'Number of Subscriber in General Channel', width: 200 },
                { name: 'Number of Members in CoP Members Private Channel', width: 200 },
                { name: 'Number of Active Channels in CoP', width: 200 },
                { name: 'CoP Type', width: 200 },
                { name: 'CoP Status', width: 200 },
                { name: 'Lesson Learnt', width: 200 },
                { name: 'Best Practice', width: 200 },
                { name: 'Publication', width: 200 },
                { name: 'Technical Alert', width: 200 }
            ];

            var rows = [{
              cells: [
                { value: "CoP Category" ,background: "#7a7a7a",color: '#fff',},
                { value: "CoP Name" ,background: "#7a7a7a",color: '#fff',},
                { value: "Number of Subscriber in General Channel" ,background: "#7a7a7a",color: '#fff',},
                { value: "Number of Members in CoP Members Private Channel" ,background: "#7a7a7a",color: '#fff',},
                { value: "Number of Active Channels in CoP", background: "#7a7a7a",color: '#fff', },
                { value: "CoP Type" ,background: "#7a7a7a",color: '#fff',},
                { value: "CoP Status" ,background: "#7a7a7a",color: '#fff',},
                { value: "Lesson Learnt" ,background: "#7a7a7a",color: '#fff',},
                { value: "Best Practice" ,background: "#7a7a7a",color: '#fff',},
                { value: "Publication" ,background: "#7a7a7a",color: '#fff',},
                { value: "Technical Alert" ,background: "#7a7a7a",color: '#fff',}

              ]
            }];

            $scope.gridDataSource.fetch(function(){
              var data = this.data();

              for (var i = 0; i < data.length; i++){

                // Push single row for every record.
                rows.push({
                  cells: [
                    { value: data[i].category },
                    { value: data[i].copName },
                    { value: data[i].numberOfSubscribers },
                    { value: data[i].numberOfMembers },
                    { value: data[i].numberOfCopChannels},
                    { value: data[i].copType },
                    { value: data[i].copStatus },
                    { value: data[i].lessonLearntCount },
                    { value: data[i].bestPracticeCount },
                    { value: data[i].publicationCount },
                    { value: data[i].technialAlertCount }
                   

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


            kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: $scope.category.name + ".xlsx"});
          });
          },
          dataSource: $scope.gridDataSource,
          columns: [
            {
              field: "category",
              title: "CoP Category",
              hidden: true,
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.category + "</span>";
              }
            },
            {
               field: "copName",
              title: "CoP Name",
              width: "150px",
                sortable: {
                  initialDirection: "asc"  
                },
              filterable: {
                operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
            },
            },
            {
              field: "numberOfSubscribers",
              title: "No. of Subscriber in General Channel",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.numberOfSubscribers + "</span>";
              },
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
              field: "numberOfMembers",
              title: "No. of Members in CoP Members Private Channel",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.numberOfMembers + "</span>";
              },
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
              field: "numberOfCopChannels",
              title: "No. of Active Channels in CoP",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.numberOfCopChannels + "</span>";
              },
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
              field: "copType",
              title: "CoP Type",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.copType + "</span>";
              },
              filterable: { 
                multi: true,
                search:true,
                dataSource: 
                [
                  {
                     copType: "Public",
                  },
                  {
                    copType: "Private",
                   },
                  ],
                  checkAll: false
            }
            },
            {
              field: "copStatus",
              title: "CoP Status",
              filterable: { 
                multi: true,
                search:true,
                dataSource: 
                [
                  {
                     copType: "Active",
                  },
                  {
                    copType: "In-Active",
                   },
                  ],
                  checkAll: false
            }
            },
            {
              field: "lessonLearntCount",
              title: "Lesson Learnt",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.lessonLearntCount + "</span>";
              },
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
              field: "bestPracticeCount",
              title: "Best Practice",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.bestPracticeCount + "</span>";
              },
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
              field: "publicationCount",
              title: "Publication",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.publicationCount + "</span>";
              },
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
              field: "technialAlertCount",
              title: "Technical Alert",
              template: function (dataItem) {
                return "<span style='cursor: pointer'>" + dataItem.technialAlertCount + "</span>";
              },
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
              title: "Action",
              template: function (dataItem) {
                return '<div style="display: flex; align-items: center; margin: 0px -6px;"><span class="c-icon icon-edit k-grid-edit" ng-click="editCOP(\''+dataItem.copId+'\')" title="Edit"></span><span ng-click="ExportMembers(\''+dataItem.copId+'\')" title="Export Members"><img src="/assets/icons/new-icons/export-icon.svg" style="width: 15px; margin-left: 7px; margin-top: -8px;"></span><a href="javascript: void(0)" ng-click="viewAuditTrail(\''+dataItem.id+'\',\''+dataItem.copId+'\')" title="View Audit Trail"><img src="/assets/icons/new-icons/km-audit-trail-icon.svg" style="height: 16px; margin-left: 9px; margin-top: -2px;"></a></div>';
              }
            }
          ]
        };
        // mainGridOptions  end

        function LoadGridFilters(filterString) {
          debugger;
          if (filterString != "") {
            var filters = JSON.parse(filterString);
            filters.filters.forEach(function(filter,index){
              filter.filters.forEach(function(existingFilter){
                  existingFilter.field=existingFilter.field.charAt(0).toLowerCase() + existingFilter.field.slice(1);
              });
                
            });
            var grid = $("#grid"+$scope.category.id).data("kendoGrid");
            parseFilterDateValues(filters,checkIfDate, grid);

            var datasource= $("#grid"+$scope.category.id).getKendoGrid().dataSource;
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


        $scope.viewAuditTrail = function (id , copID) {

          $scope.copId = copID;
          AdminSettingCoPApi.getAuditTrail(id).then(function (res) {
            vm.currentCoP = [];
            if(res.length > 0 ){
              res.forEach(function(cop){
                vm.currentCoP.push(cop);
              });
            }
            $scope.$emit("showAuditTrail",vm.currentCoP);
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


        $scope.editCOP = function (copID) {
          $state.go('appAdmin.copManagement.copAdministrationAdd', { id: copID});
        }
       
      },
      templateUrl: 'app/main/apps/cop-administration/directives/skill-custom-grid-cop.html'

    };
  }
})();

