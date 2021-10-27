(function () {
  'use strict';

  angular
    .module('app.expertInterview')
    .controller('ExpertInterviewAddProfileController', ExpertInterviewAddProfileController);

  /** @ngInject */
  function ExpertInterviewAddProfileController($scope, ExpertInterviewApi, $timeout, UserProfileApi, Utils, appConfig, $state, $stateParams, SearchApi) {
    var vm = this;

    $scope.ExpertProfile = {
      idExpertInterview: $stateParams.id,
      title: null,
      userProfileId: '',
      name: '',
      positionName: '',
      opu: '',
      emailAddress: '',
      yearInPetronas: '',
      quotes: '',
      officeAddress1: '',
      officeAddress2: '',
      postCode: '',
      city: '',
      countryId: '',
      stateId: '',
      academicBackground: [
        {
          certificateId: '',
          majorCourse: '',
          institution: ''
        }
      ],
      workingExperiences: [
        {
          position: '',
          company: '',
          start: '',
          end: '',
          jobDescription: ''
        }
      ]
    };

    $scope.CoverImage = {
      result: '/assets/images/NoAvatar.jpg',
    };

    $scope.arrState = [];
    $scope.arrCertificate = [];
    $scope.DisplayName = '';


    $scope.CountrySource = {
      dataTextField: "locationName",
      dataValueField: "id",
      filter: "contains",
      minLength: 0,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            if ($scope.ExpertProfile.countryId > 0 && (SearchText == null || SearchText.trim().length <= 0)) {
              $scope.ExpertProfile.countryId = '';
              $scope.arrState = [];
            }
            return SearchApi.searchCountry(options);
          }
        }
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
        });
      }
    };

    $scope.onSelectCountry = function(e) {
      var index = _.findIndex($scope.ExpertProfile.countryName, function (obj) { return obj.name == e.dataItem.locationName });
      if (index == -1) {
        $scope.ExpertProfile.countryName = e.dataItem.locationName;
        $scope.ExpertProfile.countryId = e.dataItem.id;
        loadStateByCountry();
      }
    };

    $timeout(function () {
      var control = $scope.CountryAutoComplete;
      var autocompleteInput = control.element;
      autocompleteInput.on('click', function (e) {
        control.search('');
      });
    }, 1000);

    function loadStateByCountry() {
      var countryName = $scope.ExpertProfile.countryName;
      $scope.arrState = [];
      if (countryName == "Malaysia" || countryName == "malaysia") {
        var countryId = $scope.ExpertProfile.countryId;
        ExpertInterviewApi.getStateByCountry(countryId).then(function (response) {
          $scope.arrState = response;
        }, function (error) {
          console.log(error);
        });
      }
    }

    function _onInit() {
      ExpertInterviewApi.api.GetCertificate.save().$promise.then(function (res) {
        $scope.arrCertificate = res;
      });

      //get current year
      var currentYear = (new Date()).getFullYear();
      $scope.startyear = 1993;
      $scope.allYear = [1993];
      for (var i = 0; i < (currentYear - 1993); i++) {
        $scope.startyear++;
        $scope.allYear.push($scope.startyear);
      }

      if ($stateParams.id) {
        ExpertInterviewApi.buildExpertInterview($stateParams.id).then(function (res) {
          $scope.ExpertProfile.id = res.id;
          $scope.ExpertProfile.idExpertInterview = res.id;
          $scope.ExpertProfile.title = res.title;

          if (res.smeUserId) {
            var event = {
              dataItem: {
                userId: res.smeUserId,
                displayName: res.smeUserDisplayName
              }
            };
            _onSelect(event);
          }
          if (res.countryId) {
            var currentCountry = {
              dataItem: {
                id: res.countryId,
                locationName: res.countryName
              }
            };
            $scope.onSelectCountry(currentCountry);
          }
          if (res.stateId) {
            $scope.ExpertProfile.stateId = res.stateId;
          }
        });
      }
    }
    _onInit();

    function _onSelect(e) {
      var index = _.findIndex($scope.DisplayName, function (obj) { return obj.name == e.dataItem.displayName });
      if (index == -1) {
        $scope.DisplayName = e.dataItem.displayName;
        $scope.ExpertProfile.name = e.dataItem.displayName;
        $scope.ExpertProfile.userProfileId = e.dataItem.userId;
        ExpertInterviewApi.GetExpertProfileInfo(e.dataItem.userId).then(function (res) {
          $scope.ExpertProfile.positionName = res.positionName;
          $scope.ExpertProfile.quotes = res.quotes;
          $scope.ExpertProfile.opu = res.opu;
          $scope.ExpertProfile.emailAddress = res.emailAddress;
          $scope.ExpertProfile.yearInPetronas = res.yearInPetronas;
          $scope.ExpertProfile.officeAddress1 = res.officeAddress1;
          $scope.ExpertProfile.officeAddress2 = res.officeAddress2;
          $scope.ExpertProfile.postCode = res.postCode;
          $scope.ExpertProfile.city = res.city;

          $scope.CoverImage = {
            result: res.userImageUrl,
          };

          if (res.stateId)
            res.stateId = res.stateId.toString();
          $scope.ExpertProfile.stateId = res.stateId;

          if (res.countryId)
            res.countryId = res.countryId.toString();
          $scope.ExpertProfile.countryId = res.countryId;

          if (res.academicBackground && res.academicBackground.length > 0) {
            res.academicBackground = _.map(res.academicBackground, function (i) {
              i.certificateId = i.certificateId.toString();
              return i;
            });
          }
          $scope.ExpertProfile.academicBackground = res.academicBackground;

          //if (res.workingExperiences && res.workingExperiences.length > 0) {
          //  res.workingExperiences = _.map(res.workingExperiences, function (i) {
          //    if (i.start)
          //      i.start = i.start.toString();
          //    if (i.end)
          //      i.end = i.end.toString();
          //    return i;
          //  });
          //}
          $scope.ExpertProfile.workingExperiences = res.workingExperiences;
        });
      }
    };
    $scope.onSelect = _onSelect;

    $scope.userName = {
      dataTextField: "displayName",
      dataValueField: "userId",
      filter: "contains",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return ExpertInterviewApi.searchUser(options, $scope.DisplayName);
          }
        },
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
        });
      },
    };

    $scope.submit = function () {
    
      var postData = angular.copy($scope.ExpertProfile);
      postData.stateId = parseInt(postData.stateId);
      postData.countryId = parseInt(postData.countryId);
      ExpertInterviewApi.api.submitExpertProfile.save(postData).$promise.then(
        function (res) {
          $('#addExpert').modal('show');
        }, function error(err) {
          logger.error(err.data.errorMessage);
        });
    };

    $scope.doneSubmit = function () {
      $('#addExpert').modal('hide');
        $timeout(function(){
          $state.go('appAdmin.expertInterviewManagement');
      }, 500);
    }

    $scope.addNewAcademicBackground = function () {
      $scope.ExpertProfile.academicBackground.push(
        {
          certificate: '',
          majorCourse: '',
          institution: ''
        }
      );
    };

    $scope.removeAcademicBackground = function (index) {
      if (index > -1 && $scope.ExpertProfile.academicBackground.length > 1) {
        $scope.ExpertProfile.academicBackground.splice(index, 1);
      }
    };

    $scope.addNewWorkingExperiencs = function () {
      $scope.ExpertProfile.workingExperiences.push(
        {
          position: '',
          company: '',
          start: '',
          end: '',
          jobDescription: ''
        }
      );
    };

    $scope.removeWorkingExperiencs = function (index) {
      if (index > -1 && $scope.ExpertProfile.workingExperiences.length > 1) {
        $scope.ExpertProfile.workingExperiences.splice(index, 1);
      }
    };

    $scope.optUploadPhoto = {
      multiple: false,
      // validation: { allowedExtensions: ['jpg', 'png'], maxFileSize: 10485760 },
      // async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
      showFileList: false
    };

    $scope.Upload = function (e) {
      for (var i = 0; i < e.files.length; i++) {
        var obj = Utils.validateFile(e.files[i], appConfig.allowImageExtension);
        if (obj.extension && obj.size) {
          var file = e.files[i].rawFile;
          if (file) {
            var fd = new FormData();
            fd.append("attachment", file);
            UserProfileApi.uploadAvartar(fd, $scope.ExpertProfile.userProfileId).then(function (res) {
              $scope.CoverImage = {
                result: Utils.getImage('avatar', res.id) + '?rd=' + Math.random(),
                id: res.id,
                name: res.name,
                size: res.size,
                isAttachment: false
              };
            });
          }
        } else {
          logger.error('Invalid file.')
        }
      }
    };

    $scope.Preview = function () {
      window.open('/expert-interview/' + $scope.ExpertProfile.idExpertInterview, '_blank');
    };

  }
})();
