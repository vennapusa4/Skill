(function () {
    'use strict';

    angular
        .module('app.SearchPage')
        .controller('peopleController', peopleController);

    /** @ngInject */
    function peopleController($scope,$location, profileAPI,$state, $stateParams, UserProfileApi, LandingPageAPI, searchPageAPI, appConfig, $timeout) {
        var vm = this;
        vm.dummyRelated = ['basin', 'petroleum exploration', 'sedimentory', 'type of basin', 'bayesian analysis', 'basin modelling'];
        vm.dummyUser = [
            {
                name: 'Ahmad Fitri Hakim bin Mohad Fadzil',
                title: 'King of all Kings',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Raja Azura',
                title: 'Queen',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Fateh Hamin',
                title: 'Bishop',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Nur Ikhwan Bin Mustafa',
                title: 'Castle',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Mustaqim bin Beramboi',
                title: 'Knight',
                image: '/assets/images/aidil.jpg'
            },
            {
                name: 'Saadah Munirah binti Latiff',
                title: 'King of all Kings',
                image: '/assets/images/aidil.jpg'
            }

        ];
        vm.slidercops = [];
        vm.articles = [];
        vm.pageIndex = 1;
        $scope.fromDate;
        $scope.toDate;
        vm.scrollLeftContent = function () {
            var div = document.querySelector('div#scrollContent');
            div.scrollTo(div.scrollLeft + 262, 0);
            console.log(div.scrollLeft);
        }
        $scope.categoryCountList = [
            {
              name: "All",
            },
            {
              name: "Lessons Learnt",
            },
            {
              name: "Best Practices",
            },
            {
              name: "Publications",
            },
            {
              name: "Technical Alerts",
            },
            {
              name: "Collections",
            },
            {
              name: "Community of Practice",
            },
            {
              name: "People",
            },
          ];
        $scope.isPeoplePage = true;
        $scope.isSearched = false;
        $scope.isGridView = false;
        $scope.category = [];
        $scope.peopleSearchTag = [
            { "name": "All", "value": "All", "selected": true },
            { "name": "SME", "value": "SME", "selected": false },
            { "name": "With Expert interview", "value": "With Expert interview", "selected": false },
            { "name": "People I Follow", "value": "People I Follow", "selected": false }
        ];
        $scope.listPeopleTrending = [];
        $scope.listAllPeoples = null;
        $scope.listPeopleTrendingLoader = true;
        $scope.loadingPeople = true;
        $scope.isEmptyPeople = false;
        $scope.searchKeyword = null;
        $scope.searchTime=0;

        $scope.arrSortby = [
          { id: "LatestContribution", name: "Latest Contributor" },
          { id: "HighestEngagement", name: "Highest Engagement" },
          { id: "HighestContributor", name: "Highest Contributor" },
          { id: "HighestValueContributor", name: "Highest Value Contributor" },
          { id: "HighestValidator", name: "Highest Validator" },
          { id: "HighestReplicator", name: "Highest Replicator" },
          { id: "MostPopular", name: "Most Popular" },
          { id: "AtoZ", name: "A to Z" },
          { id: "ZtoA", name: "Z to A" },
        ];


        // $scope.listSortBy = [
            
        //     {
        //         id: 15,
        //         name : 'Latest Contributor'
        //       },
        //       {
        //         id: 2,
        //         name : 'Highest Engagement'
        //       },
        //     {
        //       id: 10,
        //       name : 'Highest '
        //     },
        //     {
        //       id: 11,
        //       name : ''
        //     },
        //     {
        //       id: 12,
        //       name : ''
        //     },
        //     {
        //       id: 13,
        //       name : ''
        //     },
        //     {
        //       id: 14,
        //       name : 'Highest Rank'
        //     },
        //     // {
        //     //   id: 16,
        //     //   name : 'Most Active'
        //     // },
        //     {
        //       id: 17,
        //       name : ''
        //     },
        //     {
        //       id: 18,
        //       name : ''
        //     },
        //     {
        //       id: 19,
        //       name : ''
        //     },
        //   ]

        vm.handleChangPage = function(page){
            getDataForGridView(page)
        } 

        $scope.$on('changeView', function (event, data) {
            $scope.isGridView = data === 'grid' ? true : false;
            
        });
        $scope.$on('onSortingChange', function (event, data) {
            getDataForGridView();
        });
        $scope.$on('onTaggingChange', function (event, data) {
            getDataForGridView();            
        });
        $scope.$on('onPeopleSearch', function (event, data) {
            $scope.searchKeyword = data.searchText;
            getDataForGridView(undefined,data.searchText); 
            $scope.isSearched = !!data.searchText
        });


        $scope.$on("onMonthChange", function (event, dates) {
          $scope.fromDate = kendo.toString(new Date(dates.startDate), "dd-MMM-yyyy");
          $scope.toDate = kendo.toString( new Date(dates.endDate), "dd-MMM-yyyy");
          getDataForGridView();
        });
        $scope.$on("onYearChange", function (event, dates) {
          $scope.fromDate = kendo.toString(new Date(dates.startDate), "dd-MMM-yyyy");
          $scope.toDate = kendo.toString( new Date(dates.endDate), "dd-MMM-yyyy");
          getDataForGridView();

        });
        $scope.$on("onQuarterChange", function (event, dates) {
          var changefrom = dates.fromDate.replace('1970', kendo.toString(new Date(), "yyyy"));
          var changeto = dates.toDate.replace('1970', kendo.toString(new Date(), "yyyy"));
          $scope.fromDate = kendo.toString(new Date(changefrom), "dd-MMM-yyyy");
          $scope.toDate = kendo.toString( new Date(changeto), "dd-MMM-yyyy");
          getDataForGridView();
        });
        $scope.$on("customDateChange", function (event, dates) {
          $scope.fromDate = kendo.toString(new Date(dates.fromDate), "dd-MMM-yyyy");
          $scope.toDate = kendo.toString( new Date(dates.toDate), "dd-MMM-yyyy");       
          getDataForGridView();
        });
        $scope.$on("setDefaultDate", function (event, dates) {
          var queryUrl = $location.search();

          if ((queryUrl.startDate == undefined || queryUrl.startDate == null) && (queryUrl.endDate == undefined || queryUrl.endDate == null)) {
            $scope.fromDate = kendo.toString(new Date(dates.startDate), "dd-MMM-yyyy");
            $scope.toDate = kendo.toString( new Date(dates.endDate), "dd-MMM-yyyy");
          }
          else{
            
            $scope.fromDate = queryUrl.startDate
            $scope.toDate = queryUrl.endDate
          }

        
        });

        $scope.$on("onCategoryChange", function (event, categoryList) {
            $scope.category = categoryList;
            getDataForGridView(undefined,$scope.searchText,categoryList); 
          });
          
        function getDataForGridView (pageIndex,searchText,categoryList){
            $scope.loadingPeople = true;
            $scope.isEmptyPeople = false;
            var searchText = $("#txtSearchKeyword").val();
            if(searchText){
                $scope.searchKeyword = searchText;
            }
            var tags;
             var sorting;
             var docType;
             var queryUrl = $location.search();
            if (queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
              sorting = $scope.arrSortby[0].id;
            } else {
                sorting = queryUrl.sortBy;
            }
            if (queryUrl.tags == undefined || queryUrl.tags == null) {
            //    tags = $scope.listSortBy[0].id;
            } else {
                tags = queryUrl.tags;
                $scope.peopleSearchTag.forEach(function(tag) {
                    if(tags.includes(tag.value)){
                        tag.selected = true;
                    }
                    else{
                        tag.selected = false;
                    }
                });
            }
            


            var obj = {
                "category": $scope.category,
                "sortBy": sorting,
                "filterBy": [],
                "searchKeyword": $scope.searchKeyword ? $scope.searchKeyword : "",
                "isSME": $scope.peopleSearchTag[1].selected,
                "hasExpertInterview": $scope.peopleSearchTag[2].selected,
                "isFollowing": $scope.peopleSearchTag[3].selected,
                "skip": pageIndex ? (pageIndex - 1)*9 : (vm.pageIndex - 1)*9,
                "take": 9,
                "fromDate": $scope.fromDate,
                "toDate": $scope.toDate,
                "sortField": "string",
                "sortDir": "string",
                "isExport": true,
                "searchTerm": "string",
                "IsPeople":true
              }
            searchPageAPI.GetPeopleForGridView(obj).then(function(res){
                if(res != null || res != ""){
                    $scope.listAllPeoples = res.data;
                    vm.found = res.total;
                    $scope.searchTime=res.seconds;
                    $scope.loadingPeople = false;
                   if(res.data.length == 0){
                     $scope.isEmptyPeople = true;
                   }
                }
                    
            })
        }
        vm.loadInitialData = function (){
            vm.userInfo = UserProfileApi.getUserInfo();
            $scope.$emit('onPeopleLoad' , $scope.searchText , $scope.categoryName);
            LandingPageAPI.getSlider(vm.userInfo.userId).then(function (res) {
                if(res != null || res != "")
                {
                    console.log(res.slider);
                    res.slider.cop.forEach(function (cop) {
                        vm.slidercops.push(cop);
                    });
                    res.slider.featuredArticles.forEach(function (articles) {
                        vm.articles.push(articles);
                    });
                    res.slider.featuredArticles.forEach(function (articles, element) {
                        console.log(element);
                        if(element == 0) {
                            vm.articles.push(articles);
                        }
                    });
                    
                }
                $scope.listPeopleTrendingLoader = false;
            });
            searchPageAPI.GetTrendingPeople().then(function(res){
                if(res && res.length > 0){
                    $scope.listPeopleTrending = res;
                }
            });
            // getDataForGridView(vm.pageIndex,$scope.searchText);
            
        }

        $timeout(vm.loadInitialData, 500);

    }

})();
