(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeLessonLearntImproveController', KnowledgeLessonLearntImproveController);

  /** @ngInject */
  function KnowledgeLessonLearntImproveController($scope, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, ValidatorService, AutosaveService, logger) {
    var vm = this;
    var isSubmit = false;

    ValidatorService.Rules($scope);

    $scope.Field = {};
    $scope.QuestionsEnglish = {};
    $scope.Questions = {};
    $scope.QuestionsEnglish.knowledgeTitle = 'Knowledge Title <strong class="req">*</strong>';
    $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong><br><small>Write the submission in a concise manner</small>';
    $scope.QuestionsEnglish.whatHappen = 'What was supposed to happen? <strong class="req">*</strong>';
    $scope.QuestionsEnglish.whatHappenTitle = 'This should be a simple statement of what the intended outcome was. It could be quantitative, for example a planned expenditure, or it could be qualitative to explain the planned consequences.';
    $scope.QuestionsEnglish.whatHappenDescribe = 'Describe the objectives or expectations of the project/event';
    $scope.QuestionsEnglish.whatHappenPopover = '*Refer to 4 Quadrant Guideline too for brief guide (No. 1 to 7)';
    $scope.QuestionsEnglish.actuallyHappen = '<span title="This should describe what the actual outcome was. It should be a simple statement of fact that indicates a difference, for better or worse, in relation to the planned or expected outcome.">What actually happened? <strong class="req">*</strong></span><br><small> Describe the objectives or expectations that has been achieved through the project/event</small>';
    $scope.QuestionsEnglish.whyDifferences = '<span title="This is where it is important to explain why the difference arose so that the user will understand what caused the deviation from the plan.">Why were the differences? <strong class="req">*</strong></span><br><small>Describe the objectives or expectations has been achieved</small>';
    $scope.QuestionsEnglish.whatLearn = '<span title="This is probably the most important section because it tells the user what he/she should do to either avoid the reported pitfall or to gain the benefit from the good practice. It is important to target this advice at the correct level. ">What can we learn from this? <strong class="req">*</strong></span><br><small>Describe the challenges or good practices that has been adopted and identified during this project/event</small>';
    $scope.Questions = $scope.QuestionsEnglish;

    $scope.TypeofLL = [];

    vm.LanguageList = [{ languageCodeId : 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
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
      $scope.Field.originalLanguage = res.originalKnowledge.originalLanguage;
      $scope.Field.title = res.translatedKnowledge.title;
      $scope.Field.summary = res.translatedKnowledge.summary;
      $scope.Field.supposedToHappen = res.translatedKnowledge.supposedToHappen;
      $scope.Field.actuallyHappen = res.translatedKnowledge.actuallyHappened;
      $scope.Field.whyDifference = res.translatedKnowledge.whyDifference;
      $scope.Field.whatLearn = res.translatedKnowledge.whatLearn;
      $scope.selectedLanguage = $stateParams.ln;
      translateQuestions();
    }, function (err) {
      logger.error(err.data.message);
    });

    $scope.isSaving = false;
    function _Submit(event) {
      event.preventDefault();
      if ($scope.Validator.validate()) {
        $scope.isSaving = true;
        KnowledgeDiscoveryApi.saveImproveByType($stateParams.type, true, $scope.Field, $scope.selectedLanguage).then(function (res) {
          $scope.isSaving = false;
          logger.success("Save successfully!");
          $location.path('/knowledge-discovery/' + $stateParams.id);
        }, function (err) {
          $scope.isSaving = false;
          logger.error(ValidatorService.ModelState(err.data.modelState));
        });
      } else {
        $location.hash('TwoCols');
        $anchorScroll();
      }
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

    $scope.navigateback = function () {
      $location.path('/knowledge-discovery/' + $stateParams.id);
    };
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
