(function () {
    "use strict";
  
    angular
      .module("app.SearchPage")
      .controller("KnowledgesController", KnowledgesController);
  
    /** @ngInject */
    function KnowledgesController(
      $scope,
      $window,
      $timeout,
      searchPageAPI,
      KnowledgeDocumentApi,
      UserProfileApi,
      CollectionApi,
      $log,
      $location,
      LandingPageAPI,
      appConfig,
      $stateParams,
      $state,
      $rootScope,
      KnowledgeDiscoveryApi
    ) {
      var vm = this;
  
      vm.isEndorsed = false;
      vm.withVideo = false;
      vm.withValue = false;
      vm.withReplication = false;
      vm.isValidated = false;
      vm.withAudio = false;
      $scope.currentView = "list";
      $scope.trendingKnowledge = [];
      vm.pageIndex = 1;
      vm.maxSize = 8;
      vm.found = 0;
      vm.pageSize = 10;
      vm.sorting="";
      $scope.cop;
      $scope.searchFilters = [];
      $scope.loadedTrendKnowledge = false;
      $scope.loadedKnowledge = false;
      $scope.loadedKnowledgeCount = false;
      $scope.category = [];
      $scope.potentialValueTotal = 0;
      $scope.searchTime=0;
      $scope.valueRealizedTotal = 0;
      $scope.isAdmin;
      $scope.mediaLoaded = false;
      $scope.setPage = function (pageNo) {
        vm.pageIndex = pageNo;
      };
      $scope.taTypeModel = 0;
  
      $scope.fromDate;
      $scope.toDate;
      $scope.isdeepSearch = false;
      $scope.nowPlayingTrendingMedia = undefined;
      $scope.categoriesFilterList = [];
      $scope.taCategoriesFilterList = [];
      $scope.basicPeopleList = [];
      $scope.viewSearch = false;

      $scope.arrSortby = [
        { id: "LatestContribution", name: "Latest Contribution" },
        { id: "HighestEngagement", name: "Highest Engagement" },
        { id: "MostShared", name: "Most Shared" },
        { id: "HighestValueRealised", name: "Highest Value Realised" },
        { id: "HighestPotentialValue", name: "Highest Potential Value" },
        { id: "HighestReplication", name: "Highest Replication" },
      ];

      function playMedia(data, isPlay) {
        $scope.nowPlayingTrendingMedia = data;
  
        if (data) {
          var myOptions = {
            nativeControlsForTouch: false,
            controls: true,
            autoplay: false,
            width: "100%",
            height: "auto",
          };
          $timeout(function () {
            var myPlayerSearchTrending = amp("azuremediaplayerSearch", myOptions);
            myPlayerSearchTrending.src([
              {
                src: data.mediaURL,
                type: "application/vnd.ms-sstr+xml",
              },
            ]);
            amp("azuremediaplayerSearch").ready(function () {
              myPlayerSearchTrending = this;
              if (isPlay) {
                myPlayerSearchTrending.play();
              }
            });
          }, 500);
        }
      }
      function kmlFormatter(num, tofixed) {
        var result = num > 999 ? (num / 1000).toFixed(3) + "K" : num;
        if (num >= 1000000000) {
          return (num / 1000000000).toFixed(3) + "B";
        } else {
          if (num >= 1000000) {
            return (num / 1000000).toFixed(3) + "M";
          } else {
            if (num >= 1000) {
              return (num / 1000).toFixed(3) + "K";
            } else {
              return num;
            }
          }
        }
        return result;
      }
      $scope.showMediaInNewTab = function () {
        var url = $location.url();
  
        var docType;
        var searchParam = "";
        var queryUrl = $location.search();
  
        docType = queryUrl.docType;
        if (queryUrl.searchKeyword != undefined) {
          searchParam = queryUrl.searchKeyword;
        }
  
        $window.open(
          $state.href("app.SearchPage.media", {
            docType: docType,
            searchKeyword: searchParam,
          }),
          "_blank"
        );
        // $state.go('app.SearchPage.media', { "docType": docType, "searchKeyword":searchParam }, { reload : true, newtab : true, target : "_blank" });
      };
  
      // Format currency
      $scope.kmlFormatter = function (str) {
        return kmlFormatter(str);
      };
  
      vm.scrollLeftContent = function () {
        var div = document.querySelector("div#scrollContent");
        div.scrollTo(div.scrollLeft + 262, 0);
        console.log(div.scrollLeft);
      };
  
      $scope.isSearched = false;
  
      function handleGetBasicPeople(searchText,take){
        searchPageAPI.BasicSearchPeople(searchText,take).then(function(res){
          if(res && res.length > 0){
            $scope.basicPeopleList = res;
          }
        })
      }
      function parse(s) {
        var i;
        for (i = 0; i < s.length; i++) {
          console.log(s.length - i);
          try {
          return partialParse(s.slice(0, s.length-i));
          }
          catch(e) {
            console.dir(e);
          }
        }
      }
      function getTrendingKnowledge(searchText, categoryName) {
        $scope.loadedTrendKnowledge = false;
        searchPageAPI
          .getTrendingKnowledge1(searchText, categoryName)
          .then(function (res) {
            res.forEach(function (knowledge) {
              $scope.trendingKnowledge.push(knowledge);
            });
            $scope.loadedTrendKnowledge = true;
            $timeout(function(){
              checkTrendingToggle ();
            }, 500)}
            ,(p) =>  {
              debugger
            },(sp)=>  {
              debugger;
              var aa=parse(sp);
            }
          );
      }
  
      //For Search Single COP
      $scope.pageChanged = function (page) {
        if (page <= 0) return;
        vm.pageIndex = page;
        getKnowledge();
      };
      function getSingleCoP(searchText) {
        searchPageAPI.getSingleCOP(searchText).then(function (cop) {
          $scope.cop = cop;
        });
      }
  
      //For Knowledge Discovery Single COP
      function SearchTrendingSingleCop(docType) {
        searchPageAPI.SearchTrendingSingleCop(docType).then(function (cop) {
          $scope.cop = cop;
        });
      }
  
  
      $scope.setSelectedFilters = function () {
        var kdType;
        $scope.searchFilters.push({ "name": "All", "value": "All", "selected": true });
        for (kdType in appConfig.SearchFilters) {
          if (appConfig.SearchFilters.hasOwnProperty(kdType)) {
            var value = appConfig.SearchFilters[kdType];
            $scope.searchFilters.push({
              name: value,
              value: kdType,
              selected: false,
            });
          }
        }
      };
  
      function getKnowledge() {
        $scope.loadedKnowledge = false;
        $scope.loadedKnowledgeCount=false;
        var filters;
        var sorting;
        var docType;

        var queryUrl = $location.search();
        if (queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
            sorting = $scope.arrSortby[0].id;
        } else {
            sorting = queryUrl.sortBy;
            vm.sorting=queryUrl.sortBy;
        }
        if (queryUrl.filter === undefined || queryUrl.filter === null) {
            filters = $scope.searchFilters.map(function (x) { return x.name }).slice(1);
        } else {
            filters = queryUrl.filter;
        }

        if (queryUrl.isEndorsed == false || queryUrl.isEndorsed == "false" || queryUrl.isEndorsed == undefined) {
            vm.isEndorsed = false;
        }
        else {
            vm.isEndorsed = true;
        }
        if (queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined) {
            vm.isValidated = false;
        }
        else {
            vm.isValidated = true;
        }
        if (queryUrl.withVideo == false || queryUrl.withVideo == "false" || queryUrl.withVideo == undefined) {
            vm.withVideo = false;
        }
        else {
            vm.withVideo = true;
        }

        if (queryUrl.withAudio == false || queryUrl.withAudio == "false" || queryUrl.withAudio == undefined) {
            vm.withAudio = false;
        }
        else {
            vm.withAudio = true;
        }

        if (queryUrl.withValue == false || queryUrl.withValue == "false" || queryUrl.withValue == undefined) {

            vm.withValue = false;
        }
        else {
            vm.withValue = true;
        }

        if (queryUrl.withReplication == false || queryUrl.withReplication == "false" || queryUrl.withReplication == undefined) {

            vm.withReplication = false;
        }
        else {
            vm.withReplication = true;
        }
        if (queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined) {

            vm.isValidated = false;
        }
        else {
            vm.isValidated = true;
        }

        var skip = (vm.pageIndex - 1) * vm.pageSize;
        docType = queryUrl.docType;
        $scope.userInfo = UserProfileApi.getUserInfo();

        $scope.knowledgeID;
        $scope.searchData = {
            "searchKeyword": $scope.searchText,
            "searchKeywordTranslated": [
                ""
            ],
            "docType": docType,
            "fromDate": $scope.fromDate,
            "todate": $scope.toDate,
            "year": 0,
            "userid": 0,
            "category": $scope.category,
            "sortBy": sorting,
            "filterBy": [],
            "isShowHasValue": vm.withValue,
            "isShowHasVideo": vm.withVideo,
            "isShowValidate": vm.isValidated,
            "isShowEndorsed": vm.isEndorsed,
            "isShowReplications": vm.withReplication,
            "isShowHasAudio": vm.withAudio,
            "skip": skip,
            "take": vm.pageSize,
            "sortField": "",
            "sortDir": "",
            "isExport": true,
            "searchTerm": $scope.searchText,
            "isdeepSearch": $scope.isdeepSearch,
            "publicationTypes": $scope.categoriesFilterList.filter(function(x) {return x.selected}).map(function(x) {return x.value}),
            "technicalAlertTypeId": $scope.taTypeModel
        }

        $scope.articles = [];
        searchPageAPI.getKnowledge($scope.searchData).then(function (res) {

            if (res.data != null) {
                $scope.articles = res.data;
                if(skip==0)
                {
                    vm.found = res.total;
                    $scope.potentialValueTotal = Math.ceil(res.potentialValueTotal);
                    $scope.valueRealizedTotal = Math.ceil(res.valueRealizedTotal);
                    $scope.searchTime=res.seconds;
                }
                // $scope.hasDataLoaded = true;
            }
            else {
                // $scope.hasDataLoaded = true;
            }
            $scope.loadedKnowledge = true;
            //debugger;
            if($scope.searchText!='' && $scope.searchText!=null && $scope.category.length==0 && skip==0)
            {
                 searchPageAPI.getKnowledgeCount($scope.searchData).then(function (res) {

                    if (res != null) {
                        vm.found = res.total;
                        $scope.potentialValueTotal = Math.ceil(res.potentialValueTotal);
                        $scope.valueRealizedTotal = Math.ceil(res.valueRealizedTotal);
                        $scope.loadedKnowledgeCount = true;
                    }
                    else {
                        // $scope.hasDataLoaded = true;
                    }
                    

                });
            }
            else
            {
                $scope.loadedKnowledgeCount = true;
            }
        });
    }
      $scope.$on("changeView", function (event, data) {
        $scope.currentView = data;
      });
  
      $scope.getKnowledgeID = function (knowledgeID) {
        $scope.knowledgeID = "";
        $scope.knowledgeID = knowledgeID;
        console.log($scope.knowledgeID);
        //$('#showArticle_' + knowledgeID).modal('show');
      };
      function checkTrendingToggle () {
        var checkSorting = localStorage.getItem('TrendingToggle');
              if(checkSorting !== undefined && checkSorting !== null) {
                if(checkSorting == 'open') {
                  $('#collapseTrending').collapse({
                    toggle: true
                  })
                } 
                  $timeout(function(){
                      localStorage.removeItem('TrendingToggle');
                  }, 1000);
              } 
      }
  
      $scope.showArticle = function (data) {
        $scope.selectedArticle = null;
  
        var articleInfo = {};
  
        var postData = { knowledgeDocumentId: data };
        KnowledgeDocumentApi.knowledgeDocument(postData).then(function (res) {
          if (res != null) {
            articleInfo["knowledge"] = res;
          }
  
          KnowledgeDocumentApi.GetKnowledgeUserInfo(data).then(function (res) {
            if (res != null) {
              articleInfo["user_info"] = res;
            }
            KnowledgeDocumentApi.api.replicationDetails.query(
              {},
              postData,
              function (response) {
                articleInfo["replicationDetail"] = response;
                KnowledgeDocumentApi.GetKnowledgeAdditionInfo(data).then(
                  function (response) {
                    articleInfo["additional_info"] = response;
                    KnowledgeDocumentApi.api.replicationHistory.query(
                      {},
                      postData,
                      function (response) {
                        articleInfo["replicationHistory"] = response;
                        $scope.selectedArticle = articleInfo;
                        console.log($scope.selectedArticle);
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      }
                    );
                  }
                );
              },
              function (response) {
                if (response.status !== 404)
                  logger.error(response.data.errorMessage);
              }
            );
          });
        });
      };

      $scope.disableCollectionBtn = true;
      $scope.isCollectionSelected = false;
      $scope.checkCollection = function(){
        $scope.isCollectionSelected = false;
        $scope.ngModel.collections.forEach(function(item) {
          if(item.isChild == true) {
              $scope.isCollectionSelected = true;
          }
      });

      if($scope.isCollectionSelected){
        $scope.disableCollectionBtn = false;
      }
      else{
        $scope.disableCollectionBtn = true; 
      }

      }
      //Refine Search Filters Start
      
      $scope.$on("onDeepSearch", function (event, isDeepSearch) {
        $scope.isdeepSearch = isDeepSearch;
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });
      
  
      $scope.$on("onCategoryChange", function (event, categoryList) {
        $scope.category = categoryList;
        console.log($scope.category);
        debugger;
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });
  
      $scope.$on("onAdditionalFilterChange", function (event) {
        
        //   Tag.filter Tag.value
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });
  
      $scope.$on("onSortingChange", function (event) {
        //   Tag.filter Tag.value
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });

      $scope.$on("setDefaultDate", function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;

        // filter by categories name
        var checkTopic = localStorage.getItem('trendTopicName')
        if($rootScope.searchParams && $rootScope.searchParams.categoryName && $rootScope.searchParams.displayName){
          debugger;
            $scope.category = [{"displayName":$rootScope.searchParams.categoryName.substring(0, $rootScope.searchParams.categoryName.length - 1), "categoryName":$rootScope.searchParams.categoryName, "itemized":[{"itemName": $rootScope.searchParams.displayName, "itemId": $rootScope.searchParams.itemId, "itemGuid": null}]}];
        } 
        else if(checkTopic !== undefined && checkTopic !== null) {
          var name = localStorage.getItem('trendTopicName');
          var keywordID = localStorage.getItem('trendTopicID');
          $scope.category = [{"displayName":"Keyword","categoryName":"Keywords", "itemized":[{"itemName": name, "itemId": keywordID, "itemGuid": null}]}];
        }
        
        getKnowledge();
  
      });
      $scope.$on("onMonthChange", function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;
        getKnowledge();
      
      });
      $scope.$on("onYearChange", function (event, dates) {
        $scope.fromDate = dates.startDate;
        $scope.toDate = dates.endDate;
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });
      $scope.$on("onQuarterChange", function (event, dates) {
        $scope.fromDate = dates.fromDate;
        $scope.toDate = dates.toDate;
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=null)
        // {
        //     getKnowledgeCount();
        // }
      });
      $scope.$on("customDateChange", function (event, dates) {
        $scope.fromDate = dates.fromDate;
        $scope.toDate = dates.toDate;
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=undefined)
        // {
        //     getKnowledgeCount();
        // }
      });
      //Refine Search Filter End
  
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
  
      function getCategoriesFilterList() {
        $scope.categoriesFilterList = appConfig.categoriesFilterList
      }
      function getTACategoriesFilterList() {
        $scope.taCategoriesFilterList = appConfig.taCategoriesFilterList
      }
  
      $scope.changeTag = function(data) {
        if(data.value == 0) {
            $location.search('tags', null);
            $scope.categoriesFilterList.forEach(function(element) {
                if(element.value != 0) {
                    element.selected = true;
                } else {
                    element.selected = true;
                }
            }); 
        } else {
            var allfinder = $scope.categoriesFilterList.find(function(x) { return x.value === 0});
            allfinder.selected = false;
            var querybuilder = [];
            $scope.categoriesFilterList.forEach(function(element) {
                if(element.value != 0 && element.selected) {
                    querybuilder.push(element.name);
                }
            });
            $location.search('tags', querybuilder);
        }
        getKnowledge();
    }
    $scope.changeTagTA = function(data) {
        $scope.taTypeModel = data.value;
        if(data.value == 0) {
          $location.search('tags', null);; 
      } else {
          $location.search('tags', data.name);
      }
        getKnowledge();
      }
      function getMedia() {
        $scope.mediaLoaded = false;
        var filters;
        var sorting;
        var docType;
  
        var queryUrl = $location.search();
        if (queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
          sorting = $scope.arrSortby[0].id;
        } else {
          sorting = queryUrl.sortBy;
          vm.sorting=queryUrl.sortBy;
        }
        if (queryUrl.filter === undefined || queryUrl.filter === null) {
          filters = $scope.searchFilters
            .map(function (x) {
              return x.name;
            })
            .slice(1);
        } else {
          filters = queryUrl.filter;
        }
  
        if (
          queryUrl.isEndorsed == false ||
          queryUrl.isEndorsed == "false" ||
          queryUrl.isEndorsed == undefined
        ) {
          vm.isEndorsed = false;
        } else {
          vm.isEndorsed = true;
        }
 
       
  
        if (
          queryUrl.withVideo == false ||
          queryUrl.withVideo == "false" ||
          queryUrl.withVideo == undefined
        ) {
          vm.withVideo = false;
        } else {
          vm.withVideo = true;
        }
  
        if (
          queryUrl.withAudio == false ||
          queryUrl.withAudio == "false" ||
          queryUrl.withAudio == undefined
        ) {
          vm.withAudio = false;
        } else {
          vm.withAudio = true;
        }
  
        if (
          queryUrl.withValue == false ||
          queryUrl.withValue == "false" ||
          queryUrl.withValue == undefined
        ) {
          vm.withValue = false;
        } else {
          vm.withValue = true;
        }
  
        if (
          queryUrl.withReplication == false ||
          queryUrl.withReplication == "false" ||
          queryUrl.withReplication == undefined
        ) {
          vm.withReplication = false;
        } else {
          vm.withReplication = true;
        }
        if (
          queryUrl.isValidated == false ||
          queryUrl.isValidated == "false" ||
          queryUrl.isValidated == undefined
        ) {
          vm.isValidated = false;
        } else {
          vm.isValidated = true;
        }
  
        docType = queryUrl.docType;
        $scope.userInfo = UserProfileApi.getUserInfo();
        $scope.category = [];
  
        var skip = ($scope.pageIndex - 1) * $scope.pageSize;
  
        $scope.searchData = {
          searchKeyword: $scope.searchText,
          searchKeywordTranslated: [""],
          docType: docType,
          fromDate: $scope.fromDate,
          todate: $scope.toDate,
          year: 0,
          userid: 0,
          category: $scope.category,
          sortBy: sorting,
          filterBy: [],
          isShowHasValue: vm.withValue,
          isShowHasVideo: vm.withVideo,
          isShowValidate: vm.isValidated,
          isShowEndorsed: vm.isEndorsed,
          isShowReplications: vm.withReplication,
          isShowHasAudio: vm.withAudio,
          skip: 0,
          take: 10,
          sortField: "",
          sortDir: "",
          isExport: true,
          searchTerm: $scope.searchText,
        };
  
        $scope.mediaList = [];
        searchPageAPI.getMedia($scope.searchData).then(function (res) {
          if (res.data != null) {
            res.data.forEach(function (media) {
              $scope.mediaList.push(media);
            });
  
            $scope.nowPlayingTrendingMedia = undefined;
            $scope.mediaLoaded = true;
            $timeout(function () {
              if ($scope.mediaList != undefined && $scope.mediaList.length > 0) {
                playMedia($scope.mediaList[0], false);
              }
            }, 500);
          } else {
            // $scope.hasDataLoaded = true;
          }
          $scope.mediaLoaded = true;
        });
      }
  
      $scope.$on("onSearch", function (evt, object) {
        // alert("KNOWLEDGE EVENT FIRE");
        $scope.searchText = object.searchText;
        $scope.isdeepSearch = object.deepSearchFlag;
        $scope.categoryName = $stateParams.docType;
  
        getMedia();
        if ($scope.categoryName == undefined) {
          $scope.categoryName = "All";
          //  $location.search('docType', $scope.categoryName);
        }
  
        if (object.searchText == null || object.searchText == "") {
          SearchTrendingSingleCop($scope.categoryName);
        } else {
          //If Search is not empty
          getSingleCoP(object.searchText);
        }
        $scope.$emit("onKnowledgeLoad", object.searchText, $scope.categoryName);
        // $location.search('searchKeyword', searchText)
        getTrendingKnowledge(object.searchText, $scope.categoryName);
  
        getKnowledge();
        handleGetBasicPeople(object.searchText,5);
      });
  
      $scope.$on("onRemoveSearch", function (evt) {
        // alert("KNOWLEDGE EVENT FIRE");
        $scope.searchText = "";
        $scope.categoryName = $stateParams.docType;
        if ($scope.categoryName == undefined) {
          $scope.categoryName = "All";
          //  $location.search('docType', $scope.categoryName);
        }
        SearchTrendingSingleCop($scope.categoryName);
        $scope.$emit("onKnowledgeLoad", $scope.searchText, $scope.categoryName);
        // $location.search('searchKeyword', searchText)
        getTrendingKnowledge($scope.searchText, $scope.categoryName);
        getKnowledge();
        // if($scope.searchText!='' && $scope.searchText!=undefined)
        // {
        //     getKnowledgeCount();
        // }
      });
  
      function _onInit() {
        vm.userInfo = UserProfileApi.getUserInfo();
        $scope.isAdmin = vm.userInfo.isAdmin;
        //DocType
        $scope.categoryName = $stateParams.docType;
  
        if ($scope.categoryName == undefined) {
          $scope.categoryName = "All";
          $location.search("docType", $scope.categoryName);
        }
  
        if ($scope.categoryName === "Publications") {
          getCategoriesFilterList();
        }

        if($scope.categoryName === 'Technical Alerts') {
          getTACategoriesFilterList();
        }
        //SearchText
        $scope.searchText = $stateParams.searchKeyword;
        var articleID;
        var queryUrl = $location.search();
        articleID = queryUrl.knowledgeID;
  
        if ($scope.searchText == undefined) {
          $scope.searchText = "";
  
          $scope.$emit("onKnowledgeLoad", $scope.searchText, $scope.categoryName);
          SearchTrendingSingleCop($scope.categoryName);
        } else {
          //If Search is not empty
          handleGetBasicPeople($scope.searchText,5);
          getSingleCoP($scope.searchText);
          getMedia();
          $scope.$emit("onKnowledgeLoad", $scope.searchText, $scope.categoryName);
          $location.search("searchKeyword", $scope.searchText);
        }
  
        //KnowledgeID to open Popup
  
        $scope.$emit("displayLeftPanel", true);
  
        $scope.setSelectedFilters();
        getTrendingKnowledge($scope.searchText, $scope.categoryName);
        // getKnowledge();
        $scope.discipline = $stateParams.Disciplines;
        $scope.project = $stateParams.Projects;
        $scope.well = $stateParams.Wells;
        $scope.equipment = $stateParams.Equipments;
        $scope.keywording = $stateParams.Keywords;
        $scope.source = $stateParams.Sources;
        $scope.refineParam;
  
        if ($scope.discipline != undefined) {
          console.log($scope.discipline)
          $scope.refineParam = "Disciplines" + "," + $scope.discipline;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": searchParam[3]}]})
         
        }
        if ($scope.project != undefined) {
          $scope.refineParam = "Projects" + "," + $scope.project;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": searchParam[3]}]})
         
        }
        if ($scope.well != undefined) {
          $scope.refineParam = "Wells" + "," + $scope.wells;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": searchParam[3]}]})
         
        }
        if ($scope.equipment != undefined) {
          $scope.refineParam = "Equipments" + "," + $scope.equipment;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": searchParam[3]}]})
         
        }
        if ($scope.keywording != undefined) {
          $scope.refineParam = "Keywords" + "," + $scope.keywording;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid":searchParam[3]}]})
         
        }
        if ($scope.source != undefined) {
          $scope.refineParam = "Sources" + "," + $scope.source;
          var searchParam = $scope.refineParam.split(",");
          $scope.category.push({"displayName":searchParam[0],"categoryName":searchParam[0], "itemized":[{"itemName": searchParam[1], "itemId": parseInt(searchParam[2]) , "itemGuid": searchParam[3]}]})
        }

      }
  
      $scope.article;
      $scope.$on("modalOpen", function (event, data) {
        $scope.ngModel = data || { recents: [], collections: [] };
      });
  
      $scope.approve = function () {
        var datapost = {
          isAdmin: $scope.ngModel.isAdmin,
          recents: $scope.ngModel.recents,
          collections: $scope.ngModel.collections,
        };
  
        CollectionApi.addKdToCollections(
          { kd_id: $scope.ngModel.kd_id, data: datapost },
          function (response) {
            $log.info("Added collections to knowledge successfully.");
            toastr.success("Added to collections", "SKILL");
            CollectionApi.closeForm("#CollectionPopup");
            $scope.ngModel = {};
          },
          function (response) {
            logger.error(response.data.errorMessage);
          }
        );
      };
  
      _onInit();
      $scope.OnInit = _onInit;
    }
  })();
  