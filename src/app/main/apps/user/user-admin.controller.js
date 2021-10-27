(function () {
    'use strict';

    angular
        .module('app.user')
        .controller('UserAdminController', UserAdminController);

    /** @ngInject */
    function UserAdminController($scope, $timeout, UserProfileApi, CommonApi, SearchApi , appConfig) {
        var vm = this;
        vm.UserName = [];
        $scope.pageSize = 10;
        $scope.selectedUserType = {};
        $scope.userType = [];

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
        $scope.selectedView = "Default";
        $scope.getAllUserType = function () {
            UserProfileApi.getAllRole().then(function (data) {
                $scope.listUserType = data;
                $scope.listUserType.splice(0 , 1);
                $scope.listUserType.forEach(function(item){
                    $scope.userType.push(item.text);
                })
                console.log( $scope.listUserType);
                $scope.selectedUserType = $scope.listUserType[0];
            });
        }
        
        $scope.getAllUserType();
       // getMasterData();
        $scope.gridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    return UserProfileApi.getUserProfile(options, $scope.Keyword, $scope.filterBy.filters.length>0?$scope.filterBy:null, $scope.gridDataSource.total());
                }
            },
            serverFiltering : true,
            serverSorting: true,
            serverPaging: true,
            pageSize: $scope.pageSize,
            schema: {
                data: function (e) {
                    $scope.getSelectedView();
                   
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
                        location: { type: "object" },
                        lastLogin: { type: "date" },
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
                        subDiscipline: { type: "string" },
                        points: { type: "number" },
                        joinedDate: { type: "date" },
                       //joinedDate: { type: "string" },
                        interests: {type: "object"},
                        company : {type:"string"},
                        userTypes : {type : "string"},
                        disciplinesString : {type : "string"},
                        copString : {type : "string"},
                        locationString : {type : "string"},
                        subDisciplineString : {type : "string"},
                        interestsString : {type : "string"},
                        rankName: {type: "string"},
                        hasExpertInterView: {type: "string"}
                    }
                }
            },
            filterMenuInit: function(e) {
                debugger;
                if (e.field === "disciplinesString" || e.field === "subDisciplineString") {
                  var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck")
                  filterMultiCheck.container.empty();
                  filterMultiCheck.checkSource.sort({field: e.field, dir: "asc"});
  
                  // uncomment the following line to handle any grouping from the original dataSource:
              // filterMultiCheck.checkSource.group(null);
  
                  filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
                  filterMultiCheck.createCheckBoxes();

                  
                }

   
              },
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

                e.container.on("click", "[type='submit']", function () {

                    var popup = $(e.container[0]).data("kendoPopup");
                    popup.bind("close", function(e) {
                        $(".k-filter-menu").hide()
                    });

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

                    if(filter.field == "DisciplineName"){
                        filter.operator = "contains"
                    }
                    if(filter.field == "CopName"){
                        filter.operator = "contains"
                    }

                    if(filter.field == "UserTypeName"){
                         // filter.field = "SubmitterName";
                        filter.operator = "contains"
                    }

                    if(filter.field == "SubDisciplineName"){
                        // filter.field = "SubmitterName";
                       filter.operator = "contains"
                   }

                   if(filter.field == "LocationName"){
                    // filter.field = "SubmitterName";
                   filter.operator = "contains"
                    }

                    if(filter.field == "RankName"){
                        // filter.field = "SubmitterName";
                        filter.operator = "contains"
                    }
                    if(filter.field == "DepartmentName"){
                    // filter.field = "SubmitterName";
                    filter.operator = "contains"
                    }
                    if(filter.field == "DivisionName"){
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
            toolbar: [
                // {
                //     name: "create",
                //     iconClass: "c-icon icon-new",
                //     text: "Add New"
                //   },
                "edit",
                "delete",
                // {
                //     name: "create",
                //     iconClass: "c-icon icon-new",
                //     text: "Add New"
                // },
               
                { template: '<span class="glyphicon glyphicon-eye-open"></span><span class="viewSelecting">Select View</span><select ng-change="getSelectedView()" ng-model="selectedView"><option value="Default" selected="selected">Default</option><option value="Profile">Profile</option><option value="Organization">Organization</option></select>' },
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
                    filterable: {
                        extra:false,
                        operators: {
                                string: {
                                    contains: "Contains",
                                }
                            }
                    },
                    template: "<strong>#:data.name#</strong>"
                },
              
                {
                    field: "userTypes",
                    title: "Type",
                    filterable: {
                        extra:false,
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        },
                        ui: userTypeFilter
                     },
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
                    },
                    


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
                        
                    }
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
                {
                    field: "lastLogin",
                    title: "Last Login",
                    format: "{0:MM/dd/yyyy hh:m tt}",
                    filterable: {
                        operators: {
                            datetimepicker: {
                                gt: "After",
                                lt: "Before"
                              }
                          }

                      //  ui: "datetimepicker"
                    }
                },
                {
                    field: "interestsString",
                    hidden: true,
                    title: "Interest",
                    filterable: {
                        extra:false,
                        operators: {
                            string: {
                                eq: "Equals To",
                            }
                            }
                    },
                },
                {
                    field: "email",
                    hidden: true,
                    title: "Email",
                    filterable: {
                        extra:false,
                        operators: {
                            string: {
                                contains: "Contains",
                            }
                        }
                    }
                },
                {
                    field: 'copName',
                    hidden: true,
                   // headerTemplate: '<span title="CoP">CoP</span>',
                    title: 'CoP',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllCops',
                                    method : "POST",
                                    data: {
                                        field: "copName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                  //  dataSource: vm.SubDsciplineSource,
                    checkAll: false
                    
                },
                },

                {
                    field: "rankName",
                    hidden: true,
                    title: "Ranking",
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllRankingTypes',
                                    method : "GET",
                                    data: {
                                        field: "rankName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                  //  dataSource: vm.SubDsciplineSource,
                    checkAll: false
                    
                },
                },
                {
                    field: "points",
                    hidden: true,
                    title: "Points",
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            eq: "Equals To",
                        }
                    }
                    }
                },
                {
                    field: "joinedDate",
                    title: "Joined Date",
                    hidden: true,
                    format: "{0:MM/dd/yyyy}",
                    filterable: {
                        operators: {
                            date: {
                                gt: "After",
                                lt: "Before"
                              }
                          }
                    },
                },
                {
                    field: "skillExpertise",
                    title: "Expertise",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "departmentName",
                    title: "Department",
                    hidden: true,
                    filterable: { 
                        extra:false,
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllDepartments',
                                    method : "GET",
                                    data: {
                                        field: "departmentName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                        checkAll: false
                        
                    }
                },
                {
                    field: "divisionName",
                    title: "Division",
                    hidden: true,
                    filterable: { 
                        extra:false,
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/Divisions',
                                    method : "GET",
                                    data: {
                                        field: "divisionName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                        checkAll: false
                        
                    },
                },
                {
                    field: "opu",
                    title: "OPU",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "position",
                    title: "Position",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "businessUnit",
                    title: "Business Unit",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "skillGroup",
                    title: "Skill Group",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "company",
                    title: "Company",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                        string: {
                            contains: "Contains",
                        }
                    }
                    }
                },
                {
                    field: "hasExpertInterView",
                    title: "Exert Interview",
                    hidden: true,
                    filterable: {
                        multi: true,
                        search:true,
                        dataSource: [{
                            hasExpertInterView: 'YES',
                        },{
                            hasExpertInterView: 'NO',
                        }
                        ],
                        checkAll: false
                    },
                }
            ],
            
            
            excel: {
                allPages: true,
                filterable: true,
                fileName: "User Management.xlsx",
                
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

                var validator = $("#create-update-form").kendoValidator({
                    rules: {
                        required: function (input) {
                            if (input.is("[data-required-msg]")) {
                                return !_.isEmpty(input.val());
                            }
                            return true;
                        },
                        username: function (input) {
                            if (input.is("[data-username-msg]") && e.model.isNew()) {
                                return !_.isEmpty($scope.userName) && (vm.UserName === $scope.userName.displayName);
                            }
                            return true;
                        }
                    },
                    messages: {
                        required: 'Mandatory field.',
                        username: 'Invalid User Name.'
                    }
                }).data("kendoValidator");

                if (validator.validate()) {
                    var postData = new Object();
                    postData.id = e.model.id;
                    if (postData.id == 0)
                        postData.userName = $scope.userName.name;
                    else
                        postData.userName = "";
                    postData.roles = vm.LstSelectedUserTypes;
                    postData.disciplineId = vm.SelectedDisciplineIds[0];
                    postData.subDisciplines = vm.SelectedSubDisciplineIds;
                    postData.locationId = vm.SelectedLocationIds[0];

                    UserProfileApi.saveUserProfile(postData).then(function (data) {
                        if (data.result == true)
                            $scope.Search();
                        else
                            alert("Data save unssuccessfull!");
                    });
                }
            }
        };


        $scope.getSelectedView = function(){
           // alert($scope.selectedView);
            var grid = $("#xgrid").data("kendoGrid");
            

            if($scope.selectedView == "Default"){
                grid.hideColumn(grid.columns[7]);
                grid.hideColumn(grid.columns[8]);
                grid.hideColumn(grid.columns[9]);
                grid.hideColumn(grid.columns[10]);
                grid.hideColumn(grid.columns[11]);
                grid.hideColumn(grid.columns[12]);
                grid.hideColumn(grid.columns[13]);
                grid.hideColumn(grid.columns[14]);
                grid.hideColumn(grid.columns[15]);
                grid.hideColumn(grid.columns[16]);
                grid.hideColumn(grid.columns[17]);
                grid.hideColumn(grid.columns[18]);
                grid.hideColumn(grid.columns[19]);
                grid.hideColumn(grid.columns[20]);
                grid.hideColumn(grid.columns[21]);

                grid.showColumn(grid.columns[0]);
                grid.showColumn(grid.columns[1]);
                grid.showColumn(grid.columns[2]);
                grid.showColumn(grid.columns[3]);
                grid.showColumn(grid.columns[4]);
                grid.showColumn(grid.columns[5]);
                grid.showColumn(grid.columns[6]);

            }
            else if($scope.selectedView == "Profile"){
                // grid.hideColumn(grid.columns[0]);
                // grid.hideColumn(grid.columns[1]);
                //grid.hideColumn(grid.columns[2]);
                grid.hideColumn(grid.columns[3]);
                grid.hideColumn(grid.columns[4]);
                grid.hideColumn(grid.columns[5]);
                grid.hideColumn(grid.columns[6]);

                grid.showColumn(grid.columns[7]);
                grid.showColumn(grid.columns[8]);
                grid.showColumn(grid.columns[9]);
                grid.showColumn(grid.columns[10]);
                grid.showColumn(grid.columns[11]);
                grid.showColumn(grid.columns[12]);
                grid.showColumn(grid.columns[21]);
                
                grid.showColumn(grid.columns[13]);
                grid.hideColumn(grid.columns[14]);
                grid.hideColumn(grid.columns[15]);
                grid.hideColumn(grid.columns[16]);
                grid.hideColumn(grid.columns[17]);
                grid.hideColumn(grid.columns[18]);
                grid.hideColumn(grid.columns[19]);
                grid.hideColumn(grid.columns[20]);

            }
            else if($scope.selectedView == "Organization"){
                // grid.hideColumn(grid.columns[0]);
                // grid.hideColumn(grid.columns[1]);
                // grid.hideColumn(grid.columns[2]);
                // grid.hideColumn(grid.columns[3]);
                grid.hideColumn(grid.columns[4]);
                grid.hideColumn(grid.columns[5]);
                grid.hideColumn(grid.columns[6]);
                grid.hideColumn(grid.columns[7]);
                grid.hideColumn(grid.columns[8]);
                grid.hideColumn(grid.columns[9]);
                grid.hideColumn(grid.columns[10]);
                grid.hideColumn(grid.columns[11]);
                grid.hideColumn(grid.columns[12]);
                grid.hideColumn(grid.columns[21]);

                grid.hideColumn(grid.columns[13]);
                grid.showColumn(grid.columns[14]);
                grid.showColumn(grid.columns[15]);
                grid.showColumn(grid.columns[16]);
                grid.showColumn(grid.columns[17]);
                grid.showColumn(grid.columns[18]);
                grid.showColumn(grid.columns[19]);
                grid.showColumn(grid.columns[20]);
                

            }
        }
       
        function exportExcel() {
            UserProfileApi.exportAllUsers();
        }
        function getExcelData(row) {
            var result = [];
            try {
                result.push({ value: row.userName });
                result.push({ value: row.name });
                result.push({ value: row.email });
                result.push({ value: row.nickName });
                result.push({ value: (row.active === 'Active' ? 'Yes' : 'No') });
                result.push({ value: row.coPname });
                result.push({ value: row.departmentName });
                result.push({ value: row.divisionName });
                result.push({ value: row.locationName });
                result.push({ value: row.rankingName });
                result.push({ value: row.opu });
                result.push({ value: row.skillExpertise });
                result.push({ value: row.isDeleted });
                result.push({ value: row.telephoneNumber });
                result.push({ value: row.position });

                result.push({
                    value: _.join(_.uniq(_.map(row.userType, function (o) {
                        return o.title
                    })), ',')
                });

                result.push({
                    value: _.join(_.uniq(_.map(row.disciplines, function (o) {
                        return o.title
                    })), ',')
                });

                var subDisciplines = [];
                _.forEach(row.disciplines, function (o) {
                    _.forEach(o.subDisciplineResponses, function (o1) {
                        subDisciplines.push(o1.title);
                    });
                });
                result.push({ value: _.join(_.uniq(subDisciplines), ',') });
            }
            catch (err) {
                console.log(err);
            }
            finally {
                return result;
            }
        }

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
            setButtonStatus();
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
            setButtonStatus();
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
            var grid = e.sender;
            window.setTimeout(
                function(){
            var view = grid.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (checkedIds[view[i].id]) {
                    this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                        .addClass("k-state-selected")
                        .find(".checkbox")
                        .attr("checked", "checked");
                }
            }
           
            
        },10000);
        
                       
        }

        $scope.Source = {
            dataTextField: "displayName",
            dataValueField: "name",
            filter: "contains",
            minLength: 1,
            delay: 500,
            dataSource: {
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
            vm.DisciplinesSource = [];
            vm.SubDsciplineSource = [];
            vm.LocationSource = [];

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
            vm.AllDisciplinesValue = [];
            //get discipline
            CommonApi.getAllDiscipline().then(function (totalData) {
                vm.AllDisciplines = totalData;
                $.each(vm.AllDisciplines, function (index, value) {
                    vm.AllDisciplinesValue.push(value.disciplineName);
                    value.title = value.disciplineName;
                });

             //   $("#user-disciplines").data("kendoMultiSelect").options.maxSelectedItems = 1;

                $.each(totalData.disciplines, function (index, value) {
                    vm.DisciplinesSource.push({disciplinesString: value.name});
                });

                $.each(totalData.subDisciplines, function (index, value) {
                    vm.SubDsciplineSource.push(value.name);
                });

                $.each(totalData.locations, function (index, value) {
                    vm.LocationSource.push(value.name);
                });
            });
        }


        function setButtonStatus() {
            var selectchk = $(".grid table input.k-checkbox:checked");
            if (selectchk.length > 0) {
                $(".k-grid-delete").removeClass("k-state-disabled");
                if (selectchk.length === 1)
                    $(".k-grid-edit").removeClass("k-state-disabled");
                else if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                    $(".k-grid-edit").addClass("k-state-disabled");
            }
            else {
                if (!$(".k-grid-delete").hasClass("k-state-disabled"))
                    $(".k-grid-delete").addClass("k-state-disabled");
                if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                    $(".k-grid-edit").addClass("k-state-disabled");
            }
        }
        $(function () {
            setButtonStatus();
        });

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
        function userTypeFilter(element) {
            element.kendoDropDownList({
                dataSource: $scope.userType,
                optionLabel: "--Select Value--"
            });
         }

    
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

                   // $("#user-disciplines").data("kendoMultiSelect").options.maxSelectedItems = 1;
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
                                    $.each($scope.SelectedSubDisciplineIds, function (index, value) {
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
            setButtonStatus();

        }, 1000);
    }
})();
