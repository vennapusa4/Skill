(function () {
  'use strict';

  angular
    .module('app.translationEngagement')
    .controller('TranslationEngagementAdminController', TranslationEngagementAdminController);

  /** @ngInject */
    function TranslationEngagementAdminController($scope, $filter, appConfig, InsightsCommonService, TranslatorApi, $rootScope) {
        var vm = this;
    // Declare variables
    $scope.isFirstTimeToLoad = true;
    $scope.arrClass = appConfig.arrClass;
    $scope.arrColor = appConfig.arrColor;
    $scope.data = [];
    $scope.showDropdown = false;
    $scope.filter = "All";
    var xDate = new Date();
    var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
    var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
    $scope.fromDate = new Date(1, 1, 1900); //currentDate;
    $scope.toDate = new Date(); //lastDateInMonth;
    $scope.defaultFilter = "year";
    $scope.colorViewMoreTopReplications = 0;
      $scope.dataPopup = [];
      $scope.locationType = [
          { Id: "0", Name: 'ALL' },
          { Id: "1", Name: 'State' },
          { Id: "2", Name: 'Field' },
          { Id: "3", Name: 'Block' },
          { Id: "4", Name: 'Terminal' },
          { Id: "5", Name: 'Plant' },
          { Id: "6", Name: 'Country' },
          { Id: "7", Name: 'Region' },
      ];
        $scope.selectedLocationType = "0";
        vm.ApplyLocationTypeFilter = ApplyLocationTypeFilter;
        $scope.locationResponse = [];
    $scope.setTabActive = function (index) {
      return index == 0 ? "tab-pane active" : "tab-pane";
    }
    function loadDataBaseLocalStorage(isSave) {
      if ($scope.isFirstTimeToLoad) {
        loadData();
        $scope.isFirstTimeToLoad = false;
      } else {
        if (isSave) {
          loadData();
        }
      }
    }
    loadDataBaseLocalStorage(false);

    // Segment Labels Changes
    $scope.$on('segmentLabelChanges', function (event, data) {
      loadDataBaseLocalStorage(data.isSave);
    });

    // Switch mode
    $scope.$on('switchMode', function (event, data) {
      $scope.isShowAll = data.isShowAll;
      loadData();
    });

    // Filter by date
    $scope.filterDate = function (startDate, endDate, period) {
      var segmentItems = InsightsCommonService.getAllSegmentLabels();
      $scope.fromDate = startDate._d;
      $scope.toDate = endDate._d;

      $scope.defaultFilter = period;
      var month = $scope.fromDate.getMonth() + 1;
      var year = $scope.fromDate.getFullYear();
      switch (period) {
        case 'month': {
          $scope.toDate = new Date(year, month, 0);
          $scope.filter = month + "/" + year;
          break;
        }
        case 'quarter': {
          var quarter = InsightsCommonService.getQuarter($scope.fromDate);
          $scope.toDate = new Date(year, quarter * 3, 0);
          $scope.filter = "Quarter " + quarter;
          break;
        }
        case 'year': {
          $scope.toDate = new Date(year, 12, 0);
          $scope.filter = "Year " + year;
          break;
        }
        default:
      }

      // Reload data for top trending
      loadData();

      $scope.$apply(function () {
        $scope.showDropdown = false;
      });
    }

    $scope.kmlFormatter = function (str) {
      return InsightsCommonService.kmlFormatter(str);
    }

    // Load data
    function loadData() {
      $scope.loading = true;
      $scope.data = [];

      var input = {
        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy")
      };
      TranslatorApi.TranslationStatistics(input).then(function (data) {
        $scope.loading = false;
        if (data != null) {
            $scope.data = data;
            $scope.locationResponse = $scope.data[0].topTenKnowledgeLocationResponse;
        }
      }, function (error) {
        $scope.loading = false;
        console.log(error);
      });
    }

    $scope.$on('globalFilterDateChange', function (event, args) {
      var data = args.any;
      $scope.fromDate = data.fromDate;
      $scope.toDate = data.toDate;
      $scope.defaultFilter = data.defaultFilter;
      $scope.filter = data.label;

      loadData();
      $rootScope.$broadcast('globalFilterDateChangeSuccess');
    });

    // DatNT38 - Remove date filter
    $scope.removeFilter = function (type) {
      $scope.fromDate = new Date(1, 1, 1900);
      $scope.toDate = new Date();
      $scope.defaultFilter = "year";
      $scope.filter = "All";
      $scope.showDropdown = false;
      loadData();
      $(".range_filter").find('.start-date:first').removeClass('start-date');
    }

    $scope.removeSpace = function (str) {
      if (str) {
        return str.replace(/ /gi, '');
      }
      var currentDate = new Date();
      return currentDate.getFullYear() + '' + currentDate.getMonth() + '' + currentDate.getDate() + '' + currentDate.getHours() + '' + currentDate.getMinutes() + '' + currentDate.getSeconds() + currentDate.getMilliseconds();
    }

      $scope.vewAllTranslatedLanguages = function () {


          $('#ModalAllTranslatedLanguages').modal('show');
          
          
      }

      // Close View more popup
      $scope.closeViewAllTranslatedLanguages = function () {
          $('#ModalAllTranslatedLanguages').modal('hide');
      }
      $scope.vewAllUserLocations = function () {


          $('#ModalAllUsersLocations').modal('show');
          
          
      }

      // Close View more popup
      $scope.closeViewAllUsersLocations = function () {
          $('#ModalAllUsersLocations').modal('hide');
      }
      $scope.vewAllTranslatedLocations = function () {


          $('#ModalAllnKnowledgeLocations').modal('show');
          
          
      }

      // Close View more popup
      $scope.closeViewAllnKnowledgeLocations = function () {
          $('#ModalAllnKnowledgeLocations').modal('hide');
      }

        function ApplyLocationTypeFilter(t) {
            $scope.selectedLocationType = t;
            $scope.locationResponse = [];
            if ($scope.selectedLocationType != "0") {
                for (var i = 0; $scope.data[0].topTenKnowledgeLocationResponse != null && i < $scope.data[0].topTenKnowledgeLocationResponse.length; i++) {
                    if ($scope.data[0].topTenKnowledgeLocationResponse[i].locationType == $scope.selectedLocationType) {
                        $scope.locationResponse.push($scope.data[0].topTenKnowledgeLocationResponse[i]);
                    }
                }

            }
            else {
                $scope.locationResponse = $scope.data[0].topTenKnowledgeLocationResponse;
            }
      }


      $scope.topTenUserLocation = [];
      vm.userLocation = [];
      vm.translatedLanguages = [];
      vm.KnowledgeLocation = [];
      vm.translationEngement=[];
      vm.totalEngagement = [];

      $scope.exportExcel = function () {

         $scope.knowledgeChartResponses =  $scope.data[0].knowledgeChartResponses;
         $scope.shareExperienceChartResponses =  $scope.data[0].shareExperienceChartResponses;
        // $scope.totalEngagement =  $scope.data[0].knowledgeChartResponses;

          $scope.topTenKnowledgeLocation = $scope.data[0].allKnowledgeLocationResponse;
          $scope.topTenUserLocation = $scope.data[0]. allUsersLocationResponse
          $scope.topTenLanguagesResponse = $scope.data[0].allLanguagesResponse;

          vm.timeDistance = []
          vm.translationEngements = [];
          vm.userLocation = [];
          vm.translatedLanguages = [];
          vm.KnowledgeLocation = [];
          vm.translationEngement=[];
          vm.totalEngagement = [];
          
          $scope.knowledgeChartResponses.forEach(function(data){
            vm.timeDistance.push(data.timeDistance)
            })

           for(var i = 0; i < vm.timeDistance.length; i++){
             vm.translationEngements.push({"Selected Time Distance": vm.timeDistance[i] , "Total Knowledge Translated": $scope.knowledgeChartResponses[i].count , "Total Shared Experience Translated":  $scope.shareExperienceChartResponses[i].count , "Total Translation Engagements": $scope.knowledgeChartResponses[i].count + $scope.shareExperienceChartResponses[i].count})
           }

           if($scope.topTenLanguagesResponse.length > 0){
              $scope.topTenLanguagesResponse.forEach(function(data){
                vm.translatedLanguages.push({"Language": data.languageName , "Total Translation": data.translationCount})
      
              });
           }
           else{
            vm.translatedLanguages.push({"Language": "" , "Total Translation": ""})
           }
          

          if($scope.topTenUserLocation.length > 0){
            $scope.topTenUserLocation.forEach(function(data){
              vm.userLocation.push({"User Location": data.locationName , "Total Translation": data.translationCount})
    
            })
          }
          else{
             vm.userLocation.push({"User Location": "" , "Total Translation": ""})
          } 
         
          if($scope.topTenKnowledgeLocation.length > 0){
            $scope.topTenKnowledgeLocation.forEach(function(data){
              vm.KnowledgeLocation.push({"Language": data.locationName , "Total Translation": data.translationCount})
    
            })
          }
          else{
            vm.KnowledgeLocation.push({"Language": "" , "Total Translation": ""})
          }
       
        
  
          // var mystyle = {
          //   headers: true,
          //   autoWidth: false,
          //   columns: [
          //     { title: 'Collection Name', width: 300 },
          //     { title: 'Views', width: 300 },
          //     { title: 'Likes', width: 200 },
          //     { title: 'Shares', width: 250 },
          //     { title: 'Save', width: 230 }
          //   ],
          // };

          var totalTranslationEngagement = vm.translationEngements;
          var topTenUserLocation = vm.userLocation;
          var topTenLanguagesResponse = vm.translatedLanguages;
          var topTenKnowledgeLocations = vm.KnowledgeLocation;
          var opts = [
            {
              sheetid: 'Total Translation Engagements',
              headers: true
            },
            {
              sheetid: 'Total Translated Languages',
              headers: true
            },
            {
            sheetid: 'Total Translator User Locations',
            headers: true
            },
            {
              sheetid: 'Total Knowledge Locations (' + $scope.locationType[$scope.selectedLocationType].Name + ')',
              headers: true
              }
          
        ];
          var res = alasql('SELECT INTO XLSX("TranslationEngagement.xlsx",?) FROM ?', [opts, [totalTranslationEngagement,topTenLanguagesResponse, topTenUserLocation , topTenKnowledgeLocations]]);
      
  
      }
  }
})();
