(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeInsightsBuildController', KnowledgeInsightsBuildController);

  /** @ngInject */
  function KnowledgeInsightsBuildController($scope, $rootScope, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, AutosaveService, ValidatorService, logger, SearchApi, UserProfileApi, KnowledgeDocumentApi,appConfig,$window ) {
    var vm = this;
    var isSubmit = false;
    $scope.Dialog = false;

    ValidatorService.Rules($scope);

    $scope.Field = {
      lessonLearnType: 0,
      kdReferenceId: [],
      valueInRM: 0
    };

    $scope.QuestionsEnglish = {};
    $scope.Questions = {};
    $scope.QuestionsEnglish.title = 'Title <strong class="req">*</strong>';
    $scope.QuestionsEnglish.knowledgeBeenReplicate = 'Is this a replication from other knowledge? <strong class="req">*</strong>';
    $scope.QuestionsEnglish.SourceReplicate = 'Replication Source <strong class="req">*</strong>';
    $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong>';
    $scope.QuestionsEnglish.recommendation = 'Recommendation';
    $scope.QuestionsEnglish.kReferenced = 'SKILL Knowledge Referenced (REPLICATION)';
    $scope.QuestionsEnglish.submittedBy = 'Submitted By';
    $scope.QuestionsEnglish.author = 'Author';
    $scope.QuestionsEnglish.location = 'Location';
    $scope.QuestionsEnglish.copyPastePopover = 'Refer to the guidelines on How to Copy and Paste Data from Source File.';
    $scope.Questions = $scope.QuestionsEnglish;
    $scope.selectedLanguage = 'English';

    $scope.submitModel = {
      knowledgeDocumentId: $stateParams.id,
      isShareToDepartment: false,
      isShareToCop: false,
      emailsToShare: [],
      isSkip: $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog,
      smeId: null,
      endorseId: null
    };
    $scope.knowledgetype = "Insights";

    $scope.Field.referenceKdIds = [];


    vm.knowledgeDocumentId = $stateParams.id;
    $scope.status;
    $scope.disableField = false;
    $scope.viewMode;
    vm.config = appConfig;
    $scope.beenReplicated = false;
    $scope.isEdit = false;
    $scope.replicationID = $stateParams.replicationID;

     $scope.$watch('disableField', function() {
      if($scope.disableField == true){
        $($('#Summary').data().kendoEditor.body).attr('contenteditable', false);
        $($('#recommendation').data().kendoEditor.body).attr('contenteditable', false);
      }
      else{
        $($('#Summary').data().kendoEditor.body).attr('contenteditable', true);
        $($('#recommendation').data().kendoEditor.body).attr('contenteditable', true);
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

    $scope.$on("viewModeChanged", function (evt, mode) {
      $scope.viewMode = mode;

      if ($stateParams.id == undefined && vm.knowledgeDocument.status != vm.config.Statuses.Draft && $scope.viewMode != edit) {
        $scope.disableField = true;
      }
      else {
        $scope.disableField = false;
      }
      
    });
    if (vm.knowledgeDocumentId != undefined) {
      getKnowledgeDocumentDetail();
    }

    vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
    $scope.Field.originalLanguage = "en";
    $scope.CopOptions = [];
    vm.LanguageChange = LanguageChange;

    KnowledgeDiscoveryApi.buildByType($stateParams.type).then(function (res) {
      KnowledgeService.initBuild(res);
      $scope.$broadcast('Init', null);
      getListOfLanguages();
      $scope.CopOptions = res.cops;
      if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
        KnowledgeDiscoveryApi.buildByType($stateParams.type, $stateParams.id).then(function (res0) {
          //if (res0.endorseStatus == 'Draft') {
          //  $state.go('^.completed', { id: $stateParams.id });
          //  return;
          //}
          KnowledgeService.init(res0);
          $scope.$broadcast('Get', { Get: KnowledgeService.get });
          $scope.Field.id = KnowledgeService.get('id');
          $scope.Field.knowledgeDocumentId = KnowledgeService.get('id');
          $scope.Field.title = KnowledgeService.get('title');
          $scope.Field.summary = KnowledgeService.get('summary');
          $scope.Field.recommendation = KnowledgeService.get('recommendation');
          $scope.Knowledges = KnowledgeService.get('insightKnowledgeReferences');
          $scope.Field.originalLanguage = KnowledgeService.get('originalLanguage');
          $scope.Field.referenceKdIds = KnowledgeService.get('referenceKdIds');
         
          $scope.Field.copId = KnowledgeService.get('copId');

          if ($scope.Field.referenceKdIds != null && $scope.Field.referenceKdIds.length>0) {
            $scope.beenReplicated = true;
          }
          else {
            $scope.beenReplicated = false;
            $scope.Field.referenceKdIds = [];
          }


          _.each($scope.Knowledges, function (x, xIndex) {
            $scope.Field.kdReferenceId.push(x.kdId);
          });
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

    $scope.auditTrail = [];

    if ($stateParams.id != undefined && $stateParams.id != null && $stateParams.id != "") {
      KnowledgeDiscoveryApi.getAuditTrial($stateParams.id).then(function (res) {
        $scope.auditTrail = [];
        if (res != null && res != "") {
          $scope.auditTrail = res;
        }
      });
    }

    $scope.knowledgeid = null;
    function getUserInfo() {
      vm.userInfo = UserProfileApi.getUserInfo();
      vm.isReviewer = vm.userInfo.roles.indexOf('KMI') != -1;

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

   
    $scope.autoSaveMsg = "";
    function _AutoSave() {
      if ($scope.Field.originalLanguage == "" || $scope.Field.originalLanguage == undefined) {
        alert("Please select input language");
        event.preventDefault();
        return;
      }
      var errors = $scope.Validator.errors();
      if ($scope.Validator.validate()) {
        KnowledgeService.mergeObject('', $scope.Field);
        $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
        var postData = KnowledgeService.getPost();
        postData.knowledgeDocumentId = (postData.knowledgeDocumentId != null && postData.knowledgeDocumentId != undefined) ? postData.knowledgeDocumentId : 0;
        KnowledgeDiscoveryApi.saveByType($stateParams.type, false, postData).then(function (res) {
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
      if (!isSubmit) $scope.Validator.hideMessages();
    };

    $scope.isSaving = false;

    function _Submit(event) {
      isSubmit = true;
      event.preventDefault();
      if ($scope.Validator.validate()) {
        KnowledgeService.mergeObject('', $scope.Field);
        $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
        var postData = KnowledgeService.getPost();
        postData.knowledgeDocumentId = (postData.knowledgeDocumentId != null && postData.knowledgeDocumentId != undefined) ? postData.knowledgeDocumentId : 0;
        $scope.isSaving = true;
        KnowledgeDiscoveryApi.saveByType($stateParams.type, false, postData).then(function (res) {
          $scope.isSaving = false;
          $scope.submitModel.knowledgeDocumentId = res.id;
          $scope.Confirm = res.confirmSubmit;
          if ($scope.submitModel.isSkip) {
            _SaveAndNext(event);
          } else {
            logger.success("Save successfully!");
            $('#ModalSubmitted').modal('show');
          }
        }, function (err) {
          $scope.isSaving = false;
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      } else {
        $location.hash('TwoCols');
        $anchorScroll();
      }
    }


    function _Preview() {
      if ($scope.Validator.validate()) {
        KnowledgeService.mergeObject('', $scope.Field);
        $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
        var postData = KnowledgeService.getPost();
        postData.knowledgeDocumentId = (postData.knowledgeDocumentId != null && postData.knowledgeDocumentId != undefined) ? postData.knowledgeDocumentId : 0;
        KnowledgeDiscoveryApi.saveByType($stateParams.type, true, postData).then(function (res) {
          //$state.go('app.knowledgeDiscovery.knowledgeDetail', { id: res.id });
          var url = $state.href('app.knowledgeDiscovery.knowledgeDetail', { id: res.id });
          window.open(url, '_blank');
        }, function (err) {
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      }
    };
    function _SaveAsDraft() {

      if ($scope.Validator.validate()) {
        KnowledgeService.mergeObject('', $scope.Field);
        $scope.$broadcast('Submit', { Set: KnowledgeService.setAttr });
        var postData = KnowledgeService.getPost();
        postData.knowledgeDocumentId = (postData.knowledgeDocumentId != null && postData.knowledgeDocumentId != undefined) ? postData.knowledgeDocumentId : 0;
        KnowledgeDiscoveryApi.saveByType($stateParams.type, true, postData).then(function (res) {
          logger.success('Saved Successfully as Draft');
          $state.go($state.current,{ id :res.id }, {reload: true});
        }, function (err) {
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      }
    };
    $scope.Submit = _Submit;
    $scope.Preview = _Preview;

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
    $scope.$on("changePage", function (data, redirect) {
      $scope.redirecting = redirect;
      $timeout(function () {
        $('#redirectPosting').modal('show');
      }, 500);
    });

    $scope.SourceKnowledges = {
      dataTextField: "title",
      dataValueField: "kdId",
      filter: "contains",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return SearchApi.searchKnowledgeRef(options, $scope.Knowledges);
          }
        },
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
        });
      },
    };
    $scope.emailSource = {
      dataTextField: "PersonName",
      dataValueField: "Id",
      autoBind: false,
      delay: 500,
      dataSource: new kendo.data.DataSource({
        serverFiltering: true,
        transport: {
          read: function (options) {
            return KnowledgeDiscoveryApi.getEmails(options)
          }
        }
      })
    };

    function _onSelect(e) {
      if ($scope.Knowledges == undefined || $scope.Knowledges == null) {
        $scope.Knowledges = [];
      }
      var index = _.findIndex($scope.Knowledges, function (obj) { return obj.kdId == e.dataItem.kdId });
      if (index == -1) {
        $scope.Knowledges.push(e.dataItem);
        $scope.Field.kdReferenceId.push(e.dataItem.kdId);
      }
      $timeout(function () {
        $scope.Knowledge = "";
      });
    };

    function _Remove(idx) {
      $scope.Knowledges.splice(idx, 1);
      $scope.Field.kdReferenceId.splice(idx, 1);
    };
    function _onOpen(e) {
      $timeout(function () {
        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
      });
    };
    $scope.onSelect = _onSelect;
    $scope.Remove = _Remove;
    $scope.onOpen = _onOpen;

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


    function _showDialog() {
      $scope.Dialog = true;
      $scope.$emit('Dialog', { show: true });
    };
    function _hideDialog() {
      $scope.Dialog = false;
      $scope.submitModel = {
        knowledgeDocumentId: $stateParams.id,
        isShareToDepartment: false,
        isShareToCop: false,
        emailsToShare: [],
        isSkip: $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog,
        smeId: null,
        endorseId: null
      };
      $scope.$emit('Dialog', { show: false });
    };
    function _SaveAndNext(event) {
      if ($scope.submitModel.shareToEmail && ($scope.submitModel.emailsToShare == null || $scope.submitModel.emailsToShare.length <= 0)) {
        return;
      }
      event.preventDefault();
      var emailsList = $scope.submitModel.emailsToShare ? _.map($scope.submitModel.emailsToShare, function (o) { return o.Id }) : [];
      $scope.submitModel.emailsToShare = emailsList;
      KnowledgeDiscoveryApi.SubmitInsightShareInperience($scope.submitModel).then(function (res) {
        $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog = $scope.submitModel.isSkip;
        UserProfileApi.saveUserInfo($rootScope.userInfo);
        _hideDialog();
        logger.success("Submit successfully!");
        $('#ModalSubmitted').modal('show');
        // $state.go('^.completed', { id: res.knowledgeDocumentId });
      }, function (err) {
        _hideDialog();
        logger.error(ValidatorService.ModelState(err.data.modelState));
      });
    }

    $scope.isDone = function () {
      $('#ModalSubmitted').modal('hide');
      $timeout(function(){
        $state.go('app.knowledgeDiscovery.knowledgeDetail', { id: $scope.submitModel.knowledgeDocumentId });
      }, 500);
  }

    $scope.showDialog = _showDialog;
    $scope.hideDialog = _hideDialog;
    $scope.SaveAndNext = _SaveAndNext;

    function LanguageChange() {
      if ($scope.Field.originalLanguage == "en" || $scope.Field.originalLanguage == undefined) {
        $scope.Questions = $scope.QuestionsEnglish;
      }
      else {
        TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
          textToTranslate: $scope.QuestionsEnglish,
          fromLanguage: "en",
          toLanguage: $scope.Field.originalLanguage
        },
          function (response) {
            $scope.Questions = response.translatedText;
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
    }

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
        $('#knowledge-list').parents("span").children(".k-clear-value").trigger('click');
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
