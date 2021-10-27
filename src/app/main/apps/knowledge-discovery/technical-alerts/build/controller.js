(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
      .controller('KnowledgeTechnicalAlertsBuildController', KnowledgeTechnicalAlertsBuildController);

    /** @ngInject */
  function KnowledgeTechnicalAlertsBuildController($scope, Message,$state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, AutosaveService, ValidatorService, logger,appConfig,KnowledgeDocumentApi,UserProfileApi,$window) {
        var vm = this;
        var isSubmit = false;
        $scope.totalKeywords = 0;
        $scope.type = {}
        $scope.type.isImplemented = true;
        $scope.type.min = 2;

      //  ValidatorService.Rules($scope);
      $scope.Validation = {
        rules: {
          richtext: function (textarea) {
            if (textarea.is("[data-richtext-msg]")) {
                var html = $('<div></div>').append(textarea.val()).text();
                var valid = $('<div></div>').append(html).text().trim().length > 0;
                return valid;
            }
            return true;
            },
            summary: function (textarea) {
              if (textarea.is("[data-summary-msg]")) {
                  var html = $('<div></div>').append(textarea.val()).text();
                  var count = $('<div></div>').append(html).text().trim().length;

                  if($scope.Field.technicalAlertType == $scope.technicalAlertImplementationType && $scope.beenReplicated == true){
                    if(count === 0 ){
                      return false;
                    }
                  } 
                  else if($scope.Field.technicalAlertType != $scope.technicalAlertImplementationType){
                    if(count === 0 ){
                      return false;
                    }
                  } 
                 
              }
              return true;
          },
            notImplemented: function (textarea) {
              if (textarea.is("[data-notimplemented-msg]")) {
                  var html = $('<div></div>').append(textarea.val()).text();
                  var count = $('<div></div>').append(html).text().trim().length;
                  if($scope.Field.technicalAlertType == $scope.technicalAlertImplementationType && count === 0 && $scope.beenReplicated == false )
                  return false;
              }
              return true;
          },
          numberofkeywords : function (input) {
            if (input.is("[data-total-Keyword]")) {
              if((($scope.Field.technicalAlertType == 2 && $scope.beenReplicated == true) || $scope.Field.technicalAlertType != 2)  && $scope.totalKeywords < 2 && $scope.type.min != 0)
                  return false;
          }
          return true;
        },
          technicalAlert: function (textarea) {
            if (textarea.is("[data-technical-msg]")) {
                var html = $('<div></div>').append(textarea.val()).text();
                var count = $('<div></div>').append(html).text().trim().length;
                if($scope.Field.technicalAlertType != $scope.technicalAlertImplementationType && count === 0)
                  return false;
            }
            return true;
        },
            minlength: function (textarea) {
                if (textarea.is("[data-minlength-msg]")) {
                    var html = $('<div></div>').append(textarea.val()).text();
                    var count = $('<div></div>').append(html).text().trim().length;
                    return count > 20 || count === 0;
                }
                return true;
            },
            collection: function (input) {
              if (input.is("[data-collection-msg]")) {
                  if (_.size($scope.Field.referenceKdIds) === 0) return false;
              }
              return true;
          },
          invalidLocation :function (input) {
            if (input.is("[invalidLocation]")) {
              if ($scope.Field.locationId == "") return false;
            }
            return true;
        },
        },
        messages: {
            required: Message.Msg1,
            richtext: Message.Msg1,
            collection: Message.Msg1,
            invalidLocation: 'Select Valid Location From List',
            technicalAlert : Message.Msg1,
            notImplemented: Message.Msg1,
            summary:Message.Msg1,
            numberofkeywords : 'Number of Keywords should be greater than or equal to 2'
        }
    };
  
    $scope.$on("validateLocation" , function (event, locationId){
      $scope.Field.locationId = locationId
      $scope.Validator.validateInput($("input[name=validLocation]"));
    });
   
    $scope.$on("validateKeyword" , function (event, totalKeyword){
      $scope.totalKeywords = totalKeyword;
      $scope.Validator.validateInput($("input[name=data-total-Keyword]"));
    });
  
    $scope.checkIsImplemented = function(){
      if($scope.beenReplicated == false && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
        $scope.type.isImplemented = false;
        $scope.type.min = 0;
      }
      else if($scope.beenReplicated == true && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
        $scope.type.isImplemented = true;
        $scope.type.min = 2;
      }
    }

  
    $scope.validateReplicationSource = function(){
      $scope.Validator.validateInput($("input[name=referenceKdIds]"));
    }

    $scope.technicalAlertImplementationType = 2;

        $scope.Field = {
            techincalAlertType: 0
        };
        $scope.knowledgetype = "Technical Alerts";
        $scope.QuestionsEnglish = {};
        $scope.Questions = {};
        $scope.QuestionsEnglish.knowledge = 'Knowledge';
        $scope.QuestionsEnglish.SourceReplicate = 'Implementation Source <strong class="req">*</strong>';
        $scope.QuestionsEnglish.copyPastePopover = 'Refer to the guidelines on How to Copy and Paste Data from Source File.';
        $scope.QuestionsEnglish.knowledgeTitle = 'Technical Alert Title <strong class="req">*</strong>';
        $scope.QuestionsEnglish.implemented = 'Has this Technical Alert been Implemented?<strong class="req">*</strong>';
        $scope.QuestionsEnglish.typeOfLessonLearnt = 'Select a Type of Lesson Learnt?<strong class="req">*</strong>';
        $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong>';
        $scope.QuestionsEnglish.whyNotImplemented = 'Why this has not implemented <strong class="req">*</strong>';
        $scope.QuestionsEnglish.description = 'Description <strong class="req">*</strong>';
        $scope.QuestionsEnglish.recommendation = 'Recommendation <strong class="req">*</strong>';
        $scope.QuestionsEnglish.implementedReason = 'Why this has not been implemented?<strong class="req">*</strong>';
        $scope.QuestionsEnglish.copyPasteGuidelines = '<div class="ms-rtestate-field" ><p>How to Copy and Paste Data from Source File:&#8203;</p> <ol class="noSidePadding"><li>Copy data from source file (Ms Word / Ms Excel etc.</li><li>Go to Share Knowledge Menu and select a form (Lessons Learnt / Best Practice etc).</li><li>Right click on the destination field (empty field) and select "Paste as Plain Text".</li><li>Proceed to fill in all the details and submit.</li><li>Once you view the knowledge again in reading mode, you may see that the format are correctly placed based on your original data.</li></ol></div >';
        $scope.QuestionsEnglish.typeOfTA = 'Select Technical Alert Type <strong class="req">*</strong>';
        

        //$scope.QuestionsEnglish.whatHappen = 'What was supposed to happen? <s trong class="req">*</strong>';
        //$scope.QuestionsEnglish.whatHappenTitle = 'This should be a simple statement of what the intended outcome was. It could be quantitative, for example a planned expenditure, or it could be qualitative to explain the planned consequences.';
        //$scope.QuestionsEnglish.whatHappenDescribe = 'Describe the objectives or expectations of the project/event';
        //$scope.QuestionsEnglish.whatHappenPopover = '*Refer to 4 Quadrant Guideline too for brief guide (No. 1 to 7)';
        //$scope.QuestionsEnglish.actuallyHappen = '<span title="This should describe what the actual outcome was. It should be a simple statement of fact that indicates a difference, for better or worse, in relation to the planned or expected outcome.">What actually happened? <strong class="req">*</strong></span><br><small> Describe the objectives or expectations that has been achieved through the project/event</small>';
        //$scope.QuestionsEnglish.whyDifferences = '<span title="This is where it is important to explain why the difference arose so that the user will understand what caused the deviation from the plan.">Why were the differences? <strong class="req">*</strong></span><br><small>Describe the objectives or expectations has been achieved</small>';
        //$scope.QuestionsEnglish.whatLearn = '<span title="This is probably the most important section because it tells the user what he/she should do to either avoid the reported pitfall or to gain the benefit from the good practice. It is important to target this advice at the correct level. ">What can we learn from this? <strong class="req">*</strong></span><br><small>Describe the challenges or good practices that has been adopted and identified during this project/event</small>';
        //$scope.QuestionsEnglish.guidelines = '<div class="ms-rtestate-field" > <p>&nbsp;</p> <p>Below are the guidelines for an author to submit an article, lesson learnt and best practices:&#8203;</p> <ol><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do1.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do1.aspx">Be specific! Avoid generalities</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do2.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do2.aspx">Do not state the obvious</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do3.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do3.aspx">Do not enter something for the sake of entering something</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do4.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do4.aspx">Use plain English</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do5.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do5.aspx">This is not a place for grudge bearing</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do6.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do6.aspx">Policy makers beware</a></li><li><a href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do7.aspx" data-cke-saved-href="https://pww.centralapps.petronas.com.my/nextg/pcsb/taxonomy/faq/do7.aspx">Copyrights</a></li></ol> <p>&nbsp;</p> <p>To fill in the 4 quadrant, author need to be aware of these guideline as per below:</p> <p><strong>What was supposed to happen?</strong></p> <p>Author need to explains on the objectives or expectation of the project or event.</p> <p><strong>What actually happened?</strong></p> <p>Author need to explains on what are the objectives or expectations that has been achieved trough the project or event.</p> <p><strong>Why were they differences?</strong></p> <p>Author need to explains on how these objectives or expectations has been achieved.</p> <p><strong>What can we learn from this?</strong></p> <p>Author need to explains on what are the challenges or good practices that has been adopted and identified during this project/event.</p></div >';

    //Attachment
    $scope.QuestionsEnglish.attachment = 'Attachment';
    $scope.QuestionsEnglish.knowledgeBeenReplicate = 'Has this Technical Alert been implemented? <strong class="req">*</strong>';
    $scope.QuestionsEnglish.formatsaccepted = 'Formats accepted';
    $scope.QuestionsEnglish.useascover = 'Use as cover image';

    //Submission
    $scope.QuestionsEnglish.submission = 'Submission';
    $scope.QuestionsEnglish.submittedBy = 'Submitted By';
    $scope.QuestionsEnglish.changeSubmitter = 'Change Submitter';
    $scope.QuestionsEnglish.searchSubmitter = 'Search for name of submitter';
    $scope.QuestionsEnglish.iamauthor = 'I am also the author of this article';
    $scope.QuestionsEnglish.author = 'Author';
    $scope.QuestionsEnglish.selectcop = 'Select a CoP';
    $scope.QuestionsEnglish.selectcoptitle = 'Communities of Practice is a group of people that are informally bound together by shared professional expertise, passion for sharing knowledge and learning';

    //Cover Image
    $scope.QuestionsEnglish.coverImage = 'Cover Image';
    $scope.QuestionsEnglish.uploadMessage = 'Upload a cover image for this article<br><small>A default image will be assigned if left empty</small>';
    $scope.QuestionsEnglish.minSizeMessage = 'Minimum dimension 500 x 500 pixels in png or jpg';
    $scope.QuestionsEnglish.varietyMessage = 'Variety of compressor frame strokes allow the compressor to be perfectly matched to the optimum driver.';

    //Location
    $scope.QuestionsEnglish.location = 'Location <strong class="req">*</strong>';
    $scope.QuestionsEnglish.locationDescription = 'Search by country, state, field, block, terminal or plant name';
    $scope.QuestionsEnglish.locationMessage = 'Choose a location for this document <strong class="req">*</strong><br><small>Search by country, state, field, block, terminal or plant name</small>';

    //Additional Info
    $scope.QuestionsEnglish.defineYourKnowledge = 'Define your knowledge further<small> Add project, well, equipment and / or other attribute </small>';
    $scope.QuestionsEnglish.chhoseAddInfo = 'Choose additional information';
    $scope.QuestionsEnglish.newInfo = 'New information<br><small>Search for project, wells name, equipment or other atrributes</small>';
    $scope.QuestionsEnglish.newEntry = 'New entry';
    $scope.QuestionsEnglish.createNewEntry = 'Create new entry for project, wells, equipment or keyword. May require admin moderation.';
    $scope.QuestionsEnglish.entryName = 'Entry Name <strong class="req">*</strong>';
    $scope.QuestionsEnglish.entryType = 'Entry Type <strong class="req">*</strong>';
    $scope.QuestionsEnglish.addNewInfo = 'Add New Information';
    $scope.selectedLanguage = 'English';
    $scope.beenReplicated = false;

    //Choose Keyword
    $scope.QuestionsEnglish.chooseKeyword = 'Choose Keyword';

    $scope.isFileUploading = false;
    $scope.uploadingCount = 0;
    $scope.totalUploading = 0;
    $scope.prefix = "";

    $scope.TypeofTA = [];
    $scope.Field.referenceKdIds = [];
    vm.knowledgeDocumentId = $stateParams.id;
    $scope.status;
    $scope.disableField = false;
    $scope.viewMode;
    vm.config = appConfig;
    $scope.beenReplicated = false;
    $scope.isEndorser = false;
    $scope.isSubmitter = false;
    $scope.replicationID = $stateParams.replicationID;
    //
    $scope.Field.Implemented = true;
    $scope.Field.typeOfLesson = "technical alert";

    $scope.checkImplementStatus = function(status){
      $scope.Field.Implemented = status;
    }
    $scope.checkTypeOfLesson = function(type){
      $scope.Field.typeOfLesson = type
    }

    function getKnowledgeDocumentDetail() {
        if ($stateParams.id != null && $stateParams.id != "" && $stateParams.replicationID == undefined) {
          KnowledgeDocumentApi.api.knowledgeDocument.byId({}, {
            knowledgeDocumentId: vm.knowledgeDocumentId
          },
            function (response) {
              if (!response || !response.kdId) {
                $("#notfound_modal").modal('show');
                $('#notfound_modal').on('hidden.bs.modal', function (e) {
                 // $state.go('app.LandingPageController');
                })
                return;
              }
  
              vm.knowledgeDocument = response;
              if(vm.knowledgeDocument.submittedBy.userId == vm.userInfo.userId){
                $scope.isSubmitter = true;
              }
              if(  vm.knowledgeDocument!=null &&  vm.knowledgeDocument.endorser!=null && vm.knowledgeDocument.endorser.userId== vm.userInfo.userId){
                $scope.isEndorser = true;
             }
              $scope.status = vm.knowledgeDocument.status;
  
              switch($scope.status)
          {
              case "Review":$scope.status="Reviewed";
              break;
              case "Submit":$scope.status="Submitted";
              break;
              case "Approve":$scope.status="Approved";
              break;
          } 
              if (vm.knowledgeDocument.status != vm.config.Statuses.Draft) {
                $scope.disableField = true;
              }
              else {
                $scope.disableField = false;
              }
  
            },
            function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
  
        }
  
      };

      $scope.$watch('disableField', function() {
        if($scope.disableField == true){
          $($('#Summary').data().kendoEditor.body).attr('contenteditable', false);
          $($('#description').data().kendoEditor.body).attr('contenteditable', false);
          $($('#recommendation').data().kendoEditor.body).attr('contenteditable', false);
        }
        else{
          $($('#Summary').data().kendoEditor.body).attr('contenteditable', true);
          $($('#description').data().kendoEditor.body).attr('contenteditable', true);
          $($('#recommendation').data().kendoEditor.body).attr('contenteditable', true);
        }
        
      });
      $scope.$on("viewModeChanged", function (evt, mode) {
        $scope.viewMode = mode;
        $scope.disableEndorseEdit = true;
  
        if($scope.isSMEUser && vm.knowledgeDocument.status == vm.config.Statuses.Review && vm.knowledgeDocument.sme.userId == vm.userInfo.userId){
                $scope.disableField = false;   
         }
        //Content review
        if($scope.isSubmitter && vm.knowledgeDocument.status == vm.config.Statuses.Amend){
            $scope.disableField = false;
            
        }
        else if(vm.isReviewer && vm.knowledgeDocument.status == vm.config.Statuses.Submit){
            $scope.disableField = false;
        }
        //value creation
        if(($scope.endorserStatus == 'Submit' && $scope.isEndorser) || ($scope.isSubmitter && $scope.endorserStatus == 'Amend')){
                $scope.disableEndorseEdit = false;
        }
  
        
  
      });
      
      if (vm.knowledgeDocumentId != undefined) {
        getKnowledgeDocumentDetail();
      }

    $scope.$on('uploadAttachment', function (event, data) {
        $scope.prefix = data.prefix;
      $scope.isFileUploading = data.isUploading;
      $scope.uploadingCount = data.uploadingCount;
      $scope.totalUploading = data.totalCount;
    });
    
    $scope.isDone = function () {
      $('#ModalSubmitted').modal('hide');
      $timeout(function(){
        $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.submitModel.knowledgeDocumentId });
      }, 500);
  }
    //Comments
    $scope.QuestionsEnglish.comments = 'Comments';

        $scope.Questions = $scope.QuestionsEnglish;


        vm.LanguageList = [{ languageCodeId : 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
        $scope.Field.originalLanguage = "en";

        vm.LanguageChange = LanguageChange;

        KnowledgeDiscoveryApi.buildByType($stateParams.type).then(function (res) {
            KnowledgeService.initBuild(res);
            $scope.$broadcast('Init', null);

            $scope.TypeofTA = _.map(KnowledgeService.getBuild('learnTypes'), function (o) { return { id: o.id.toString(), typeName: o.typeName, translatedName: o.typeName } });
            $scope.Field.technicalAlertType = res.technicalAlertTypeId;

            getListOfLanguages();
            if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
                KnowledgeDiscoveryApi.buildByType($stateParams.type, $stateParams.id).then(function (res0) {
                    if(res0 && res0.hasOwnProperty("externalAuthors") && res0["externalAuthors"].length > 0){
                      $scope.Field.ExternalAuthors = res0["externalAuthors"][0].displayName;
                    }
                    KnowledgeService.init(res0);
                    $scope.$broadcast('Get', { Get: KnowledgeService.get });
                    $scope.Field.id = KnowledgeService.get('id');
                    $scope.Field.technicalAlertType = KnowledgeService.get('technicalAlertTypeId');
                    $scope.Field.title = KnowledgeService.get('title');
                    $scope.Field.summary = KnowledgeService.get('summary');
                    $scope.Field.description = KnowledgeService.get('description');
                    $scope.Field.recommendation= KnowledgeService.get('recommendation');
                    $scope.Field.originalLanguage = KnowledgeService.get('originalLanguage');
                    $scope.Field.comments = KnowledgeService.get('comments');
                    $scope.Field.referenceKdIds = KnowledgeService.get('referenceKdIds');
                    $scope.Field.whyNotImplemented = KnowledgeService.get('whyNotImplemented');

                    if ($scope.Field.referenceKdIds != null && $scope.Field.referenceKdIds.length>0) {
                      $scope.beenReplicated = true;
                    }
                    else {
                      $scope.Field.referenceKdIds = [];
                    }
                }, function (err0) {
                    logger.error(err0.data.message);
                });
            }
            else if($stateParams.replicationID != null) {
                KnowledgeDiscoveryApi.getKDTitle($stateParams.replicationID).then(function (res0) {
                  $scope.Field.technicalAlertType = $scope.technicalAlertImplementationType;
                  $scope.beenReplicated = true;
                  $scope.Field.referenceKdIds.push({ "kdId": $stateParams.replicationID, "kdTitle": res0.title });
        
                }, function (err0) {
                  logger.error(err0.data.message);
                });
              }

              $scope.checkIsImplemented();
            $timeout(function () {
                AutosaveService.register(_AutoSave);
            }, 1000);
        }, function (err) {
            logger.error(err.data.message);
        });

        $scope.auditTrail = []

        if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
          KnowledgeDiscoveryApi.getAuditTrial($stateParams.id).then(function (res) {
            $scope.auditTrail = [];
            if (res != null && res != "") {
              $scope.auditTrail = res;
            }
          });
        }

    $scope.knowledgeid = null;
    $scope.isSMEUser = false;
    vm.isKM = false;
    
    function getUserInfo() {
      vm.userInfo = UserProfileApi.getUserInfo();
      vm.isReviewer = vm.userInfo.roles.indexOf('KMI') != -1;
      vm.isKM = vm.userInfo.roles.indexOf('KM') != -1;
      $scope.isSMEUser = vm.userInfo.isSMEUser;
    };
    $scope.goToNext = function () {
      $state.go('^.validate', { id: $stateParams.id, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage });

    }
    $scope.isDuplicate = false;
    $scope.duplicatedKD = {
      id:"",
      title: ""
    };
    $scope.checkDuplicateKD = function(title){
      KnowledgeDiscoveryApi.getDuplicateKD(title).then(function (res) {
        if(res.exists){
          $scope.isDuplicate = res.exists;
          $scope.duplicatedKD.id = res.id;
          $scope.duplicatedKD.title = res.title;
          $("#DuplicateModal").modal('show');
        }
      

      });
    }

    $scope.clickOkDuplicate = function(){
      $scope.Field.title = "";
      $("#DuplicateModal").modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }

    $scope.redirectToKD = function(id){
      $("#DuplicateModal").modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $window.open($state.href('app.knowledgeDiscovery.knowledgeDetail', { "id" : id  }), '_blank');
    }

   
      getUserInfo();
      $scope.$on("$destroy", function () {
        AutosaveService.destroy();
    });

      $scope.$on("submitTA", function (){

        $timeout(function(){
          if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
            alert("Please select input language");
            event.preventDefault();
            return;
          }
          isSubmit = true;
          if ($scope.Validator.validate()) {
              KnowledgeService.mergeObject('', $scope.Field);
              $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
            $scope.isSaving = true;

            //$scope.$apply();
            //$state.go('^.validate', { id: 5001, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage });
              KnowledgeDiscoveryApi.saveByType($stateParams.type, true, processObj( KnowledgeService.getPost())).then(function (res) {
               

                KnowledgeDocumentApi.api.knowledgeDocument.byId({}, {knowledgeDocumentId: res.id},function (response) {
                  logger.success("Submit successfully!");
                    vm.knowledgeDocument = response;
                    $('#ModalSubmitted').modal('show');
                  });
                  
                
              }, function (err) {
                  $scope.isSaving = false;
                  logger.error(ValidatorService.ModelState(err.data.modelState));
              });
          } else{
            logger.error("Some missing fields in (*)");
          }
        }, 500);
      });

      $scope.isDone = function () {
        $('#ModalSubmitted').modal('hide');
        $timeout(function(){
          $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: vm.knowledgeDocument.kdId });
        }, 500);
    }


        $scope.autoSaveMsg = "";
        function _AutoSave() {
            var errors = $scope.Validator.errors();
            if ($scope.Validator.validate()) {
                KnowledgeService.mergeObject('', $scope.Field);
                $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
                var post = processObj(KnowledgeService.getPost());
                KnowledgeDiscoveryApi.saveByType($stateParams.type, false, post).then(function (res) {
                    $scope.Field.id = res.id;
                    logger.success('Autosave successfully!');
                    $state.transitionTo($state.current, { id: res.id }, {
                        reload: false, inherit: false, notify: false
                    });
                    $scope.autoSaveMsg = "Auto-saved 2 minutes ago";
                }, function (err) {
                    logger.error(err.data.message);
                });
            }
            else{
              logger.error("Some missing fields in (*)");
            }
            if (!isSubmit) $scope.Validator.hideMessages();
        };

        function replaceSpecialChar(val){
          if(val != undefined && val != null){
            var strVal = val;
            var split  = strVal.split(/\n/g);
            strVal = split.join(" ");
    
            split = strVal.split(/\r/g);
            strVal = split.join("");
    
            split = strVal.split(/\v/g);
            strVal = split.join("");
            
            split = strVal.split(/\t/g);
            strVal = split.join(" ");
            return strVal;
          }
          else{
            return val;
          }
        }
    
        function processObj(knowledge){
          debugger;
          knowledge.title = replaceSpecialChar(knowledge.title);
          knowledge.ExternalAuthors = replaceSpecialChar(knowledge.ExternalAuthors);
          knowledge.actuallyHappen = replaceSpecialChar(knowledge.actuallyHappen);
          knowledge.summary = replaceSpecialChar(knowledge.summary);
          knowledge.supposedToHappen = replaceSpecialChar(knowledge.supposedToHappen);
          knowledge.whatLearn = replaceSpecialChar(knowledge.whatLearn);
          knowledge.whyDifference = replaceSpecialChar(knowledge.whyDifference);
          knowledge.recommendation = replaceSpecialChar(knowledge.recommendation);
          knowledge.description = replaceSpecialChar(knowledge.description);
          knowledge.methodologyTools = replaceSpecialChar(knowledge.methodologyTools);
          knowledge.businessImpact = replaceSpecialChar(knowledge.businessImpact);
          knowledge.successFactors = replaceSpecialChar(knowledge.successFactors);
          knowledge.ptsgvalue = replaceSpecialChar(knowledge.ptsgvalue);
          knowledge.ptgptsValue = replaceSpecialChar(knowledge.ptgptsValue);
          knowledge.whyNotImplemented = replaceSpecialChar(knowledge.whyNotImplemented);
          
          return knowledge;
        }

        $scope.isSaving = false;
        function _Submit(event) {
          $timeout(function(){
            if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
              alert("Please select input language");
              event.preventDefault();
              return;
            }
            isSubmit = true;
            event.preventDefault();
            if ($scope.Validator.validate()) {
                KnowledgeService.mergeObject('', $scope.Field);
                $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
              $scope.isSaving = true;

              var post = processObj(KnowledgeService.getPost());
              //$scope.$apply();
              //$state.go('^.validate', { id: 5001, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage });
                KnowledgeDiscoveryApi.saveByType($stateParams.type, true, post).then(function (res) {
                    logger.success("Save successfully!");
                    $scope.isSaving = false;
                  $state.go('^.validate', { id: res.id, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage  });
                }, function (err) {
                    $scope.isSaving = false;
                    logger.error(ValidatorService.ModelState(err.data.modelState));
                });
            } else{
              logger.error("Some missing fields in (*)");
            }
          }, 500);
        };
        $scope.isPreview = false;
        function _Preview() {
          $scope.isPreview = true;
          _SaveAsDraft();   
    
        };

        function _SaveAsDraft() {
          if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
            alert("Please select input language");
          }
          if ($scope.Validator.validate()) {
            KnowledgeService.mergeObject('', $scope.Field);
            $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
            KnowledgeDiscoveryApi.saveByType($stateParams.type, false, processObj(KnowledgeService.getPost()), vm.isReviewer).then(function (res) {
              logger.success('Saved Successfully as Draft');
              $state.go($state.current,{ id :res.id }, {reload: true});
              if( $scope.isPreview == true){
                var url = $state.href('app.knowledgeDiscovery.knowledgeDetail', { id: res.id });
               window.open(url, '_blank');
              }
            }, function (err) {
              logger.error(ValidatorService.ModelState(err.data.modelState));
            });
          }
          else{
            logger.error("Some missing fields in (*)");
          }
        };
        
        $scope.Submit = _Submit;
        $scope.Preview = _Preview;

        $scope.$on("$destroy", function () {
            AutosaveService.destroy();
        });

        $timeout(function () {

            //Kendo Accordion
            $('#RightAccordion').kendoPanelBar({
                expandMode: 'single'
            });

            //Kendo Multiselect
            $('#MultiSelect').kendoMultiSelect({
                open: function (e) {
                    $('#MultiSelect-list').addClass('multiselect_panel');
                }
            });
        }, 500);

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

        function LanguageChange() {
          $scope.$broadcast('changeInputLanguage', { inputLanguage: $scope.Field.originalLanguage });
          if ($scope.Field.originalLanguage == "en" || $scope.Field.originalLanguage == undefined) {
              $scope.Questions = $scope.QuestionsEnglish;
              $scope.$broadcast('changeQuestionsLanguage', {});
          }
          else {
            TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
              textToTranslate: $scope.QuestionsEnglish,
              fromLanguage: "en",
              toLanguage: $scope.Field.originalLanguage
            },
              function (response) {
                $scope.Questions = response.translatedText;
                $scope.$broadcast('changeQuestionsLanguage', {});
              },
              function (response) {
                if (response.status !== 404)
                  logger.error(response.data.errorMessage);
              });
          }

          var selected = vm.LanguageList.find(function(x){
            return x.languageCode == $scope.Field.originalLanguage;
          })
    
          $scope.selectedLanguage = selected.languageCodeName;

          var i = 0;
          angular.forEach($scope.TypeofTA, function (value, key) {
            if ($scope.Field.originalLanguage == "en" || $scope.Field.originalLanguage == undefined) {
              value.translatedName = value.typeName;
            }
            else {
              TranslatorApi.api.TranslateSingleText.save({}, {
                textToTranslate: value.typeName,
                fromLanguage: "en",
                toLanguage: $scope.Field.originalLanguage
              },
                function (response) {
                  value.translatedName = response.translatedText;
                },
                function (response) {
                  if (response.status !== 404)
                    logger.error(response.data.errorMessage);
                });
            }
          });
        }

       
        //$scope.isReplicated = false;
        $scope.checkReplicated = function(value) {
          //$scope.isReplicated = value;
          $scope.beenReplicated = value;
          // if(!value){
//            $scope.Field.referenceKdIds.splice(0, $scope.Field.referenceKdIds.length);
            $scope.Field.whyNotImplemented = "";
            $scope.Field.referenceKdIds = [];
            $scope.Field.IsImplemented = value;

            if($scope.beenReplicated == false && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
              $scope.type.isImplemented = false;
              $scope.type.min = 0;
            }
            else if($scope.beenReplicated == true && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
              $scope.type.isImplemented = true;
              $scope.type.min = 2;
            }
          // }
          //$scope.$apply();
        }
        $scope.typeChanged = function(id){
          if(id != $scope.technicalAlertImplementationType){
            $scope.beenReplicated = false;
           // $scope.Field.referenceKdIds = [];
           // $scope.Field.referenceKdIds.splice(0, $scope.Field.referenceKdIds.length);
            $scope.Field.whyNotImplemented = "";
            $scope.Field.referenceKdIds = [];
            
            //$scope.$apply();
          }
          if($scope.beenReplicated == false && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
            $scope.type.isImplemented = false;
            $scope.type.min = 0;
          }
          else if($scope.beenReplicated == true && $scope.Field.technicalAlertType == $scope.technicalAlertImplementationType){
            $scope.type.isImplemented = true;
            $scope.type.min = 2;
          }
          else{
            $scope.type.isImplemented = true;
            $scope.type.min = 2;
          }
          $scope.$broadcast('SetTAType', id);

          
        }

        // ta implementation
        $scope.disable;
        $scope.knowledge = [];
        $scope.knowledgeScope = {
          placeholder: "Select Technical Alert for implementation.",
          dataTextField: "knowledgeDocumentTitle",
          dataValueField: "knowledgeDocumentId",
          filter: "contains",
          minLength: 2,
          delay: 500,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                return KnowledgeDiscoveryApi.SearchKnowledgeImplementationTA(options, $scope.knowledge);
                // return AdminSettingCoPApi.GetAllUsers(options, $scope.modelValue);
              }
            },
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
          },
        };
    
        function _onOpen(e) {
          $timeout(function () {
            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
          });
        };
    
        function _onSelect(e) {
          var index = _.findIndex($scope.Field.referenceKdIds, function (obj) { return obj.kdId == e.dataItem.knowledgeDocumentId });
          if (index == -1) {
            $scope.Field.referenceKdIds.push({ "kdId": e.dataItem.knowledgeDocumentId, "kdTitle": e.dataItem.knowledgeDocumentTitle });
          }
    
          $timeout(function () {
            $('#knowledge-list').parents("span").children(".k-clear-value").trigger('click');
            $scope.knowledge = "";
          }, 500);
        };
    
     
        function _RemoveKnowledge(idx) {
          $scope.Field.referenceKdIds.splice(idx, 1);
          $scope.knowledge.splice(idx, 1);
          $scope.$apply();
        };
    
        $scope.onOpen = _onOpen;
        $scope.onSelect = _onSelect;
        $scope.RemoveKnowledge = _RemoveKnowledge;

        // end of ta implementation



        $scope.$on("clickedPreview", function () {
          _Preview();
        });
        $scope.$on("goToNext", function () {
          $scope.goToNext();
        });
        $scope.$on("clickedSaveAsDraft", function () {
          _SaveAsDraft();
        });
        $scope.$on("changePage", function (data, redirect) {
          $scope.redirecting = redirect;
          $timeout(function () {
            $('#redirectPosting').modal('show');
          }, 500);
        });
    
        $scope.confirmRedirect = function () {
          $('#redirectPosting').modal('hide');
          $timeout(function () {
            $state.go($scope.redirecting);
          }, 500);
        }
    }
})();
