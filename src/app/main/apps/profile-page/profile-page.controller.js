(function () {
    'use strict';
  
    angular
        .module('app.ProfilePage')
        .controller('ProfilePageController', ProfilePageController);
  
    /** @ngInject */
    function ProfilePageController($window,$scope, $rootScope, profileAPI,searchPageAPI , UserProfileApi , $state , CollectionApi, $log, $location, logger,LeaderboardApi,$stateParams ) {
        var vm = this;
        $scope.showMenu = false;
        $scope.showActivity = false;
        vm.userRanking;
        $scope.isProfile = false;
        $scope.isMe = true;
        $scope.cops = [];
        $scope.interests = [];
        vm.userInfo;
        $scope.userDisciplines;
        $scope.recentActivity = [];
        $scope.knowledgeDocumentType = [];
        $scope.pagename = "ProfilePage";
        $scope.isAdmin;
        $scope.CountStatus = {
            totalPendingAction: 0,
            totalPendingValidation: 0,
            totalPendingEndorsement: 0,
            totalMembershipRequest : 0
        };
        vm.contributions = 0;
        vm.likes = 0;
        vm.share = 0;
        vm.bookmarked = 0;
        $scope.dataMyLevel = null;
        $scope.listPeopleYouFollow = [];
        $scope.user =  $stateParams.user;
        $scope.showMenuGrid = true;

        //function
        $scope.followButtonClick = function() {
          $scope.isDisableButton = true;
          searchPageAPI.FollowingPeople($location.search().user).then(function(res){
              $scope.isFollowing = !$scope.isFollowing;
              $scope.isDisableButton = false;
          })
        }

        $scope.$on('modalShareOpen', function (event, data) {
          $scope.choosenKnowlegde = data;
          $('#ModalShare').modal('show');
        });
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
         
          function setDefaultView(){
            if ($state.current.name === 'app.ProfilePage') {
              $state.go('app.ProfilePage.feeds');
            }
          };
          function getPendingActionCount() {
              profileAPI.getPendingActionsCount().then(function (data) {
                $scope.CountStatus = data;
              });
          };
          $rootScope.$on('$stateChangeSuccess', function () {
            checker();
          });

          function checker() {
            if($state.current.name === 'app.ProfilePage.cop') {
                $scope.showMenuGrid = false;
            } else {
                $scope.showMenuGrid = true;
            }
            console.log($scope.showMenuGrid);

        }
          function profileChecker() {
            if($state.current.name === 'app.ProfilePage.profile') {
              $scope.isProfile = true;
            } else {
              $scope.isProfile = false;
            }
          }
          function getUserLevel(userID) {
            LeaderboardApi.getUserLevel(userID).then(function (data) {
              if (data != null) {
                $scope.dataMyLevel = data;
              }
            }, function (error) {
              console.log(error);
            });
          }
          function getSubscribedCops(userID){
            profileAPI.getSubscribedCops(userID).then(function (res) {
                $scope.cops= [];
                if(res != null || res != "")
                {
                  $scope.cops = res;
                }
           
            });
          }
          function getInterests(userID){
            profileAPI.getInterests(userID).then(function (res) {
              if(res != null || res != "")
              {
                $scope.interests = res;
              }
          });
          }
          function getUserProfileDetails(userID){
            UserProfileApi.getProfile(userID).then(function (res) {
              if(res != null || res!= ""){
                  $scope.user = res;
                  if($location.$$search && $location.$$search.user){
                    searchPageAPI.IsFollowingPeople($rootScope.userInfo.userId, +$location.$$search.user).then(function(response){
                        $scope.isFollowing = response.isFollowing;
                    })
                  }
                  vm.contributions = res.myContributionsCount;
                  vm.likes = res.myLikesCount;
                  vm.share = res.mySharesCount;
                  vm.bookmarked = res.mySavesCount;


                  res.recentActivities.forEach(function (activity) {
                      $scope.recentActivity.push(activity)
                  });
                 
              }
              
         
            });
          }
          function showEarnedBadges(userID){
            LeaderboardApi.getUserEarnedBadges(userID).then(function (data) {
              if (data != null) {
                vm.userRanking = data;
              }
            }, function (error) {
              console.log(error);
            });
          }

          function getPeopleFollowing(userId){
            profileAPI.getPeopleYouFollowing(99999,userId).then(function(res){
              if(res.length > 0){
                $scope.listPeopleYouFollow = res;
              }
            },function (error) {
              console.log(error);
            })
          }

          $scope.checkItem = function(user,index) {
            return user ? index <= 14 : null
          }

          $scope.goToPeople = function() {
            $state.go('app.SearchPage.people',  {tag: 'People I Follow'});
          }
        
          function _onInit() {
           $scope.currentUser = UserProfileApi.getUserInfo();
          // getPeopleFollowing()
          } 
          $scope.$on('onOtherMenuItemLoad', function (event, userID) {
            $scope.listPeopleYouFollow = [];
            getUserProfileDetails(userID);
            profileChecker();
            setDefaultView();
            getUserLevel(userID);
            showEarnedBadges(userID);
            getPendingActionCount();
            getSubscribedCops(userID);
            getInterests(userID);
            getCrossCollaborationChannels(userID);
            getPeopleFollowing(userID); 
            var checker = $stateParams.user;
            if(checker == undefined) {
              $scope.isMe = true;
            }
  
          });
          
          $scope.$on('updatingInterest', function (event, userID) {
            getInterests(userID);
          });

        $scope.$on('onProfileLoad', function (event, userID) {
          getUserProfileDetails(userID.id);
          profileChecker();
          setDefaultView();
          getUserLevel(userID.id);
          showEarnedBadges(userID.id);
          getSubscribedCops(userID.id);
          getInterests(userID.id);
          getCrossCollaborationChannels(userID.id);
          getPeopleFollowing(userID.id); 

          $scope.isMe = userID.isMe;
        });

        $scope.$on('modalOpen', function (event, data) {            
            $scope.ngModel = data || { recents: [], collections: [] };

        });
        $rootScope.$on('$stateChangeSuccess', function () {
          profileChecker();
        });

        $scope.$on('onCoPSubscription', function (event , status) {   
            if(status == "success"){
              setTimeout(function(){
                getSubscribedCops();
               
                profileAPI.getCoPAndMembers().then(function (res) {
                  $scope.copChannel= [];
                  if(res != null || res != "")
                  {
                      res.forEach(function (data) {
                          $scope.copChannel.push(data);
                      });
                  }
              });
                },
               8000);
             
            }
          });

          $scope.$on('onCoPUnSubscription', function (event ,status) {   
             //Unsubscribe General Channel
            if(status == "success"){
              setTimeout(function(){
                getSubscribedCops();
                profileAPI.getCoPAndMembers().then(function (res) {
                  $scope.copChannel= [];
                  if(res != null || res != "")
                  {
                      res.forEach(function (data) {
                          $scope.copChannel.push(data);
                      });
                  }
              });
                },
               8000);
            }
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

        function getCrossCollaborationChannels(userID){
          $scope.collaborationChannels = [];
          profileAPI.getCrossCollaborationChannels(userID).then(function (res) {
            if (res != null || res != "") {
              res.forEach(function (collabChannel) {
                $scope.collaborationChannels.push(collabChannel);
              });
            }
          });
        }
    
        _onInit();
        $scope.OnInit = _onInit;
        checker();
    
    }
  
  })();
  