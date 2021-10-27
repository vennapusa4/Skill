/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('app.adminSetting')
      .directive('skillCustomGridKnowledges', skillCustomGridKnowledges);
  
    /** @ngInject */
    function skillCustomGridKnowledges() {
  
      return {
        restrict: 'E',
        scope: {
          category: '=',
        },
        controller: function ($scope, KnowledgeManagementApi ,  $state, Utils) {
          $scope.categoryName = "";
  
          $scope.cops = [];
          $scope.count = 0;
          $scope.pageSize = 10;
          $scope.Keyword = '';
          $scope.checkedIds = {};
          $scope.selectItemId = null;
          $scope.isCheckedMulti = false;
          $scope.isSearch = false;
          $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
              read: function (options) {
                return KnowledgeManagementApi.getKnowledgeCollection(options, $scope.category.collectionId);
              },
              update: function (e) {
                e.success();
              },
  
            },
           // serverFiltering: true,
            sort: { field: "kdTitle", dir: "asc" },
            sortable: {
              mode: "single",
              allowUnsort: false
            },
            //  serverPaging: true,
            pageSize: $scope.pageSize,
            filterable: true,
            groupable: true,
            pageable: true,
            schema: {
              data: function (e) {
                return e.data;
              },
              total: "total",
              model: {
                kdId: "kdId",
                fields: {
                  kdId: {
                    type: "number"
                  },
                  disciplines: {
                    type: "string"
                  },
                  kdTitle: {
                    type: "string"
                  },
                  kdType: {
                    type: "string"
                  },
                  status: {
                    type: "string"
                  },
                  totalLikesCount: {
                    type: "number"
                  },
                  totalSaveLibraryCount: {
                    type: "number"
                  },
                  totalCommentCount: {
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
            filter: true,
            dataBound: function (e) {
              var view = this.dataSource.view();
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
                  { name: 'Knowledge Title', width: 500 },
                  { name: 'Views', width: 100 },
                  { name: 'Likes', width: 100 },
                  { name: 'Shares', width: 100 },
                  { name: 'Saves', width: 100 },
                  { name: 'Ratings', width: 100 },
                  { name: 'Comments', width: 100 },
              ];
  
              var rows = [{
                cells: [
                  { value: "Knowledge Title" ,background: "#7a7a7a",color: '#fff',},
                  { value: "Views" ,background: "#7a7a7a",color: '#fff',},
                  { value: "Likes" ,background: "#7a7a7a",color: '#fff',},
                  { value: "Shares", background: "#7a7a7a",color: '#fff', },
                  { value: "Saves" ,background: "#7a7a7a",color: '#fff',},
                  { value: "Ratings" ,background: "#7a7a7a",color: '#fff',},
                  { value: "Comments" ,background: "#7a7a7a",color: '#fff',},
                ]
              }];
  
              $scope.gridDataSource.fetch(function(){
                var data = this.data();
  
                for (var i = 0; i < data.length; i++){
  
                  // Push single row for every record.
                  rows.push({
                    cells: [
                      { value: data[i].kdTitle },
                      { value: data[i].totalViewCount },
                      { value: data[i].totalLikesCount },
                      { value: data[i].totalShareCount},
                      { value: data[i].totalSaveLibraryCount },
                      { value: data[i].totalRatingCount },
                      { value: data[i].totalCommentCount } 
  
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
  
  
              kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: $scope.category.collectionName + ".xlsx"});
            });
            },
            dataSource: $scope.gridDataSource,
            columns: [
              {
                title: 'Select All',
                headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='vm.headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
                template: function (dataItem) {
                    return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='vm.checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
                },
                width: "30px",
                attributes: {
                    "class": "check_cell",
                }
            },
              {
                 field: "kdTitle",
                title: "Title",
                width: "25%",
                template: function (dataItem) {
                  return '<a ui-sref="app.knowledgeDiscovery.knowledgeDetail({id: ' + dataItem.kdId +'})" target="_blank">' + dataItem.kdTitle + '</a>'
                }
              },
              {
                field: "kdTitle",
               title: "Author",
               width: "20%",
               template: function (dataItem) {
                 var html = '';
                 dataItem.authors.forEach(function(x){
                   html = html + x.displayName + '<br/>'
                 })
                 return html;
               }
             },
              {
                field: "totalViewCount",
                title: "views",
              },
              {
                field: "totalLikesCount",
                title: "likes",
              },
              {
                field: "totalShareCount",
                title: "shares",
              },
              {
                field: "totalSaveLibraryCount",
                title: "saves",
              },
              {
                field: "totalRatingCount",
                title: "rating",
              },
              {
                field: "totalCommentCount",
                title: "comment",
              },
            ]
          };
          // mainGridOptions  end
  
  
          function getExcel(row) {
            var result = getExcelCommon(row);
            return Utils.escapeArray(result);
        };
  
          $scope.editCOP = function (copID) {
            $state.go('appAdmin.copAdministrationAdd', { id: copID});
          }
         
        },
        templateUrl: 'app/main/apps/knowledge-management/directives/skill-custom-grid-knowledges.html'
  
      };
    }
  })();
  
  