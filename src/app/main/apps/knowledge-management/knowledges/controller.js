(function () {
    'use strict';

    angular
        .module('app.knowledgeManagement')
        .controller('KnowledgeManagementKnowledges', KnowledgeManagementKnowledges);

    /** @ngInject */
    function KnowledgeManagementKnowledges($scope, KnowledgeManagementApi, $timeout, $window, Utils, CommonApi, BulkUploadApi, UserProfileApi, KnowledgeDiscoveryApi, SearchApi, logger, MasterDataGameMechanicsApi,appConfig) {
        //alert('knowledge management');

        var vm = this;
        vm.pageSize = 10;
        vm.searchTerm = '';
        vm.checkedIds = {};
        vm.checkedItems = [];
        vm.selectItemId = null;
        vm.isCheckedMulti = false;
        vm.isSearch = false;
        vm.hasAttachment = false;
        vm.bulk = {};
        vm.AllLLType = [];
        vm.AllStatus = [];
        vm.AdminStatus = [];
        vm.options = null;


       //localStorage["kendo-grid-filter"]=$scope.filterBy;

        $scope.filterBy = {

            logic: "and",
            filters: []
        };
        localStorage["kendo-grid-filter"]=null;

        $scope.filterByOriginal = {
            logic: "and",
            filters: []
        };
        $scope.filters = [];
        
        vm.filterByTypes = [];
        vm.filterType = "";
        vm.isWithReplication = false;
        $scope.selectedView = "Default";
        vm.isAdminDisble = false;
        $scope.userInfo = UserProfileApi.getUserInfo();
        $scope.userInfo.isAdmin = $scope.userInfo.roles.indexOf("Administrator")!=-1;

        vm.hasAttachment = ["Yes" , "No"]
       
        $scope.auditTrail = [];
        $scope.viewAuditTrail = function (data) {
            KnowledgeDiscoveryApi.getAuditTrial(data.id).then(function (res) {
                $scope.auditTrail = [];
                if (res != null && res != "") {
                  $scope.auditTrail = res;
                  $('#auditTrail').modal('show');
                }
              });
           
        }
        $scope.skippingReview = function() {

            KnowledgeManagementApi.getSkipStatus().then(function (data) {
                $scope.skipStatus = data.skipReview;
                $('#skipReview').modal('show');
             });
            
          }
          $scope.showDone = false;
          $scope.skipStatus;

            $scope.submittingSkip = function() {
            
                KnowledgeManagementApi.skipReview(!$scope.skipStatus).then(function (data) {
                
                if($scope.skipStatus == false){
                    logger.success("Enabled Successfully");
                    
                }
                else{
                    logger.success("Disabled Successfully")
                }
                $("#skipReview").modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }, function (err) {
                logger.error(err);
            });

        }

        var deferFeedKnowledgeDocumentTypes = MasterDataGameMechanicsApi.feedKnowledgeDocumentTypes().then(function (data) {
            vm.filterByTypes = data;
        });

        var searchDisciplineId = 0;
        var searchAuthorId = '';
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
                    // var filterBy = [
                    //     { field: 'Disciplines', value: searchDisciplineId },
                    //     { field: 'Authors', value: searchAuthorId },
                    //     { field: 'Types', value: vm.filterType }
                    // ];
                    // vm.filterBy = filterBy;
                    vm.options = options;
                    return KnowledgeManagementApi.getKnowledges(options, vm.searchTerm, $scope.filterBy.filters.length>0?$scope.filterBy:null, vm.gridDataSource.total(), vm.isWithReplication);
                },
                update: function (e) {
                    e.success();
                },
                destroy: function (e) {
                    KnowledgeManagementApi.deleteItem({ id: e.data.id }).then(function (data) {
                        if (data.result) {
                            vm.gridDataSource.read();
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
            pageSize: vm.pageSize,
            schema: {
                data: function (e) {
                 //   $scope.getSelectedView();
                    return e.data;
                },
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        submitterName:{
                            type: "string"
                        },
                        title: {
                            type: "string"
                        },
                        type: {
                            type: "string"
                        },
                        attachment: {
                            type: "boolean"
                        },

                        status: {
                            type: "string"
                        },
                        createdDate: {
                            type: "date"
                        },
                        reviewerUserName : {
                            type: "string"
                        },
                        reviewDate : {
                            type: "date"
                        },
                        smeUserName: {
                            type: "string"
                        },
                        validationDate : {
                            type: "date"
                        },
                        endorserUserName : {
                            type: "string"
                        },
                        endorsementDate : {
                            type: "date"
                        },
                        estimatedValue:{
                            type: "string"
                        },
                        remark : {
                            type: "string"
                        },
                        copName : {
                            type: "string"
                        },
                        location : {
                            type: "string"
                        },
                        originallanguage: {
                            type: "string"
                        },
                        replicationId : {
                            type: "number"
                        },
                        replicationKnowledgeIdString:{
                            type:"string"
                        },
                        replicationKnowledgeName : {
                            type: "string"
                        },
                        totalReplicationCount : {
                            type: "number"
                        },
                        views : {
                            type: "number"
                        },
                        likes: {
                            type: "number"
                        },
                        shares : {
                            type: "number"
                        },
                        comments : {
                            type: "number"
                        },
                        bookmarks: {
                            type: "number"
                        },
                        currentVersion : {
                            type: "number"
                        },
                        submitter : {
                            type: "string"
                        },
                        disciplinesString : {
                            type: "string"
                        },
                        authorString :{
                            type:"string"
                        },
                        attachmentTypeString :{
                            type:"string"
                        },
                        attachmentSizeString :{
                            type:"string"
                        },
                        attachmentNameString :{
                            type:"string"
                        },
                        translatedlanguageString: {
                            type: "string"
                        },
                        currentVersionString: {
                            type: "string"
                        },
                        valueTypeString: {
                            type: "string"
                        },
                        estimatedValueString: {
                            type: "string"
                        },
                        replicationKnowledgeNameString : {
                            type: "string"
                        },
                        keywordString : {
                            type: "string"
                        },
                        remarkString : {
                            type: "string"
                        },
                        attachmentString:{
                            type: "string"
                        },
                        published : {
                            type: "boolean"
                        },
                        docType : {
                            type: "boolean"
                        },
                        rating: {
                            type: "number"
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

                      if(filter.field == "DisciplineName"){
                             filter.operator = "contains"
                      }
                      if(filter.field == "AuthorString"){
                        filter.operator = "contains"
                      }
                      if(filter.field == "CreatedDate"){
                        filter.value.setHours(filter.value.getHours() + 8);
                      }
                        if(filter.field == "AttachmentTypeString"){
                            filter.operator = "contains"
                        }
                        if(filter.field == "ValueTypeString"){
                            filter.operator = "contains"
                        }
                    if(filter.field == "Originallanguage"){
                        filter.operator = "contains"
                    }
                    if(filter.field == "TranslatedlanguageString"){
                        filter.operator = "contains"
                    }
                    if(filter.field == "CopName"){
                        filter.operator = "contains"
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
               // { template: '<kendo-button ng-click="vm.exportColumns()" class="k-button k-grid-export2"><span class="c-icon icon-export"></span>Export</kendo-button>' },
                "edit",
                "delete",
              
                { template: '<kendo-button ng-click="skippingReview()" class="k-grid-validate">Skip Review</kendo-button>' },
                // { template: '<kendo-button ng-click="vm.exportAllColumns()" class="k-button k-grid-export"><span class="c-icon icon-export"></span>Export All Columns</kendo-button>' },
                // { template: "<kendo-button class='k-grid-validate' style='margin-left:5px;'>Export to excel</kendo-button>" },
              
                { template: '<span><span class="glyphicon glyphicon-eye-open"></span><span class="viewSelecting">Select View</span><select ng-change="getSelectedView()" ng-model="selectedView"><option value="Default" selected="selected">Default</option><option value="Published">Published</option><option value="Workflow">Workflow</option><option value="Metadata">Metadata</option><option value="Value">Value</option><option value="Attachment">Attachment</option><option value="Replication">Replication</option><option value="Translation">Translation</option><option value="Engagement">Engagement</option></select></span>' },
                {
                    name: "excel",
                    iconClass: "c-icon icon-export",
                    text: "Export to excel"
                },
            ],
            dataSource: vm.gridDataSource,
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
                    field: "title",
                    title: "Title",
                    filterable: {
                        extra:false,
                        operators: {
                            extra:false,
                            string: {
                                contains: "Contains",
                            }
                        }
                  },
                   // headerTemplate: '<span title="Title">Title</span>',
                    template: function (dataItem) {
                        var result = "";
                        console.log($scope.selectedView);
                            if (dataItem.title == null || dataItem.title.trim() == '') dataItem.title = 'No Title';

                            if (dataItem.type == 'Best Practices') {
                                result = "<a href='/knowledge-discovery/best-practices/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Lessons Learnt') {
                                result = "<a href='/knowledge-discovery/lessons-learnt/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Publications') {
                                result = "<a href='/knowledge-discovery/publications/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else if (dataItem.type == 'Technical Alerts') {
                                result = "<a href='/knowledge-discovery/technical-alerts/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                            else {
                                // Default
                              result = "<a href='/knowledge-discovery/insights/build?id=" + dataItem.id + "'>" + dataItem.title + "</a>"
                            }
                      
                        return result;
                    }
                },
                //For Engagement View link is different
                {
                    field: "title",
                    title: "Title",
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                            extra:false,
                            string: {
                                contains: "Contains",
                            }
                        }
                      },
                    template: function (dataItem) {
                        return "<a href='/knowledge-discovery/" + dataItem.id + "'>" + dataItem.title + "</a>"
                    }
                },
                {
                    field: "type",
                   //headerTemplate: '<span title="Type">Type</span>',
                    title: "Type",
                    width: '100px',
                    filterable: { 
                        multi: true,
                                    search:true,
                                    dataSource: [{
                                        type: "Lessons Learnt",
                                    },
                                    {
                                        type: "Best Practices",
                                    },
                                    {
                                        type: "Publications",
                                    },
                                    {
                                        type: "Technical Alerts",
                                    },
                                    {
                                        type: "Insights",
                                    },
                                    {
                                        type: "Ideas",
                                    }
                                    ],
                                    checkAll: false
            
                                
            
                    }
                },
                {
                    field: 'status',
                    title: 'Status',
                  //  headerTemplate: '<span title="Status">Status</span>',
                    width: '90px',
                    filterable: {
                        multi: true,
                        search:true,
                        dataSource: [
                            {
                                status: "Draft",
                            },
                            {
                                status: "Submit",
                            },
                            {
                                status: "Review",
                            },
                            {
                                status: "Approve",
                            },
                            {
                                status: "Reject",
                            }
                        ],
                        checkAll: false
                    },
                },
                {
                    field: "attachmentString",
                    hidden: true,
                    title: "<i class='icon-attachment'></i>",
                   // template: '#: attachment ? "Yes":"No" #',
                    width: '60px',
                    filterable: {
                        multi: true,
                        search:true,
                        dataSource: [{
                            attachmentString: "Yes",
                        },{
                            attachmentString: "No",
                        }
                        ],
                        checkAll: false
                    },
                },
                {
                    field: 'disciplineName',
                    //headerTemplate: '<span title="Discipline">Discipline</span>',
                   title: 'Discipline',
                    width: '120px',
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
                    
                //    template: '# for(var i = 0; i < disciplineResponses.length; i++) {# #:disciplineResponses[i].title# <br/> #}#'
                },
                {
                    field: 'authorString',
                    title: 'Author',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllAuthors',
                                    method : "GET",
                                    data: {
                                        field: "authorString"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                      //  dataSource: vm.SubDsciplineSource,
                        checkAll: false
                        
                    },
                   // headerTemplate: '<span title="Author">Author</span>',
                  //  template: '# for(var i = 0; i < author.length; i++) {# #:author[i].title# <br/> #}#',
                    width: '150px'
                },
                {
                    field: 'submitter',
                   title: 'Submitter',
                   // headerTemplate: '<span title="Submitter">Submitter</span>',
                    width: '150px',
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
                        checkAll: false
                        
                    },
                },
                {
                    field: 'createdDate',
                    title: 'Date',
                   // headerTemplate: '<span title="Date">Date</span>',
                    format: '{0:dd-MMM-yyyy}',
                    width: '120px',
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
                    field: 'reviewerUserName',
                    //headerTemplate: '<span title="Reviewer">Reviewer</span>',
                    title: 'Reviewer',
                    hidden: true,
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllReviewers',
                                    method : "GET",
                                    data: {
                                        field: "reviewerUserName"
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
                    field: 'reviewDate',
                    title: 'Review Date',
                    hidden: true,
                    //headerTemplate: '<span title="Review Date">Review Date</span>',
                    format: '{0:dd-MMM-yyyy}',
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
                    field: 'smeUserName',
                    title: 'SME (Validate)',
                    hidden: true,
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllSMEValidators',
                                    method : "GET",
                                    data: {
                                        field: "smeUserName"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                      //  dataSource: vm.SubDsciplineSource,
                        checkAll: false
                        
                    },
                   // headerTemplate: '<span title="SME (Validate)">SME (Validate)</span>',
                    width: '120px'
                },
                {
                    field: 'validationDate',
                    title: 'Validation Date',
                    hidden: true,
                    format: '{0:dd-MMM-yyyy}',
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
                    field: 'endorserUserName',
                    title: 'Endorser',
                    hidden: true,
                  //  headerTemplate: '<span title="Endorser">Endorser</span>',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllEndorsers',
                                    method : "GET",
                                    data: {
                                        field: "endorserUserName"
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
                    field: 'endorsementDate',
                    title: 'Endorsment Date',
                    hidden: true,
                    format: '{0:dd-MMM-yyyy}',
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
                    title: "Audit Trail",
                    hidden: true,
                    template: function (dataItem) {
                        return "<a href='javascript: void(0)' ng-click='viewAuditTrail(dataItem)'><img src='/assets/icons/new-icons/km-audit-trail-icon.svg' style='width: 30px; margin-left: 24px;'></a>";
                    }  
                },
                {
                    field: 'originallanguage',
                    hidden: true,
                   // headerTemplate: '<span title="Language">Language</span>',
                    title: 'Language',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllOriginalLanguages',
                                    method : "GET",
                                    data: {
                                        field: "originallanguage"
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
                    field: 'locationName',
                    hidden: true,
                  //  headerTemplate: '<span title="Location">Location</span>',
                    title: 'Location',
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
                        checkAll: false
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
                   
                    field: 'keywordString',
                    hidden: true,
                    title: 'Keyword',
                    filterable: {
                        extra:false,
                        operators: {
                          string: {
                              contains: "Equals To",
                          }
                        }
                      },
                },
                {
             
                    field: 'valueTypeString',
                    hidden: true,
                    title: 'Value Type',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllValueTypes',
                                    method : "GET",
                                    data: {
                                        field: "valueTypeString"
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
            

                    field: 'estimatedValueString',
                    hidden: true,
                   title: 'Value',
                    filterable: {
                        extra:false,
                        operators: {
                            string: {
                                contains: "Equals To",
                            }
                          }
                      },
                },
                {
                    field: 'remarkString',
                    hidden: true,
                    title: 'Remarks',    
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
              

                    field: 'attachmentNameString',
                    hidden: true,
                    title: 'Attachment Name',
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
                    field: 'attachmentTypeString',
                    title: 'Attachment Type',
                    hidden: true,
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllAttachmentTypes',
                                    method : "GET",
                                    data: {
                                        field: "attachmentTypeString"
                                    }
                                }
                            }
                        },
                        multi: true,
                        search: true,
                  //  dataSource: vm.SubDsciplineSource,
                   // checkAll: false
                    
                },
                    //headerTemplate: '<span title="Attachment Type">Attachment Type</span>',
                    // template: function (dataItem) {
                    //     var result = "";
                    //     if (dataItem.attachmentTypes != null && dataItem.attachmentTypes.length > 0) {
                    //         $.each(dataItem.attachmentTypes, function (index, value) {
                    //             result = result + value + "<br />";
                    //         });
                    //     }
                    //     return result;
                    // }
                },
                {

            
                    field: 'attachmentSizeString',
                    title: 'Attachment Size',
                    hidden: true,
                    filterable: {
                        extra:false,
                        operators: {
                          string: {
                            contains: "Equals to",
                          }
                        }
                      },
                  //  headerTemplate: '<span title="Attachment Size">Attachment Size</span>',
                    // template: function (dataItem) {
                    //     var result = "";
                    //     if (dataItem.attachmentSizes != null && dataItem.attachmentSizes.length > 0) {
                    //         $.each(dataItem.attachmentSizes, function (index, value) {
                    //             console.log("download link" + value);
                    //             result = result +  "<p><a href='" + value +"' download>Download File</a></p><br />";
                    //         });
                    //     }
                    //     return result;
                    // }

                },
                {
                    field: 'attachmentDownloadLinksString',
                    title: 'Download Links',
                    hidden: true,
                    filterable: false,
                   // headerTemplate: '<span title="Download Links">Download Links</span>',
                    template: function (dataItem) {
                        var result = "";
                        if (dataItem.attachmentDownloadLinksString != null && dataItem.attachmentDownloadLinksString.length > 0) {
                            $.each(dataItem.attachmentDownloadLinksString.split(","), function (index, value) {
                                result = result + "<a href='"+value+"' download>Download</a><br />";
                            });
                        }
                        return result;
                    }

                },
                {
                    field: 'replicationKnowledgeIdString',
                    title: 'Replicated ID',
                    hidden: true,
                   // headerTemplate: '<span title="Replicated ID">Replicated ID</span>',
                   filterable: {
                    extra:false,
                    operators: {
                      string: {
                          contains: "Equals To",
                      }
                    }
                  },
                },
                {
                 

                    field: 'replicationKnowledgeNameString',
                    title: 'Replicated Knowledge Name',
                    hidden: true,
                   // headerTemplate: '<span title="Replicated Knowledge Name">Replicated Knowledge Name</span>',
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
                    field: 'totalReplicationCount',
                    title: 'Replicated Count',
                    hidden: true,
                  //  headerTemplate: '<span title="Replicated Count">Replicated Count</span>',
                  filterable: {
                    extra:false,
                    operators: {
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
                    field: 'originallanguage',
                    hidden: true,
                    title: 'Original Language',
                 //   headerTemplate: '<span title="Original Language">Original Language</span>',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllOriginalLanguages',
                                    method : "GET",
                                    data: {
                                        field: "originallanguage"
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
                    field: 'translatedlanguageString',
                    hidden: true,
                  //  headerTemplate: '<span title="Translated Language">Translated Language</span>',
                    title: 'Translated Language',
                    filterable: { 
                        dataSource: {
                            transport: {
                                read: {
                                    url: appConfig.SkillApi + 'api/Lookup/AllLanguages',
                                    method : "GET",
                                    data: {
                                        field: "translatedlanguageString"
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
                    //     var result = "";
                    //     if (dataItem.translatedlanguage != null && dataItem.translatedlanguage.length > 0) {
                    //         $.each(dataItem.translatedlanguage, function (index, value) {
                    //             result = result + value + "<br />";
                    //         });
                    //     }
                    //     return result;
                    // }
                },
                {
                    
                    field: 'id' ,
                    hidden: true,
                    title: "Knowledge Id"   ,
                    filterable : {
                        extra:false,
                        number:{
                            eq: "Equals To",
                            
                          }
                    }
                   // headerTemplate: '<span title=""Knowledge Id">"Knowledge Id</span>',              
                },
                {
                   
                    field : "currentVersionString",
                    hidden: true,
                    title: "Current Version",
                    //headerTemplate: '<span title="Current Version">Current Version</span>',
                    filterable: {
                         extra:false,
                        operators: {
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
                    field: 'views',
                    hidden: true,
                  //  headerTemplate: '<span title="Views">Views</span>',
                    title: 'Views',
                    filterable: {
                        extra:false,
                        operators: {
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
                    field: 'likes',
                    hidden: true,
                  //  headerTemplate: '<span title="Like">Like</span>',
                    title: 'Likes',
                    filterable: {
                        extra:false,
                        operators: {
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
                    field: 'shares',
                    hidden: true,
                 //   headerTemplate: '<span title="Share">Share</span>',
                    title: 'Shares',
                    filterable: {
                        extra:false,
                        operators: {
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
                    field: 'comments',
                    hidden: true,
                //    headerTemplate: '<span title="Comments">Comments</span>',
                    title: 'Comments',
                    filterable: {
                        extra:false,
                        operators: {
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
                    field: 'bookmarks',
                    hidden: true,
                  //  headerTemplate: '<span title="Bookmarks">Bookmarks</span>',
                    title: 'Bookmark',
                    filterable: {
                        extra:false,
                        operators: {
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
                field: 'rating',
                  //  headerTemplate: '<span title="Bookmarks">Bookmarks</span>',
                   hidden: true,
                  //    headerTemplate: '<span title="Comments">Comments</span>',
                      title: 'Rating',
                      filterable: {
                          extra:false,
                          operators: {
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
                    field: 'published',
                  //  headerTemplate: '<span title="Bookmarks">Bookmarks</span>',
                    title: 'Published',
                    filterable: {
                        multi: true,
                        search:true,
                        dataSource: [{
                            published: true,
                        },{
                            published: false,
                        }
                        ],
                        checkAll: false
                    },
                }
                
                
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#editorTemplate").html())
            },
            excel: {
                allPages: true,
                filterable: true,
                fileName: "KnowledgeManagement.xlsx"
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
            change: function () {
                // TODO: Refactor to use data-binding instead. Currently, data-binding doesn't update button state immediately
                var selectedCount = vm.grid.select().length;

                vm.grid.element.find('.k-grid-edit').each(function () {
                    $(this).kendoButton().data('kendoButton').enable(selectedCount === 1);
                });
                vm.grid.element.find('.k-grid-delete,.k-grid-validate').each(function () {
                    $(this).kendoButton().data('kendoButton').enable(selectedCount > 0);
                });
            },
            save: function (e) {
                e.preventDefault();
              
                    if (e.model.type !== 'Bulk') {
                        var formData = {
                            id: e.model.id,
                            title: vm.dataItem.title,
                            DisciplineIds: vm.SelectedDisciplineIds,
                            SubDisciplineIds: vm.SelectedSubDisciplineIds,
                            SMEUserId: vm.dataItem.smeUser != null ? vm.SMEUserId : null,
                            AuthorIds: vm.SelectedAuthorIds,
                            hasAttachment: vm.dataItem.hasAttachment,
                            type: vm.dataItem.type,
                            published: vm.bulk.published
                        };
    
                        KnowledgeManagementApi.updateKnowledge(formData).then(function (data) {
                            if (data.result) {
                                vm.gridDataSource.read();
                            }
                        });
                    } else {
                        var postData = {
                            comment: vm.bulk.comment,
                            ids: vm.bulk.ids,
                            type: vm.bulk.updateType ? vm.bulk.type : null,
                            smeUserId: vm.bulk.updateSME ? vm.bulk.smeId : null,
                            statusId: vm.bulk.updateStatus ? vm.bulk.status.id : null,
                            EndorsementStatusId : vm.bulk.updateEndorserStatuses ? vm.bulk.endorderstatus.id : _.head(vm.EndorserStatuses).id,
                            lessonLearntTypeId: (vm.bulk.updateType && vm.bulk.type === 'Lesson Learnt') ? vm.bulk.lessonLearntType : null,
                            published: vm.bulk.published
                        };
                        KnowledgeManagementApi.api.batchUpdate.save(null, postData).$promise.then(function (res) {
                            logger.success('Update successfully');
                            vm.gridDataSource.read();
                        }, function (err) {
                            logger.error(err);
                        });
                    }
               

            },
            beforeEdit: function (e) {
                //if (_.size(vm.checkedIds) > 1) {
                e.model.type = "Bulk";
                vm.ReviewerStatus = [];
                vm.EndorserStatuses = [];

                  //Keep the fields Disabled, Admin should not change it. Bug # 166811
                // if(e.model.status == "Approve"){
                //     alert(e.model.status);
                //     if( $scope.userInfo.isAdmin){
                //         alert($scope.userInfo.isAdmin);
                //         vm.isAdminDisble = true
                //     }
                  
                    
                // }
                KnowledgeManagementApi.getAllRefs().then(function (data) {
                    vm.AllLLType = data.allLLType;
                    vm.AllStatus = data.allStatus;
                    //var res = arr.map((key) => obj[key]);
        
                    vm.AdminStatus = [];
                    vm.AllStatus.forEach(function(status){
                        var idx = _.indexOf(_.map(appConfig.AdminStatus, function (o, idx) { return o; }), status.title);
                        if(idx != -1){
                            vm.AdminStatus.push(status);
                        }
                    });

                    vm.AllStatus.forEach(function(status){
                        var idx = _.indexOf(_.map(appConfig.EndorserStatuses, function (o, idx) { return o; }), status.title);
                        if(idx != -1){
                            vm.EndorserStatuses.push(status);
                        }
                    });
                
                    vm.bulk = {
                        updateType: false,
                        type: 'Best Practice',
                        lessonLearntType: _.head(data.allLLType).id,
                        updateSME: false,
                        sme: null,
                        updateStatus: false,
                        updateEndorserStatuses: false,
                        status: _.head(vm.AdminStatus),
                        endorderstatus: _.head( vm.EndorserStatuses),
                        comment: null,
                        smeId: null,
                        ids: _.map(vm.checkedIds, function (val, key) { return val }),
                        hasPublication: !_.isEmpty(_.filter(vm.checkedItems, function (o) { return o.type === 'Publications' })),
                        hasDraft: !_.isEmpty(_.filter(vm.checkedItems, function (o) { return o.status === 'Draft' })),
                        published: false
                    };
                }, function (err) {
                    logger.error(err.data.message);
                });
                //}
            },
            edit: function (e) {
                if (_.size(vm.checkedIds) > 1) {
                    $('.k-window-titlebar').find('.k-window-title').text('Bulk Edit');
                    vm.SMEControl.enable(false);
                }
            }
        };

        $("#xgrid").kendoGrid().data("kendoGrid").thead.kendoTooltip({
            filter: "th",
            content: function (e) {
                var target = e.target; // element for which the tooltip is shown
                return $(target).text();
            }
        });

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

        $scope.getSelectedView = function(){
           // alert($scope.selectedView);
            var grid = $("#xgrid").data("kendoGrid");
            $scope.filterBy = {

                logic: "and",
                filters: []
    
            };

            if($scope.selectedView == "Default"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.showColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.showColumn(grid.columns[6]); // discipline
                grid.showColumn(grid.columns[7]); // author
                grid.showColumn(grid.columns[8]); // submitter
                grid.showColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Published"){

                $scope.filterBy = {
                    
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "Status"},
                                  {value: true, operator: "eq", field: "Published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "DocType"},
                        {value: "Insights", operator: "neq", field: "DocType"}]}
                        
                    ]
        
                };

                $scope.filterByOriginal = {
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "status"},
                                  {value: true, operator: "eq", field: "published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "docType"},
                        {value: "Insights", operator: "neq", field: "docType"}]}
                        
                    ]
                }


                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.showColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.showColumn(grid.columns[6]); // discipline
                grid.showColumn(grid.columns[7]); // author
                grid.showColumn(grid.columns[8]); // submitter
                grid.showColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Workflow"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.showColumn(grid.columns[10]); // reviewer user name
                grid.showColumn(grid.columns[11]); // review date
                grid.showColumn(grid.columns[12]); // sme user name
                grid.showColumn(grid.columns[13]); // validate date
                grid.showColumn(grid.columns[14]); // endorser 
                grid.showColumn(grid.columns[15]); // endorsement date
                grid.showColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Metadata"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.showColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.showColumn(grid.columns[17]); // language
                grid.showColumn(grid.columns[18]); // location
                grid.showColumn(grid.columns[19]); // cop
                grid.showColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
                
            }
            else if($scope.selectedView == "Value"){
                $scope.filterBy = {
                    
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "Status"},
                                  {value: true, operator: "eq", field: "Published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "DocType"},
                        {value: "Insights", operator: "neq", field: "DocType"}]}
                        
                    ]
        
                };

                $scope.filterByOriginal = {
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "status"},
                                  {value: true, operator: "eq", field: "published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "docType"},
                        {value: "Insights", operator: "neq", field: "docType"}]}
                        
                    ]
                }
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.showColumn(grid.columns[14]); // endorser 
                grid.showColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.showColumn(grid.columns[21]); // value type
                grid.showColumn(grid.columns[22]); // value
                grid.showColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating

            }
            else if($scope.selectedView == "Attachment"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.showColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.showColumn(grid.columns[24]); //attachmnet names
                grid.showColumn(grid.columns[25]); // attachment types
                grid.showColumn(grid.columns[26]); // attachmnet sizes
                grid.showColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Replication"){
                $scope.filterBy = {
                    
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "Status"},
                                  {value: true, operator: "eq", field: "Published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "DocType"},
                        {value: "Insights", operator: "neq", field: "DocType"}]}
                        
                    ]
        
                };

                $scope.filterByOriginal = {
                    logic: "and",
                    filters: [
                        {logic: "or", 
                        filters: [{value: "Approve", operator: "eq", field: "status"},
                                  {value: true, operator: "eq", field: "published"}]},
                        {logic: "and", 
                        filters: [{value: "Ideas", operator: "neq", field: "docType"},
                        {value: "Insights", operator: "neq", field: "docType"}]}
                        
                    ]
                }
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.showColumn(grid.columns[28]); // replication id
                grid.showColumn(grid.columns[29]); // replicated knowledge name
                grid.showColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Translation"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.showColumn(grid.columns[1]); //title
                grid.hideColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.showColumn(grid.columns[31]); // original language
                grid.showColumn(grid.columns[32]); // translated laguages
                grid.showColumn(grid.columns[33]); // knowledge id 
                grid.showColumn(grid.columns[34]); // current version
                grid.hideColumn(grid.columns[35]); // views
                grid.hideColumn(grid.columns[36]); // likes
                grid.hideColumn(grid.columns[37]); // shares
                grid.hideColumn(grid.columns[38]); // comments
                grid.hideColumn(grid.columns[39]); // bookmarks
                grid.hideColumn(grid.columns[40]); // rating
            }
            else if($scope.selectedView == "Engagement"){
                grid.showColumn(grid.columns[0]); // checkbox
                grid.hideColumn(grid.columns[1]); //title
                grid.showColumn(grid.columns[2]); // title for Engagement
                grid.hideColumn(grid.columns[3]); //type
                grid.showColumn(grid.columns[4]); // status
                grid.hideColumn(grid.columns[5]); // attachment
                grid.hideColumn(grid.columns[6]); // discipline
                grid.hideColumn(grid.columns[7]); // author
                grid.hideColumn(grid.columns[8]); // submitter
                grid.hideColumn(grid.columns[9]); // created date
                grid.hideColumn(grid.columns[10]); // reviewer user name
                grid.hideColumn(grid.columns[11]); // review date
                grid.hideColumn(grid.columns[12]); // sme user name
                grid.hideColumn(grid.columns[13]); // validate date
                grid.hideColumn(grid.columns[14]); // endorser 
                grid.hideColumn(grid.columns[15]); // endorsement date
                grid.hideColumn(grid.columns[16]); // Audit Trail
                grid.hideColumn(grid.columns[17]); // language
                grid.hideColumn(grid.columns[18]); // location
                grid.hideColumn(grid.columns[19]); // cop
                grid.hideColumn(grid.columns[20]); // keyword
                grid.hideColumn(grid.columns[21]); // value type
                grid.hideColumn(grid.columns[22]); // value
                grid.hideColumn(grid.columns[23]); // remarks
                grid.hideColumn(grid.columns[24]); //attachmnet names
                grid.hideColumn(grid.columns[25]); // attachment types
                grid.hideColumn(grid.columns[26]); // attachmnet sizes
                grid.hideColumn(grid.columns[27]); // download links
                grid.hideColumn(grid.columns[28]); // replication id
                grid.hideColumn(grid.columns[29]); // replicated knowledge name
                grid.hideColumn(grid.columns[30]); // replication couint
                grid.hideColumn(grid.columns[31]); // original language
                grid.hideColumn(grid.columns[32]); // translated laguages
                grid.hideColumn(grid.columns[33]); // knowledge id 
                grid.hideColumn(grid.columns[34]); // current version
                grid.showColumn(grid.columns[35]); // views
                grid.showColumn(grid.columns[36]); // likes
                grid.showColumn(grid.columns[37]); // shares
                grid.showColumn(grid.columns[38]); // comments
                grid.showColumn(grid.columns[39]); // bookmarks
                grid.showColumn(grid.columns[40]); // rating
            }
            
            var datasource= $("#xgrid").getKendoGrid().dataSource;
            datasource.filter( $scope.filterBy);
  
        }
       
        function htmlDecode(value) {
            return $('<div/>').html(value).text();
        };

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


        function getExcelLL(row) {
            var result = getExcelCommon(row);
            var addmore = [
                { value: 'To be follow' },
                { value: htmlDecode(row.supposedToHappen) },
                { value: htmlDecode(row.actuallyHappen) },
                { value: htmlDecode(row.whyDifference) },
                { value: htmlDecode(row.whatLearn) }
            ];
            var args = [1, 0].concat(addmore);
            Array.prototype.splice.apply(result, args);
            result.push({ value: formatDate(row.createdDate) });
            return Utils.escapeArray(result);
        };

        function getExcelBP(row) {
            var result = getExcelCommon(row);
            var addmore = [
                { value: htmlDecode(row.supposedToHappen) },
                { value: htmlDecode(row.actuallyHappen) },
                { value: htmlDecode(row.whyDifference) },
                { value: htmlDecode(row.whatLearn) }
            ];
            var args = [2, 0].concat(addmore);
            Array.prototype.splice.apply(result, args);
            result.push({ value: formatDate(row.createdDate) });
            return Utils.escapeArray(result);
        };

        function getExcelPub(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.smeUserName });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: row.sourcename });
            result.push({ value: row.isbn });
            result.push({ value: row.url });
            result.push({ value: row.articleTitle });
            result.push({ value: row.bookTitle });
            
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: row.eventName });
            result.push({ value: row.eventYear });
            result.push({ value: row.digitalMediaTypeName });
            result.push({ value: row.publishedDate });
            result.push({ value: row.newspaperName });
            result.push({ value: row.magazineName });
            result.push({ value: row.publicationMonth });
            result.push({ value: row.publicationYear });
            result.push({ value: row.country });
            result.push({ value: row.society });
            result.push({ value: row.audienceLevel });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });

            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: row.referenceTitle});
            result.push({ value: _.join(row.attachmentNames, ',') });
            result.push({ value: row.createdDate });
            return result;
        };

        function getExcelTA(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.description });
            result.push({ value: row.recommendation });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.groupTechnicalAuthority });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: _.join(row.attachmentNames, ',') });
            result.push({ value: row.createdDate });
            return result;
        };


        function getExcelCommon(row) {
            var result = [];
            result.push({ value: row.title });
            result.push({ value: row.summary });
            result.push({ value: row.kdStage });
            result.push({ value: row.copName });
            result.push({ value: row.location });
            result.push({ value: row.valueCreationType });
            result.push({ value: row.status });
            result.push({ value: row.smeUserName });
            result.push({ value: row.createdByName });
            result.push({ value: row.documentTypeName });
            result.push({ value: _.join(_.uniq(_.map(row.disciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.uniq(_.map(row.subDisciplineResponses, function (o) { return o.title })), ',') });
            result.push({ value: _.join(_.map(row.author, function (o) { return o.title }), ',') });
            result.push({ value: _.join(row.project, ',') });
            result.push({ value: _.join(row.projectPhase, ',') });
            result.push({ value: _.join(row.wells, ',') });
            result.push({ value: _.join(row.wellsPhase, ',') });
            result.push({ value: _.join(row.wellOperation, ',') });
            result.push({ value: _.join(row.equipment, ',') });
            result.push({ value: _.join(row.keyword, ',') });
            result.push({ value: _.join(row.valueType, ',') });
            result.push({ value: _.join(row.estimatedValue, ',') });
            result.push({ value: _.join(row.remark, ',') });
            result.push({ value: _.join(row.referenceTitle, ',') });
            result.push({ value: _.join(row.attachmentNames, ',') });
            return result;
        };

        vm.SelectedDisciplineIds = [];
        vm.checkItem = function (data) {
            if (data.CheckItem) {
                vm.checkedIds[data.id] = data.id;
                vm.checkedItems.push(angular.copy(data));
                vm.selectItemId = data.id;
            } else {
                try {
                    delete vm.checkedIds[data.id];
                    _.remove(vm.checkedItems, function (o) { return o.id === data.id });
                } catch (ex) { }
                vm.selectItemId = vm.checkedIds ? vm.checkedIds[Object.keys(vm.checkedIds)[0]] : null;
            }

            setButtonStatus();
        };

        function setButtonStatus() {
            var selectchk = $(".grid table input.k-checkbox:checked");
            if (selectchk.length > 0) {
                $(".k-grid-delete").removeClass("k-state-disabled");
                $(".k-grid-edit").removeClass("k-state-disabled");
                //if (selectchk.length === 1)
                //    $(".k-grid-edit").removeClass("k-state-disabled");
                //else if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                //    $(".k-grid-edit").addClass("k-state-disabled");
            }
            else {
                if (!$(".k-grid-delete").hasClass("k-state-disabled"))
                    $(".k-grid-delete").addClass("k-state-disabled");
                if (!$(".k-grid-edit").hasClass("k-state-disabled"))
                    $(".k-grid-edit").addClass("k-state-disabled");
            }
        };

        vm.headerChbChangeFunc = function () {
            var checked = $("#header-chb").prop('checked');
            vm.isCheckedMulti = checked;
            $('.row-checkbox').each(function (idx, item) {
                if (checked != $(item).prop("checked"))
                    $(item).trigger('click');
            });
        };

        vm.validate = function () {
            var selectedIds = _.map(vm.checkedIds, function (num, key) { return key; });
            if (selectedIds.length <= 0) return;

            KnowledgeManagementApi.validate(selectedIds).then(function (response) {
                if (response.result) {
                    logger.success('Validate success.');
                    vm.gridDataSource.read();
                }
                else {
                    logger.success('There selected items cannot validate.');
                }
            });
        };



        vm.exportWithReplication = function () {
            vm.isWithReplication = true;
            // Trigger export excel event
            var grid = $("#xgrid").data("kendoGrid");
            grid.saveAsExcel();

            vm.isWithReplication = false;

            //var options = angular.copy(vm.options);
            //var total = angular.copy(vm.gridDataSource.total());
            //KnowledgeManagementApi.exportWithReplication(options, vm.searchTerm, vm.filterBy, total);
            //vm.gridDataSource.read();
            //return;
        };

        vm.AllDisciplines = [];
        vm.AllSubDisciplines = [];

        vm.disciplinesOptions = {
            select: function (e) {

                vm.AllSubDisciplines = [];
                //get sub-discipline
                vm.SelectedDisciplineIds.push(e.dataItem.id);
                CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                    vm.AllSubDisciplines = items;
                    $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                        svalue.title = svalue.subDisciplineName;
                    });
                });
            },
            deselect: function (e) {
                vm.AllSubDisciplines = [];
                var indexItem = vm.SelectedDisciplineIds.indexOf(e.dataItem.id);
                if (indexItem != -1) {
                    vm.SelectedDisciplineIds.splice(indexItem, 1);
                    CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                        vm.AllSubDisciplines = items;
                        $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                            svalue.title = svalue.subDisciplineName;
                        });
                    });
                }
            }
        };

        vm.BulkSMESource = {
            dataTextField: "Text",
            dataValueField: "Id",
            filter: "contains",
            minLength: 1,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return BulkUploadApi.GetSmeUsers(options);
                    }
                },
            },
            select: function (e) {
                vm.bulk.smeId = e.dataItem.Id;
            }
        };

        vm.SMEUserId = null;
        vm.SMESource = {
            dataTextField: "Text",
            dataValueField: "Id",
            filter: "contains",
            minLength: 1,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return BulkUploadApi.GetSmeUser(options, vm.SelectedDisciplineIds);
                    }
                },
            },
            select: function (e) {
                vm.SMEUserId = e.dataItem.Id;
            }
        };

        vm.DisciplineSrc = {
            dataTextField: "Text",
            dataValueField: "Id",
            placeholder: "Filter by Discipline",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return KnowledgeDiscoveryApi.getDiscipline(options, [], []);
                    }
                }
            },
            open: function (e) {
                $timeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                });
            },
            select: function (e) {
                searchDisciplineId = e.dataItem.Id;
                vm.search();
            },
            change: function (e) {
                if (_.isEmpty(vm.searchDiscipline)) {
                    searchDisciplineId = 0;
                    vm.search();
                }
            }
        };

        vm.AuthorSrc = {
            dataTextField: "displayName",
            dataValueField: "name",
            placeholder: "Filter by Author",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return SearchApi.searchUser(options, []);
                    }
                },
            },
            open: function (e) {
                $timeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                });
            },
            select: function (e) {
                searchAuthorId = e.dataItem.name;
                vm.search();
            },
            change: function (e) {
                if (_.isEmpty(vm.searchAuthor)) {
                    searchAuthorId = '';
                    vm.search();
                }
            }
        };

        vm.toggleSME = function () {
            vm.SMEControl.enable(vm.bulk.updateSME);
        };

        vm.AllAuthors = [];
        vm.SelectedAuthorIds = [];

        function _onOpen(e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        };

        $scope.onOpen = _onOpen;

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
            $(".k-grid-delete").addClass("k-state-disabled");
            $(".k-grid-edit").addClass("k-state-disabled");
            $('.k-grid-edit').on('click', function (e) {
                //if (vm.isCheckedMulti) return;
                if (!vm.checkedIds) return;
                if (_.size(vm.checkedIds) === 1) {
                    var trEl = $('input#chk_' + vm.selectItemId).closest('tr');

                    vm.SelectedDisciplineIds = [];
                    vm.SelectedSubDisciplineIds = [];
                    vm.SelectedAuthorIds = [];
                    vm.AllAuthors = [];
                    KnowledgeManagementApi.getKnowledgeDocumentSettingById(vm.selectItemId).then(function (data) {
                        vm.dataItem = data;
                        vm.SelectedDisciplineIds = _.map(data.discipline, function (o) { return o.id; });

                        if (data.smeUser != null) {
                            vm.SMEUserId = data.smeUser.id;
                            vm.SMEUser = data.smeUser.title;
                        }

                        // Get all Authors                    
                        UserProfileApi.getAllUsers().then(function (allAuthors) {
                            vm.AllAuthors = allAuthors;
                            vm.SelectedAuthorIds = _.map(data.authors, function (o) { return o.id; });
                        });
                        if (vm.SelectedDisciplineIds != null && vm.SelectedDisciplineIds.length > 0) {
                            CommonApi.getSubDisciplines(vm.SelectedDisciplineIds).then(function (items) {

                                vm.AllSubDisciplines = items;
                                $.each(vm.AllSubDisciplines, function (sindex, svalue) {
                                    svalue.title = svalue.subDisciplineName;
                                });
                                vm.SelectedSubDisciplineIds = _.map(data.subDiscipline, function (o) { return o.id; });
                            });
                        }

                        vm.hasAttachment = angular.copy(data.hasAttachment);
                    });
                    vm.grid.editRow(trEl);
                } else {
                    var trEl = $('input#chk_' + _.sample(vm.checkedIds)).closest('tr');
                    vm.grid.editRow(trEl);
                }
            });

            $('.k-grid-delete').click(function (e) {
                if (!vm.checkedIds) {
                    return;
                }
                var ids = _.map(vm.checkedIds, function (num, key) { return key; });
                if (ids.length <= 0) return;

                var confirm = $window.confirm("Are you sure you want to delete this record?");
                if (!confirm) {
                    return;
                }

                KnowledgeManagementApi.deleteKnowledges(ids).then(function (data) {
                    if (data.result)
                        vm.gridDataSource.read();
                });
            });

            UserProfileApi.getAllUsers().then(function (allAuthors) {
                vm.AllAuthors = allAuthors;
            });

            CommonApi.getAllDiscipline().then(function (items) {
                vm.AllDisciplines = items;
            });

        }, 1000);
    }

})();
