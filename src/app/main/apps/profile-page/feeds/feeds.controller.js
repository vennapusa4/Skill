(function () {
    'use strict';

    angular
        .module('app.ProfilePage')
        .controller('FeedsController', FeedsController);

    /** @ngInject */
    function FeedsController($scope, profileAPI, UserProfileApi, AdsSettingAPI , LandingPageAPI, searchPageAPI, appConfig, $timeout , $location) {
        var vm = this;
        $scope.showMenu = false;
        vm.userRanking;
        $scope.cops = [];
        $scope.interests = [];
        $scope.events = [];
        vm.userInfo;
        $scope.pagename = "ProfilePage";
        $scope.discussionTooltipshow2 = false;
        $scope.eventsLoad = false;
        $scope.recommendedArticleLoad = false;
        $scope.unsubscribedArticles = [];
        $scope.discussions = [];
        $scope.team = [];
        $scope.discussionData;
        $scope.totalDiscussions;
        $scope.docTypemodel;
        $scope.PeopleRecommendationRecords = [];
        $scope.showEvent = false;
        $scope.Ads = null;
        
        function getActiveAds(){
            AdsSettingAPI.getAllActiveAds().then(function (res) {
                if(res && res.data && res.data.length > 0){
                    $scope.Ads = res.data[0];
                    console.log($scope.Ads);
                } else {
                    $scope.Ads = null;
                }
              });
        }
        function getRecommendedArticles(){
            profileAPI.getUnSubscribedArticles().then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (event) {
                        $scope.unsubscribedArticles.push(event);
                    });
                }
                $scope.recommendedArticleLoad = true;
            });
        }
       
        function getDiscussions() {
            $scope.discussionData = {
                copId: '',
                userId: vm.userInfo.userId,
                page: vm.discussionPageIndex
              }
          
              profileAPI.getDiscussionsByCopId($scope.discussionData).then(function (res) {
                $scope.totalDiscussions = res.total;
                $scope.discussions = [];
                if(res != null && res.length !=0 && res.discussions != null){
                    res.discussions.forEach(function (discussion) {
                        $scope.discussions.push(discussion);
                    });
                    if (res.total > 0) {
                        vm.discussionSkip = (vm.discussionPageIndex - 1) * vm.discussionPageSize,
                          vm.discussionfromPos = vm.discussionSkip + 1;
                        vm.discussiontoPos = vm.discussionfromPos + res.total - 1;
                      }
                      else {
                        vm.discussionfromPos = 0;
                        vm.discussiontoPos = 0;
                      }
                }
                $scope.discussionLoad = true;
            });
        }
        $scope.knowledgeDocumentType = [];
        function setSelectedDocumentType(){
            var kdType;
            var queryUrl = $location.search();
            var docType = queryUrl.docType;
            for (kdType in appConfig.UserProfileKnowledgeDocumentTypes) {
                console.log(kdType);
                if (appConfig.UserProfileKnowledgeDocumentTypes.hasOwnProperty(kdType)) {
                    var value = appConfig.UserProfileKnowledgeDocumentTypes[kdType];

                    if(value == docType){
                        var toDisplay;
                        if(value == 'Best Practices') {
                            toDisplay = 'Best Practice';
                        } else if(value == 'Publications') {
                            toDisplay = 'Publication';
                        } else if(value == 'Technical Alerts') {
                            toDisplay = 'Technical Alert';
                        } else if (value == 'Collections') {
                            toDisplay = 'Collection';
                        } else {
                            toDisplay = value;
                        }
                        $scope.knowledgeDocumentType.push({ "name": value, "value": kdType, "display": toDisplay, "selected": true });
                        $scope.docTypemodel = kdType;
                    }
                    else{
                        if(docType == undefined){
                            $scope.docTypemodel = "All";
                        }
                        var toDisplay;
                        if(value == 'Best Practices') {
                            toDisplay = 'Best Practices';
                        } else if(value == 'Publications') {
                            toDisplay = 'Publications';
                        } else if(value == 'Technical Alerts') {
                            toDisplay = 'Technical Alerts';
                        } else if (value == 'Collections') {
                            toDisplay = 'Collections';
                        } else {
                            toDisplay = value;
                        }
                        $scope.knowledgeDocumentType.push({ "name": value, "value": kdType, "display": toDisplay, "selected": false });
                    } 
                }
            }
        }

        $scope.getTabValue = function(value){
            console.log("selected tab" + value);
            $location.search('docType', value);
           // $scope.$emit('onTabChange');
        }

        $scope.hanldeFollowingPeople = function(peopleId,index){
            searchPageAPI.FollowingPeople(peopleId).then(function(res){
                $scope.PeopleRecommendationRecords[index].isFollowing = !$scope.PeopleRecommendationRecords[index].isFollowing;
            })
        }

        function HandleGetPeopleRecommendation(){
            searchPageAPI.GetPeopleRecommendation(5).then(function(res){
                if(res && res.length){
                    $scope.PeopleRecommendationRecords = res;
                }
            })
        }

        function _onInit() {
            vm.userInfo = UserProfileApi.getUserInfo();
            $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
            vm.discussionfromPos = 0;
            vm.discussiontoPos = 0;
      
            /* PAGING */
            vm.discussionPageIndex = 1;
            vm.discussionPageSize = 10;
            vm.discussionMaxSize = 5;
            vm.discussionSetPage = function (pageNo) {
                vm.discussionPageIndex = pageNo;
            };
           HandleGetPeopleRecommendation();
            getRecommendedArticles();
            //Commenting Out the Discussion WorkItem # 142190
            //getDiscussions();
            setSelectedDocumentType();
            getActiveAds();
        }
        $scope.$on('requestSent', function (event, status) {
            if (status == "success") {
                logger.success("Request Sent successfully!");

                $timeout(function () {
                    $scope.unsubscribedArticles = [];
                    profileAPI.getUnSubscribedArticles().then(function (res) {
                        if (res != null || res != "") {
                            res.forEach(function (event) {
                                $scope.unsubscribedArticles.push(event);
                            });
                        }
                    });
                }, 3000);


            }
        });
        vm.discussionPageChanged = function (){
            $scope.getDiscussions();
        }

        _onInit();

    }

})();
