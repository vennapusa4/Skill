(function () {
    'use strict';

    angular
        .module('app.ProfilePage')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, AdsSettingAPI, profileAPI, UserProfileApi, LandingPageAPI,$location, appConfig, $timeout , $stateParams) {
        var vm = this;
        $scope.showMenu = false;
        $scope.selectedView = 'contribution';
        $scope.changeViewing = function (data) {
            $scope.selectedView = data;
        };
        $scope.pageShow = 'myContribution';
        vm.userRanking;
        $scope.cops = [];
        $scope.interests = [];
        $scope.events = [];
        vm.userInfo;
        $scope.pagename = "ProfilePage";
        $scope.eventsLoad = false;
        $scope.recommendedArticleLoad = false;
        $scope.workingLoaded = false;
        $scope.unsubscribedArticles = [];
        $scope.discussions = [];
        $scope.team = [];
        $scope.workingExperience = [];
        $scope.expertInterview = [];
        $scope.expertExperience = [];
        $scope.expertInterviewId = 0 ;
        $scope.showContributions = false;
        $scope.showExpertInterview = false;

        $scope.user =  $stateParams.user;
        $scope.userID;
        $scope.userTypemodel = 'All';
        $scope.Ads = null;

        $scope.changeShow = function (data) {
            $scope.pageShow = data;
        }

        function getWorkingAndProjects(userID){
            profileAPI.getWorkingAndprojects(userID).then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (event) {
                        if(event.position != null || event.projectName != null || event.projectDuration != null || event.projectLocation != null) {
                            $scope.workingExperience.push(event);
                        }
                    });
                }
                $scope.workingLoaded = true;
                console.log($scope.workingExperience);
            });
        }
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
        function getExpertExperience(userID){
            profileAPI.getExpertExperience(userID).then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (experience) {
                        if(experience.position != null || experience.projectDuration != null || experience.experienceTitle != null)
                        $scope.expertExperience.push(experience);
                    });
                }
                $scope.eventsLoad = true;
                console.log($scope.expertExperience);
            });
        }
        function getExpertInterviews(userID){
            profileAPI.getExpertInterviews(userID).then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (interview) {
                        $scope.expertInterview.push(interview);
                    });
                }
                $scope.eventsLoad = true;
                console.log($scope.expertInterview);
    
            });
        }
        $scope.userType = [];
        function setSelectedUserType(){

            var userType;
            var queryUrl = $location.search();
            var user = queryUrl.userType;
            for (userType in appConfig.UserProfileUserTypes) {
                console.log(userType);
                if (appConfig.UserProfileUserTypes.hasOwnProperty(userType)) {
                    var value = appConfig.UserProfileUserTypes[userType];

                    if(value == user){
                        $scope.userType.push({ "name": value, "value": userType, "selected": true });
                        $scope.userTypemodel = userType;
                    }
                    else{
                        if(user == undefined){
                            $scope.userTypemodel = "All";
                        }
                        $scope.userType.push({ "name": value, "value": userType, "selected": false });
                    } 
                }
            }

        }
        $scope.getTabValue = function(value){
            console.log("selected tab" + value);
            $location.search('userType', value);
        }
        
       
        function _onInit() {
            getActiveAds();
            if($scope.user != undefined){
                $scope.$emit('onProfileLoad' , {id: $scope.user, isMe: false});
                getWorkingAndProjects($scope.user);
                getExpertExperience($scope.user);
                getExpertInterviews($scope.user);
                $scope.userID = $scope.user;
            }
            else{
                $scope.user = UserProfileApi.getUserInfo();
                $scope.$emit('onProfileLoad' , {id: $scope.user.userId, isMe: true});
                getWorkingAndProjects($scope.user.userId);
                getExpertExperience($scope.user.userId);
                getExpertInterviews($scope.user.userId);
                $scope.userID = $scope.user.userId;
            } 
            vm.discussionfromPos = 0;
            vm.discussiontoPos = 0;
      
            /* PAGING */
            vm.discussionPageIndex = 1;
            vm.discussionPageSize = 10;
            vm.discussionMaxSize = 5;
            vm.discussionSetPage = function (pageNo) {
                vm.discussionPageIndex = pageNo;
            };

            setSelectedUserType();
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
  


        $scope.getExpertInterviewID = function(expertInterviewID){
            $scope.expertInterviewId = expertInterviewID;
            $('#showArticle_' + expertInterviewID).modal('show');
        }

        $scope.$on('contributionsLoaded', function (event, totalArticles) {
           $scope.showContributions = true;
           
        });
        $scope.$on('expertInterviewLoaded', function (event, totalInterviews) {
            if(totalInterviews > 0){
                $scope.showExpertInterview = true;
            }
         });

        _onInit();

    }

})();
