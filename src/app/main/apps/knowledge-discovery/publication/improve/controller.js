(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgePublicationImproveController', KnowledgePublicationImproveController);

  /** @ngInject */
  function KnowledgePublicationImproveController($scope, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, ValidatorService, PublicationService, AutosaveService, logger) {
    var vm = this;
    var isSubmit = false;
    ValidatorService.Rules($scope);

    $scope.Field = { lessonLearnType: 0 };
    $scope.QuestionsEnglish = {};
    $scope.Questions = {};
    $scope.QuestionsEnglish.title = 'Title <strong class="req">*</strong>';
    $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong>';
    $scope.QuestionsEnglish.publicationType = 'Select a type <strong class="req">*</strong>';
    $scope.QuestionsEnglish.freetextBoldStory = 'Free Text Bold Story';
    $scope.QuestionsEnglish.doingDifferently = 'Doing things differently';
    $scope.QuestionsEnglish.caseForChange = 'Case for Change';
    $scope.QuestionsEnglish.winnerText = 'Winner';
    $scope.Questions = $scope.QuestionsEnglish;

    $scope.LanguageChange = LanguageChange;

    vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
    $scope.selectedLanguage = "en";

    vm.LanguageChange = LanguageChange;
    vm.reTranslate = reTranslate;

    KnowledgeDiscoveryApi.improveByType($stateParams.type, $stateParams.ln, $stateParams.id).then(function (res) {
      getListOfLanguages();
      $scope.Field.id = $stateParams.id;
      $scope.Field.original_title = res.originalKnowledge.title;
      $scope.Field.original_summary = res.originalKnowledge.summary;
      $scope.Field.original_supposedToHappen = res.originalKnowledge.supposedToHappen;
      $scope.Field.original_actuallyHappen = res.originalKnowledge.actuallyHappened;
      $scope.Field.original_whyDifferences = res.originalKnowledge.whyDifference;
      $scope.Field.original_whatLearn = res.originalKnowledge.whatLearn;
      $scope.Field.original_freetextBoldStory = res.originalKnowledge.freetextBoldStory;
      $scope.Field.original_doingDifferently = res.originalKnowledge.doingDifferently;
      $scope.Field.original_caseForChange = res.originalKnowledge.caseForChange;
      $scope.Field.original_winnerText = res.originalKnowledge.winnerText;
      $scope.Field.originalLanguage = res.originalKnowledge.originalLanguage;
      $scope.Field.title = res.translatedKnowledge.title;
      $scope.Field.summary = res.translatedKnowledge.summary;
      $scope.Field.supposedToHappen = res.translatedKnowledge.supposedToHappen;
      $scope.Field.actuallyHappen = res.translatedKnowledge.actuallyHappened;
      $scope.Field.whyDifference = res.translatedKnowledge.whyDifference;
      $scope.Field.whatLearn = res.translatedKnowledge.whatLearn;
      $scope.Field.freetextBoldStory = res.translatedKnowledge.freetextBoldStory;
      $scope.Field.doingDifferently = res.translatedKnowledge.doingDifferently;
      $scope.Field.caseForChange = res.translatedKnowledge.caseForChange;
      $scope.Field.winnerText = res.translatedKnowledge.winnerText;
      $scope.selectedLanguage = $stateParams.ln;
      translateQuestions();
    }, function (err) {
      logger.error(err.data.message);
    });

    
    $scope.isSaving = false;
    function _Submit(event) {
      event.preventDefault();
      //if ($scope.Validator.validate()) {
        $scope.isSaving = true;
        KnowledgeDiscoveryApi.saveImproveByType($stateParams.type, true, $scope.Field, $scope.selectedLanguage).then(function (res) {
          $scope.isSaving = false;
          logger.success("Save successfully!");
          $location.path('/knowledge-discovery/' + $stateParams.id);
        }, function (err) {
          $scope.isSaving = false;
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      //} else {
      //  $location.hash('TwoCols');
      //  $anchorScroll();
      //}
    };

    $scope.Submit = _Submit;

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
          setTimeout(function () {
            $('#MultiSelect-list').addClass('multiselect_panel');
          }, 100);
        }
      });
    }, 500);

    function getListOfLanguages() {
      MasterDataLanguageCodesApi.api.getList.query({}, {},
        function (response) {
          vm.LanguageList = response;
        },
        function (response) {
          if (response.status !== 404)
            logger.error(response.data.errorMessage);
        });
    }

    function LanguageChange() {
      $scope.$broadcast('changeInputLanguage', { inputLanguage: $scope.Field.originalLanguage });
      if ($scope.Field.originalLanguage == "en") {
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
    }
    $scope.navigateback = function () {
      $location.path('/knowledge-discovery/' + $stateParams.id);
    };
    function translateQuestions() {
      if ($scope.selectedLanguage == "en") {
        $scope.Questions = $scope.QuestionsEnglish;
      }
      else {
        var textToTranslate = $scope.QuestionsEnglish;

        TranslatorApi.api.TranslateMultipleText.save({}, {
          textToTranslate: textToTranslate,
          fromLanguage: "en",
          toLanguage: $scope.selectedLanguage
        },
          function (response) {
            $scope.Questions = response.translatedText;
          },
          function (response) {
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
          });
      }
    }

    function reTranslate(fieldName) {
      var orgiginalText = $scope.Field['original_' + fieldName];
      if (orgiginalText != null && orgiginalText != undefined && orgiginalText != '') {
        TranslatorApi.api.TranslateSingleHtmlText.save({}, {
          textToTranslate: orgiginalText,
          fromLanguage: $scope.Field['originalLanguage'],
          toLanguage: $scope.selectedLanguage
        },
          function (response) {
            $scope.Field[fieldName] = response.translatedText;
          },
          function (response) {
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
          });
      }
    }
  }
})();
