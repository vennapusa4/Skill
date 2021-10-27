(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgePublicationBuildController', KnowledgePublicationBuildController);

  /** @ngInject */
  function KnowledgePublicationBuildController($scope, Message, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, ValidatorService, PublicationService, AutosaveService, logger, UserProfileApi, KnowledgeDocumentApi, appConfig,$window) {
    var vm = this;
    var isSubmit = false;
    $scope.totalKeywords = 0;
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
        minlength: function (textarea) {
            if (textarea.is("[data-minlength-msg]")) {
                var html = $('<div></div>').append(textarea.val()).text();
                var count = $('<div></div>').append(html).text().trim().length;
                return count > 20 || count === 0;
            }
            return true;
        },
        invalidReferenceKd: function (input) {
          if (input.is("[data-invalidReferenceKd-msg]")) {
              if (_.size($scope.Field.referenceKdIds) === 0 || angular.element('#knowledge-list').val() != "") return false;
          }
          return true;
      },
      invalidLocation :function (input) {
        if (input.is("[invalidLocation]")) {
          if ($scope.Field.locationId == "") return false;
        }
        return true;
      },
      numberofkeywords : function (input) {
        if (input.is("[data-total-Keyword]")) {
          if($scope.totalKeywords < 2)
              return false;
        } 
        return true;
      },
    },
    messages: {
        required: Message.Msg1,
        richtext: Message.Msg1,
        collection: Message.Msg1,
        invalidReferenceKd: 'Select Knowledge From List',
        invalidLocation: 'Select Valid Location From List',
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

$scope.validateReplicationSource = function(){
  $scope.Validator.validateInput($("input[name=referenceKdIds]"));
}
    PublicationService.Init(PublicationService.Model);

    $scope.Field = { lessonLearnType: 0 };
    $scope.QuestionsEnglish = {};
    $scope.Questions = {};
    $scope.QuestionsEnglish.knowledge = 'Knowledge';
    $scope.QuestionsEnglish.BusinessSector = 'Business Sector Collaboration <strong class="req">*</strong>';
    $scope.QuestionsEnglish.disclaimer = '<strong>DISCLAIMER</strong> : This e-mail and any files transmitted with it ("Message") is intended only for the use of the recipient(s) named above and may contain confidential information. You are hereby notified that the taking of any action in reliance upon, or any review, retransmission, dissemination, distribution, printing or copying of this Message or any part thereof by anyone other than the intended recipient(s) is strictly prohibited. If you have received this Message in error, you should delete this Message immediately and advise the sender by return e-mail. Opinions, conclusions and other information in this Message that do not relate to the official business of PETRONAS or its Group of Companies shall be understood as neither given nor endorsed by PETRONAS or any of the companies within the Group.'
    $scope.QuestionsEnglish.title = 'Knowledge Title <strong class="req">*</strong>';
    $scope.QuestionsEnglish.knowledgeBeenReplicate = 'Is this a replication from other knowledge? <strong class="req">*</strong>';
    $scope.QuestionsEnglish.SourceReplicate = 'Replication Source <strong class="req">*</strong>';
    $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong>';
    $scope.QuestionsEnglish.publicationType = 'Select a type <strong class="req">*</strong>';
    $scope.QuestionsEnglish.publishedDate = 'Published Date';
    $scope.QuestionsEnglish.publishAuthor = 'Author';
    $scope.QuestionsEnglish.url = 'URL';
    $scope.QuestionsEnglish.publicationTypeText = 'Publication Type';
    $scope.QuestionsEnglish.copyPastePopover = '*Refer to the guidelines on How to Copy and Paste Data from Source File.';
    $scope.QuestionsEnglish.copyPasteGuidelines = '<div class="ms-rtestate-field" ><p>How to Copy and Paste Data from Source File:&#8203;</p> <ol class="noSidePadding"><li>Copy data from source file (Ms Word / Ms Excel etc.</li><li>Go to Share Knowledge Menu and select a form (Lessons Learnt / Best Practice etc).</li><li>Right click on the destination field (empty field) and select "Paste as Plain Text".</li><li>Proceed to fill in all the details and submit.</li><li>Once you view the knowledge again in reading mode, you may see that the format are correctly placed based on your original data.</li></ol></div >';

    //Attachment
    $scope.QuestionsEnglish.attachment = 'Attachment';
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

    //Choose Keyword
    $scope.QuestionsEnglish.chooseKeyword = 'Choose Keyword';
    $scope.selectedLanguage = 'English';
    $scope.beenReplicated = 'no';
    $scope.Field.businessSectorTypeIds= [];

    $scope.Questions = $scope.QuestionsEnglish;

    $scope.LanguageChange = LanguageChange;

    $scope.Source = [];
    var authorsValid = false;
    $scope.isSubmitter = false;

    vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
    $scope.Field.originalLanguage = "en";

    //$scope.Validation['rules']['list'] = function (input) {
    //    if (input.is("[data-list-msg]")) {
    //        $scope.$broadcast('Validate', null);
    //        return authorsValid;
    //    }
    //    return true;
    //};

    //$scope.$on('ValidateStatus', function (event, data) {
    //    authorsValid = data.status;
    //    //$scope.Validator.validateInput($("input[name=Authors]"));
    //});
    $scope.isFileUploading = false;
    $scope.uploadingCount = 0;
    $scope.totalUploading = 0;
    $scope.prefix = "";

    $scope.Field.referenceKdIds = [];


    vm.knowledgeDocumentId = $stateParams.id;
    $scope.status;
    $scope.disableField = false;
    $scope.viewMode;
    vm.config = appConfig;
    vm.isReviewer = false;
    $scope.isEndorser = false;
    $scope.beenReplicated = false;
    $scope.isEdit = false;

    $scope.field = {
      "disableField" : false
    }

    $scope.$watch('disableField', function() {
      if($scope.disableField == true){
        $($('#Summary').data().kendoEditor.body).attr('contenteditable', false);
      }
      else{
        $($('#Summary').data().kendoEditor.body).attr('contenteditable', true);
      }
      
    });

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
              $scope.field.disableField = true;
            }
            else {
              $scope.disableField = false;
              $scope.field.disableField = false;
            }

          },
          function (response) {
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
          });

      }

    };
    $scope.$on('disableFields', function (event, value) {
      $scope.disableField = value;
      
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

    $scope.$on('Completed', function () {
      $scope.$broadcast('Init', { Get: PublicationService.GetS, Type: $scope.Field.sourceName, inputLanguage: $scope.Field.originalLanguage == "" ? "en" : $scope.Field.originalLanguage });
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

    $scope.$watch('Field.sourceId', function (newValue, oldValue) {
      if (!_.isEmpty(newValue)) {
        $scope.Field.sourceName = _.head(_.filter($scope.Source, function (o) { return o.id === newValue })).sourceName;
      }
    });
    $scope.businessSector = [];
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
          });
        }
          $scope.getAllBusinessSectors();

    KnowledgeDiscoveryApi.buildByType($stateParams.type).then(function (res) {
      KnowledgeService.initBuild(res);
      $scope.$broadcast('Init', null);
      $scope.Source = _.map(KnowledgeService.getBuild('sources'), function (o) { return { id: o.id.toString(), sourceName: o.sourceName, translatedName: o.sourceName } });

      $scope.Field.sourceId = !_.isEmpty(_.head($scope.Source)) ? _.head($scope.Source).id : null;
      getListOfLanguages();
      if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
        KnowledgeDiscoveryApi.buildByType($stateParams.type, $stateParams.id).then(function (res0) {
          KnowledgeService.init(res0);
          $scope.Field.id = KnowledgeService.get('id');
          $scope.Field.title = KnowledgeService.get('title');
          $scope.Field.summary = KnowledgeService.get('summary');
          $scope.Field.sourceId = KnowledgeService.get('sourceId');
          $scope.Field.sourceName = _.head(_.filter($scope.Source, function (o) { return o.id == KnowledgeService.get('sourceId').toString() })).sourceName;
          $scope.Field.originalLanguage = KnowledgeService.get('originalLanguage');
          $scope.Field.endorseStatus = KnowledgeService.get('endorseStatus');
          $scope.Field.endorserComments = KnowledgeService.get('endorserComments');
          $scope.Field.reviewStatus = KnowledgeService.get('reviewStatus');
          $scope.Field.reviewerComments = KnowledgeService.get('reviewerComments');
          $scope.Field.businessSectors = KnowledgeService.get('businessSectors'); 
          $scope.Field.referenceKdIds = KnowledgeService.get('referenceKdIds');
          $scope.Field.businessSectorTypeIds = _.map($scope.Field.businessSectors, function (o) { return o.typeId });

          $scope.selectedSectors = _.map(_.filter($scope.Field.businessSectors, function(business){ return _.filter($scope.businessSector, function (o) { return business.typeId == o.typeId })}) , function (o, idx) { return { typeId: o.typeId, name: o.name , selected: true }});
          $scope.selectedSectors.forEach(function(selected){
            $scope.businessSector.forEach(function(business , idx){
              if(selected.typeId == business.typeId ){
                $scope.businessSector.splice(idx, 1, selected);
              }
            });
          })

         
          if ( $scope.Field.referenceKdIds != null && $scope.Field.referenceKdIds.length!=0 ) {
            $scope.beenReplicated = true;
          }
          else {
            $scope.Field.referenceKdIds = [];
          }
          if ($scope.Field.endorseStatus == 'Amend') {
            $scope.isEndoserAmend = true;
          }
          
         
          $timeout(function () { $scope.$broadcast('Get', { Get: KnowledgeService.get }) }, 200);
        }, function (err0) {
          logger.error(err0.data.message);
        });
      }
      else if($stateParams.replicationID != null) {
        KnowledgeDiscoveryApi.getKDTitle($stateParams.replicationID).then(function (res0) {
          $scope.beenReplicated = true;
          $scope.Field.referenceKdIds.push({ "kdId": $stateParams.replicationID, "kdTitle": res0.title });

        }, function (err0) {
          logger.error(err0.data.message);
        });
      }
      $timeout(function () {
        AutosaveService.register(_AutoSave);
      }, 1000);
    }, function (err) {
      logger.error(err.data.message);
    });

    $scope.auditTrail = []

    $scope.updateSectorValue = function(choice){
      console.log(choice);
      
      var index = _.findIndex($scope.Field.businessSectorTypeIds, function (obj) { return obj == choice.typeId });
      if(choice.selected){
        $scope.showBusinessError = false;
          $scope.Field.businessSectorTypeIds.push(choice.typeId);
      }else{
        if($scope.Field.businessSectorTypeIds.length == 0){
          $scope.showBusinessError = true;
        }
        $scope.Field.businessSectorTypeIds.splice(index, 1);
      }
      console.log($scope.Field.businessSectorTypeIds);

    }

    if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
      KnowledgeDiscoveryApi.getAuditTrial($stateParams.id).then(function (res) {
        $scope.auditTrail = [];
        if (res != null && res != "") {
          $scope.auditTrail = res;
        }
      });
    }

    $scope.knowledgeid = null;
    vm.isKM = false;
    function getUserInfo() {
      vm.userInfo = UserProfileApi.getUserInfo();
      vm.isReviewer = vm.userInfo.roles.indexOf('KMI') != -1;
      vm.isKM = vm.userInfo.roles.indexOf('KM') != -1;
      $scope.isSMEUser = vm.userInfo.isSMEUser;

    };
    getUserInfo();
    $scope.autoSaveMsg = "";
    function _AutoSave() {
      var errors = $scope.Validator.errors();
      if ($scope.Validator.validate()) {
        PublicationService.Set('id', $scope.Field.id);
        PublicationService.Set('title', $scope.Field.title);
        PublicationService.Set('summary', $scope.Field.summary);
        PublicationService.Set('originalLanguage', $scope.Field.originalLanguage);
        $scope.$broadcast('Submit', { Set: PublicationService.Set, Lower: true });
        KnowledgeDiscoveryApi.saveByType($stateParams.type, false, processObj(PublicationService.Post())).then(function (res) {
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

    $scope.understood = false;
    $scope.isSaving = false;

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
      
      knowledge.bookTitle = replaceSpecialChar(knowledge.bookTitle);
      knowledge.isbn = replaceSpecialChar(knowledge.isbn);
      knowledge.url = replaceSpecialChar(knowledge.url);
     // knowledge.authors = replaceSpecialChar(knowledge.authors);
      knowledge.eventName = replaceSpecialChar(knowledge.eventName);
      knowledge.newspaperName = replaceSpecialChar(knowledge.newspaperName);
      knowledge.magazineName = replaceSpecialChar(knowledge.magazineName);
      knowledge.caseForChange = replaceSpecialChar(knowledge.caseForChange);
      knowledge.doingDifferently = replaceSpecialChar(knowledge.doingDifferently);
      return knowledge;
    }
    function _Submit(event) {
      debugger;
      if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
        alert("Please select input language");
        event.preventDefault();
        return;
      }
      // if($scope.understood == false){
      //   alert("Please accept the Disclaimer");
      //   return;
      // }
      // $scope.showBusinessError = false;
      //       if( $scope.Field.businessSectorTypeIds.length == 0){
      //         $scope.showBusinessError = true;
      //         return;
      //       }
      //       else{
      //         $scope.showBusinessError = false;
      //       }
      event.preventDefault();
      if ($scope.Validator.validate()) {
        PublicationService.Set('id', $scope.Field.id);
        PublicationService.Set('title', $scope.Field.title);
        PublicationService.Set('summary', $scope.Field.summary);
        PublicationService.Set('sourceId', parseInt($scope.Field.sourceId));
        PublicationService.Set('originalLanguage', $scope.Field.originalLanguage);
        PublicationService.Set('referenceKdIds', $scope.Field.referenceKdIds);
        PublicationService.Set('businessSectorTypeIds', $scope.Field.businessSectorTypeIds);
        $scope.$broadcast('Submit', { Set: PublicationService.Set, Lower: true });
        var postObject = processObj( PublicationService.Post());
        var sourceName = _.head(_.filter($scope.Source, function (o) { return o.id == $scope.Field.sourceId })).sourceName;
        // Validate Published date
        if (sourceName != 'Success Story' && sourceName != 'Conference Paper' && sourceName != 'Digital Media') {
          if (!validateDateValue(postObject.publishDate)) {
            logger.error("Published Date is not a valid date in DD/MM/YYYY format!");
            return;
          }
        }

        $scope.isSaving = true;
        KnowledgeDiscoveryApi.saveByType($stateParams.type, true, postObject).then(function (res) {
          $scope.isSaving = false;
          logger.success("Save successfully!");
          $state.go('^.validate', { id: res.id, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage });
        }, function (err) {
          $scope.isSaving = false;
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      } else{
            logger.error("Some missing fields in (*)");
          }
    };

    function validateDateValue(value) {
      try {
        var year = value.getFullYear();
        if (year > 1000) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    $scope.isPreview = false;
    function _Preview() {
      $scope.isPreview = true;
      _SaveAsDraft();   

    };
    function _SaveAsDraft() {
      if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
        alert("Please select input language");
      }
      // if( $scope.Field.sourceName == "Success Story" && $scope.Field.businessSectorTypeIds.length == 0){
      //   $scope.showBusinessError = true;
      //   return;
      // }
      // else{
      //   $scope.showBusinessError = false;
      // }
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
    function _getSource(sourceId) {
      if (!_.isEmpty(sourceId)) {
        var sourceName = _.head(_.filter($scope.Source, function (o) { return o.id == sourceId })).sourceName;
        return {
          name: sourceName
        };
      }
      return { name: '' };
    };

    function _changeSource() {
      $scope.$broadcast('Change', { Set: PublicationService.SetS, Type: $scope.Field.sourceName });
    };

    $scope.Submit = _Submit;
    $scope.Preview = _Preview;
    $scope.getSource = _getSource;
    $scope.changeSource = _changeSource;

    $scope.isDuplicate = false;
    $scope.duplicatedKD = {
      id:"",
      title: ""
    };
    $scope.goToNext = function () {
      $state.go('^.validate', { id: $stateParams.id, shareId: $stateParams.shareId, shareTitle: $stateParams.shareTitle, shareLanguageCode: $scope.Field.originalLanguage });

    }
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
    
    $scope.$on("$destroy", function () {
      AutosaveService.destroy();
    });

    $scope.$on("clickedPreview", function () {
      _Preview();
    });
    $scope.$on("goToNext", function () {
      $scope.goToNext();
    });
    $scope.$on("clickedSaveAsDraft", function () {
      _SaveAsDraft();
    });
    $timeout(function () {

      //Kendo Accordion
      $('#RightAccordion').kendoPanelBar({
        expandMode: 'single'
      });

      //Kendo Multiselect
      $('#MultiSelect').kendoMultiSelect({
        open: function (e) {
          setTimeout(function () {
            $('#MultiSelect-list').addClass('multiselect_panel');
          }, 100);
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

      angular.forEach($scope.Source, function (value, key) {
        if ($scope.Field.originalLanguage == "en" || $scope.Field.originalLanguage == undefined) {
          value.translatedName = value.sourceName;
        }
        else {
          TranslatorApi.api.TranslateSingleText.save({}, {
            textToTranslate: value.sourceName,
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
      var selected = vm.LanguageList.find(function (x) {
        return x.languageCode == $scope.Field.originalLanguage;
      })
      $scope.selectedLanguage = selected.languageCodeName;
    }

    $scope.isReplicated = false;
    function checkReplicated(value) {
      if (value == "yes") {
        $scope.isReplicated = true;
      }
      else {
        $scope.isReplicated = no;
      }

    }

    $scope.disable;
    $scope.knowledge = [];
    $scope.knowledgeScope = {
      placeholder: "Select Knowledge Document for replication.",
      dataTextField: "knowledgeDocumentTitle",
      dataValueField: "knowledgeDocumentId",
      filter: "contains",
      minLength: 2,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return KnowledgeDiscoveryApi.SearchKnowledgeReplication(options, $scope.knowledge);
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
        $('.k-clear-value').trigger('click');
        $scope.knowledge = "";
      }, 500);
    };

    function _Remove(idx) {
      $scope.Field.referenceKdIds.splice(idx, 1);
    };
    function _RemoveKnowledge(idx) {
      $scope.knowledge.splice(idx, 1);
    };

    $scope.onOpen = _onOpen;
    $scope.onSelect = _onSelect;
    $scope.Remove = _Remove;
    $scope._RemoveKnowledge = _RemoveKnowledge;

  }

})();
