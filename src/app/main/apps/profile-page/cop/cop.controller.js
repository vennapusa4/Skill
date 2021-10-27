(function () {
  'use strict';

  angular
    .module('app.ProfilePage')
    .controller('CoPController', CoPController);

  /** @ngInject */
  function CoPController($scope, profileAPI, UserProfileApi, AdminSettingCoPApi, appConfig, $stateParams, $state , LandingPageAPI) {
    var vm = this;
    $scope.showMenu = false;
    $scope.copID = $stateParams.copid;
    $scope.cops = [];

    $scope.events = [];
    $scope.discussions = [];
    $scope.discussionTooltipshow2 = false;
    $scope.eventsLoad = false;
    $scope.discussionLoad = false;
    $scope.pagename = "ProfilePage";
    $scope.unsubscribedArticles = [];
    $scope.channels = [];
    $scope.articles = [];
    $scope.ngModel;
    $scope.totalMemeber;
    $scope.redirectLink = appConfig.MsTeamRedirectLink;
    $scope.userInfo;
    $scope.copObj = {
      copName: "",
      copCategory: "",
      copDescription: "",
      champions: [],
      leaders: [],
      secretaries: [],
      members: [],
      image: null,
    }
    $scope.discussionData;
    $scope.totalDiscussions;
    $scope.color;
    $scope.arrcolors= appConfig.copCategoryColor;
    $scope.isMember = false;
    $scope.discussionLoad = false;
    $scope.eventsLoad = false;
    $scope.hasSubscribed = false;

    $scope.userInfo = UserProfileApi.getUserInfo();
    $scope.defaultCoverImage = appConfig.defaultCoPCoverImageBase64;

    $scope.currentUserStatus = {
      "isChampion": false,
      "isLeader": false,
      "isSecretary": false,
      "role": ""
    }

    function getTopNoticeForCoP(){
      AdminSettingCoPApi.getTopNoticeForCoP($scope.copID).then(function (res){
        $scope.noticeForCOP = res;
      })
    }

    $scope.onClickNotice = function(notice){
      debugger
      $scope.currentNotice = notice;
      $("#ModalNotice").show();
    }

    function getCopDetails(){

      profileAPI.getCopDetailById($scope.copID).then(function (res) {

        $scope.copObj.copName = res.copName;
        $scope.copObj.copDescription = res.copDescription;
        $scope.copObj.image = res.image;
        $scope.copObj.copCategory = res.copCategory;
  
        $scope.copObj.champions = [];
        if (res.champions != null) {
          res.champions.forEach(function (champion) {
            $scope.copObj.champions.push(champion);
            if(champion.userID ==  $scope.userInfo.userId){
              $scope.currentUserStatus.isChampion = true;
              $scope.currentUserStatus.role = "Team Champion"
            }
          });
        }
        $scope.copObj.leaders = [];
        if (res.leaders != null) {
          res.leaders.forEach(function (leader) {
            $scope.copObj.leaders.push(leader);
            if(leader.userID ==  $scope.userInfo.userId){
              $scope.currentUserStatus.isLeader = true;
              $scope.currentUserStatus.role = "Team Leader";
            }
          });
        }
        $scope.copObj.secretaries= [];
        if (res.secretaries != null) {
          res.secretaries.forEach(function (secretary) {
            $scope.copObj.secretaries.push(secretary);
            if(secretary.userID ==  $scope.userInfo.userId){
              $scope.currentUserStatus.isSecretary = true;
              $scope.currentUserStatus.role = "Team Secretary"
            }
          });
        }
        $scope.copObj.members= [];
        if (res.members != null) {
          $scope.totalMemeber = res.members.length;
  
          res.members.forEach(function (member) {
            $scope.copObj.members.push(member);
  
          });
        }
        setCopColor();
  
      });
    }
    function setCopColor(){
      if($scope.copObj.copCategory == 'Operation & Technology'){
          $scope.color = $scope.arrcolors[0];
      }
      else if($scope.copObj.copCategory== 'Engineering & Maintenance'){
          $scope.color = $scope.arrcolors[1];
      }
      else if($scope.copObj.copCategory == 'Project Management'){
          $scope.color = $scope.arrcolors[2];
      }
      else if($scope.copObj.copCategory == 'Business Improvement'){
          $scope.color = $scope.arrcolors[3];
      }
      else if($scope.copObj.copCategory == 'Production, Development & Exploration'){
          $scope.color = $scope.arrcolors[4];
      }
      else if($scope.copObj.copCategory == 'HSE'){
          $scope.color = $scope.arrcolors[5];
      }
      else if($scope.copObj.copCategory == 'Business Enablers'){
          $scope.color = $scope.arrcolors[6];
      }
      else if($scope.copObj.copCategory == 'Technical Data'){
          $scope.color = $scope.arrcolors[7];
      }
    }

    function getUpComingEventsByCopID(){
      $scope.events = [];
      profileAPI.getUpComingEventsByCopID($scope.copID).then(function (res) {
        if (res != null || res != "") {
          res.forEach(function (event) {
            $scope.events.push(event);
          });
        }
        $scope.eventsLoad = true;
      });
    }

    function getChannelsByCopID(){
      $scope.channels = [];
      profileAPI.getChannelsByCopID($scope.copID).then(function (res) {
        if (res != null || res != "") {
          res.forEach(function (channel) {
            $scope.channels.push(channel);
          });
        }
      });
    }
    function getDiscussionByCoP() {
      $scope.discussionData = {
        copId: $scope.copID,
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
  
    function getCrossCollaborationChannels(){
      $scope.collaborationChannels = [];
      profileAPI.getCrossCollaborationChannels().then(function (res) {
        if (res != null || res != "") {
          res.forEach(function (collabChannel) {
            $scope.collaborationChannels.push(collabChannel);
          });
        }
      });
    }

    function _onInit() {

      $scope.$emit('onOtherMenuItemLoad' ,  $scope.userInfo.userId);
      vm.fromPos = 0;
      vm.toPos = 0;

      /* PAGING */
      vm.pageIndex = 1;
      vm.pageSize = 10;
      vm.maxSize = 5;
      vm.setPage = function (pageNo) {
          vm.pageIndex = pageNo;
      };

      vm.discussionfromPos = 0;
      vm.discussiontoPos = 0;

      /* PAGING */
      vm.discussionPageIndex = 1;
      vm.discussionPageSize = 10;
      vm.discussionMaxSize = 5;
      vm.discussionSetPage = function (pageNo) {
          vm.discussionPageIndex = pageNo;
      };

      getCopDetails();
      checkSubscribedStatustoGeneral();
      checkSubscribedStatus();
      setCopColor();
      getUpComingEventsByCopID();
      getChannelsByCopID();
      getDiscussionByCoP();
      getTopNoticeForCoP();
    }
    
    function checkSubscribedStatus(){
      profileAPI.checkChannelStatus($scope.copID).then(function (res) {
        if (res != null || res != "") {
          $scope.hasSubscribed = res.isSubscribedToGeneral;
          $scope.isMember = res.isSubscribedToMembers;

          if($scope.isMember){
            getCrossCollaborationChannels();
          }
        }
      });
    }

    function checkSubscribedStatustoGeneral(){
      profileAPI.checkGeneralChannelStatus($scope.copID).then(function (res) {
        if (res != null || res != "") {
          $scope.hasSubscribed = res.isSubscribedToGeneral;
          $scope.isMember = res.isSubscribedToMembers;

          if($scope.isMember){
            getCrossCollaborationChannels();
          }
        }
      });
    }
    $scope.joinChannel = function (channelName, channelID) {
  
      if(channelName == "General"){
        $scope.requestToSubscribe();
      }
      else{
        $scope.data = {
          "requesterId": $scope.userInfo.userId,
          "copId": $scope.copID,
          "channelName" : channelName,
          "channelId": channelID,
        }
        profileAPI.requestToJoinChannel($scope.data).then(function (data) {
          logger.success("Request sent successfully!");
          $scope.channels = [];
          profileAPI.getChannelsByCopID($scope.copID).then(function (res) {
            if (res != null || res != "") {
              res.forEach(function (channel) {
                $scope.channels.push(channel);
              });
            }
  
            //Update Pending Actions as well. 
          });
  
        }, function (error) {
        });
      }
    }

     $scope.requestToSubscribe = function(){
      $scope.userInfo = UserProfileApi.getUserInfo(); 

      $scope.postData = {
        userId : $scope.userInfo.userId,
        copId:  $scope.copID
       }

      LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
          logger.success("Subscribed Successfully");
          checkSubscribedStatustoGeneral();
          checkSubscribedStatus();
          
          getChannelsByCopID();
          $scope.$emit('onCoPSubscription', "success");
       },function (error) {
         logger.error(error);
       });
    }

    $scope.isOwner = false;
      profileAPI.CheckOwner($scope.copID , $scope.userInfo.userId).then(function (res) {
        $scope.isOwner = res.isOwner
      });
    
    $scope.requestToUnSubscribe = function(copID , channelName){
      $scope.userInfo = UserProfileApi.getUserInfo(); 
   
      if(channelName == "General"){
        
          if($scope.isOwner){
              alert("You are currently a Team Owner you can not unsubscribe to the CoP Please contact Administrator");
          }
          else{
            $('#requestToUnSubscribeAlert').show();
            $('#requestToUnSubscribeAlert').on('close.bs.alert', function (event) {
              
              event.preventDefault();
              $(this).fadeOut();
          $scope.postData = {
            requesterId : $scope.userInfo.userId,
            copId: copID,
            channelName : channelName
           }
           profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
            logger.success("Your request to unsubscribe the channel is Successful");
            $scope.$emit('onCoPUnSubscription' , "success");
            checkSubscribedStatustoGeneral();
            checkSubscribedStatus();
           
            getChannelsByCopID();


            
          },function (error) {
            logger.error(error);
          });
        })
        
          }
      }
      else{
        $('#requestToUnSubscribeToMember').show();
        $('#requestToUnSubscribeToMember').on('close.bs.alert', function (event) {
          event.preventDefault();
          $(this).fadeOut();
          $scope.postData = {
            requesterId : $scope.userInfo.userId,
            copId: copID,
            channelName : channelName
           }
          profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
            logger.success("Your request to leave the channel is Successful");
            checkSubscribedStatustoGeneral();
            checkSubscribedStatus();
            
            getChannelsByCopID();
          //  $scope.$emit('onCoPUnSubscription' , "success");

          },function (error) {
            logger.error(error);
          });
        })
      }    
    }


   vm.discussionPageChanged = function (){
      $scope.getDiscussionByCoP();
   }

   $scope.cancelSubscription = function(element){
     if(element == "General" ){
      $("#requestToUnSubscribeAlert").fadeOut();
     }
     else if(element == "Member" ){
      $("#requestToUnSubscribeToMember").fadeOut();
     }
     
   }

    _onInit();

  }

})();
