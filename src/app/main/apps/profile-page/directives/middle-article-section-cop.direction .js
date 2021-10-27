/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('middleArticleSectionCop', middleArticleSectionCop);

    /** @ngInject */
    function middleArticleSectionCop() {

        return {
            restrict: 'E',
            scope: {
                copid: "=",
                interestid : '=',
                pagename : '=',
                showbookmark : '=',

            },
            controller: function ($scope, appConfig,UserProfileApi,profileAPI,KnowledgeDiscoveryApi,KnowledgeDocumentApi, $rootScope, $location) { 
                var vm = this;  
                $scope.postShare = postShare;
                $scope.ShareEmails = [];
                $scope.choosenKnowlegde = {};   
                $scope.knowledgeDocumentType = [];
                $scope.selecteddocumentType = [];
                $scope.articles = [];
                $scope.potentialValue;
                $scope.valueRealized;
                $scope.found;
                $scope.hasDataLoaded = false;
                $scope.userInfo = UserProfileApi.getUserInfo();
                $scope.fromPos = 0;
                $scope.toPos = 0;
                $scope.redirectLink = appConfig.MsTeamRedirectLink;
                $scope.articleLoad = false;
                $scope.articleView = 'list';
                $scope.category = [];
                vm.isEndorsed = false;
                vm.withVideo = false;
                vm.withAudio = false;
                vm.withValue = false;
                vm.withReplication = false;
                vm.isValidated = false;
                $scope.searchFilters = [];
                $scope.fromDate;
                $scope.toDate;
                $scope.discussionLoad = false;
                $scope.eventsLoad = false;
                $scope.hasSubscribed = false;
                $scope.events = [];
                vm.discussionfromPos = 0;
                vm.discussiontoPos = 0;

                /* PAGING */
                vm.discussionPageIndex = 1;
                vm.discussionPageSize = 10;
                vm.discussionMaxSize = 5;
                vm.discussionSetPage = function (pageNo) {
                    vm.discussionPageIndex = pageNo;
                };

                /* PAGING */
                $scope.pageIndex = 1;
                $scope.pageSize = 10;
                $scope.maxSize = 5;
                $scope.setPage = function (pageNo) {
                    $scope.pageIndex = pageNo;
                };

                // debugger;
                // var recCopId = $scope.copid;
                // var interestid = $scope.interestid;
                $scope.$on('modalShareOpen', function (event, data) {
                    $scope.choosenKnowlegde = data;
                  });
                   $scope.arrSortby = [

                  { id: 'LatestContribution', name: 'Latest Contribution' },
                  { id: 'HighestEngagement', name: 'Highest Engagement' },
                  { id: 'MostShared', name: 'Most Shared' },
                  { id: 'HighestValueRealised', name: 'Highest Value Realised' },
                  { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
                  { id: 'HighestReplication', name: 'Highest Replication' },
              ];

        $scope.setSelectedFilters = function(){
          var kdType;
          for (kdType in appConfig.SearchFilters) {
              if (appConfig.SearchFilters.hasOwnProperty(kdType)) {
                  var value = appConfig.SearchFilters[kdType];
                  $scope.searchFilters.push({ "name": value, "value": kdType, "selected": false });
              }
          }
      }

      function kmlFormatter(num, tofixed) {
        var result = num > 999 ? (num / 1000).toFixed(2) + 'K' : num;
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'B';
        } else {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M';
            } else {
                if (num >= 1000) {
                    return (num / 1000).toFixed(2) + 'K';
                } else {
                    return num;
                }
            }
        }
        return result;
    }
    $scope.kmlFormatter = function (str) {
      return kmlFormatter(str);
  }
  
                function shareUsers() {
                    $scope.EmailSources = {
                      placeholder: "Select user...",
                      dataTextField: "PersonName",
                      dataValueField: "Id",
                      minLength: 4,
                      delay: 500,
                      valuePrimitive: true,
                      dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                          read: function (options) {
                            return KnowledgeDiscoveryApi.getEmails(options)
                          }
                        }
                      }),
                      open: function (e) {
                        setTimeout(function () {
                          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        }, 100);
                      },
                      template: '<strong>#: data.PersonName #</strong><br/><small>#: data.PersonDept #</small>',
                      select: function (e) {
                        var index = _.findIndex($scope.ShareEmails, function (item) {
                          return item.value == e.dataItem.Id
                        });
                        if (index == -1) {
                          $scope.$apply(function () {
                            $scope.ShareEmails.push({
                              value: e.dataItem.Id,
                              label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id
                            });
                          });
                        }
                      },
                    };
                  }
                function setSelectedDocumentType(){
                    var kdType;
                    for (kdType in appConfig.UserProfileKnowledgeDocumentTypes) {
                        if (appConfig.UserProfileKnowledgeDocumentTypes.hasOwnProperty(kdType)) {
                            var value = appConfig.UserProfileKnowledgeDocumentTypes[kdType];
                            
                            $scope.knowledgeDocumentType.push({ "name": value, "value": kdType, "selected": false });
                               
                           
                             
                        }
                    }
                }
                function getUpComingEventsByCopID(){
                  if($scope.copid) {
                    $scope.events = [];
                  profileAPI.getUpComingEventsByCopID($scope.copid).then(function (res) {
                    if (res != null || res != "") {
                      res.forEach(function (event) {
                        $scope.events.push(event);
                      });
                    }
                    $scope.eventsLoad = true;
                  });
                  }
                }
                function checkSubscribedStatus(){
                  profileAPI.checkChannelStatus($scope.copid).then(function (res) {
                    if (res != null || res != "") {
                      $scope.hasSubscribed = res.isSubscribedToGeneral;
                    }
                  });
                }
                function getChannelsByCopID(){
                  $scope.channels = [];
                  profileAPI.getChannelsByCopID($scope.copid).then(function (res) {
                    if (res != null || res != "") {
                      res.forEach(function (channel) {
                        $scope.channels.push(channel);
                      });
                    }
                  });
                }
                function getDiscussionByCoP() {
                  $scope.discussionData = {
                    copId: $scope.copid,
                    userId: $scope.userInfo.userId,
                    page: vm.discussionPageIndex
            
                  }
                    profileAPI.getDiscussionsByCopId($scope.discussionData).then(function (res) {
                  
                    if (res != null && res != "" &&  res.discussions != null) {
                      $scope.totalDiscussions = res.total;
                      $scope.discussions = [];
                      res.discussions.forEach(function (discussion) {
                        $scope.discussions.push(discussion);
                      });
                    }
            
                    if (res.total > 0) {
                      vm.discussionSkip = (vm.discussionPageIndex - 1) * vm.discussionPageSize,
                        vm.discussionfromPos = vm.discussionSkip + 1;
                      vm.discussiontoPos = vm.discussionfromPos + res.total - 1;
                    }
                    else {
                      vm.discussionfromPos = 0;
                      vm.discussiontoPos = 0;
                    }
                    $scope.discussionLoad = true;
            
                  });
                }
                $scope.getSortingValue = function () {
                    $scope.hasDataLoaded = false;
                    $scope.pageIndex = 1;
                    $scope.articleLoad = false;
                    getProfileArticles();
                }
                $scope.GetSelectedValue = function () {
                    $scope.hasDataLoaded = false;
                    $scope.pageIndex = 1;
                    $scope.articleLoad = false;
                    getProfileArticles();
                }

                $scope.$on('$locationChangeSuccess', function(event){
                  $scope.articleLoad = false;
                  getProfileArticles();
               });
               $scope.$on('onChangeView', function (event, data) {
                $scope.articleView = data;
              });
              $scope.$on('onAdditionalFilterChange', function (event) {
                //   Tag.filter Tag.value
                getProfileArticles();
              });
       
              $scope.$on('onSortingChange', function (event) {
                   //   Tag.filter Tag.value
                   getProfileArticles();
              });
              $scope.$on('setDefaultDate', function (event, dates) {
                $scope.fromDate = dates.startDate;
                $scope.toDate = dates.endDate;
                getProfileArticles();
            });
            $scope.$on('onMonthChange', function (event, dates) {
                $scope.fromDate = dates.startDate;
                $scope.toDate = dates.endDate;
                getProfileArticles();
            });
            $scope.$on('onYearChange', function (event, dates) {
                $scope.fromDate = dates.startDate;
                $scope.toDate = dates.endDate;
                getProfileArticles();
            });
            $scope.$on('onQuarterChange', function (event, dates) {
                $scope.fromDate = dates.fromDate;
                $scope.toDate = dates.toDate
                getProfileArticles();
            });
            $scope.$on('customDateChange', function (event, dates) {
                $scope.fromDate = dates.fromDate;
                $scope.toDate = dates.toDate
                getProfileArticles();
            });

            $scope.$on('onTabChange', function () {
              getProfileArticles();
          });

                function getProfileArticles() {
                   
                    var filters;
                    var sorting;
                    var docType;

                    $scope.selectedDocType = []

        
                    var queryUrl = $location.search();
                    if(queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
                      sorting = $scope.arrSortby[0].id;
                    } else {
                      sorting = queryUrl.sortBy;
                    }
                    if(queryUrl.filter === undefined || queryUrl.filter === null) {
                        filters = $scope.searchFilters.map(function(x){ return x.name}).slice(1);
                    } else {
                        filters = queryUrl.filter;
                    }
        
                    if(queryUrl.isEndorsed == false || queryUrl.isEndorsed == "false" || queryUrl.isEndorsed == undefined ){
                      vm.isEndorsed = false;
                  }
                  else{
                    vm.isEndorsed = true;
                  }

                  if(queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined ){
                    vm.isValidated = false;
                }
                else{
                  vm.isValidated = true;
                }
              
                  if(queryUrl.withVideo == false || queryUrl.withVideo == "false" || queryUrl.withVideo == undefined){
                      vm.withVideo = false;
                  }
                  else{
                    vm.withVideo = true;
                  }
              
                  if(queryUrl.withAudio == false || queryUrl.withAudio == "false" || queryUrl.withAudio == undefined){
                      vm.withAudio = false;
                    }
                    else{
                      vm.withAudio = true;
                    }
              
                  if(queryUrl.withValue == false || queryUrl.withValue == "false" || queryUrl.withValue == undefined){
                    
                      vm.withValue = false;
                  }
                  else{
                      vm.withValue = true;
                  }
              
                  if(queryUrl.withReplication == false || queryUrl.withReplication == "false" || queryUrl.withReplication == undefined){
                  
                      vm.withReplication = false;
                  }
                  else{
                    vm.withReplication = true;
                  }
                  if(queryUrl.isValidated == false || queryUrl.isValidated == "false" || queryUrl.isValidated == undefined){
                  
                      vm.isValidated = false;
                  }
                  else{
                    vm.isValidated = true;
                  }

                    //Have to change now

                      docType = queryUrl.docType;

                      if(docType == undefined || docType == "" ){
                        
                        docType = "All";
                        
                      }
            
                      $scope.selectedDocType.push(docType);
                      queryUrl.searchKeyword
                      $scope.userInfo = UserProfileApi.getUserInfo();
                     
                      $scope.knowledgeID;


                      $scope.postData = {

                        copId: $scope.copid,
                        userId: $scope.userInfo.userId,
                        disciplineId: $scope.interestid,
                        page: $scope.pageIndex,
                        showbookmark : $scope.showbookmark,
                        searchKeyword: queryUrl.searchKeyword,
                        searchKeywordTranslated: [],
                        docType: docType === 'Potential Reuse' ? [] : $scope.selectedDocType,
                        fromDate: $scope.fromDate,
                        todate: $scope.toDate,
                        "year": 0,
                        category: $scope.category,
                        sortBy: sorting,
                        "filterBy": [],
                        isShowHasValue:  vm.withValue , 
                        isShowHasVideo: vm.withVideo,
                        isShowValidate:  vm.isValidated ,
                        isShowEndorsed: vm.isEndorsed,
                        isShowReplications: vm.withReplication,
                        "skip": $scope.pageIndex,
                        "take": 10,
                        "sortField": "",
                        "sortDir": "",
                        "isExport": true,
                    }


      
                    $scope.articles = [];
                    debugger
                    profileAPI.getCoPArticles($scope.postData).then(function (res) {
                       
                        $scope.potentialValue = res.potentialValueTotal
                        $scope.valueRealized = res.valueRealizedTotal
                        $scope.found = res.total;
        
                        if (res.data != null) {
                            $scope.articles = res.data;
                            $scope.hasDataLoaded = true;
                        }
                        else{
                            $scope.hasDataLoaded = true;
                        }
        
                        if (res.total > 0) {
                            $scope.skip = ($scope.pageIndex - 1) * $scope.pageSize,
                            $scope.fromPos = $scope.skip + 1;
                            $scope.toPos = $scope.fromPos + res.data.length - 1;
                        }
                        else {
                            $scope.fromPos = 0;
                            $scope.toPos = 0;
                        }
                        $scope.articleLoad = true;
                    });
        
                   
                }
     
                $scope.pageChanged = function (page) {
          
                  if (page <= 0) return;
                  $scope.pageIndex = page;
                  $scope.hasDataLoaded = false;
                  $scope.articleLoad = false;
                  getProfileArticles();
              }
  


                function postShare() {
                    var shareRequest = {
                        knowledgeDocumentId: $scope.choosenKnowlegde.articleID,
                        taggingTypeName: 'Share',
                        taggingTypeValue: true
                      };
                      KnowledgeDocumentApi.api.postTagging.save({}, shareRequest,
                        function (response) {
                          $rootScope.$broadcast('UpdateInterest');
                        },
                        function (response) {
                          logger.error(response.data.errorMessage);
                        });
                
                      if ($scope.ShareEmails && $scope.ShareEmails.length > 0) {
                        var postData = {
                          title: $scope.choosenKnowlegde.title,
                          kDId: $scope.choosenKnowlegde.articleID,
                          lstMailShare: $scope.ShareEmails
                        };
                        KnowledgeDiscoveryApi.shareKnowledgeDiscovery(postData).then(function (response) {
                          if (response && response.success) {
                            for(var element in $scope.articles) {
                              if($scope.articles[element].articleID === $scope.choosenKnowlegde.articleID) {
                                  $scope.articles[element].shareCount = $scope.articles[element].shareCount + $scope.ShareEmails.length;
                              }
                            }    
                              $scope.ShareEmails = [];
                          }
                          $rootScope.$broadcast('UpdateInterest');
                        }, function (response) {
                          logger.error(response.data.errorMessage);
                        });
                      }
                  };

                  function getKnowledge(){

                    
        
        
                    
        
                      $scope.articles = [];
                      searchPageAPI.getKnowledge($scope.searchData).then(function (res) {
             
                                if (res.data != null) {
                                    $scope.articles = res.data;
                                   // $scope.hasDataLoaded = true;
                                }
                                else{
                                   // $scope.hasDataLoaded = true;
                                }
                
                            
                            });
                 }
      
              
                 $scope.$on('onCategoryChange', function (event, categoryList) {
                    $scope.category = categoryList;
                    getProfileArticles();
                 });
                 $scope.setSelectedFilters();
                 getUpComingEventsByCopID();
                 checkSubscribedStatus();
                 getChannelsByCopID();
                 getDiscussionByCoP();
               // setSelectedDocumentType();
              //  getProfileArticles();
                shareUsers();
                
            },
            templateUrl: 'app/main/apps/profile-page/directives/middle-article-section-cop.html'
            
        };
    }
})();
