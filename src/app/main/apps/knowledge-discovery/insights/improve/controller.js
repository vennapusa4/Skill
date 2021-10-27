(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeInsightsImproveController', KnowledgeInsightsImproveController);

  /** @ngInject */
  function KnowledgeInsightsImproveController($scope, $rootScope, $state, $stateParams, $location, $anchorScroll, $timeout, KnowledgeDiscoveryApi, MasterDataLanguageCodesApi, TranslatorApi, KnowledgeService, AutosaveService, ValidatorService, logger, SearchApi, UserProfileApi) {
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
    $scope.QuestionsEnglish.summary = 'Summary <strong class="req">*</strong>';
    $scope.QuestionsEnglish.recommendation = 'Recommendation';
    $scope.Questions = $scope.QuestionsEnglish;

    vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", isDeleted: false }];
    $scope.selectedLanguage = "en";

    vm.LanguageChange = LanguageChange;
    vm.reTranslate = reTranslate;

    KnowledgeDiscoveryApi.improveByType($stateParams.type, $stateParams.ln, $stateParams.id).then(function (res) {
      getListOfLanguages();
      $scope.Field.id = $stateParams.id;
      $scope.Field.original_title = res.originalKnowledge.title;
      $scope.Field.original_summary = res.originalKnowledge.summary;
      $scope.Field.original_recommendation = res.originalKnowledge.recommendation;
      $scope.Field.originalLanguage = res.originalKnowledge.originalLanguage;
      $scope.Field.title = res.translatedKnowledge.title;
      $scope.Field.summary = res.translatedKnowledge.summary;
      $scope.Field.recommendation = res.translatedKnowledge.recommendation;
      $scope.selectedLanguage = $stateParams.ln;
      translateQuestions();
    }, function (err) {
      logger.error(err.data.message);
    });

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
    $scope.navigateback = function () {
      $location.path('/knowledge-discovery/' + $stateParams.id);
    };
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
  }
})();
