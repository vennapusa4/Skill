/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
      .directive('actionCard', actionCard);

  /** @ngInject */
  function actionCard() {

      return {
          restrict: 'E',
          scope: {
            step: '=',
            showaction: '=',
            showpublish:'=',
            publishname: '=',
            knowledgeid: '=',
            knowledgetype: '=',
            screen: '=',
            implemented: '='
          },
          controller: function (KnowledgeService, $scope, $state, $timeout, KnowledgeDocumentApi,UserProfileApi,$stateParams,appConfig,logger) {
             // $scope.article.description = $scope.article.description.slice(0, 270)+"...";
            //alert($scope.knowledgetype);
             var vm = this;
             $scope.wantReplication = false;
             $scope.repeatableInMyArea = false;
             $scope.isFeedBackLoop = false;
             $scope.isTAImplementation = false;
             $scope.status = {
              reviewCommentText : "",
              showCommentsError : false
             }
             $scope.attachmentDisabled = false;
             vm.knowledgeDocumentId = $stateParams.id;
             $scope.isSme = false;
             $scope.feedbackData = {
              projectNameReplication: '',
              remarksReplication:'',
              replicateUsers:[],
              projectNameReplicateMyArea:'',
              remarksReplicateMyArea:'',
              ReplicateMyAreaUser: []

              }
             if($scope.publishname == undefined) {
              $scope.labelling = 'Publish';
             } else {
              $scope.labelling = $scope.publishname;
             }

              $scope.clickedPreview = function () {
                  $scope.$emit('clickedPreview');
              }
              $scope.submitTA = function(){
                $scope.$emit('submitTA');
              }
              
              $scope.clickedPrev = function () {
                  $scope.$emit('clickedPrev');
              }
              $scope.goToNext = function () {
                  $scope.$emit('goToNext');
              }
              $scope.clickedSaveAsDraft = function () {
                  $scope.$emit('clickedSaveAsDraft');
              }
              $scope.clickedCancel = function () {
                  $('#cancelPosting').modal('hide');
                  $timeout(function () {
                      $state.go('app.SearchPage.knowledge');
                  }, 500);
              }
              $scope.$on("SetTAType", function (evt, data) {
                if(data=="2")
                {
                  $scope.isTAImplementation=true;
                }
                else
                {
                  $scope.isTAImplementation=false;
                }
            });
              $scope.$on('uploadingAttachment', function(){
                $scope.attachmentDisabled = true;
                console.log($scope.attachmentDisabled);
              })
              
              $scope.$on('finishUploadAttachment', function(){
                $scope.attachmentDisabled = false;
                console.log($scope.attachmentDisabled);
              })
                  $scope.knowledgeDocumentId = $stateParams.id;
                  $scope.config = appConfig;

      function getKnowledgeDocumentDetail() {
        KnowledgeDocumentApi.api.knowledgeDocument.byId({}, {knowledgeDocumentId: $scope.knowledgeDocumentId },
          function (response) {
            if (!response || !response.kdId) {
                $("#notfound_modal").modal('show');
                  $('#notfound_modal').on('hidden.bs.modal', function (e) {
                //  $state.go('app.LandingPageController');
                  })
                  return;
            }  
          
          $scope.knowledgeDocument = response;
          debugger;


          if($scope.knowledgeDocument.sme!=null && $scope.knowledgeDocument.sme.userId== $scope.userInfo.userId){
            $scope.isSme = true;
          }
          KnowledgeDocumentApi.GetKnowledgeUserInfo($scope.knowledgeDocumentId).then(function (res) {
            $scope.knowledgeDocument['user_info'] = res;
            
          });


          // get insight references
          if ($scope.knowledgeDocument.kdType == $scope.config.KnowledgeDocumentTypes.Insights) {
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


          if(response.submittedBy.userId == $scope.userInfo.userId){
            $scope.isSubmitter = true;
          }

          ///// this section is for TA only
          if($scope.knowledgeDocument.kdType == $scope.config.KnowledgeDocumentTypes.TechnicalAlerts)
          {
            if( $scope.knowledgeDocument.canValidateTA == true){
              $scope.isReviewer = true;
            }
            else{
              $scope.isReviewer = false;
            }
          }
          ///// end section ////

          if ($scope.isReviewer && ($scope.knowledgeDocument.status == $scope.config.Statuses.Submit)) {
            $scope.canViewReviewer = true;
            //console.log("isReviewer"+$scope.isReviewer);
          } else {
            $scope.canViewReviewer = false;
          }

          //Check if current user can view expert section
          if (($scope.userInfo && (($scope.userInfo.isAdmin && $scope.knowledgeDocument.sme != null) || ($scope.knowledgeDocument.sme != null && $scope.knowledgeDocument.sme.userId == $scope.userInfo.userId))) &&
            $scope.knowledgeDocument.kdType != $scope.config.KnowledgeDocumentTypes.Publications &&
            $scope.knowledgeDocument.status == $scope.config.Statuses.Review) {
            $scope.canViewExpertSection = true;
          } else {
            $scope.canViewExpertSection = false;
          }

          if ($scope.userInfo != null && $scope.knowledgeDocument.endorser != null && $scope.knowledgeDocument.endorser.userId == $scope.userInfo.userId &&
            $scope.knowledgeDocument.statusEndorse == $scope.config.Statuses.Submit && ( $scope.knowledgeDocument.status == $scope.config.Statuses.Review || 
              $scope.knowledgeDocument.status == $scope.config.Statuses.Approve)) {
            $scope.canViewEndorser = true;
          } else {
            $scope.canViewEndorser = false;
          }

          if ($scope.knowledgeDocument.kdType === $scope.config.KnowledgeDocumentTypes.BestPractice) {
            $scope.knowledgeDocumentTypeName = $scope.config.KDTypeDisplayNames.BestPractice;
          } else if ($scope.knowledgeDocument.kdType === $scope.config.KnowledgeDocumentTypes.LessonsLearnt) {
            $scope.knowledgeDocumentTypeName = $scope.config.KDTypeDisplayNames.LessonsLearnt;
            if ($scope.knowledgeDocument.status === $scope.config.Statuses.Submit) {
              $scope.tagName = 'To be followed';
            }
          } else if ($scope.knowledgeDocument.kdType === $scope.config.KnowledgeDocumentTypes.Publications) {
            $scope.knowledgeDocumentTypeName = $scope.config.KDTypeDisplayNames.Publications;
            $scope.tagName = $scope.knowledgeDocument.sourceName;
          } else if ($scope.knowledgeDocument.kdType === $scope.config.KnowledgeDocumentTypes.TechnicalAlerts) {
            $scope.knowledgeDocumentTypeName = $scope.config.KDTypeDisplayNames.TechnicalAlerts;
            //TO CHECK:
            //$scope.tagName = $scope.knowledgeDocument.sourceName;
          }

          $scope.canShowApprove = ($scope.knowledgeDocument.kdType == $scope.config.KnowledgeDocumentTypes.Publications &&
            $scope.knowledgeDocument.status == $scope.config.Statuses.Submit) ? false : true;
            console.log($scope.knowledgeDocument);
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });

  };

  $scope.reviewer = {}
  $scope.canViewEndorser = false;
  $scope.isSubmitter = false;
  $scope.canViewReviewer = false;
  $scope.canViewExpertSection = false;
  $scope.canShowApprove = false;
  $scope.isReviewer = false;
  function getUserInfo() {
    $scope.userInfo = UserProfileApi.getUserInfo();
    $scope.isReviewer = $scope.userInfo.roles.indexOf('KMI') != -1;

  if($scope.isReviewer){
    $scope.reviewer = $scope.userInfo;
  }
  console.log($scope.reviewer);

  };
  $scope.isEditMode = false;
 // $scope.createMode = ;
  $scope.setViewMode = function(mode){
    $scope.isEditMode = true;
      $scope.$emit('viewModeChanged', mode);

  }
  getUserInfo();

  $scope.showreplicatemyarearemarkerror = false;
  $scope.showreplicationremarkerror = false;

  if($scope.knowledgeDocumentId != undefined){
      getKnowledgeDocumentDetail();
  }

  // bussiness sectors
  $scope.businessSector = [];
  $scope.selectedBussinessSectorIds = [];
  $scope.updateSectorValue = function(sector){
    if(sector.selected == true){
      $scope.selectedBussinessSectorIds.push(sector.typeId);
    }
    else{
      var index = - 1;
      for(i = 0; i <$scope.selectedBussinessSectorIds.length; i++){
        if($scope.selectedBussinessSectorIds[i] == sector.typeId){
          index = i;
          break;
        }
      }
      if(index >= 0){
        $scope.selectedBussinessSectorIds.splice(index, 1);
      }
    }
  }
  $scope.getAllBusinessSectors = function(){

    KnowledgeDocumentApi.getAllBusinessSectors($stateParams.id).then(function (res) {
      res.forEach(function(sector){
        var arrangement;
          if(sector.name == 'Upstream') {
            arrangement = 1;
          } else if(sector.name == 'Downstream') {
            arrangement = 2;
          } else if(sector.name == 'Corporate') {
            arrangement = 3;
          } else if(sector.name == 'Gas & New Energy (GNE)') {
            arrangement = 4;
          } else if(sector.name == 'Project Delivery & Technology (PD&T)') {
            arrangement = 5;
          } else {
            arrangement = 6;
          }
        $scope.businessSector.push({"typeId" : sector.id, "name":sector.name, "position": arrangement, selected:false});
      });
      $scope.businessSector = $scope.businessSector.sort(function(a, b) {
        return a.position - b.position;
      });
      // KnowledgeService.setAttr("collaboration", $scope.businessSector)
    });
  }
  $scope.getAllBusinessSectors();
  // end of business sectors
    $scope.selectedBussinessSectorIds = [];
    $scope.status.showCommentsError = false;
    
    $scope.showBusinessError = false;
    $scope.openBussinessSectorValidation = function(statusName){
      debugger;
      if($scope.status.reviewCommentText != ""){
       
          if(statusName != "Approve"){
            $scope.updateStatus(statusName);
          }
          else{
            //show dialog for bussiness sectors
            $("#ModalBussinessSectors").modal({
              backdrop: 'static',
              keyboard: false
            });
  
            $("#ModalApprove").modal('hide');
          }
      }
      else{
        $scope.status.showCommentsError = true;
      }
    }
    $scope.updateStatusTA = function(statusName){
      debugger;
      if($scope.selectedBussinessSectorIds.length >0){
        $scope.updateStatus(statusName);
      }
      else{
        $scope.showBusinessError = true;
      }
    }
    $scope.updateStatus = function(statusName) {
      debugger;
      if($scope.status.reviewCommentText != ""){
                    var statusUpdateRequest = {
                      knowledgeDocumentId: $scope.knowledgeDocumentId,
                      statusName: statusName,
                      commentText: $scope.status.reviewCommentText,
                      bussinessSectors : $scope.selectedBussinessSectorIds
                    };

                    

                  
                    KnowledgeDocumentApi.api.updateStatus.save({}, statusUpdateRequest,
                      function (response) {
                        $scope.$emit('UpdateStatus', null);
                        logger.success('Status updated successfully.');
                        switch (statusName) {
                          case 'Approve':
                          // $("#ModalApprove").modal('hide');
                          debugger;
                          if($scope.knowledgeDocument.kdType != $scope.config.KnowledgeDocumentTypes.TechnicalAlerts)
                          {
                            $scope.isFeedBackLoop = true;
                          }
                          else
                          {
                            // $scope.isFeedBackLoop = false;

                            $("#ModalApprove").modal('hide');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $timeout(function(){
                              $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                            }, 500);

                          }
                            break;
                          case 'Reject':
                            $("#ModalReject").modal('hide');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $timeout(function(){
                              $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                            }, 500);
                            break;
                          case 'Amend':
                          case 'Draft':
                            $("#ModalAmend").modal('hide');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $timeout(function(){
                              $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                            }, 500);
                            break;
                          default:
                            break;
                        }
                        $scope.status.reviewCommentText = '';
                      },
                      function (response) {
                        logger.error(response.data.errorMessage);
                      });
      } else{
        $scope.status.showCommentsError = true;
      }
                
    };
            
    $scope.updateReviewerStatus = function(statusName){

                  if($scope.status.reviewCommentText != ""){
                    var statusUpdateRequest = {
                      knowledgeDocumentId: $scope.knowledgeDocumentId,
                      statusName: statusName,
                      commentText: $scope.status.reviewCommentText
                    };
                    KnowledgeDocumentApi.api.updateReviewerStatus.save({}, statusUpdateRequest,
                      function (response) {
                        $scope.$emit('UpdateStatus', null);
                       // getKnowledgeDocumentDetail();
                        logger.success('Status updated successfully.');
                      
                        switch (statusName) {
                          case 'Review':
                            $("#ModalApproveReviewer").modal('hide');
                            $("#ModalApproveReviewer").hide();
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                            break;
                          case 'Reject':
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $("#ModalRejectReviewer").modal('hide');
                            $("#ModalRejectReviewer").hide();

                            $scope.status.reviewCommentText = '';
                            $timeout(function(){
                              $state.go('app.ProfilePage.actions');
                            }, 500);
                            
                            break;
                          case 'Amend':
                          case 'Submit':
                            $("#ModalAmendReviewer").modal('hide');
                            $("#ModalAmendReviewer").hide();
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                            break;
                          default:
                            break;
                        }
                        // $('body').removeClass('modal-open');
                        // $('.modal-backdrop').remove();
                        // $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                        // $scope.status.reviewCommentText = '';
                        
                      },
                      function (response) {
                        logger.error(response.data.message + " " + response.data.exceptionMessage);
                      });

                  }
                  else{
                    $scope.status.showCommentsError = true;
                  }
                
    }
            
                $scope.updateEndorseStatus = function(statusName) {

                  if($scope.status.reviewCommentText != "" &&  $scope.status.showCommentsError == false){
                    var statusUpdateRequest = {
                      knowledgeDocumentId: $scope.knowledgeDocumentId,
                      statusName: statusName,
                      commentText: $scope.status.reviewCommentText
                    };
                    KnowledgeDocumentApi.api.updateEndorseStatus.save({}, statusUpdateRequest,
                      function (response) {
                        $scope.$emit('UpdateStatus', null);
                      //  getKnowledgeDocumentDetail();
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
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.status.reviewCommentText = '';
                        $timeout(function(){
                          $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                        }, 500);
                      },
                      function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  }
                  else{
                    $scope.status.showCommentsError = true;
                  }
                  var statusUpdateRequest = {
                    knowledgeDocumentId: $scope.knowledgeDocumentId,
                    statusName: statusName,
                    commentText: $scope.status.reviewCommentText
                  };
              
                };

                $scope.isSuccess = false;

                $scope.getfeedbackOption = function(option,value ){

                  if(option == 'wantReplication'){
                    if(value == true){
                      $scope.wantReplication = true;
                    }
                    else{
                      $scope.wantReplication = false;
                    }
                    
                  }
                  else  if(option == 'repeatableInMyArea'){
                    if(value == true){
                      $scope.repeatableInMyArea = true;
                    }
                    else{
                      $scope.repeatableInMyArea = false;
                    }
                  }
                }
                $scope.addFeedbackloop= function(){
                  var postData;
            
                  if($scope.wantReplication){
                    if($scope.feedbackData.remarksReplication != ""){
                      if($scope.feedbackData.replicateUsers.length > 0){
                        $scope.feedbackData.replicateUsers.forEach(function(user){

                          $scope.showProjectError = false;
                          $scope.showUserError = false;
                          $scope.showRemarksError = false;

                          postData = {
                          "kdId": vm.knowledgeDocumentId,
                          "userId": user.id,
                          "typeId": 1,
                          "statusId":1,
                          "locationProjectName":$scope.feedbackData.projectNameReplication,
                          "comments":$scope.feedbackData.remarksReplication,
                          "isInterested" : false
                          }
                  
                          KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
                            $scope.isSuccess = true;
                            logger.log("Feedback Added Successfully for Replication!");
                            $scope.feedbackData.projectNameReplication= '';
                            $scope.feedbackData.remarksReplication = '';
                            $("#ModalApprove").modal('hide');

                          },function (error) {
                              logger.error(error.data.message);
                          });
                        });
                      }
                      else{
                        postData = {
                          "kdId": vm.knowledgeDocumentId,
                          "userId": $scope.userInfo.userId,
                          "typeId": 1,
                          "statusId":1,
                          "locationProjectName":$scope.feedbackData.projectNameReplication,
                          "comments":$scope.feedbackData.remarksReplication,
                          "isInterested" : false
                          }
                          
                          KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
                            logger.log("Feedback Added Successfully for Replication!");
                            $scope.feedbackData.projectNameReplication= '';
                            $scope.feedbackData.remarksReplication = '';
                    
                          },function (error) {
                              logger.error(error.data.message);
                          });
                      }
                    }else{
                      $scope.isSuccess = false;
                      $scope.showreplicationremarkerror = true;
                      return;
                    }
                  }
                  if($scope.repeatableInMyArea){
                    if($scope.feedbackData.remarksReplicateMyArea != ""){
                      if($scope.feedbackData.ReplicateMyAreaUser.length > 0){
                        $scope.feedbackData.ReplicateMyAreaUser.forEach(function(user){
                          postData = {
                            "kdId": vm.knowledgeDocumentId,
                            "userId": user.id,
                            "typeId": 2,
                            "statusId":1,
                            "locationProjectName":$scope.feedbackData.projectNameReplicateMyArea,
                            "comments":$scope.feedbackData.remarksReplicateMyArea,
                            "isInterested" : false
                            }
                    
                            KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
                             scope.isSuccess = true;
                              logger.log("Feedback Added Successfully For Repeatability!");
                              $scope.feedbackData.projectNameReplicateMyArea = '';
                              $scope.feedbackData.remarksReplicateMyArea = '';
                            },function (error) {
                               logger.error(error.data.message);
                            });
                        });
                      }
                      else{
                        
                        postData = {
                          "kdId": vm.knowledgeDocumentId,
                          "userId": $scope.userInfo.userId,
                          "typeId": 2,
                          "statusId":1,
                          "locationProjectName":$scope.feedbackData.projectNameReplicateMyArea,
                          "comments":$scope.feedbackData.remarksReplicateMyArea,
                          "isInterested" : false
                          }
                  
                          KnowledgeDocumentApi.addFeedbackloop(postData).then(function (data) {
                            logger.log("Feedback Added Successfully For Repeatability!");
                            $scope.feedbackData.projectNameReplicateMyArea = '';
                            $scope.feedbackData.remarksReplicateMyArea = '';
                          },function (error) {
                            logger.error(error.data.message);
                          });
                       }
                    }
                    else{
                      $scope.showreplicatemyarearemarkerror = true;
                      $scope.isSuccess = false;
                      return
                    }
                         
            
                 }
                 

                 if($scope.isSuccess = true){
                  $("#ModalApprove").modal('hide');
                  logger.success("Feedback Added Successfully");
                  $('body').removeClass('modal-open');
                  $('.modal-backdrop').remove();
                  $timeout(function(){
                    $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.knowledgeDocumentId });
                  }, 500);

                 }
                }
          },
          templateUrl: 'app/main/apps/knowledge-discovery/_directives/action-card.html'
          
      };
  }
})();
