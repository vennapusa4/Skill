(function () {
  'use strict';

  angular
    .module('app.bulkUpload')
    .controller('BulkUploadController', BulkUploadController);

  /** @ngInject */
  function BulkUploadController($scope, $state, $timeout,KnowledgeDocumentApi, MasterDataLanguageCodesApi  , TranslatorApi , KnowledgeDiscoveryApi, KnowledgeService, BulkUploadApi, BulkUploadService, logger, $stateParams, $location, $anchorScroll, ValidatorService) {
      var vm = this;
      $scope.shareid = $stateParams.shareId;
      $scope.shareTitle = $stateParams.shareTitle;
      $scope.Field = {};
      $scope.KnowledgeType = "Best Practices";
      ValidatorService.Rules($scope);
      $scope.QuestionsEnglish = {};
      $scope.Questions = {};
      $scope.Field.copId;
      $scope.covers = 14;
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
      $scope.QuestionsEnglish.BusinessSector = 'Business Sector Collaboration <strong class="req">*</strong>';

      $scope.haveTemplate = false;
      $scope.selectedLanguage = 'English';

      $scope.Field.businessSectorTypeIds= [];
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
            $scope.businessSector.push({"typeId" : sector.id, "name":sector.name, "position": arrangement, selected:false})
          });
          $scope.businessSector = $scope.businessSector.sort(function(a, b) {
            return a.position - b.position;
          });
        });
      }
        $scope.getAllBusinessSectors();

      //Choose Keyword
      $scope.QuestionsEnglish.chooseKeyword = 'Choose Keyword';
      $scope.Questions = $scope.QuestionsEnglish;
    $scope.$watch('KnowledgeType', function () {
      if($scope.KnowledgeType == 'Lesson Learnt') {
        $scope.covers = 2;
        console.log($scope.covers);
      } else {
        $scope.covers = 14;
        console.log($scope.covers);
      }
    });

    $scope.$watch('Field.SourceId', function () {
      var sourceId = $scope.Field.SourceId;
      if (sourceId) {
          var exists = _.find($scope.Source, function (item, index) {
              return item.id == sourceId;
          });
          if (exists) {
              BulkUploadService.setCurrentSource(exists.sourceName);
          }
      }
  });
    $scope.selectedBusinessSectors = [];
    $scope.updateSectorValue = function(choice){
      // $scope.Field.businessSectorTypeIds = $scope.Field.businessSectorTypeIds || [];
       if(choice.selected){
           $scope.selectedBusinessSectors.push({typeId: choice.typeId , name: choice.name});
           BulkUploadService.setBusinessSectorList($scope.selectedBusinessSectors);
           console.log(BulkUploadService.getBusinessSectorList());
          // $scope.selectedBusinessSectors =  _.uniq($scope.value, choice.name);
       }else{         
           $scope.selectedBusinessSectors = _.without($scope.value, choice.name);
           BulkUploadService.setBusinessSectorList($scope.selectedBusinessSectors);
       }

     }


     vm.LanguageList = [{ languageCodeId: 1, languageCodeName: "English", languageCode: "en", image: 'united-kingdom.svg', isDeleted: false }];
    $scope.Field.originalLanguage = "en";
     vm.LanguageChange = LanguageChange;

    KnowledgeDiscoveryApi.buildByType('Pub').then(function (res) {
      KnowledgeService.initBuild(res);
      getListOfLanguages();
      $scope.Source = _.map(KnowledgeService.getBuild('sources'), function (o) { return { id: o.id.toString(), sourceName: o.sourceName } });
      $scope.Field.SourceId = !_.isEmpty(_.head($scope.Source)) ? _.head($scope.Source).id : null;
      $scope.businessSectors = KnowledgeService.get('businessSectors'); 
     // $scope.Field.originalLanguage = KnowledgeService.get('originalLanguage');
      $scope.CopOptions = res.cops;
      $scope.$broadcast('Init', null);
    });

    $scope.showBusinessError = false;
    $scope.Submit = function (event) {
      event.preventDefault();
      if( $scope.selectedBusinessSectors.length == 0 && $scope.KnowledgeType == "Best Practices"){
        $scope.showBusinessError = true;
        return;
      }
      else{
        $scope.showBusinessError = false;
      }

      if ($scope.Validator.validate()) {
        $scope.$broadcast('Submit', { Set: BulkUploadService.Set });
        BulkUploadApi.GenerateBulkUploadTemplate(angular.extend({
          type: $scope.KnowledgeType,
          sourceId: $scope.Field.SourceId,
          submittedBy: KnowledgeService.getBuild('submittedByUser.userName'),
          businessSectors : BulkUploadService.getBusinessSectorList(),
          copId : $scope.Field.copId,
          originalLanguage: $scope.Field.originalLanguage,
        }, BulkUploadService.Post())).then(function (res) {
          if (res.status) {
            logger.success('Generate template successfully');
            $state.go('app.bulkUpload.upload', { type: decodeURIComponent($scope.KnowledgeType) });
          }
        }, function (err) {
          console.log(err);
        });
      } else {
        $location.hash('TwoCols');
        $anchorScroll();
      }

    }

    $timeout(function () {

      //Kendo Accordion
      $('#RightAccordion').kendoPanelBar({
        expandMode: 'single'
      });

      //Kendo Accordion - Additional Info
      $('#AccInfo').kendoPanelBar({
        expandMode: 'single'
      });

      // Collapse New Author block on click close button
      var panelBar = $("#AuthorList").data("kendoPanelBar");
      $('.btn_close_panel').click(function () {
        panelBar.collapse($(this).parents('li'));
      });
    }, 1000);


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
    }

  }
})();
