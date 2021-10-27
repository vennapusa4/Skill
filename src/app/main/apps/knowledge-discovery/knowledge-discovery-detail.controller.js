(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeDetailController', KnowledgeDetailController);

  /** @ngInject */
  function KnowledgeDetailController($scope, $window, $timeout, $stateParams, $rootScope, logger, appConfig, $location,
    $anchorScroll, UserProfileApi, KnowledgeDocumentApi, KnowledgeDiscoveryApi, InsightsApi, MasterDataLanguageCodesApi, TranslatorApi, $state) {
    var vm = this;
    vm.mS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // vm.loading = false;
    vm.knowledgeDocumentId = $stateParams.id;
    vm.config = appConfig;
    vm.knowledgeDocument = {};
    vm.knowledgeDocumentOriginal = {};
    $scope.translationUpdateDateOriginal = {};
    vm.similarDocumentDetails = {};
    vm.featuredDocuments = [];
    vm.replicationDetails = {};
    vm.userInfo = {};
    vm.replicationContributorDetails = {};
    vm.knowledgeDocumentTypeName = '';
    vm.tagName = '';
    vm.trendSeries = ['TotalCount'];
    vm.trendLabels = [];
    vm.trendData = [];
    vm.showTrendGraph = false;
    $scope.playList = [];
    vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
      $scope.versionList = [1,2];
      vm.versionDetailsList = [1];
    vm.trendOptions = {
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      }
    };


      
    vm.canViewEndorser = false;
    $scope.mediaSource = null;
    $scope.mediaType = null;
    vm.isSubmitter = false;
    vm.canViewReviewer = false;
    vm.canViewExpertSection = false;
    vm.canShowApprove = false;
    vm.knowledgeDocument.totalLikesCount = '';
    vm.knowledgeDocument.totalSaveLibraryCount = '';
    vm.taggingRequest = {};
    vm.postLike = postLike;
   // vm.postSave = postSave;
    vm.updateStatus = updateStatus;
    vm.updateReviewerStatus = updateReviewerStatus;
    vm.updateEndorseStatus = updateEndorseStatus;
    vm.gotoCommentsSection = gotoCommentsSection;
    vm.calculateTotalComment = calculateTotalComment;
    vm.languageChange = languageChange;
    vm.revertTranslation = revertTranslation;
    vm.ShareEmails = [];
      vm.insightKnowledgeReferences = [];
      vm.version = undefined;
    $scope.IsShowValue = false;
    $scope.submitInforMation = {};
    $scope.selectedLanguage = "en";
    $scope.languageCodeName = "English";
    $scope.originalLanguageCode = "en";
    vm.selectedRevertToVersion = "1";
    vm.knowledgeDocument.originalLanguageCode = "en";
    vm.prevPath;

    
    $scope.QuestionsEnglish = {};
    $scope.Questions = {};
    $scope.QuestionsEnglish.published = 'Published on';
    $scope.QuestionsEnglish.reviews = 'Reviews';
    $scope.QuestionsEnglish.views = 'Views';
    $scope.QuestionsEnglish.trending = 'Trending';
    $scope.QuestionsEnglish.summary = 'Summary';
    $scope.QuestionsEnglish.description = 'Description';
    $scope.QuestionsEnglish.recommendation = 'Recommendation';
    $scope.QuestionsEnglish.referenced = 'SKILL knowledge referenced (REPLICATION)';
    $scope.QuestionsEnglish.LLtype = 'Lessons Learnt type';
    $scope.QuestionsEnglish.supposedToHappen = 'What was supposed to happen?';
    $scope.QuestionsEnglish.actuallyHappened = 'What actually happened?';
    $scope.QuestionsEnglish.whyDifference = 'Why were the differences?';
    $scope.QuestionsEnglish.whatLearn = 'What can we learn from this?';
    $scope.QuestionsEnglish.valueImpact = 'VALUE IMPACT (IN RM)';
    $scope.QuestionsEnglish.fromThisExperience = 'From This Experience';
    $scope.QuestionsEnglish.fromReplications = 'From Replications';
    $scope.QuestionsEnglish.businessImpact = 'Business Impact';
    $scope.QuestionsEnglish.methodTool = 'Methodology / Tools';
    $scope.QuestionsEnglish.successFactor = 'Success Factor';
    $scope.QuestionsEnglish.businessSectors = 'Business Sectors';
    //
    $scope.QuestionsEnglish.attachment = 'Attachment';
    $scope.isAutoplay = false;
    //
    $scope.QuestionsEnglish.discipline = 'Discipline';
    $scope.QuestionsEnglish.location = 'Location';
    $scope.QuestionsEnglish.project = 'Project';
    $scope.QuestionsEnglish.equipment = 'Equipment';
    $scope.QuestionsEnglish.wells = 'Wells';
    $scope.QuestionsEnglish.keywords = 'Keywords';
    //
    $scope.QuestionsEnglish.author = 'Author';
    $scope.QuestionsEnglish.coauthor = 'co-author';
    $scope.QuestionsEnglish.source = 'SOURCE';
    $scope.QuestionsEnglish.externalauthor = 'External-Author';
    $scope.QuestionsEnglish.submittedby = 'Submitted by';
    $scope.QuestionsEnglish.endorsedby = 'Endorsed By';
    //
    $scope.QuestionsEnglish.recentInterests = 'Recent interests';
    $scope.QuestionsEnglish.loadmore = 'Load More';
    //
    $scope.QuestionsEnglish.comments = 'Comments';
    $scope.QuestionsEnglish.postedon = 'posted on';
    $scope.QuestionsEnglish.reply = 'Reply';
    $scope.QuestionsEnglish.deletecomment = 'Delete Comment';
    $scope.QuestionsEnglish.translate = 'Translate';
    $scope.QuestionsEnglish.hideTranslation = 'Hide Translation';
    $scope.QuestionsEnglish.like = 'Like';
    $scope.QuestionsEnglish.dislike = 'Dislike';

    //
    $scope.QuestionsEnglish.translation = 'Translation';
    $scope.QuestionsEnglish.versionUpdateText1 = 'This version has been updated on';
    $scope.QuestionsEnglish.versionUpdateText2 = 'by';
    //$scope.QuestionsEnglish.improvetranslation = 'Improve This Translation';
      $scope.QuestionsEnglish.disclaimer1 = 'Disclaimer ';
      $scope.QuestionsEnglish.satisfaction = 'Are you statisfied with this translation?';
      $scope.QuestionsEnglish.satisfaction1 = 'Thanks for your Feedback!!';
      $scope.QuestionsEnglish.satisfaction2 = 'Bring me to the Translation Edit Page';
      $scope.QuestionsEnglish.satisfaction3 = 'I want to report discrepancy';
    $scope.QuestionsEnglish.disclaimer = 'Your translation improvement is important to us. By updating this translation, you will be fully responsible for the content translated. Your credentials and content shall be viewed by others and recorded for audit purposes.';

    //Replication History
    $scope.QuestionsEnglish.replicationHistory = 'Replication History';
    $scope.QuestionsEnglish.replicationSource = 'Replication Source';
    $scope.QuestionsEnglish.allReplications = 'All Replications';
    $scope.QuestionsEnglish.valueRealized = 'Value Realized';
    $scope.QuestionsEnglish.potentialValue = 'Potential Value';
    $scope.QuestionsEnglish.totalValue = 'Total Value';
    $scope.QuestionsEnglish.remarks = 'Remarks';

    //Value Creation
    $scope.QuestionsEnglish.valueAmplified = 'Value Amplified';
    $scope.QuestionsEnglish.valueAmplifiedByType = 'Value Amplified By Type';

    //Value Creation
    $scope.QuestionsEnglish.aiDiscipline = 'DISCIPLINE';
    $scope.QuestionsEnglish.aiKeyword = 'KEYWORDS';
    $scope.QuestionsEnglish.aiCop = 'CoP';
    $scope.QuestionsEnglish.aiAdditionalInfo = 'ADDITIONAL INFO';
    $scope.QuestionsEnglish.aiSubDiscipline = 'SUB-DISCIPLINE';
    $scope.QuestionsEnglish.aiLocation = 'LOCATION';

    //Rating
    $scope.QuestionsEnglish.rRateThisArticle = 'Rate this article';
    $scope.QuestionsEnglish.rSelectRating = 'Select Rating';
    $scope.QuestionsEnglish.rPublish = 'Publish my comments and rating';
    $scope.QuestionsEnglish.rSubmit = 'Submit';
    $scope.QuestionsEnglish.rYouRated = 'You have rated this article.';


    //Publications
    $scope.QuestionsEnglish.about = 'ABOUT';
    $scope.QuestionsEnglish.publishType = 'Publication Type';
    $scope.QuestionsEnglish.bookTitle = 'Book Title';
    $scope.QuestionsEnglish.eventName = 'Event Name';
    $scope.QuestionsEnglish.eventDate = 'Event Date';
    $scope.QuestionsEnglish.eventMonthYear = 'Publish Month & Year';
    $scope.QuestionsEnglish.eventLocation = 'Event Location';
    $scope.QuestionsEnglish.digitalMediaTypeName = 'Digital Media Type';
    $scope.QuestionsEnglish.journalTitle = 'Journal Title';
    $scope.QuestionsEnglish.magazineTitle = 'Magazine Title';
    $scope.QuestionsEnglish.newspaperName = 'Newspaper Name';
    $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
    $scope.QuestionsEnglish.publicationDate = 'Published Date';
    $scope.QuestionsEnglish.audienceLevel = 'Audience Level';
    $scope.QuestionsEnglish.society = 'Society';
    $scope.QuestionsEnglish.isbn = 'ISBN';
    $scope.QuestionsEnglish.websiteURL = 'URL';
    $scope.QuestionsEnglish.collaboration = 'Collaboration';
    $scope.QuestionsEnglish.programme = 'Programme';
    $scope.QuestionsEnglish.exernalAuthor = 'Exernal Author';
    $scope.QuestionsEnglish.winner = 'Winner';
    $scope.QuestionsEnglish.doingDifferently = 'Doing things differently';
    $scope.QuestionsEnglish.caseForChange = 'Case for Change';
    $scope.wantReplication = false;
    $scope.repeatableInMyArea = false;
    //Tech Alert
    $scope.QuestionsEnglish.description = 'Description';
    $scope.QuestionsEnglish.recommendation = 'Recommendation';
    $scope.QuestionsEnglish.whyNotImplemented = 'Why Not Implemented?';

    //authors
    $scope.QuestionsEnglish.authorAuthor = 'AUTHOR';
    $scope.QuestionsEnglish.authorCoAuthor = 'CO-AUTHOR';
    $scope.QuestionsEnglish.authorSource = 'SOURCE';
    $scope.QuestionsEnglish.authorSubmittedBy = 'SUBMITTED BY';
    $scope.QuestionsEnglish.authorValidatedBy = 'VALIDATED BY';

    //replication slide
    $scope.QuestionsEnglish.rsTotal = 'Total';
    $scope.QuestionsEnglish.rsSource = 'Source';
    $scope.QuestionsEnglish.rsTotalValue = 'Total Value (RM)';
    $scope.QuestionsEnglish.rsRemark = 'Remarks';

    //value impact
    $scope.QuestionsEnglish.vlViewChart = 'View Chart';
    $scope.QuestionsEnglish.vlViewNumber = 'View Number';
    $scope.QuestionsEnglish.vlfromExp = 'From The Experience';
    $scope.QuestionsEnglish.vlfromReplication = 'From Replication';
    $scope.QuestionsEnglish.vlPotentialValue = 'Potential Value';
    $scope.QuestionsEnglish.vlValueRealised = 'Value Realised';

    //Ideas
    $scope.QuestionsEnglish.category = 'Category';
    $scope.QuestionsEnglish.originalKnowledge = 'Original Knowledge';
    $scope.valueImpactShows = 'number';
    $scope.allLoaded = false;
    $scope.showThanks = false;

    //buttons 
    $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
    $scope.QuestionsEnglish.iaminterested = "I am Interested";
    $scope.QuestionsEnglish.totalInterestedWord = "people interested to replicate this knowledge."

    

    $scope.arrRatingComments = [];
    $scope.RatingComments = "";
    $scope.totalRating;
    $scope.totalReviews;
    $scope.myRating = 0;
    $scope.rating = 0;
    $scope.ratingAtPopup = "";
    $scope.public = false;

    $scope.ratingLevel= [ 1, 2, 3, 4, 5];
    $scope.popupratingLevel= [ 1, 2, 3, 4, 5];
    vm.popupRatingComments = "";
    vm.RatingCommentsSection = "";

    $scope.getPublicValue = function(value, calledFrom){
      if(calledFrom == "popup"){
        $scope.popupPublic = value;
      }
      else{
        $scope.public = value;
      }
     
    } 

    
    $scope.arrPopupRatingComments = [];
    $scope.setSelectedPopupComments = function () {
      var key;
      for (key in appConfig.popupRatingComments) {
          if (appConfig.popupRatingComments.hasOwnProperty(key)) {
              var value = appConfig.ratingComments[key];
              $scope.arrPopupRatingComments.push({ "name": value, "value": key, "selected": false });
          }
      }
    }

    $scope.setSelectedComments = function () {
    var key;
    for (key in appConfig.ratingComments) {
        if (appConfig.ratingComments.hasOwnProperty(key)) {
            var value = appConfig.ratingComments[key];
            $scope.arrRatingComments.push({ "name": value, "value": key, "selected": false });
        }
    }
  }

  $scope.predefinedComments = [];
  $scope.allPredefinedRatingComments = [];
  $scope.getPredefinedRatingComments = function(){
    KnowledgeDocumentApi.getPredefinedRatingComments().then(function (comments) {
      comments.forEach(function(comment){
          $scope.allPredefinedRatingComments.push(comment)
       
      })
    },function (error) {
      logger.error(error.data.message);
  
    });
  }
 
  $scope.getRatingComments = function(comments, calledFrom){

    
    if(calledFrom == "popup"){
      vm.popupRatingComments = comments;
    }
    else if(calledFrom == "main"){
      vm.RatingCommentsSection = comments;
    }
    
  }
  $scope.commentChanged = function(){
    $scope.RatingComments = "";
  }

  function getKnowledgeRating(){
    KnowledgeDocumentApi.getRating(vm.knowledgeDocumentId ,vm.userInfo.userId )
    .then(function (res) {
      if(res !=null && res != ""){
        $scope.totalRating = res.averageRating;
        $scope.totalReviews = res.numberOfReviews;
        $scope.myRating = res.myRating;
      }
    }).catch(function (res) {
      $scope.totalRating = 0;
      $scope.totalReviews = 0;
    });
  }

  
  $scope.predefinedComments = [];
  $scope.getSelectedRating = function(value , calledFrom){

    $scope.predefinedComments = [];
    $scope.predefinedPopUpComments = [];
    if(calledFrom == "popup"){
      $scope.popupRating = value;
      $scope.showPopupRatingError = false;
      console.log($scope.popupRating);

      $scope.allPredefinedRatingComments.forEach(function(comment){
        if($scope.popupRating == comment.typeId){
          $scope.predefinedPopUpComments.push({ "name": comment.comments, "value": comment.comments, "selected": false })
        }
      })
    }
    else{
      $scope.rating = value;
      $scope.showRatingError = false;
      console.log($scope.rating);

      $scope.allPredefinedRatingComments.forEach(function(comment){
        if($scope.rating == comment.typeId){
          $scope.predefinedComments.push({ "name": comment.comments, "value": comment.comments, "selected": false })
        }
      })
    }
 
  }
  $scope.showRatingError = false;

  $scope.isPopupRating = false;

  $scope.openRatingModal = function(){
    $scope.isPopupRating = true;
    $("#ratingPopup").modal('show');
  }
  
  $scope.saveRating = function(){

    var ratingData;
    if($scope.isPopupRating != true){
      ratingData = {
        "kdId": vm.knowledgeDocumentId,
        "userId": vm.userInfo.userId,
        "ratingTypeId": 1,
        "rating":$scope.rating,
        "ratingComments": vm.RatingCommentsSection,
        "public": $scope.public
        }
        if($scope.rating != 0){
            KnowledgeDocumentApi.saveRating(ratingData).then(function (data) {
              logger.success("Rating Added Successfully!");
              //$state.go($state.current,$stateParams , {reload: true});
              vm.RatingCommentsSection = "";
              // $scope.getAllRatingComments();
              getKnowledgeRating();
              $scope.$broadcast('commentsAdded');
            },function (error) {
              logger.error(error.data.message);
          
            });
        }
        else{
            $scope.showRatingError = true;
          
        }
  
    }
    else{
      ratingData = {
        "kdId": vm.knowledgeDocumentId,
        "userId": vm.userInfo.userId,
        "ratingTypeId": 1,
        "rating":$scope.popupRating,
        "ratingComments": vm.popupRatingComments,
        "public": $scope.popupPublic
        }
        if($scope.popupRating != 0){
            KnowledgeDocumentApi.saveRating(ratingData).then(function (data) {
              logger.success("Rating Added Successfully!");
              //$state.go($state.current,$stateParams , {reload: true});
              vm.popupRatingComments = "";
               $('#ratingPopup').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
              getKnowledgeRating();
              $scope.$broadcast('commentsAdded');
            },function (error) {
              logger.error(error.data.message);
          
            });
        }
        else{
            $scope.showPopupRatingError = true;
          
        }
    }
    
     
  }

  $scope.feedbackloopData = {
    projectNameReplication: "",
    remarksReplication: "",
    projectNameReplicateMyArea: "",
    remarksReplicateMyArea:"",
    forMyKnowledge :false
  }
  

  $scope.addFeedbackloop= function(){
    var postData;
    if($scope.wantReplication){
       postData = {
        "kdId": vm.knowledgeDocumentId,
        "userId": vm.userInfo.userId,
        "typeId": 1,
        "statusId":1,
        "locationProjectName":$scope.feedbackloopData.projectNameReplication,
        "comments":$scope.feedbackloopData.remarksReplication,
        "isInterested" : true
        }

        KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
          logger.success("Feedback Added Successfully!");
          $scope.feedbackloopData.projectNameReplication= '';
          $scope.feedbackloopData.remarksReplication = '';
          $scope.getTotalInterests();
  
        },function (error) {
           logger.error(error.data.message);
        });
    }
    if($scope.repeatableInMyArea){
      postData = {
        "kdId": vm.knowledgeDocumentId,
        "userId": vm.userInfo.userId,
        "typeId": 2,
        "statusId":1,
        "locationProjectName":$scope.feedbackloopData.projectNameReplicateMyArea,
        "comments":$scope.feedbackloopData.remarksReplicateMyArea,
        "isInterested" : true
        }

        KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
          logger.success("Feedback Added Successfully!");
          $scope.feedbackloopData.projectNameReplicateMyArea = '';
          $scope.feedbackloopData.remarksReplicateMyArea = '';
          $scope.getTotalInterests();
        },function (error) {
           logger.error(error.data.message);
        });
    }
    if($scope.forMyKnowledge ){
      $scope.postSave();
      $scope.getTotalInterests();
    }   
    $('#interested').modal('hide');
  }
  

  $scope.getTotalInterests = function(){
    KnowledgeDocumentApi.getTotalInterest(vm.knowledgeDocumentId , vm.userInfo.userId)
    .then(function (res) {
      if(res !=null && res != ""){
        $scope.totalInterested = res.totalFeedbackloops;
      }
    }).catch(function (res) {
    });
  }
 
    $scope.switchView = function(data) {
      $scope.valueImpactShows = data;
    }

    vm.isReviewer = false;

    activate();
    angular.element(document).ready(function () {
      vm.prevPath = {};
      if($window.localStorage.getItem("prevPathTitle") && $window.localStorage.getItem("prevPathName")) {
        vm.prevPath['name'] = $window.localStorage.getItem("prevPathName");
        vm.prevPath['title'] = $window.localStorage.getItem("prevPathTitle");
        $window.localStorage.removeItem("prevPathName");
        $window.localStorage.removeItem("prevPathTitle");
      } else {
        vm.prevPath['name'] = 'app.SearchPage.knowledge({docType: All})';
        vm.prevPath['title'] = 'Knowledge Discovery';
      }
      $timeout(function() {
        if ($location.hash() === 'comments') {
          gotoCommentsSection();
        } else if ($location.hash() === 'attachments') {
          gotoAttachmentSection();
        }
       }, 1000);
    });

    function activate() {
      getUserInfo();
    //  $scope.setSelectedComments(); 
      $scope.getTotalInterests();
      getKnowledgeRating();
      getKnowledgeDocumentDetail();
      getTrendDetails();
      getReplicationContributors();
      getSimilarDocuments();
      shareUsers();
      getReplicationDetails();
      getListOfLanguages();
    }

    $scope.ratingComments= [];
    // $scope.getAllRatingComments = function(){
      
    //   KnowledgeDocumentApi.getAllRatingComments(vm.knowledgeDocumentId)
    // .then(function (res) {
    //   if(res !=null && res != ""){
    //     $scope.getAllRatingComments = res;
    //   }
    // }).catch(function (res) {
    //   $scope.totalRating = 0;
    //   $scope.totalReviews = 0;
    // });
    // }
    // $scope.getAllRatingComments();
    $scope.totalInterested;
    // $scope.replicateNowButtonText = $scope.Questions.replicateNowButton;
    

    function getKnowledgeDocumentDetail() {
      KnowledgeDocumentApi.api.knowledgeDocument.byId({}, {
          knowledgeDocumentId: vm.knowledgeDocumentId
        },
        function (response) {
          if (!response || !response.kdId || response.isDeleted) {
            $("#notfound_modal").modal('show');
            $('#notfound_modal').on('hidden.bs.modal', function (e) {
              //$state.go('app.LandingPageController');
            })
            return;
          }  
          
          vm.knowledgeDocument = response;
          $scope.allLoaded=true;
          $scope.replicationSourceCount = 0;
         // $scope.totalInterested = vm.knowledgeDocument.totalInterested
          KnowledgeDocumentApi.GetKnowledgeUserInfo(vm.knowledgeDocumentId).then(function (res) {
            vm.knowledgeDocument['user_info'] = res;
            KnowledgeDocumentApi.GetKnowledgeAdditionInfo(vm.knowledgeDocumentId).then(function (result) {
              vm.knowledgeDocument['additional_info'] = result;
              var displayInfo = [];
              vm.knowledgeDocument.additional_info.equipments.forEach(function(x){
                displayInfo.push(x.equipmentName);
              });
              vm.knowledgeDocument.additional_info.projects.forEach(function(x){
                displayInfo.push(x.projectName);
              });
              vm.knowledgeDocument.additional_info.wells.forEach(function(x){
                displayInfo.push(x.wellName);
              });
              vm.knowledgeDocument.additional_info['displayAdditional'] = displayInfo;
              KnowledgeDocumentApi.api.attachments.query({}, { knowledgeDocumentId: vm.knowledgeDocumentId },
                function (responses) {
                    $scope.playList = [];
                    var videos = [];
                    var audios = [];
                    var images = [];
                    responses.forEach(function(element){
                      if(element.fileName.toLowerCase().indexOf('.png') != -1 || element.fileName.toLowerCase().indexOf('.jpg') != -1 || element.fileName.toLowerCase().indexOf('.jpeg') != -1){
                        images.push(element);
                      } else if (element.fileName.toLowerCase().indexOf('.mp3') != -1) {
                        audios.push(element);
                        element.playType = 'audio';
                        element.active = false;
                        $scope.playList.push(element);
                      } else if (element.fileName.toLowerCase().indexOf('.mp4') != -1) {
                        videos.push(element);
                        element.playType = 'video';
                        element.active = false;
                        $scope.playList.push(element);
                      } 
                    });

            

                    if(videos.length > 0) {
                      choosePlaying(videos[0], false);
                      // $scope.mediaSource = videos[0];
                      // $scope.mediaType = 'video';
                    } else if(audios.length > 0) {
                      choosePlaying(audios[0], false);
                      // $scope.mediaSource = audios[0];
                      // $scope.mediaType = 'audio';
                    } else {
                      $scope.mediaType = 'image';
                    }
                    console.log($scope.mediaSource);
                    console.log($scope.mediaType);
                    console.log($scope.playList);
                    // else if(images.length > 0) {
                    //   $scope.mediaSource = images[0];
                    //   $scope.mediaType = 'image';
                    // }
                    KnowledgeDocumentApi.api.replicationHistory.query({}, { knowledgeDocumentId: vm.knowledgeDocumentId }, function(respond){
                      vm.knowledgeDocument['replication_history'] = respond;
                      KnowledgeDocumentApi.getKDDisclaimer(vm.knowledgeDocumentId).then(function (responsive) {
                        vm.knowledgeDocument['KDDisclaimer'] = responsive;
                      }, function (error) {
                        vm.knowledgeDocument['KDDisclaimer'] = null;
                        //console.log(error);
                      });
                      $scope.allLoaded = true;
                      window.setTimeout(function () {
                        $("#mapKDDetail").kendoMap({
                          center: [vm.knowledgeDocument.additional_info.location.latitude, vm.knowledgeDocument.additional_info.location.longitude],
                          zoom: 5,
                          layers: [{
                              type: "tile",
                              urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                            subdomains: ["a", "b", "c"],
                          }],
                          markers: [{
                            location: [vm.knowledgeDocument.additional_info.location.latitude, vm.knowledgeDocument.additional_info.location.longitude],
                            shape: "pinTarget",
                            tooltip: {
                                content: vm.knowledgeDocument.additional_info.location.latitude,
                                showOn: "click"
                            },
                          }],
                        });
                      });
        
                      window.setInterval(function () {
                        try {
                          $("#mapKDDetail")
                            .css({ width: "100%", height: "100px" })
                            .data("kendoMap").resize();
                        } catch (e) {
        
                        }
                      }, 2000);
                    });
                    KnowledgeDocumentApi.api.replicationSourceHistory.query({}, { knowledgeDocumentId: vm.knowledgeDocumentId },
                      function (response) {
                        debugger;
                        if(response && response.length >0){
                          $scope.replicationSourceCount = response.length;
                        }
                      }
                    );
                });
              console.log(vm.knowledgeDocument);
            });
          });
          vm.knowledgeDocumentOriginal = angular.copy(vm.knowledgeDocument);

          if (vm.knowledgeDocument.originalLanguageCode != null && vm.knowledgeDocument.originalLanguageCode != '') {
            $scope.selectedLanguage = vm.knowledgeDocument.originalLanguageCode;
            $scope.originalLanguageCode = vm.knowledgeDocument.originalLanguageCode;
           
            $scope.TranslatedEventDate = moment(vm.knowledgeDocument.eventDate).format('DD MMM YYYY');
            $scope.PublishedDate = moment(vm.knowledgeDocument.publicationDate).format('DD MMM YYYY');
            translateQuestions();
            translateDates(vm.knowledgeDocument.originalLanguageCode);           
          }
          else {
            vm.knowledgeDocument.originalLanguageCode = "en";
            $scope.originalLanguageCode = "en";
            
            $scope.TranslatedEventDate = moment(vm.knowledgeDocument.eventDate).format('DD MMM YYYY');
            $scope.PublishedDate = moment(vm.knowledgeDocument.publicationDate).format('DD MMM YYYY');
          }

          // set Page Title
          if (vm.knowledgeDocument) {
            switch (vm.knowledgeDocument.kdType) {
              case vm.config.KnowledgeDocumentTypes.BestPractice:
                $rootScope.title = 'Knowledge Details Best Practice';
                $scope.improveType = 'best-practices';
                $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
                break;
              case vm.config.KnowledgeDocumentTypes.LessonsLearnt:
                $rootScope.title = 'Knowledge Details Lessons Learnt';
                $scope.improveType = 'lessons-learnt';
                $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
                break;
              case vm.config.KnowledgeDocumentTypes.Publications:
                $rootScope.title = 'Knowledge Details Publications';
                $scope.improveType = 'publications';
                $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
                break;
              case vm.config.KnowledgeDocumentTypes.TechnicalAlerts:
                $rootScope.title = 'Knowledge Details Technical Alerts';
                $scope.improveType = 'technical-alerts';
                $scope.QuestionsEnglish.replicateNowButton = "Share Technical Alert Implementation Here";
                break;
              case vm.config.KnowledgeDocumentTypes.Insights:
                $rootScope.title = 'Knowledge Details Insights';
                $scope.improveType = 'insights';
                $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
                break;
              case vm.config.KnowledgeDocumentTypes.Ideas:
                $rootScope.title = 'Knowledge Details Ideas';
                $scope.improveType = 'lessons-learnt';
                $scope.QuestionsEnglish.replicateNowButton = "Replicate Now";
                break;
            }
          }

          // get insight references
          if (vm.knowledgeDocument.kdType == vm.config.KnowledgeDocumentTypes.Insights) {
            getInsightReferencesDocuments();
            InsightsApi.getGetContributorInfoById(response.submittedBy.userId).then(function (data) {
              if (data != null) {
                $scope.submitInforMation = data;
              }
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          }

          vm.knowledgeDocument.hasVideo = response.videos && response.videos.length > 0;
          if (vm.knowledgeDocument.keywordList != null) {
            vm.knowledgeDocument.keywords = _.join(vm.knowledgeDocument.keywordList, ', ');
          }

          if(response.submittedBy.userId == vm.userInfo.userId && vm.isReviewer == false){
            vm.isSubmitter = true;
          }

          if (vm.isReviewer &&
            (vm.knowledgeDocument.kdType != vm.config.KnowledgeDocumentTypes.Publications) &&
            (vm.knowledgeDocument.status == vm.config.Statuses.Submit)) {
            vm.canViewReviewer = true;
            console.log("isReviewer"+vm.isReviewer);
          } else {
            vm.canViewReviewer = false;
          }

          //Check if current user can view expert section
          if ((vm.userInfo && (vm.userInfo.isAdmin || (vm.knowledgeDocument.sme != null && vm.knowledgeDocument.sme.userId == vm.userInfo.userId))) &&
            vm.knowledgeDocument.kdType != vm.config.KnowledgeDocumentTypes.Publications &&
            vm.knowledgeDocument.status == vm.config.Statuses.Review) {
            vm.canViewExpertSection = true;
          } else {
            vm.canViewExpertSection = false;
          }

          if (vm.userInfo != null && vm.knowledgeDocument.endorser != null && vm.knowledgeDocument.endorser.userId == vm.userInfo.userId &&
            vm.knowledgeDocument.statusEndorse == vm.config.Statuses.Submit && vm.knowledgeDocument.status == vm.config.Statuses.Review) {
            vm.canViewEndorser = true;
          } else {
            vm.canViewEndorser = false;
          }

          if (vm.knowledgeDocument.kdType === vm.config.KnowledgeDocumentTypes.BestPractice) {
            vm.knowledgeDocumentTypeName = vm.config.KDTypeDisplayNames.BestPractice;
          } else if (vm.knowledgeDocument.kdType === vm.config.KnowledgeDocumentTypes.LessonsLearnt) {
            vm.knowledgeDocumentTypeName = vm.config.KDTypeDisplayNames.LessonsLearnt;
            if (vm.knowledgeDocument.status === vm.config.Statuses.Submit) {
              vm.tagName = 'To be followed';
            }
          } else if (vm.knowledgeDocument.kdType === vm.config.KnowledgeDocumentTypes.Publications) {
            vm.knowledgeDocumentTypeName = vm.config.KDTypeDisplayNames.Publications;
            vm.tagName = vm.knowledgeDocument.sourceName;
          } else if (vm.knowledgeDocument.kdType === vm.config.KnowledgeDocumentTypes.TechnicalAlerts) {
            vm.knowledgeDocumentTypeName = vm.config.KDTypeDisplayNames.TechnicalAlerts;
            //TO CHECK:
            //vm.tagName = vm.knowledgeDocument.sourceName;
          }

          //Post View if Status is submit (or) approved
          if (vm.knowledgeDocument.status === vm.config.Statuses.Submit || vm.knowledgeDocument.status === vm.config.Statuses.Approve) {
            postView();
          }

          vm.canShowApprove = (vm.knowledgeDocument.kdType == vm.config.KnowledgeDocumentTypes.Publications &&
            vm.knowledgeDocument.status == vm.config.Statuses.Submit) ? false : true;
            console.log(vm.knowledgeDocument);
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });

    };
    $scope.Questions = $scope.QuestionsEnglish;
    $scope.changePlaying = function (data) {
      $scope.$broadcast('changeVideo');
      $timeout(function(){
        choosePlaying(data, true);
      }, 500)
    }

    function choosePlaying(data, autoplay) {
      $scope.isAutoplay = autoplay;
      $scope.mediaSource = null;
      $scope.mediaType = null;
      $scope.playList.forEach(function(x){
        if(x.id === data.id) {
          x.active = true;
        } else {
          x.active = false;
        }
      });
      $timeout(function(){
        var searcher = $scope.playList.find(function(x) {
          return x.id == data.id;
        });
        $scope.mediaSource = data;
        $scope.mediaType = searcher.playType;
      }, 1000);

    }

    $scope.showArticleShare = function (data) {
      $scope.choosenKnowlegde = data;
      $scope.$emit('modalShareOpen', data);
    }
    $scope.applyFilter = function () {
      // window.localStorage.setItem('KDDisclaimerID');
      // window.localStorage.setItem('KDDisclaimerName');
      // window.localStorage.setItem('KDDisclaimerGuid');
      // vm.knowledgeDocument.KDDisclaimer.applicationId,vm.knowledgeDocument.KDDisclaimer.applicationName
      
      //id will be 0 incase of Sources.
      $window.open( $state.href('app.SearchPage.knowledge', { docType: "All" , Sources: vm.knowledgeDocument.KDDisclaimer.applicationName+","+0}), '_blank');
    }
    vm.reviewer = {}
    function getUserInfo() {
      vm.userInfo = UserProfileApi.getUserInfo();
      vm.isReviewer = vm.userInfo.roles.indexOf('KMI') != -1;

    if(vm.isReviewer){
      vm.reviewer = vm.userInfo;
    }
    console.log(vm.reviewer);

    };

    $scope.submitRating = function () {
      $scope.showThanks = true;

      $timeout(function(){
        $('#rating').modal('hide');
      },2000)
    }

    function getSimilarDocuments() {
      var similarDocumentsRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId
      };
      KnowledgeDocumentApi.api.similarDocuments.query({}, similarDocumentsRequest,
        function (response) {
          vm.similarDocumentDetails = response;
          // $log.info('Retrieved featured documents successfully.');
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    };

    function getInsightReferencesDocuments() {
      var request = {
        knowledgeDocumentId: vm.knowledgeDocumentId
      };
      KnowledgeDocumentApi.api.insightReferencesDocuments.query({}, request,
        function (response) {
          vm.insightKnowledgeReferences = response;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    };

    function getReplicationContributors() {
      var replicationContributorDetailsRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId
      };
      KnowledgeDocumentApi.api.replicationContributorDetails.query({}, replicationContributorDetailsRequest,
        function (response) {
          vm.replicationContributorDetails = response;
          // $log.info('Retrieved replication contributors successfully.');
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    };
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

    function postLike(isLiked) {
      console.log('asdas');
      vm.knowledgeDocument.isLiked = isLiked;
      vm.knowledgeDocument.totalLikesCount = isLiked ? ++vm.knowledgeDocument.totalLikesCount : --vm.knowledgeDocument.totalLikesCount;
      var likeRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        taggingTypeName: 'Like',
        taggingTypeValue: vm.knowledgeDocument.isLiked
      };
      KnowledgeDocumentApi.api.postTagging.save({}, likeRequest,
        function (response) {
          $rootScope.$broadcast('UpdateInterest');
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    };

    $scope.postSave = function() {
      //vm.knowledgeDocument.isSavedToLibrary = isSavedToLibrary;
      //vm.knowledgeDocument.totalSaveLibraryCount = isSavedToLibrary ? ++vm.knowledgeDocument.totalSaveLibraryCount : --vm.knowledgeDocument.totalSaveLibraryCount;
      var saveRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        taggingTypeName: 'Save',
        taggingTypeValue: true
      };
      KnowledgeDocumentApi.api.postTagging.save({}, saveRequest,
        function (response) {
          logger.success("Added Successfully!");
          $scope.getTotalInterests();
          $rootScope.$broadcast('UpdateInterest');
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    };

    vm.postShare= function(isShared) {
      vm.knowledgeDocument.isShared = isShared;
      var shareRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        taggingTypeName: 'Share',
        taggingTypeValue: vm.knowledgeDocument.isShared
      };
      KnowledgeDocumentApi.api.postTagging.save({}, shareRequest,
        function (response) {
          vm.knowledgeDocument.totalShareCount = vm.knowledgeDocument.totalShareCount + vm.ShareEmails.length;
          $rootScope.$broadcast('UpdateInterest');
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });

      if (vm.ShareEmails && vm.ShareEmails.length > 0) {
        var postData = {
          title: vm.knowledgeDocument.title,
          kDId: vm.knowledgeDocumentId,
          lstMailShare: vm.ShareEmails
        };
        KnowledgeDiscoveryApi.shareKnowledgeDiscovery(postData).then(function (response) {
          if (response && response.success) {
            vm.ShareEmails = [];
          }
          $rootScope.$broadcast('UpdateInterest');
        }, function (response) {
          logger.error(response.data.errorMessage);
        });
      }
    };

    function postView() {
      var viewRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        taggingTypeName: 'View',
        taggingTypeValue: true
      };
      KnowledgeDocumentApi.api.postTagging.save({}, viewRequest,
        function (response) {
          vm.knowledgeDocument.totalViewsCount += 1;
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    };

    function getTrendDetails() {
      var trendRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId
      };
      KnowledgeDocumentApi.api.trend.query({}, trendRequest,
        function (response) {
          var data = [];
          for (var i = 0; i < response.length; i++) {
            if (response[i].totalCount > 0)
              vm.showTrendGraph = true;
            vm.trendLabels.push(response[i].weekDay);
            data.push(response[i].totalCount);
          }
          vm.trendData.push(data);
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }

    function updateStatus(statusName) {
      var statusUpdateRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        statusName: statusName,
        commentText: vm.reviewCommentText
      };
      KnowledgeDocumentApi.api.updateStatus.save({}, statusUpdateRequest,
        function (response) {
          $scope.$broadcast('UpdateStatus', null);
          getKnowledgeDocumentDetail();
          logger.success('Status updated successfully.');
          switch (statusName) {
            case 'Approve':
              $("#ModalApproveReviewer").modal('hide');
              break;
            case 'Reject':
              $("#ModalRejectReviewer").modal('hide');
              break;
            case 'Amend':
            case 'Submit':
              
              $("#ModalAmendReviewer").modal('hide');
              break;
            default:
              break;
          }
          vm.reviewCommentText = '';
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    };

    function updateReviewerStatus(statusName){
      var statusUpdateRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        statusName: statusName,
        commentText: vm.reviewCommentText
      };
      KnowledgeDocumentApi.api.updateReviewerStatus.save({}, statusUpdateRequest,
        function (response) {
          $scope.$broadcast('UpdateStatus', null);
          getKnowledgeDocumentDetail();
          logger.success('Status updated successfully.');
          switch (statusName) {
            case 'Approve':
              $("#ModalApprove").modal('hide');
              break;
            case 'Reject':
              $("#ModalReject").modal('hide');
              break;
            case 'Amend':
            case 'Draft':
              $("#ModalAmend").modal('hide');
              break;
            default:
              break;
          }
          vm.reviewCommentText = '';
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    }

    function updateEndorseStatus(statusName) {
      var statusUpdateRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId,
        statusName: statusName,
        commentText: vm.reviewCommentText
      };
      KnowledgeDocumentApi.api.updateEndorseStatus.save({}, statusUpdateRequest,
        function (response) {
          $scope.$broadcast('UpdateStatus', null);
          getKnowledgeDocumentDetail();
          logger.success('Status updated successfully.');
          switch (statusName) {
            case 'Endorse':
              $("#ModalApproveEndorse").modal('hide');
              break;
            case 'Reject':
              $("#ModalRejectEndorse").modal('hide');
              break;
            case 'Amend':
              $("#ModalAmendEndorse").modal('hide');
              break;
            default:
              break;
          }
          vm.reviewCommentText = '';
        },
        function (response) {
          logger.error(response.data.errorMessage);
        });
    };

    $rootScope.$on('updateTotalLikeCount', function (evt, data) {
      if (data.kdId == vm.knowledgeDocument.kdId) {
        vm.knowledgeDocument.isLiked = data.isLiked;
      }
    });
    $scope.$on('playNext', function (evt, data) {
      var nextIndex;
      var currentIndex;
      console.log(evt);
      console.log(data);
      for(var element in $scope.playList) {
        if(data.id == $scope.playList[element].id) {
          currentIndex = element;
        }
      }
      console.log(currentIndex);

      if(($scope.playList.length - 1) > parseInt(currentIndex)) {
        nextIndex = parseInt(currentIndex) + 1;
        console.log(nextIndex);
        console.log($scope.playList[nextIndex]);
        $timeout(function(){
          $scope.changePlaying($scope.playList[nextIndex]);
        }, 1000);
      } else {
        if($scope.playList.length > 1) {
          $scope.$broadcast('changeVideo');
          choosePlaying($scope.playList[0], false);
        }
      }

    });

    $rootScope.$on('updateTotalBookmarkCount', function (evt, data) {
      if (data.kdId == vm.knowledgeDocument.kdId) {
        vm.knowledgeDocument.isSavedToLibrary = data.isSavedToLibrary;
      }
    });

    function gotoCommentsSection() {
      $anchorScroll.yOffset = 75;
      var newHash = 'Comment';
      if ($location.hash() !== newHash) {
        $anchorScroll(newHash);
      } else {
        $anchorScroll();
      }
    };

    function gotoAttachmentSection () {
      $anchorScroll.yOffset = 80;
      var newHash = 'attachments';
      if ($location.hash() !== newHash) {
        $anchorScroll(newHash);
      } else {
        $anchorScroll();
      }
    };

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

    function getReplicationDetails() {
      var replicationHistoryRequest = {
        knowledgeDocumentId: vm.knowledgeDocumentId
      };
      KnowledgeDocumentApi.api.replicationDetails.query({}, replicationHistoryRequest,
        function (response) {
          vm.replicationDetails = response;

          // $log.info('Retrieved replication history successfully.');
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }

    function calculateTotalComment(total) {
      vm.knowledgeDocument.totalCommentsCount = total;
    }

    function _getLanguage(languageCode) {
      if (!_.isEmpty(languageCode)) {
        var languageCodeName = _.head(_.filter(vm.LanguageList, function (o) { return o.languageCode == languageCode })).languageCodeName;
        return {
          name: languageCodeName
        };
      }
      return { name: '' };
    };

    function languageChange(data) {
      $scope.selectedLanguage = data.languageCode;
      $scope.languageCodeName = data.languageCodeName;
      $timeout(function(){
        $scope.$broadcast('changeInputLanguage', { inputLanguage: $scope.selectedLanguage, originalLanguage: vm.knowledgeDocumentOriginal.originalLanguageCode });
        translateQuestions();
      if ($scope.selectedLanguage == vm.knowledgeDocument.originalLanguageCode) {
        vm.knowledgeDocumentOriginal.user_info = vm.knowledgeDocument.user_info;
        vm.knowledgeDocumentOriginal.additional_info = vm.knowledgeDocument.additional_info;
        vm.knowledgeDocumentOriginal.KDDisclaimer = vm.knowledgeDocument.KDDisclaimer;
        vm.knowledgeDocumentOriginal.replication_history = vm.knowledgeDocument.replication_history;
          
        vm.knowledgeDocument = angular.copy(vm.knowledgeDocumentOriginal);
        translateDates($scope.selectedLanguage);
        $scope.$broadcast('changeDataLanguage', {});
      }
      // else
      // {
        TranslatorApi.api.TranslateKnowledgeDetail.save({}, {
          kdId: vm.knowledgeDocumentId,
          toLanguage: $scope.selectedLanguage,
            kdType: vm.knowledgeDocument.kdType,
            version: vm.version
        },
          function (response) {
            if (!response || !response.kdId) {
              $("#notfound_modal").modal('show');
              $('#notfound_modal').on('hidden.bs.modal', function (e) {
              //  $state.go('app.LandingPageController');
              })
              return;
            }

            $scope.fromLanguageName = _getLanguage(vm.knowledgeDocument.originalLanguageCode).name;
            $scope.toLanguageName = _getLanguage($scope.selectedLanguage).name;
            $scope.translationUpdateDate = moment(response.translationUpdateDate, 'YYYY-MM-DD').format('DD MMM YYYY');
            $scope.translationUpdateDateOriginal = $scope.translationUpdateDate;
            $scope.improvedBy = response.improvedBy;
            $scope.version = response.version;

            vm.knowledgeDocument.title = response.title;
            vm.knowledgeDocument.summary = response.summary;
            vm.knowledgeDocument.supposedToHappen = response.supposedToHappen;
            vm.knowledgeDocument.actuallyHappened = response.actuallyHappened;
            vm.knowledgeDocument.whyDifference = response.whyDifference;
            vm.knowledgeDocument.whatLearn = response.whatLearn;

            vm.knowledgeDocument.freetextBoldStory = response.freetextBoldStory;
            vm.knowledgeDocument.doingDifferently = response.doingDifferently;
            vm.knowledgeDocument.caseForChange = response.caseForChange;
            vm.knowledgeDocument.winnerText = response.winnerText;
              vm.knowledgeDocument.recommendation = response.recommendation;
              $scope.versionList = response.versions;
              vm.versionDetailsList = response.versionDetails;
            //vm.selectedRevertToVersion = $scope.versionList[$scope.versionList.length - 1];

            translateDates($scope.selectedLanguage);
            $scope.$broadcast('changeDataLanguage', {});
          },
          function (response) {
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
          });
      // }
      }, 500);
        
    }

    function revertTranslation() {
      TranslatorApi.api.TranslateKnowledgeDetailRevert.save({}, {
        kdId: vm.knowledgeDocumentId,
        toLanguage: $scope.selectedLanguage,
        toRevertVersion: vm.selectedRevertToVersion,
        kdType: vm.knowledgeDocument.kdType
      },
        function (response) {
          if (!response || !response.kdId) {
            $("#notfound_modal").modal('show');
            $('#notfound_modal').on('hidden.bs.modal', function (e) {
             // $state.go('app.LandingPageController');
            })
              
            return;
          }

          $scope.fromLanguageName = _getLanguage(vm.knowledgeDocument.originalLanguageCode).name;
          $scope.toLanguageName = _getLanguage($scope.selectedLanguage).name;
          $scope.translationUpdateDate = moment(response.translationUpdateDate, 'YYYY-MM-DD').format('DD MMM YYYY');
          $scope.translationUpdateDateOriginal = $scope.translationUpdateDate;
          $scope.improvedBy = response.improvedBy;
          $scope.version = response.version;

          vm.knowledgeDocument.title = response.title;
          vm.knowledgeDocument.summary = response.summary;
          vm.knowledgeDocument.supposedToHappen = response.supposedToHappen;
          vm.knowledgeDocument.actuallyHappened = response.actuallyHappened;
          vm.knowledgeDocument.whyDifference = response.whyDifference;
          vm.knowledgeDocument.whatLearn = response.whatLearn;

          vm.knowledgeDocument.freetextBoldStory = response.freetextBoldStory;
          vm.knowledgeDocument.doingDifferently = response.doingDifferently;
          vm.knowledgeDocument.caseForChange = response.caseForChange;
          vm.knowledgeDocument.winnerText = response.winnerText;
          vm.knowledgeDocument.recommendation = response.recommendation;
          $scope.versionList = response.versions;
         // vm.selectedRevertToVersion = $scope.versionList[$scope.versionList.length - 1];

          translateDates($scope.selectedLanguage);
            $scope.$broadcast('changeDataLanguage', {});
            logger.success("Version applied successfully! A New version has been created");
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }
    
      $scope.handleGoToURL = function (categoryName,displayName,itemId){
        $rootScope.searchParams = {categoryName:categoryName,displayName:displayName,itemId:itemId};
        $state.go('app.SearchPage.knowledge');
      }

    $timeout(function () {
      // Fixed Title when user scroll to past article title
      $('#FixedTitle').affix({
        offset: {
          top: function () {
            return (this.bottom = $('#Header').outerHeight() + $('.article_head').outerHeight())
          }
        }
      });
    }, 200);

    function getListOfLanguages() {
      MasterDataLanguageCodesApi.api.getList.query({}, {},
        function (response) {
          response.forEach(function(x) {
            if(x.languageCodeName == 'English') {
              x['image'] = 'united-kingdom.svg'
            } else if(x.languageCodeName == 'Malay') {
              x['image'] = 'malaysia.svg';
            } else if(x.languageCodeName == 'Arabic') {
              x['image'] = 'arab.png';
            } else if(x.languageCodeName == 'Chinese') {
              x['image'] = 'china.svg';
            } else if(x.languageCodeName == 'Japanese') {
              x['image'] = 'japan.svg';
            } else if(x.languageCodeName == 'German') {
              x['image'] = 'germany.svg';
            } else if(x.languageCodeName == 'Dutch') {
              x['image'] = 'netherlands.svg';
            } else if(x.languageCodeName == 'French') {
              x['image'] = 'france.svg';
            } else if(x.languageCodeName == 'Spanish') {
              x['image'] = 'spain.svg';
            } else if(x.languageCodeName == 'Thai') {
              x['image'] = 'thailand.svg';
            } else if(x.languageCodeName == 'Korean') {
              x['image'] = 'korea.png';
            } else if(x.languageCodeName == 'Indonesian') {
              x['image'] = 'indo.png';
            } else if(x.languageCodeName == 'Vietnamese') {
              x['image'] = 'vietnam.png';
            } else if(x.languageCodeName == 'Burmese') {
              x['image'] = 'burma.png';
            }
          });
          vm.LanguageList = response;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }
    function translateDates(languageCode) {
      if (languageCode == "en") {
        $scope.TranslatedEventDate = moment(vm.knowledgeDocument.eventDate).format('DD MMM YYYY');
        $scope.PublishedDate = moment(vm.knowledgeDocument.publicationDate).format('DD MMM YYYY');
        $scope.translationUpdateDate = moment($scope.translationUpdateDateOriginal).format('DD MMM YYYY');
        return;
      }
      TranslatorApi.api.TranslateSingleText.save({}, {
        textToTranslate: moment(vm.knowledgeDocument.eventDate).format('DD MMM YYYY'),
        fromLanguage: "en",
        toLanguage: languageCode
      },
        function (response) {
          $scope.TranslatedEventDate = response.translatedText;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
      TranslatorApi.api.TranslateSingleText.save({}, {
        textToTranslate: moment(vm.knowledgeDocument.publicationDate).format('DD MMM YYYY'),
        fromLanguage: "en",
        toLanguage: languageCode
      },
        function (response) {
          $scope.PublishedDate = response.translatedText;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
      TranslatorApi.api.TranslateSingleText.save({}, {
        textToTranslate: moment($scope.translationUpdateDateOriginal).format('DD MMM YYYY'),
        fromLanguage: "en",
        toLanguage: languageCode
      },
        function (response) {
          $scope.translationUpdateDate = response.translatedText;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }
    function translateQuestions() {
      if ($scope.selectedLanguage == "en") {
        $scope.Questions = $scope.QuestionsEnglish;
        $scope.$broadcast('changeQuestionsLanguage', {});
        console.log($scope.selectedLanguage);
      }
      else {
        var textToTranslate = $scope.QuestionsEnglish;

        if (vm.knowledgeDocument.kdType !== vm.config.KnowledgeDocumentTypes.Ideas) {
          //Ideas
          delete textToTranslate.category;
          delete textToTranslate.originalKnowledge;
        }

        if (vm.knowledgeDocument.kdType !== vm.config.KnowledgeDocumentTypes.Publications) {
          //Publications
          delete textToTranslate.about;
          delete textToTranslate.bookTitle;
          delete textToTranslate.eventName;
          delete textToTranslate.eventDate;
          delete textToTranslate.eventLocation;
          delete textToTranslate.digitalMediaTypeName;
          delete textToTranslate.journalTitle;
          delete textToTranslate.magazineTitle;
          delete textToTranslate.newspaperName;
          delete textToTranslate.publicationDate;
          delete textToTranslate.audienceLevel;
          delete textToTranslate.society;
          delete textToTranslate.isbn;
          delete textToTranslate.websiteURL;
          delete textToTranslate.collaboration;
          delete textToTranslate.programme;
          delete textToTranslate.exernalAuthor;
          delete textToTranslate.winner;
          delete textToTranslate.doingDifferently;
          delete textToTranslate.caseForChange;
        }

        TranslatorApi.api.TranslateMultipleText.save({}, {
          textToTranslate: textToTranslate,
          fromLanguage: "en",
          toLanguage: $scope.selectedLanguage
        },
          function (response) {
            $scope.Questions = response.translatedText;
            $scope.$broadcast('changeQuestionsLanguage', { });
            console.log('translate ok');
          },
          function (response) {
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
              console.log('translate xok');
          });
      }
    }
      $scope.viewVersionHistory = function () {
          

          $('#ModalVersionHistory').modal('show');

          loadData(segmentItemsInput, true);
      }

      // Close View more popup
      $scope.closeViewVersionHistory = function () {
          $('#ModalVersionHistory').modal('hide');
      }

      $scope.TranslationSatisfactionChange = function (selectedval) {
          if (selectedval=="1") {
              $('#satisfied').show();
              $('#unsatisfied1').hide();
              $('#unsatisfied2').hide();
          }
          else {
              $('#satisfied').hide();
              $('#unsatisfied1').show();
              $('#unsatisfied2').show();
          }
      }
      $scope.TranslationVersionChange = function () {
          vm.version = vm.selectedRevertToVersion;
          languageChange();
      }

      $scope.gotToEdit = function(){
        if(vm.knowledgeDocument.kdType == "Lessons Learnt"){
          $state.go('app.knowledgeDiscovery.lessonsLearnt.build', { replicationID:vm.knowledgeDocumentId });
        }
        else if(vm.knowledgeDocument.kdType == "Best Practices"){
          $state.go('app.knowledgeDiscovery.bestPractices.build', { replicationID:vm.knowledgeDocumentId });
        }
        else if(vm.knowledgeDocument.kdType == "Technical Alerts"){
          $state.go('app.knowledgeDiscovery.technicalAlerts.build', { replicationID:vm.knowledgeDocumentId });
        }
        else if(vm.knowledgeDocument.kdType == "Publications"){
          $state.go('app.knowledgeDiscovery.publications.build', { replicationID:vm.knowledgeDocumentId });
        }
        else{
          $state.go('app.knowledgeDiscovery.insights.build', { replicationID:vm.knowledgeDocumentId });
          
        }
        
      }
      $scope.getPredefinedRatingComments();

  }
})();
