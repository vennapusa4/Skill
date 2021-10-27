/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('refineSearch', refineSearch);

    /** @ngInject */
    function refineSearch() {

        return {
            restrict: 'E',
            scope: {
                filter: "=",
                sorting: "=",
                location: "=",
                view: "=",
                params: "=",
                ispeople: "=",
                totalrecords: "="
            },
            
            controller: function ($scope, $rootScope, $state, $timeout, searchPageAPI,SearchApi, $location) {
                //Default Start Date 01-01-2020
                //Default End Date 
                $scope.SearchCategory= $rootScope && $rootScope.searchParams ? $rootScope.searchParams.categoryName : 'ALL';
                $scope.keyword = '';
                $scope.searchSuggestions = [];
                $scope.authorList= [];
                $scope.knowledgeList= [];
                $scope.equipmentList= [];
                $scope.projectList= [];
                $scope.wellList= [];
                $scope.collectionList= [];
                $scope.disciplineList = [];
                $scope.currentView = 'list'
                $scope.recencyType = '';
                $scope.hasAuthor = false;
                $scope.hasKnowledge = false;
                $scope.hasEquipment = false;
                $scope.haswell = false;
                $scope.hasCollection = false;
                $scope.hasProject = false;
                $scope.hasKeyword = false;
                $scope.hasDiscipline = false;
                $scope.hideRefine = false;

                $scope.searchCategories = [];

                $scope.removeKnowledge = false;
                $scope.removeAuthor = false;
                $scope.removeProject = false;
                $scope.removeEquipment = false;
                $scope.removeWell = false;
                $scope.hasCollection = false;
                $scope.removeDiscipline = false;
                $scope.customStartDate;
                $scope.customEndDate;

                $scope.validateSearch = false;
                $scope.fromDate = "";
                $scope.toDate = "";

                if($scope.view) {
                    $scope.currentView = $scope.view;
                }
                var currentDate;
                var yearDate;
                var yr;
                var monthDate;

                if($state.current.name === 'app.SearchPage.collection') {
                    $scope.hideRefine = true
                } else {
                    $scope.hideRefine = false;
                }

                var queryUrl = $location.search();
                // filter by categories name
                // if($rootScope && $rootScope.searchParams){
                //     $scope.searchCategories.push({"displayName":$rootScope.searchParams.categoryName.substring(0, $rootScope.searchParams.categoryName.length - 1), "categoryName":$rootScope.searchParams.categoryName, "itemized":[{"itemName": $rootScope.searchParams.displayName, "itemId": +$rootScope.searchParams.itemId, "itemGuid": null}]});
                // }

                // var autocomplete = $("#RefineSearch").data("kendoAutoComplete");
                // autocomplete.value("new value");


                //for collection page
                $scope.sorting = [

                    { id: 'LatestContribution', name: 'Latest Contribution' },
                    { id: 'HighestEngagement', name: 'Highest Engagement' },
                    { id: 'MostShared', name: 'Most Shared' },
                    { id: 'HighestValueRealised', name: 'Highest Value Realised' },
                    { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
                    { id: 'HighestReplication', name: 'Highest Replication' },
                ];
                $scope.sortingBy = function (data) {
                    $location.search('sortBy', data.selectSortby); 
                    $scope.$emit('onSortingChange');
                }
                $scope.isActive = 'grid';
                $scope.selectSortby = $scope.sorting[0].id;


                
                if($rootScope && $rootScope.searchParams){
                    $scope.searchCategories.push({"displayName":$rootScope.searchParams.categoryName.substring(0, $rootScope.searchParams.categoryName.length - 1), "categoryName":$rootScope.searchParams.categoryName, "itemized":[{"itemName": $rootScope.searchParams.displayName, "itemId": +$rootScope.searchParams.itemId, "itemGuid": null}]});
                }

                function formatDate(date) {
                    //fix error display calendar when month,weekend, day
                    // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
                    var addMonth = 1;
                    date = new Date(date);
                    var day = ('0' + date.getDate()).slice(-2);
                    var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
                    var year = date.getFullYear();
    
                    return year + '-' + month + '-' + day;
                }

                var selectedDate;
                var Selectedmonth;
                var selectedYear;
                $scope.monthChange = function(e){

                
                    var yearDate = new Date($scope.year);
                    var year = yearDate.getFullYear();

                    var datePicker = e.sender;
                     selectedDate = datePicker.value();
                     Selectedmonth = selectedDate.getMonth();
                    $scope.month = Selectedmonth;

                    //to check if selected month is the current month
                    if($scope.month == monthDate){
                        $scope.fromDate =  formatDate(new Date(year, $scope.month, 1));
                        $scope.toDate = formatDate(currentDate);
                    }
                    else{
                        $scope.fromDate =  formatDate(new Date(year, $scope.month, 1));
                        $scope.toDate = formatDate(new Date(year, $scope.month + 1, 1));
                    }
                    $scope.$emit('onMonthChange' , {startDate:$scope.fromDate , endDate:$scope.toDate});
                }

                $scope.yearChange = function(e){

                    var datePicker = e.sender;
                    selectedDate = datePicker.value();
                    selectedYear  = selectedDate.getFullYear();
                    $scope.year = selectedDate;
                    $scope.fromDate;
                    $scope.toDate;
                    //Check Month
                    //var selectedDate = $scope.month;
                    if(selectedDate!=null)
                    {
                            $scope.month = new Date(selectedYear, 0, 1) ;
                            $scope.fromDate =  formatDate(new Date(selectedYear, 0, 1));
                            $scope.toDate  = formatDate(new Date(selectedYear, 11, 31));
                        
                    }
                    $scope.$emit('onYearChange' , {startDate:$scope.fromDate , endDate:$scope.toDate});

                }

                $scope.fromDate;
                $scope.toDate;
                $scope.getQuarter = function(quarter){

                    var yearDate = new Date($scope.year);
                     var year = yearDate.getFullYear();

                    if(quarter == "Q1"){
                        $scope.fromDate = new Date( year, 0, 1) ;
                        $scope.toDate = new Date( year, 2, 31) ;
                    }
                    else if(quarter == "Q2"){
                        $scope.fromDate = new Date( year, 3, 1) ;
                        $scope.toDate = new Date( year, 5, 30) ;
                    }
                    else if(quarter == "Q3"){
                        $scope.fromDate = new Date( year, 6, 1) ;
                        $scope.toDate = new Date( year, 8, 30) ;
                    }
                    else if(quarter == "Q4"){
                        $scope.fromDate = new Date( year, 9, 1) ;
                        $scope.toDate = new Date( year, 11, 31) ;
                    }
                    $scope.fromDate = formatDate($scope.fromDate)
                    $scope.toDate = formatDate($scope.toDate)
                    $scope.$emit('onQuarterChange' , { "fromDate":  formatDate($scope.fromDate) , "toDate": formatDate($scope.toDate)});
                }

                var SelectedStartDate;
                $scope.startDateChange = function(e){

                    var datePicker = e.sender;
                     selectedDate = datePicker.value();
                     SelectedStartDate = formatDate(selectedDate);
                     $scope.customStartDate= SelectedStartDate;
                }
                var SelectedEndDate;
                $scope.endDateChange = function(e){

                    var datePicker = e.sender;
                     selectedDate = datePicker.value();
                     SelectedEndDate = formatDate(selectedDate);
                     $scope.customEndDate= SelectedEndDate;
                }

                $scope.customChange = function(){
                    $scope.fromDate =  $scope.customStartDate;
                    $scope.toDate = $scope.customEndDate;

                    $scope.fromDate = formatDate($scope.fromDate)
                    $scope.toDate = formatDate($scope.toDate);

                    $scope.$emit('customDateChange' ,{ "fromDate":  $scope.fromDate , "toDate": $scope.toDate} );
                }
               

                $scope.setDefaultDate = function(){

                    currentDate = new Date();
                    $scope.year =  null;
                    yearDate =  kendo.parseDate(currentDate, "yyyy");
                    yr = yearDate.getFullYear();
                    monthDate = currentDate.getMonth();
                   // $scope.month = null;
                    
                    $scope.customStartDate = "";
                    $scope.customEndDate = "";
                    var StartDate = new Date(yr, 0, 1) ;
                    $scope.customStartDate = StartDate;
                    $scope.customEndDate = kendo.parseDate(currentDate, "yyyy-MM-DD");
   
                    $scope.max = kendo.parseDate(currentDate);
                    $scope.fromDate = formatDate(new Date(1900, 0, 1)); // 1/1/1900
                    $scope.toDate = formatDate(currentDate)
                    
                    console.log("Default From Date"+ $scope.fromDate + "Default End Date"+ $scope.toDate);
                    $scope.$emit('setDefaultDate' , {startDate:$scope.fromDate , endDate:$scope.toDate});
                }

                $scope.setDefaultDate();


                // $scope.refineSearchClick = function(){

                //     if($scope.refineKeyword.length > 4){
                //         searchPageAPI.getSuggestions($scope.refineKeyword).then(function (res) {
         
                //             if (res != null) {
                            
                //                 res.forEach(function(element) {
                //                                         switch (element.type) {
                //                                             case "Knowledges":  
                //                                                 $scope.knowledgeList.push(element);
                //                                                 $scope.hasKnowledge = true;
                //                                                 break;
                //                                             case "Authors":
                //                                                 $scope.authorList.push(element);
                //                                                 $scope.hasAuthor = true;
                //                                                 break;
                //                                             case "Projects":
                //                                                 $scope.projectList.push(element);
                //                                                 $scope.hasProject = true;
                //                                                 break;
                //                                             case "Equipments":
                //                                                 $scope.equipmentList.push(element);
                //                                                 $scope.hasEquipment = true;
                //                                                 break;
                //                                             case "Wells":
                //                                                 $scope.wellList.push(element);
                //                                                 $scope.haswell = true;
                //                                                 break;
                //                                             case "Collections":
                //                                                 $scope.collectionList.push(element);                                           
                //                                                 $scope.hasCollection = true;
                //                                                 break;
                //                                             case "Discipline":
                //                                                 $scope.disciplineList.push(element);                                           
                //                                                 $scope.hasDiscipline = true;
                //                                                 break;
                //                                             default:
                //                                                 $scope.keyword = res.text;
                //                                                 $scope.hasKeyword = true;
                //                                                 $scope.Search();
                //                                                 break;
                //                                         }
                //                                     });
    
                //             }
                //         });
                //     }
                //     else{
                //         $scope.validateSearch = true;
                //     }
                    
                //     }
                $scope.triggerchange=function()
                {
                    //$("#RefineSearch").data("kendoAutoComplete").value("");
                    var autocomplete = $("#RefineSearch").data("kendoAutoComplete");
                    autocomplete.search($scope.keyword);
                };

                $scope.onchangeCategories = function (value) {
                    $scope.SearchCategory = value.SearchCategory;
                }

                $scope.Keyword = {
                    placeholder: "Refine your search here. Select the category and click or start typing to load suggestions",
                    template: '#:data.text#',
                    // template: '<a href="#:data.linkUrl#">#:data.text#</a>',
                    dataTextField: "text",
                    dataValueField: "id",
                    filter: "contains",
                    autoBind: $rootScope && $rootScope.searchParams ? false : true,
                    value: $rootScope && $rootScope.searchParams && $rootScope.searchParams.displayName,
                    groupTemplate: "#:data.slice(36)#",
                    fixedGroupTemplate: "#:data.slice(36)#",
                    minLength: 0,
                    delay : 500,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                               return searchPageAPI.getSuggestions(options,$scope.SearchCategory,$scope.ispeople);
                            }
                        },
                        group: { field: "sortOrder" }
                    },
                    open: function (e) {
                        $timeout(function () {
                            $('.k-animation-container #RefineSearch-list').each(function () {
                                $(this).addClass('multiselect_panel');
                                
                            });
                        }, 100, false);
                    },
                    // close: function (e) {
                    //     $("#RefineSearch").data("kendoAutoComplete").value("");
                    //     setTimeout(function () {
                    //         document.activeElement.blur();
                    //     }, 15);
                    //     $scope.triggerchange();
                    // },
                    select: function (e) {
                        switch (e.dataItem.type) {
                            // case "Knowledges":  
                            //     $scope.knowledgeList.push(e.dataItem.id);
                            //     $scope.hasKnowledge = true;
                            //     break;
                            case "Knowledges":
                                $scope.searchCategories.push({"displayName":"Knowledges", "categoryName":"Knowledges", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                               
                            break;
                            case "Authors":
                                $scope.searchCategories.push({"displayName":"Author", "categoryName":"Authors", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                               
                                break;
                            case "Projects":
                                $scope.searchCategories.push({"displayName":"Project","categoryName":"Projects", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                            case "Equipments":
                                $scope.searchCategories.push({"displayName":"Equipment","categoryName":"Equipments", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                               
                                break;
                            case "Wells":
                                $scope.searchCategories.push({"displayName":"Well","categoryName":"Wells", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                               
                                break;
                            case "Collections":
                                
                                    $scope.searchCategories.push({"displayName":"Collection","categoryName":"Collection", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                    $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                            case "Disciplines":
                               
                                 $scope.searchCategories.push({"displayName":"Discipline","categoryName":"Disciplines", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                            case "Subdisciplines":
                              
                                    $scope.searchCategories.push({"displayName":"Subdiscipline","categoryName":"Subdisciplines", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                    $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                    break;
                                    
                            case "Divisions":
                                
                                $scope.searchCategories.push({"displayName":"Division","categoryName":"Divisions", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                                
                            case "Departments":
                                
                                $scope.searchCategories.push({"displayName":"Department","categoryName":"Departments", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                                
                            case "CoPs":
                                $scope.searchCategories.push({"displayName":"CoP","categoryName":"CoPs", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                                
                            case "Locations":
                                $scope.searchCategories.push({"displayName":"Location","categoryName":"Locations", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                                
                            case "Keywords":
                                $scope.searchCategories.push({"displayName":"Keyword","categoryName":"Keywords", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                break;
                                
                                case "Sources":
                                    $scope.searchCategories.push({"displayName":"Source","categoryName":"Sources", "itemized":[{"itemName": e.dataItem.text, "itemId": e.dataItem.id, "itemGuid": e.dataItem.guid}]})
                                    $scope.$emit('onCategoryChange' , $scope.searchCategories);
                                    break;
                            default:
                                // $scope.keyword = res.text;
                                // $scope.hasKeyword = true;
                                // $scope.Search();
                                break;
                        }
                        //$scope.Keyword.data("kendoAutoComplete").value('');
                        //e.sender
                    },
                };
               
                $scope.Search = function () {
                    // if ($scope.keyword != '') {
                    //     SearchApi.AddSearchText($scope.keyword);
                    //     $state.go('app.search.knowledgeDiscovery', { keyword: $scope.keyword });
                    // }
                };

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.keyword = "";
                });           

                $scope.clearSearch = function(){
                    $("#RefineSearch").data("kendoAutoComplete").value("");
                    $scope.searchCategories=[]; 
                    $scope.recencyType = "";
                    $scope.setDefaultDate();
                    $scope.$emit('onCategoryChange' , $scope.searchCategories);
                    $("#SearchCategory").val($("#SearchCategory option:first").val());

                }

               

        


                //Refine Search Implementation
                
                $scope.$on('changeView', function (event, data) {
                    $scope.$emit('onChangeView' , data);
                });
              

                //get Parameter to set as Refine Search
                if($scope.params != undefined){
                    var searchParam = $scope.params.split(",");
                    $scope.searchCategories.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": parseInt(searchParam[3])}]})
                    
                   // $scope.$emit('onCategoryChange' , $scope.searchCategories);
                }
                var checkTopic = localStorage.getItem('trendTopicName')
                if(checkTopic !== undefined && checkTopic !== null) {
                    var name = localStorage.getItem('trendTopicName');
                    var keywordID = localStorage.getItem('trendTopicID');
                    $scope.searchCategories.push({"displayName":"Keyword","categoryName":"Keywords", "itemized":[{"itemName": name, "itemId": keywordID, "itemGuid": null}]})
                    $timeout(function(){
                        localStorage.removeItem('trendTopicName');
                        localStorage.removeItem('trendTopicID');
                    }, 1000);
                }
                
                $scope.removeFilter = function(categoryName, itemName){
                    var index = _.findIndex($scope.searchCategories, 
                        function (obj) { 
                            return obj.itemized[0].itemName == itemName;
                        }); 
                        
                    if (index > -1) {
                        $scope.searchCategories.splice(index, 1);
                        $scope.$emit('onCategoryChange' , $scope.searchCategories);
                        //$scope.$broadcast('Clear', null);
                    }

                   
                }

                function getDataDocumentType() {
                    function formatDate(date) {
                        //fix error display calendar when month,weekend, day
                        // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
                        var addMonth = 1;
                        date = new Date(date);
                        var day = ('0' + date.getDate()).slice(-2);
                        var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
                        var year = date.getFullYear();
        
                        return year + '-' + month + '-' + day;
                    }
        
                    function getFilter() {
                        var results = [];
                        var arrFilter = Object.keys($scope.searchCategories).sort();
                        _.each(arrFilter, function (cate) {
                            results.push({
                                categoryName: cate,
                                itemized: _.map($scope.searchCategories[cate], function (item) { return { itemName: item.name, itemId: item.id, itemGuid: item.itemGuid } })
                            });
                        });
                        return results;
                    }
                    
                    return {
                        docType: $stateParams.docType,
                        fromDate: vm.fromDate ? formatDate(vm.fromDate) : undefined,
                        todate: vm.toDate ? formatDate(vm.toDate) : undefined,
                        year: 0,
                        category: getFilter(),
                        sortBy: vm.selectSortby.id,
                        skip: (vm.pageIndex - 1) * vm.pageSize,
                        take: vm.pageSize,
                        isShowAll: vm.isShowAll,
                        isShowHasValue: vm.isShowHasValue,
                        isShowHasVideo: vm.isShowHasVideo,
                        isShowValidate: vm.isShowValidate,
                        isShowEndorsed: vm.isShowEndorsed,
                        isShowReplications: vm.isShowReplications,
                    }
                }

                $scope.changeRecency = function(type){
                    if(type == "Month"){
                        $scope.recencyType = 'Month';
                    }
                    else if(type == "Quarter"){
                        $scope.recencyType = 'Quarter';
                    }
                    else if(type == "Year"){
                        $scope.recencyType = 'Year';
                    }
                    else{
                        $scope.recencyType = 'Custom';
                    }
                }
                function getData() {
                    // vm.loading = true;
                    searchPageAPI.getLocation($scope.keyword).then(function (data) {
                        if (data != null) {
                            bindDataTomap(data);
                        }
                    });
                }
                function bindDataTomap(data) {

                    var mapData = [];
                    _.each(data, function (x, xIndex) {
                        if (x.latitude != null && x.longitude != null) {
                            mapData.push({
                                locationId: x.locationId,
                                locationName: x.locationName,
                                location: [x.latitude, x.longitude],
                                shape: "pinTarget",
                                tooltip: {
                                    content: x.locationTypeName + ': ' + x.locationName,
                                }
                            });
                        }
                    });
                    var xMap = $("#map").kendoMap({
                        center: [4.2105, 101.9758],
                        zoom: 4,
                        layers: [{
                            type: "tile",
                            urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                            subdomains: ["a", "b", "c"],
                        }],
                        markers: mapData,
                        markerClick: clicked,
                    });
                    function clicked(e) {
                        try {
                            var currentStateName = $state.current.name;
                            var newState = '';
        
                            if (currentStateName.indexOf('Filter') != -1) {
                                newState = currentStateName.replace('Filter', '');
                            } else {
        
                                newState = currentStateName + 'Filter';
                            }
                            $('.k-popup').hide();
                            $rootScope.$broadcast('SetLayoutAfterFilter');
                            var id = e.marker.options.locationId;
                            var name = e.marker.options.locationName;
        
                            var filter = {
                                Locations: []
                            }
                            if (id != null && id != 0) {
                                filter.Locations.push({
                                    name: name,
                                    id: id
                                });
                            }
                            $scope.searchCategories.push({"categoryName":"Locations", "itemized":[{"itemName": name, "itemId":id, "itemGuid": null}]})
                           // $scope.$emit('onLocationChange' , $scope.searchCategories);
                            $scope.$emit('onCategoryChange' , $scope.searchCategories);
                            console.log(id + ' ' + name);
                            
                            //applyFilter(null, null, null, filter, newState);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }

                getData();

            },
            templateUrl: 'app/main/directives/refine-search/refine-search.html'
            
        };
    }
})();


