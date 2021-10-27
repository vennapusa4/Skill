(function () {
  'use strict';

  angular
      .module('app.landingPage')
      .controller('LandingPageController', LandingPageController);

  /** @ngInject */
  function LandingPageController($scope , $http, $window,$cookies, abbreviationAPI, $rootScope, LandingPageAPI , KnowledgeDiscoveryApi, UserProfileApi , KnowledgeDocumentApi, CollectionApi, $log, logger,$timeout , $state,$stateParams, profileAPI, searchPageAPI) {
      var vm = this;
      vm.summaryData = {
          "numberOfContent" : '' ,
          "valueAmplified" :'' ,
          "numberOfContributors":'' 
      };
      var landingSource = localStorage.getItem("LandingSource"); 
      //alert('landing page '+landingSource);
      // localStorage.setItem("LandingSource","other");
      // if(!landingSource || landingSource != "login"){
      //   $http.defaults.headers.common['AccessToken'] = "";
      //   $rootScope.$broadcast("reAuthorize", true);
      // }
      

      vm.articles = [];
      vm.cops = [];
      vm.discussions = [];
      vm.featuredArticles = [];
      vm.slidercops=[];
      vm.announcements=[];
      vm.userInfo;
      vm.ShareEmails = [];
      $scope.collection = [];
      $scope.userCollection = null;
      $scope.copTooltipshow =false;
      $scope.choosenKnowlegde = {};
      $scope.featuredArticlesLoad = false;
      $scope.featuredCopLoad = false;
      $scope.discussionLoad = false;
      $scope.copLoad = false;
      $scope.articleLoad = false;
      $scope.announcementLoad = false;
      $scope.articleTooltipshow =false;
      $scope.announcementTooltipshow =false;
      $scope.discussionTooltipshow =false;
      $scope.isAdmin;
      $scope.ngModel;
      $scope.pagename = "LandingPage";
      $scope.abbreviationList = [];
      $scope.subscriptions = [];
      $scope.searchSubscriptionText = "";
      $scope.editUserInfo = [];
      function kmlFormatter(num, tofixed) {
          var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
          if (num >= 1000000000) {
            return (num / 1000000000).toFixed(3) + 'b';
          } else {
            if (num >= 1000000) {
              return (num / 1000000).toFixed(3) + 'b';
            } else {
              if (num >= 1000) {
                return (num / 1000).toFixed(3) + 'k';
              } else {
                return num;
              }
            }
          }
          return result;
        }
       

      vm.scrollToRecommend = function() {
          var element = document.getElementById('home-recommended');
          element.scrollIntoView();
      }
      function shareUsers() {
          vm.EmailSources = {
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
              var index = _.findIndex(vm.ShareEmails, function (item) {
                return item.value == e.dataItem.Id
              });
              if (index == -1) {
                $scope.$apply(function () {
                  vm.ShareEmails.push({
                    value: e.dataItem.Id,
                    label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id
                  });
                });
              }
            },
          };
        }

      $scope.getDiscussions = function () {
          $scope.discussionData = {
              userId: vm.userInfo.userId,
              page: vm.pageIndex
      
            }
            LandingPageAPI.getDiscussions($scope.discussionData).then(function (res) {
              res.discussions.forEach(function (discussion) {
                  vm.discussions.push(discussion);
              });
          });
          $scope.discussionLoad = true;
      }
      function getAbbreviation() {
        abbreviationAPI.getAllAbbreviationsLanding().then(function(res){
          $scope.abbreviationList = res;
        });
      }
       $scope.postShare = function() {
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
    
          if (vm.ShareEmails && vm.ShareEmails.length > 0) {
            var postData = {
              title: $scope.choosenKnowlegde.title,
              kDId: $scope.choosenKnowlegde.articleID,
              lstMailShare: vm.ShareEmails
            };
            KnowledgeDiscoveryApi.shareKnowledgeDiscovery(postData).then(function (response) {
              if (response && response.success) {
                for(var element in vm.featuredArticles) {
                  if(vm.featuredArticles[element].articleID === $scope.choosenKnowlegde.articleID) {
                      vm.featuredArticles[element].shareCount = vm.featuredArticles[element].shareCount + vm.ShareEmails.length;
                  }
              }
              for(var element in vm.articles) {
                  if(vm.articles[element].articleID === $scope.choosenKnowlegde.articleID) {
                      vm.articles[element].shareCount = vm.articles[element].shareCount + vm.ShareEmails.length;
                  }
              }
                vm.ShareEmails = [];
              }
              $rootScope.$broadcast('UpdateInterest');
              $state.transitionTo($state.current, $stateParams, {reload: true});
            // $('#ModalShare').modal('close');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
            }, function (response) {
              logger.error(response.data.errorMessage);
            });
          }
        };

      function loadInitialData(){
          vm.userInfo = UserProfileApi.getUserInfo();         
          $scope.isAdmin = vm.userInfo.isAdmin;
          LandingPageAPI.GetSummary(vm.userInfo.userId).then(function (res) {
              vm.summaryData.numberOfContent = res.numberOfContent;
              vm.summaryData.valueAmplified =  kmlFormatter(res.valueAmplified);
              vm.summaryData.numberOfContributors = res.numberOfContributors;                
          });

          LandingPageAPI.getSlider(vm.userInfo.userId).then(function (res) {
              if(res != null && res != "")
              {
                  if(res.slider != undefined && res.slider.featuredArticles != null && res.slider.featuredArticles != undefined) {
                    res.slider.featuredArticles.forEach(function (featuredArticles) {
                        vm.featuredArticles.push(featuredArticles);
                    });
                  }

                  if(res.slider != undefined && res.slider.cop != null && res.slider.cop != undefined) {
                    res.slider.cop.forEach(function (cop) {
                        vm.slidercops.push(cop);
                    });
                  }

                  if(res.slider != undefined && res.slider.announcements != null && res.slider.announcements != undefined) {
                    res.slider.announcements.forEach(function (announcement) {
                      vm.announcements.push(announcement);
                    });
                  }
                  $scope.featuredCopLoad = true;
                  $scope.featuredArticlesLoad = true;
                  $scope.announcementLoad = true;
                  $timeout(function(){
                    $('#articles2').carousel({
                      interval: 4000
                    })
                  }, 1000);
                  // if(vm.announcements.length < 1) {
                  //   $('.carousel-inner .item').removeClass('active');
                  //   $('.carousel-indicators li').removeClass('active');
                  //   $('#nextItem').addClass('active');
                  //   $('#nextIndicator').addClass('active');
                  // }
              }
         
          });
        //   LandingPageAPI.getRecommendCollection(vm.userInfo.userId).then(function (res) {
        //     if(res != null && res != "")
        //     {
        //       console.log(res);
        //     }
       
        // });
          var postData = {"collectionName":"","category":[{"categoryName":"Disciplines","itemized":[]},{"categoryName":"Subdisciplines","itemized":[]},{"categoryName":"CoPs","itemized":[]},{"categoryName":"Locations","itemized":[]},{"categoryName":"Authors","itemized":[]},{"categoryName":"Projects","itemized":[]},{"categoryName":"Wells","itemized":[]},{"categoryName":"Equipments","itemized":[]},{"categoryName":"Keywords","itemized":[]},{"categoryName":"Departments","itemized":[]},{"categoryName":"Divisions","itemized":[]},{"categoryName":"WellsOperations","itemized":[]},{"categoryName":"WellsPhase","itemized":[]},{"categoryName":"WellsType","itemized":[]},{"categoryName":"ProjectPhase","itemized":[]},{"categoryName":"PPMSActivity","itemized":[]},{"categoryName":"PRAElements","itemized":[]}],"skip":0,"take":16};
          KnowledgeDocumentApi.collections(postData).then(function (data) {
            $scope.userCollection = data.data[0];
          });
          LandingPageAPI.getArticles(vm.userInfo.userId).then(function (res) {
              if(res != null && res != "" && res.articles != null && res.articles != undefined)
              {
                debugger;
                  res.articles.forEach(function (article) {
                      vm.articles.push(article);
                  });
              }
              $scope.articleLoad = true;
            
          });

          LandingPageAPI.getCoPs(vm.userInfo.userId).then(function (res) {
              if(res != null && res != "")
              {
                  res.cops.forEach(function (cop) {
                      vm.cops.push(cop);
                  });
              }
              $scope.copLoad = true;
          });

      
          vm.SearchPopular = [];
          KnowledgeDocumentApi.searchPopular().then(function (data) {
              vm.SearchPopular = data;
          });
         // $scope.getDiscussions(); // commenting out for bug # 160341
          shareUsers();

          //get data for manageSubscription
          var filter = {
            userId: vm.userInfo.userId,
            type: "All",
            SearchText: "",
            skip: 0,
            take: 10
          }
          profileAPI.manageSubscription(filter).then(function (data) {
            $scope.subscriptions = formatSubscriptionData(data);
          });

          KnowledgeDocumentApi.getMyDisciplines("", 0, 50).then(function (data) {
            $scope.editUserInfo = data;
          })
      }

      function formatSubscriptionData(data) {
        var rv = [];
        data.forEach(function(v,i) {
          var icon = "/assets/icons/new-icons/" + v.type.toLowerCase()+ "-";
          if(v.isSubscribed){
            icon+="fill.svg";

          }else{
            icon+="outline.svg";
          }
          v.imageUrl = icon;
          rv.push(v);
        })
        return rv;
      }

      function _onInit() {
          if(localStorage.getItem("access-token")){
              loadInitialData();
          }
      }
      $scope.$on('tokenStaus', function (event, data) {
          if(data){
              loadInitialData();
          }
      });
      
      
      $scope.$on('modalOpen', function (event, data) {
          $scope.ngModel = data || { recents: [], collections: [] };

        });
        $scope.$on('modalShareOpen', function (event, data) {
          $scope.choosenKnowlegde = data;
          $('#ModalShare').modal('show');
        });

        $scope.approve = function () {
          var datapost = {
              isAdmin: $scope.ngModel.isAdmin,
              recents: $scope.ngModel.recents,
              collections: $scope.ngModel.collections
          }

          CollectionApi.addKdToCollections({ kd_id: $scope.ngModel.kd_id, data: datapost }, function (response) {
              $log.info('Added collections to knowledge successfully.');
              toastr.success('Added to collections', 'SKILL')
              CollectionApi.closeForm("#CollectionPopup");
              $scope.ngModel = {};
          },
              function (response) {
                  logger.error(response.data.errorMessage);
              });

      }

      $scope.onSearchSubscription = function(){
        var filter = {
          userId: vm.userInfo.userId,
          type: "All",
          SearchText: $scope.searchSubscriptionText,
          skip: 0,
          take: 20
        }
        profileAPI.manageSubscription(filter).then(function (data) {
          $scope.subscriptions = data;
      });
      }

      $scope.redirectingAnnouncement = function(url) {
        if(url.includes("http")) {
          $window.open(url, "_blank");
        } else {
          url = "http://" + url;
          $window.open(url, "_blank");
        }
      }

      $scope.goProfilePage = function(){
        setTimeout(function(){
        $state.go("app.ProfilePage.editProfile", {'#': "interest" });

        },200)
      }

      _onInit();
      getAbbreviation();
      $scope.OnInit = _onInit;

      
      $scope.onSubscriptionClick = function(item){
        if(item.type == "CoP"){
          if(!item.isSubscribed){
            $scope.userInfo = UserProfileApi.getUserInfo(); 
            $scope.postData = {
              userId : $scope.userInfo.userId,
              copId: item.copId+""
             }
      
            LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
              updateSubscription(item.id);
             },function (error) {
               logger.error(error);
             });
          }else{
            $scope.userInfo = UserProfileApi.getUserInfo(); 
          
            $scope.postData = {
              requesterId : $scope.userInfo.userId,
              copId: item.copId,
              channelName : "General"
             }
      
             profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
              updateSubscription(item.id);
              
            },function (error) {
              logger.error(error);
            });
          }
        }else
  
        if(item.type== "People"){
          searchPageAPI.FollowingPeople(item.id).then(function(res){
            updateSubscription(item.id);
        })
        }else
  
        if(item.type == "Interest"){
          if(!item.isSubscribed){
            var idsPost = [];
  
            $scope.editUserInfo.forEach(function(element) {
              idsPost.push(element.id);
            })
    
            idsPost.push(item.id);
            var postData = { ids: idsPost };
            KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {
              if (data.result == true) {
                updateSubscription(item.id);
                }
            });
          }else{
            var idsPost = [];
  
          $scope.editUserInfo.forEach(function(element) {
            if(element.id != item.id) {
              idsPost.push(element.id);
            }
          })
          var postData = { ids: idsPost };
          KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {
  
            if (data.result == true) {
              updateSubscription(item.id);
              }
          });
          }
        }
      }
  
      function updateSubscription(id){
        $scope.subscriptions.forEach(function(v,i){
          if(v.id == id){
            v.isSubscribed = !v.isSubscribed;
          }
        })
      }

  
  }

})();
