(function () {
  'use strict';

  angular
    .module('app.myAccount')
    .controller('MyAccountUserController', MyAccountUserController);

  /** @ngInject */
  function MyAccountUserController($state, $rootScope, $scope, $timeout, UserProfileApi, SearchApi, Utils, KnowledgeDiscoveryApi, InsightsCommonService, $filter, appConfig, LeaderboardApi , profileAPI) {
    $scope.skip = null;
    $scope.currentUserId = 0;
    $scope.skipCollectionDialog = null;
    $scope.skipIdeaDialog = null;
    $scope.skipShareDocumentDialog = null;
    $scope.skipWorkingProjectDialog = null;

    $scope.collectionPrevioursSharing = null;
    $scope.ideaPrevioursSharing = null;
    $scope.shareDocumentPrevioursSharing = null;
    $scope.workingProjectPrevioursSharing = null;

    $scope.currentUserConfig = null;

    $rootScope.$state = $state;
    
    $scope.hihihihi = function () {
      console.log('hihi');
    };
    $scope.CountStatus = {
      totalPendingAction: 0,
      totalPendingValidation: 0,
      totalPendingEndorsement: 0,
      totalMembershipRequest : 0
  };
    // $scope.hasDisciplines = false;
    var location = {};

    $scope.UserRank = {};

    $scope.dataMyLevel = null;
    $scope.dataMyEarnedBadges = null;
    $scope.arrClassBadge = appConfig.arrClassBadge;

    function getNotificationCount() {
      profileAPI.getPendingActionsCount().then(function (data) {
        $scope.CountStatus = data;
      });
      };
    getNotificationCount();
    // Load My Level
    function getMyLevel() {
      LeaderboardApi.getMyLevel().then(function (data) {
        if (data != null) {
          $scope.dataMyLevel = data;
        }
      }, function (error) {
        console.log(error);
      });
    }
    getMyLevel();

    function getMyEarnedBadges() {
      LeaderboardApi.getMyEarnedBadges().then(function (data) {
        if (data != null) {
          $scope.dataMyEarnedBadges = data;
        }
      }, function (error) {
        console.log(error);
      });
    }
    getMyEarnedBadges();

    $scope.setBadgeClassName = function (index) {
      if (index < $scope.arrClassBadge.length) {
        return $scope.arrClassBadge[index];
      } else {
        var tempIndex = index - $scope.arrClassBadge.length;
        return $scope.arrClassBadge[tempIndex];
      }
    }

    UserProfileApi.getRank().then(function (data) {
      $scope.UserRank = data;
    });

    function setUserConfig() {
      var userConfig = UserProfileApi.getUserInfo();
      if (userConfig != null && userConfig.userAppConfiguration != null) {
        $scope.currentUserId = userConfig.userId;
        $scope.skipCollectionDialog = !userConfig.userAppConfiguration.isShowAddRemoveDialog;
        $scope.skipIdeaDialog = userConfig.userAppConfiguration.skipIdeaDialog;
        $scope.skipShareDocumentDialog = userConfig.userAppConfiguration.skipShareDocumentDialog;
        $scope.skipWorkingProjectDialog = userConfig.userAppConfiguration.skipWorkingProjectDialog;
      }
    }
    setUserConfig();
    function buildPreviousSharingMessage(department, cop, email) {
      var strArr = [];
      if (department != null && department.trim() != '') {
        strArr.push(department);
      }
      if (cop != null && cop.trim() != '') {
        strArr.push(cop);
      }
      var result = strArr.join(', ');
      if (result.length <= 0) {
        result += email;
      } else {
        result += ' and  ' + email;
      }
      return result;
    }
    function getPreviousSharing() {
      $scope.collectionPrevioursSharing = null;
      $scope.ideaPrevioursSharing = null;
      $scope.shareDocumentPrevioursSharing = null;
      $scope.workingProjectPrevioursSharing = null;
      UserProfileApi.getPreviousInfor($scope.currentUserId).then(function (data) {
        if (data != null && data.length > 0) {
          _.each(data, function (c, cIndex) {
            switch (c.skip) {
              case 'SkipCollectionDialog': {
                if ($scope.skipCollectionDialog) {
                  $scope.collectionPrevioursSharing = buildPreviousSharingMessage(c.department, c.cop, c.email);
                }
                break
              }
              case 'SkipIdeaDialog': {
                if ($scope.skipIdeaDialog) {
                  $scope.ideaPrevioursSharing = buildPreviousSharingMessage(c.department, c.cop, c.email);
                }
                break
              }
              case 'SkipShareDocumentDialog': {
                if ($scope.skipShareDocumentDialog) {
                  $scope.shareDocumentPrevioursSharing = buildPreviousSharingMessage(c.department, c.cop, c.email);
                }
                break
              }
              case 'SkipWorkingProjectDialog': {
                if ($scope.skipWorkingProjectDialog) {
                  $scope.workingProjectPrevioursSharing = buildPreviousSharingMessage(c.department, c.cop, c.email);
                }
                break
              }
              default:
            }
          });
        }
      }, function (err) {
        console.log(err);
      });
    }
    $('#ResetConfig').on('shown.bs.modal', function () {
      getPreviousSharing();
    });

    $scope.editUserInfo = null;
    
    UserProfileApi.getProfile().then(function (data) {

      if (data != null && data.userAppConfiguration != null) {
        $scope.currentUserConfig = data.userAppConfiguration;
      }

      $rootScope.userInfo = $.extend({}, $rootScope.userInfo, data);
      $scope.editUserInfo = angular.copy($rootScope.userInfo);
      if ($scope.editUserInfo.nickName == null || $scope.editUserInfo.nickName == '' ||
        $scope.editUserInfo.nickName == "null") {
        $scope.editUserInfo.nickName = "";
      }
      if ($scope.editUserInfo.tel == null || $scope.editUserInfo.tel == '' ||
        $scope.editUserInfo.tel == "null") {
        $scope.editUserInfo.tel = "";
      }
      if (data != undefined && data != null) {
        // $scope.hasDisciplines = $rootScope.userInfo.userDisciplines && $rootScope.userInfo.userDisciplines.length > 0;
        location = { id: data.locationId, title: data.location };
        $scope.profileImage['result'] = Utils.getImage('avatar', data.userId);
      }
    });

    $scope.optLocation = {
      dataTextField: "title",
      dataValueField: "id",
      filter: "contains",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            return SearchApi.searchLocation(options);
          }
        },
        group: { field: "group" }
      },
      open: function (e) {
        $timeout(function () {
          e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
        });
      },
      select: function (e) {
        location = e.dataItem;
      }
    };

    $scope.profileImage = {};
    $scope.optUploadPhoto = {
      multiple: false,
      localization: {
        dropFilesHere: "<i class='icon-drop'></i><br>Drag and drop files here to upload",
        select: 'or select file to upload...'
      },
      validation: { allowedExtensions: ['jpg', 'png'], maxFileSize: 10485760 },
      async: { saveUrl: 'save', removeUrl: 'remove', autoUpload: true },
      showFileList: false
    };

    $scope.Upload = function (e) {
      for (var i = 0; i < e.files.length; i++) {
        var file = e.files[i].rawFile;
        if (file) {
          var fd = new FormData();
          fd.append("attachment", file);
          UserProfileApi.uploadAvartar(fd).then(function (res) {
            $scope.profileImage = {
              result: Utils.getImage('avatar', res.id) + '?rd=' + Math.random(),
              id: res.id,
              name: res.name,
              size: res.size,
              isAttachment: false
            };
            $rootScope.userInfo.imageUrl = $scope.profileImage.result;
            UserProfileApi.saveUserInfo($rootScope.userInfo);
          });
        }
      }
    };

    $scope.Submit = function (event) {
      var postData = {
        NickName: $scope.editUserInfo.nickName,
        Tel: $scope.editUserInfo.tel,
        SkillExpertise: $scope.editUserInfo.skillExpertise,
        location: !_.isEmpty(location) ? location.id : undefined,
        UserDisciplines: []
      };

      $scope.$broadcast('Submit', {
        Set: function (path, value) {
          _.set(postData, path, value);
        }
      });

      _.forEach($scope.editUserInfo.userDisciplines, function (item) {
        if (!item.subdisciplines || item.subdisciplines.length == 0) {
          postData.UserDisciplines.push({ DisciplineId: item.disciplineId });
        } else {
          _.forEach(item.subdisciplines, function (o) {
            postData.UserDisciplines.push({ DisciplineId: item.disciplineId, SubdisciplineId: o.subdisciplineId });
          });
        }
      });

      UserProfileApi.editUserProfile(postData).then(function (data) {
        if (data != null && data.nickName != '') {
          $rootScope.userInfo.nickName = data.nickName;
          $rootScope.userInfo.tel = data.tel;
          $rootScope.userInfo.skillExpertise = data.skillExpertise;
          $rootScope.userInfo.imageUrl += '?rd=' + Math.random();
          $rootScope.userInfo.location = data.location;
          $rootScope.userInfo.locationId = data.locationId;
          $rootScope.userInfo.skills = data.skills;
          $rootScope.userInfo.areaOfExpertises = data.areaOfExpertises;
          $rootScope.userInfo.experiences = data.experiences;
          $rootScope.userInfo.cops = data.cops;
          $rootScope.userInfo.userDisciplines = angular.copy(data.userDisciplines);
          console.log(data);

          UserProfileApi.saveUserInfo($rootScope.userInfo);
          $('#editUserInfo').modal('hide');
        }
      });
    }

    $scope.Prevent = function (e) {
      e.preventDefault();
    };

    $scope.SubDiscipline = {};
    $scope.ParentId = null;

    // $scope.optCop = {
    //     dataTextField: "ExpertName",
    //     dataValueField: "ExpertID",
    //     valueTemplate: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
    //     template: '<span class="dd_expert_list"><img data-ng-src="{{dataItem.ExpertPhoto?dataItem.ExpertPhoto:\'/assets/images/NoAvatar.jpg\'}}" alt="{{dataItem.ExpertName}}" onerror="this.src=\'/assets/images/NoAvatar.jpg\'"><strong>{{dataItem.ExpertName}}</strong><small>{{dataItem.Position}}</small></span>',
    //     optionLabelTemplate: '<span class="dd_expert_list"><strong>Assign approver</strong></span>',
    //     dataSource: new kendo.data.DataSource({
    //         data: {
    //             'experts': []
    //         },
    //         schema: {
    //             data: 'experts'
    //         }
    //     }),
    //     open: function (e) {
    //         setTimeout(function () {
    //             e.sender.list.closest('.k-animation-container').addClass('dd_expert_container');
    //         });
    //     },
    //     height: 300
    // };

    $scope.SourceDisciplines = {
      dataTextField: "Text",
      dataValueField: "Id",
      minLength: 1,
      delay: 500,
      dataSource: {
        serverFiltering: true,
        transport: {
          read: function (options) {
            var filters = [];
            if ($scope.ParentId == null) {
              filters = _.map($scope.editUserInfo.userDisciplines, 'disciplineId');
            } else {
              try {
                filters = _.map(_.head(_.filter($scope.editUserInfo.userDisciplines, ['disciplineId', $scope.ParentId])).subdisciplines, 'subdisciplineId');
              } catch (ex) { }
            }
            return KnowledgeDiscoveryApi.getDiscipline(options, $scope.ParentId  ,filters,"en");
          }
        }
      }
    };

    $scope.onOpenDisciplines = function (e) {
      $timeout(function () {
        e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
      });
    };

    $scope.onSelectDisciplines = function (e) {
      $scope.NewDiscipline = '';
      $scope.IsNew = false;

      if (e.dataItem.ParentId == null) {
        $scope.editUserInfo.userDisciplines.push({
          disciplineId: e.dataItem.Id,
          disciplineName: e.dataItem.Text,
          subdisciplines: []
        });
        $timeout(function () {
          $scope.NewDiscipline = "";
          var last = $scope.editUserInfo.userDisciplines.length;
          $scope.Toggle(last - 1);
        });

      } else {
        var idx = _.indexOf(_.map($scope.editUserInfo.userDisciplines, function (o, idx) { return o.disciplineId; }), e.dataItem.ParentId);
        var current = _.get($scope.editUserInfo.userDisciplines, '[' + idx + '].subdisciplines') || [];
        current.push({
          subdisciplineName: e.dataItem.Text,
          subdisciplineId: e.dataItem.Id
        });
        _.set($scope.editUserInfo.userDisciplines, '[' + idx + '].subdisciplines', current);
        $timeout(function () {
          var parent = _.get($scope.editUserInfo.userDisciplines, '[' + idx + ']');
          $scope.SubDiscipline[parent.disciplineId] = "";
        });
      }
      // $scope.hasDisciplines = $scope.editUserInfo.userDisciplines && $scope.editUserInfo.userDisciplines.length > 0;
    };

    $scope.Toggle = function (idx) {
      _.forEach($scope.editUserInfo.userDisciplines, function (o) {
        o.isExpand = false;
      });
      $scope.IsNew = false;
      $scope.ParentId = _.get($scope.editUserInfo.userDisciplines, '[' + idx + '].disciplineId');
    };

    $scope.Remove = function (idx, rootId) {
      if (rootId === null) {
        $scope.editUserInfo.userDisciplines.splice(idx, 1);
      }
      else {
        _.forEach($scope.editUserInfo.userDisciplines, function (o) {
          _.remove(o.subdisciplines, function (o1, index) {
            return index == idx;
          })
        });
      }

      // $scope.hasDisciplines = $scope.editUserInfo.userDisciplines && $scope.editUserInfo.userDisciplines.length > 0;
    };

    $scope.flagShowHideMoreDetails = true;
    $scope.showHideMoreDetails = function () {
      $scope.flagShowHideMoreDetails = !$scope.flagShowHideMoreDetails;
    }

    $scope.ResetSkipForConfirm = function () {
      UserProfileApi.resetSkipForConfirm($scope.editUserInfo.userId, $scope.skipCollectionDialog, $scope.skipIdeaDialog, $scope.skipShareDocumentDialog, $scope.skipWorkingProjectDialog).then(function (data) {
        if (data != null) {
          $rootScope.userInfo.userAppConfiguration.isShowAddRemoveDialog = data.isShowAddRemoveDialog;
          $rootScope.userInfo.userAppConfiguration.skipIdeaDialog = data.skipIdeaDialog;
          $rootScope.userInfo.userAppConfiguration.skipShareDocumentDialog = data.skipShareDocumentDialog;
          $rootScope.userInfo.userAppConfiguration.skipWorkingProjectDialog = data.skipWorkingProjectDialog;

          UserProfileApi.saveUserInfo($rootScope.userInfo);
          logger.success('Save success!', 'SKILL');
          $('#ResetConfig').modal('hide');
        } else {
          logger.error('Save failed!', 'SKILL');
        }
      }, function error() {
        setUserConfig();
      });
    }
    $scope.applyFilter = function (typeId, obj) {
      var filter = {
        Disciplines: [],
        Subdisciplines: [],
        Skills: [],
        AreaOfExpertises: [],
        Experiences: []
      }

      if (obj) {

        switch (typeId) {
          case 1: {
            // Disciplines = 1
            filter.Disciplines.push({
              name: obj.disciplineName,
              id: obj.disciplineId
            });
            break;
          }
          case 2: {
            // Sub Disciplines = 2
            filter.Subdisciplines.push({
              name: obj.subdisciplineName,
              id: obj.subdisciplineId
            });
            break;
          }
          case 3: {
            // Area of Expertise = 3
            filter.AreaOfExpertises.push({
              name: obj.name,
              id: obj.id
            });
            break;
          }
          case 4: {
            // Skill = 4
            filter.Skills.push({
              name: obj.name,
              id: obj.id
            });
            break;
          }
          case 5: {
            // Experience = 5
            filter.Experiences.push({
              name: obj.name,
              id: obj.id
            });
            break;
          }
          default:
        }
      }
      InsightsCommonService.applyFilter(
        $filter('date')($scope.fromDate, "yyyy-MM-dd"),
        $filter('date')($scope.toDate, "yyyy-MM-dd"),
        null,
        filter,
        "app.expertDirectory"
      );
    }
  }
})();
