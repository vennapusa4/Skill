/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.abbreviation')
        .directive('myAbbreviation', abbreviation);

    /** @ngInject */
    function abbreviation(abbreviationAPI, Utils,  logger, appConfig) {

        return {
            restrict: 'E',
            scope: {
                id: "=",
                article: "="
            },
            controller: function ($scope) {
               // alert("Abbraviation Directive");
                $scope.pageSize = 5;
                $scope.$on('myabrreviationReload', function (event, data) {
                  console.log('broadcast received at abbreviation directive');
                  $scope.abbreviationGridConfig();
                  $("#statusgrid").data("kendoGrid").dataSource.read();
                });

                $scope.gridDataSource = new kendo.data.DataSource({
                    transport: {
                      read: function (options) {
                         return abbreviationAPI.getAllAbbreviationStatus(options);
                      }
                    },
                    serverFiltering: false,
                    serverSorting: false,
                    serverPaging: false,
                    pageSize:  $scope.pageSize,
                    schema: {
                      data: function (e) {
                        return e.data;
                      },
                      total: "total",
                      model: {
                        id: "id",
                        fields: {
                          acronym: {
                            type: "string"
                          },
                          definition: {
                            type: "string"
                          },
                          action: {
                            type: "string"
                          },
                          status: {
                            type: "string"
                          }
                        }
                      }
                    }
                  });
                 
                  $scope.abbreviationGridConfig = function(){
                    //Grid definition
                    $scope.abbraviationOptions = {
                      pageable: {
                        pageSize: $scope.pageSize
                      },
                      scrollable: false,
                      sortable: false,
                      filter: true,
                      dataBound: function (e) {
                        var view = this.dataSource.view();
                      },
                      toolbar: false,
                      excel: {
                        allPages: true,
                        filterable: true,
                        fileName: "My Abbreviations.xlsx"
                      },
                      excelExport: function (e) {
                        e.preventDefault();
                      },
                      dataSource: $scope.gridDataSource,
                      columns: [
                        {
                          field: "acronym",
                          title: "Acronym",
                          width: '15%'
                        },
                        {
                          field: "definition",
                          title: "Definition",
                          width: '55%'
                        },
                        {
                          field: "action",
                          title: "Action",
                          width: '15%'
                        },
                        {
                          field: "status",
                          title: "Status",
                          width: '15%'
                        },
                        // {
                        //   title: "Report",
                        //   width: '10%',
                        //   template: function (dataItem) {
                        //     //   console.log(dataItem);
                        //     return '<span class="c-icon icon-edit k-grid-edit likeButton" ng-click="edit(\''+dataItem.id+'\')"></span>';
                        //   }
                        // }
                      ],
                    };  
                  }
            },
            templateUrl: 'app/main/apps/abbreviation/directive/myAbbreviation.html'
            
        };
    }
})();
