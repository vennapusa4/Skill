(function () {
    'use strict';

    angular
         .module('app.technicalAlert')
        .controller('TechnicalAlertUserManagementController', TechnicalAlertUserManagementController);

    /** @ngInject */
    function TechnicalAlertUserManagementController($scope, $timeout, UserProfileApi, CommonApi, SearchApi) {
        var vm = this;
        vm.UserName = [];
        $scope.pageSize = 10;
        $scope.selectedUserType = {};
        $scope.exportData = [
            {
                userType: "",
                disciplines:"",
                subDisciplines : "",
                location : ""
            }
        ];
         $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) { // Role Id 5 for GTA
                    return UserProfileApi.getAllGTAUsers(options, $scope.Keyword, 5, $scope.gridDataSource.total());
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: $scope.pageSize,
            schema: {
                data: function (e) {
                    return e.userProfileResponses;
                },
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        id: { type: "number" },
                        name: { type: "string" },
                        userType: { type: "object" },
                        disciplines: { type: "object" },
                        location: { type: "object" },
                        lastLogin: { type: "string" },
                        userName: { type: "string" },
                        nickName: { type: "string" },
                        email: { type: "string" },
                        active: { type: "string" },
                        cOPName: { type: "string" },
                        departmentName: { type: "string" },
                        divisionName: { type: "string" },
                        locationName: { type: "string" },
                        rankingName: { type: "string" },
                        oPU: { type: "string" },
                        skillExpertise: { type: "string" },
                        isDeleted: { type: "string" },
                        telephoneNumber: { type: "string" },
                        position: { type: "string" },
                        userRole: { type: "string" },
                        discipline: { type: "string" },
                        subDiscipline: { type: "string" }
                    }
                }
            }
        });

        $scope.Search = function () {
            $scope.gridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
            });
        }
        var exportFlag = false;
        //Grid definition
        $scope.mainGridOptions = {
            pageable: {
                pageSize: $scope.pageSize
            },
            scrollable: false,
            sortable: false,
            filter: true,
            //define dataBound event handler
            dataBound: onDataBound,
            toolbar: [
         
                {
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export to excel"
                },
            ],
            dataSource: $scope.gridDataSource,
            columns: [
                //define template column with checkbox and attach click event handler
                {
                    title: 'Select All',
                    headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox' ng-click='headerChbChangeFunc()' ><label class='k-checkbox-label' for='header-chb'></label>",
                    template: function (dataItem) {
                        return "<input type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItem(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"
                    },
                    width: "30px",
                    attributes: {
                        "class": "check_cell"
                    }
                },
                {
                    field: "name",
                    title: "Name",
                    width: "300px",
                    template: "<strong>#:data.name#</strong>"
                },
                {
                    field: "userType",
                    title: "Type",
                    template: function (dataItem , row, index) {
                        var result = "";
                        if (dataItem.userType != null && dataItem.userType.length > 0) {
                            $.each(dataItem.userType, function (index, value) {
                                result = result + value.title + "<br />";
                            });
                        }
                        return result;
                    }
                },
                {
                    field: "disciplines",
                    title: "Discipline",
                    template: function (dataItem) {
                        var result = "";
                        if (dataItem.disciplines != null && dataItem.disciplines.length > 0) {
                            $.each(dataItem.disciplines, function (index, value) {
                                result = result + value.title + "<br />";
                            });
                        }
                        return result;
                    }
                },
                {
                    field: "subDisciplines",
                    title: "Sub-Discipline",
                    template: function (dataItem) {
                        var result = "";
                        if (dataItem.disciplines != null && dataItem.disciplines.length > 0 &&
                            dataItem.disciplines[0].subDisciplineResponses != null && dataItem.disciplines[0].subDisciplineResponses.length > 0) {
                            $.each(dataItem.disciplines[0].subDisciplineResponses, function (index, value) {
                                result = result + value.title + "<br />";
                            });
                        }
                        return result;
                    }
                },
                {
                    field: "location",
                    title: "Location",
                    template: function (dataItem) {
                        var result = "";
                        if (dataItem.location != null && dataItem.location.id != null) {
                            result = result + dataItem.location.title + "<br />";
                        }
                        return result;
                    }
                },
                {
                    field: "lastLogin",
                    title: "Last Login"
                }
            ], 
            excel: {
                allPages: true,
                filterable: true,
                fileName: "TA-UserList.xlsx",
                
            },
            excelExport: function (e) {
                e.preventDefault();

                var data_columns = [
                    { name: 'Name', width: 300 },
                    { name: 'Type', width: 150 },
                    { name: 'Discipline', width: 300 },
                    { name: 'Sub-Discipline', width: 200 },
                    { name: 'Location', width: 200 },
                    { name: 'Last Login', width: 200 }
                ];

                var rows = [{
                    cells: [
                      { value: "Name" ,background: "#7a7a7a",color: '#fff',},
                      { value: "Type" ,background: "#7a7a7a",color: '#fff',},
                      { value: "Discipline" ,background: "#7a7a7a",color: '#fff',},
                      { value: "Sub-Discipline" ,background: "#7a7a7a",color: '#fff',},
                      { value: "Location" ,background: "#7a7a7a",color: '#fff',},
                      { value: "'Last Login" ,background: "#7a7a7a",color: '#fff',}
      
                    ]
                  }];

         
                UserProfileApi.exportAllGTAUsers().then(function (res) {
                    $scope.exportData = res
                    for (var i = 0; i <  $scope.exportData.length; i++){
                        // Push single row for every record.
    
                        rows.push({
                          cells: [ 
                            { value: $scope.exportData[i].name },
                            { value: $scope.exportData[i].userType },
                            { value: $scope.exportData[i].disciplines },
                            { value: $scope.exportData[i].subDisciplines },
                            { value: $scope.exportData[i].location.title},
                            { value: $scope.exportData[i].lastLogin },
                           
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
                       kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "TA-UserList.xlsx"});
                },function (error) {
                  console.log(error.message);
                 });


                 
         
        
            }
        }; 
        //Searching the Grid by the value of the textbox
        $scope.gridSearchFunc = function () {
            var searchValue = $('.grid_search').val();

            //Setting the filter of the Grid
            $(this).parents('.setting_heading').siblings('.grid').data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    },
                    {
                        field: "Title",
                        operator: "contains",
                        value: searchValue
                    }
                ]
            });
        };

        $scope.id = null;
        $scope.userTypes = [];
        $scope.SelectedDisciplineIds = [];
        $scope.SelectedSubDisciplineIds = [];
        $scope.SelectedLocations = null;
        $scope.userName = null;
        $scope.checkItem = function (data) {
            if (data.CheckItem) {
                $scope.disabledClick = false;
                $scope.id = data.id;
                $scope.userName = data.name;
                $scope.userTypes = data.userType;
                $scope.SelectedDisciplineIds = data.disciplines;
                if (data.disciplines.length > 0) {
                    $scope.SelectedSubDisciplineIds = data.disciplines[0].subDisciplineResponses;
                }
                $scope.SelectedLocations = data.location;

            } else {
                $scope.disabledClick = true;
            }
        };

        var checkedIds = {};

        function selectRow() {
            var checked = this.checked,
                row = $(this).closest("tr"),
                grid = $(".grid").data("kendoGrid"),
                dataItem = grid.dataItem(row);

            checkedIds[dataItem.id] = checked;
            if (checked) {
                //-select the row
                row.addClass("k-state-selected");
            } else {
                //-remove selection
                row.removeClass("k-state-selected");
            }
        }


        $scope.headerChbChangeFunc = function () {
            var checked = $("#header-chb").prop('checked');
            $('.row-checkbox').each(function (idx, item) {
                if (checked) {
                    if (!($(item).closest('tr').is('.k-state-selected'))) {
                        $(item).click();
                    }
                } else {
                    if ($(item).closest('tr').is('.k-state-selected')) {
                        $(item).click();
                    }
                }
            });
        };

        // Add toolbar after Grid, before pager

        //on dataBound event restore previous selected rows:
        function onDataBound(e) {
            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (checkedIds[view[i].id]) {
                    this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                        .addClass("k-state-selected")
                        .find(".checkbox")
                        .attr("checked", "checked");
                }
            }
        }

        $scope.Source = {
            dataTextField: "displayName",
            dataValueField: "name",
            filter: "contains",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return SearchApi.searchUser(options, $scope.Authors);
                    }
                },
            }
        };


        $scope.disciplinesOptions = {
            maxSelectedItems: 1,
            select: function (e) {
                vm.AllSubDisciplines = [];
                //get sub-discipline
                CommonApi.getAllSubDiscipline(e.dataItem.id).then(function (subDisdata) {
                    vm.AllSubDisciplines = subDisdata;
                    $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                        svalue.title = svalue.subDisciplineName;
                    });
                });
            },
            deselect: function (e) {
                vm.AllSubDisciplines = [];
            }
        };

        function getMasterData() {
            vm.LstUserTypes = [];
            vm.AllLocations = [];

            UserProfileApi.getAllDropdownAdminUser().then(function (totalData) {
                // get list userTypes
                vm.LstUserTypes = totalData.roles;
                $.each(vm.LstUserTypes, function (index, value) {
                    value.title = value.name;
                });
                var obj = new Object();
                obj.id = 0;
                obj.title = 'User';
                vm.LstUserTypes.push(obj);

                // get list locations
                vm.AllLocations = totalData.locations;
                $.each(vm.AllLocations, function (index, value) {
                    value.title = value.name;
                });
                $("#user-location").data("kendoMultiSelect").options.maxSelectedItems = 1;

            });

            vm.AllDisciplines = [];
            //get discipline
            CommonApi.getAllDiscipline().then(function (totalData) {
                vm.AllDisciplines = totalData;
                $.each(vm.AllDisciplines, function (index, value) {
                    value.title = value.disciplineName;
                });

                $("#user-disciplines").data("kendoMultiSelect").options.maxSelectedItems = 1;
            });
        }
        function _onOpen(e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        };

        function _onSelect(e) {
            var index = _.findIndex($scope.userName, function (obj) { return obj.name == e.dataItem.name });
            if (index == -1) {
                $scope.userName = e.dataItem;
            }
        };

        $scope.onOpen = _onOpen;
        $scope.onSelect = _onSelect;

        $timeout(function () {
            $(".k-grid-edit").addClass("k-state-disabled");
            $(".k-grid-delete").addClass("k-state-disabled");
            //Add title on toolbar
            $(".k-grid-edit").before("<h5>Bulk Actions</h5>");

            // Add toolbar after Grid, before pager
            $('.grid').each(function () {
                $(this).find(".k-grid-toolbar").clone().insertBefore($(".k-grid-pager", this));
            });

            $('.grid table').each(function () {
                $(this).wrap('<div class="table-responsive" />');
            });

            $('.grid table .k-checkbox').on("click", selectRow);

            $('.k-grid-edit').click(function (e) {
                if ($(".k-grid-edit").hasClass("k-state-disabled"))
                    return;

                var trEl = $('input#chk_' + $scope.id).closest('tr');

                vm.UserName = $scope.userName;

                vm.LstUserTypes = [];
                vm.LstSelectedUserTypes = [];
                vm.AllLocations = [];
                vm.SelectedLocationIds = [];
                UserProfileApi.getAllDropdownAdminUser().then(function (totalData) {
                    // get list userTypes
                    vm.LstUserTypes = totalData.roles;
                    $.each(vm.LstUserTypes, function (index, value) {
                        value.title = value.name;
                    });
                    var obj = new Object();
                    obj.id = 0;
                    obj.title = 'User';
                    vm.LstUserTypes.push(obj);
                    //list selected User Types

                    $.each($scope.userTypes, function (index, value) {
                        vm.LstSelectedUserTypes.push(value.id);
                    });

                    // get list locations
                    vm.AllLocations = totalData.locations;
                    $.each(vm.AllLocations, function (index, value) {
                        value.title = value.name;
                    });
                    $("#user-location").data("kendoMultiSelect").options.maxSelectedItems = 1;
                    //list selected Location

                    if ($scope.SelectedLocations !== null) {
                        vm.SelectedLocationIds.push($scope.SelectedLocations.id);
                    }
                });


                vm.AllDisciplines = [];
                vm.SelectedDisciplineIds = [];
                vm.AllSubDisciplines = [];
                vm.SelectedSubDisciplineIds = [];
                //get discipline
                CommonApi.getAllDiscipline().then(function (totalData) {
                    vm.AllDisciplines = totalData;
                    $.each(vm.AllDisciplines, function (index, value) {
                        value.title = value.disciplineName;
                    });

                    $("#user-disciplines").data("kendoMultiSelect").options.maxSelectedItems = 1;
                    //list selected discipline
                    if ($scope.SelectedDisciplineIds.length > 0) {
                        $.each($scope.SelectedDisciplineIds, function (index, value) {
                            vm.SelectedDisciplineIds.push(value.id);

                            //get sub-discipline
                            CommonApi.getAllSubDiscipline(value.id).then(function (subDisdata) {
                                vm.AllSubDisciplines = subDisdata;
                                $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                                    svalue.title = svalue.subDisciplineName;
                                });

                                if ($scope.SelectedSubDisciplineIds.length > 0) {
                                    $.each($scope.SelectedSubDisciplisZneIds, function (index, value) {
                                        vm.SelectedSubDisciplineIds.push(value.id);
                                    });
                                }
                            });
                        });
                    }
                });

                //call edit form
                $scope.grid.editRow(trEl);
                $("#user-name").attr("disabled", true);
            });

            $('.k-grid-add').click(function (e) {
                getMasterData();
                vm.UserName = [];
                vm.LstSelectedUserTypes = [];
                vm.SelectedLocationIds = [];
                vm.SelectedDisciplineIds = [];
                vm.SelectedSubDisciplineIds = [];
                $("#user-name").attr("disabled", false);
            });

            $('.k-grid-delete').click(function (e) {
                var ids = [];
                var grid = $(this).parents('.grid').data("kendoGrid");
                $(this).parents('.grid').find("input:checked").each(function () {
                    var dataItem = grid.dataItem($(this).closest('tr'));
                    ids.push(dataItem.id);
                });
                if (ids.length > 0) {
                    if (confirm("Are you sure you want to delete these records?")) {
                        UserProfileApi.delUserProfile(ids).then(function (data) {
                            if (data.result == true) {
                                $scope.Search();
                                $timeout(function () {
                                    $('.grid table .k-checkbox').on("click", selectRow);
                                },
                                    1000);
                            } else {
                                alert("delete item unsuccessful!");
                            }
                        });
                    }
                }
            });

        }, 1000);
    }
    

})();
