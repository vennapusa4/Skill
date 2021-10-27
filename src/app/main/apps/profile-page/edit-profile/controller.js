(function () {
  'use strict';

  angular
      .module('app.ProfilePage')
      .controller('EditProfileController', EditProfileController);

  /** @ngInject */
  function EditProfileController($scope,searchPageAPI ,$location, $rootScope, CommonApi, CoPDirectoryAPI, KnowledgeDocumentApi,profileAPI, Utils, SearchApi, KnowledgeDiscoveryApi, UserProfileApi, LandingPageAPI, appConfig, $timeout,$state , $stateParams) {
      var vm = this;
      $scope.editUserInfo = null;
      $scope.SubDiscipline = {};
      $scope.ParentId = null;
      $scope.selectedViewSubscription = 'interest';
      $scope.firstRow = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      $scope.secondRow = ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
      $scope.firstRowInterest = [];
      $scope.secondRowInterest = [];
      $scope.pageShow = 'editDetails';
      vm.userInfo;
      vm.alphabet;
      vm.cops = [];
      $scope.directory = [];
      vm.newarray = [];
      $scope.sortedArray = [];
      $scope.subscriptions = [];
      $scope.subscriptionsCOP = [];
      $scope.subscriptionsInterest = [];

      var location = {};
      $scope.disabled = false;
      // for people tags
      $scope.peopleSearchTag = [
        { "name": "All", "value": "All", "selected": false },
        { "name": "SME", "value": "SME", "selected": false },
        { "name": "With Expert interview", "value": "With Expert interview", "selected": false },
        { "name": "People I Follow", "value": "People I Follow", "selected": true }
      ];
      $scope.listSortBy = [
            
        {
            id: 15,
            name : 'Latest Contributor'
          },
        {
          id: 10,
          name : 'Highest Contributor'
        },
        {
          id: 11,
          name : 'Highest Value Contributor'
        },
        {
          id: 12,
          name : 'Highest Validator'
        },
        {
          id: 13,
          name : 'Highest Replicator'
        },
        {
          id: 14,
          name : 'Highest Rank'
        },
        // {
        //   id: 16,
        //   name : 'Most Active'
        // },
        {
          id: 17,
          name : 'Most Popular'
        },
        {
          id: 18,
          name : 'A to Z'
        },
        {
          id: 19,
          name : 'Z to A'
        },
      ];
      $scope.isGridView = false;
      $scope.listAllPeoples = null;
      $scope.category = [];

      if($location.hash() == 'interest') {
        $('li[role="presentation"]:first-child').removeClass('active');
        $('li[role="presentation"]:last-child').addClass('active');
        $('#edit-profile').removeClass('active');
        $('#subscription').addClass('active');
        $scope.selectedViewSubscription = 'interest';
      }
      if($location.hash() == 'cop') {
        $('li[role="presentation"]:first-child').removeClass('active');
        $('li[role="presentation"]:last-child').addClass('active');
        $('#edit-profile').removeClass('active');
        $('#subscription').addClass('active');
        $scope.selectedViewSubscription = 'cop';
      }

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
          location = { id: data.locationId, title: data.location };
          $scope.profileImage['result'] = Utils.getImage('avatar', data.userId);
        }

        KnowledgeDocumentApi.getMyDisciplines("", 0, 50).then(function (data) {
          $scope.editUserInfo['interest'] = data;
        })
      });
      CoPDirectoryAPI.GetCoPDirectory().then(function (res) {
        res.sort(function(a, b){
          return a.copName.toLowerCase().localeCompare(b.copName.toLowerCase());
        }).forEach(function (cop) {
          $scope.directory.push(cop);
        });

        $scope.directory.forEach(function (cop) {
          vm.cops.push(cop);
        });
        
        for(var i =0 ; i < $scope.directory.length;i++){
          vm.alphabet = $scope.directory[i].copName.charAt(0);
          $scope.sortedArray = [];
          for(var j=vm.cops.length ; j > 0 ; j--){
            if(vm.cops.length != 0){
              if(vm.alphabet.toUpperCase() == vm.cops[0].copName.charAt(0).toUpperCase()){
                $scope.sortedArray.push(vm.cops[0]);
                vm.cops.splice(0 , 1);
              }
            }
          }
          if($scope.sortedArray.length != 0){
            vm.newarray.push({"alphabet": vm.alphabet , "cops": $scope.sortedArray});
          }
        
        }
        $scope.checker = Math.ceil(vm.newarray.length / 2);

        $scope.firstRow = vm.newarray.slice(0, $scope.checker + 1);
        $scope.secondRow = vm.newarray.slice($scope.checker + 1, ($scope.checker * 2));
    

      });

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
      };
  
      $scope.Toggle = function (idx) {
        _.forEach($scope.editUserInfo.userDisciplines, function (o) {
          o.isExpand = false;
        });
        $scope.IsNew = false;
        $scope.ParentId = _.get($scope.editUserInfo.userDisciplines, '[' + idx + '].disciplineId');
      };

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
              $('#editAvatar').modal('hide');
            });
          }
        }
      };

      $scope.Submit = function (event) {
        $scope.disabled = true;
        var postData = {
          NickName: $scope.editUserInfo.nickName,
          Tel: $scope.editUserInfo.tel,
          SkillExpertise: $scope.editUserInfo.skillExpertise,
          location: !_.isEmpty(location) ? location.id : undefined,
          divisionId: $scope.editUserInfo.divisionId,
          departmentId: $scope.editUserInfo.departmentId,
          divisionName: $scope.editUserInfo.divisionName,
          departmentName: $scope.editUserInfo.departmentName,
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
            localStorage.setItem("nickName", data.nickName);

            $rootScope.userInfo.nickName = data.nickName;
            $rootScope.userInfo.tel = data.tel;
            $rootScope.userInfo.skillExpertise = data.skillExpertise;
            $rootScope.userInfo.imageUrl += '?rd=' + Math.random();
            $rootScope.userInfo.location = data.location;
            $rootScope.userInfo.locationId = data.locationId;
            $rootScope.userInfo.skills = data.skills;
            $rootScope.userInfo.areaOfExpertises = data.areaOfExpertises;
            $rootScope.userInfo.experiences = data.experiences;
            $rootScope.userInfo.divisions = data.divisions;
            $rootScope.userInfo.departments = data.departments;
            $rootScope.userInfo.cops = data.cops;
            $rootScope.userInfo.userDisciplines = angular.copy(data.userDisciplines);
  
           
            UserProfileApi.saveUserInfo($rootScope.userInfo);
          }
          logger.success("Profile Update successfully!");
          $scope.disabled = false;
        }).catch(function(e){
          console.log(e);
          $scope.disabled = false;
          logger.error(e.data.errorMessage);
        });
      }

      $scope.Prevent = function (e) {
        e.preventDefault();
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

      vm.handleChangPage = function(page){
        getDataForGridView(page)
    } 
      $scope.requestToSubscribeInterest = function(copID){
        var idsPost = [];

        $scope.editUserInfo.interest.forEach(function(element) {
          idsPost.push(element.id);
        })

        idsPost.push(copID);

        var postData = { ids: idsPost };
        KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {

          if (data.result == true) {
           // requestToUnSubscribe(copID);
            updateSubscription(copID);
                $scope.$emit('updatingInterest' , vm.userInfo.userId);
            } else {
              console.log('failed');
            }
        });
      };
      $scope.$on('successFollow', function (event, data){
        updateSubscription(data);
        $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
      })
      $scope.requestToUnsubscribeInterest = function(copID){
        var idsPost = [];

        $scope.editUserInfo.interest.forEach(function(element) {
          if(element.id != copID) {
            idsPost.push(element.id);
          }
        })
        var postData = { ids: idsPost };
        KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {

          if (data.result == true) {
            //requestToUnSubscribe(copID);
              updateSubscription(copID);
                $scope.$emit('updatingInterest' , vm.userInfo.userId);
            } else {
              console.log('failed');
            }
        });
      };
      $scope.requestToSubscribe = function(copID){
        $scope.userInfo = UserProfileApi.getUserInfo(); 
  
        $scope.postData = {
          userId : $scope.userInfo.userId,
          copId: copID.copId+""
         }
  
        LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
          updateSubscription(copID.id);
          $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
         },function (error) {
           logger.error(error);
         });
      };
  
      $scope.requestToUnSubscribe = function(copID){
        $scope.userInfo = UserProfileApi.getUserInfo(); 
        
        $scope.postData = {
          requesterId : $scope.userInfo.userId,
          copId: copID.copId,
          channelName : "General"
         }
  
         profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
          updateSubscription(copID.id);
          $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
        },function (error) {
          logger.error(error);
        });
        
      };
      $scope.optDivision = {
        dataTextField: "name",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        delay: 500,
        dataSource: {
          serverFiltering: true,
          transport: {
            read: function (options) {
                return SearchApi.searchDivision(options);
            }
          },
          // group: { field: "group" }
        },
        open: function (e) {
          $timeout(function () {
            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
          });
        },
        select: function (e) {
         $scope.editUserInfo.divisionId = e.dataItem.id;
         $scope.editUserInfo.divisionName = e.dataItem.name
         $scope.editUserInfo.departmentId = 0;
         $scope.editUserInfo.departmentName = ""
        }
      };

      $scope.optDepartment = {
        dataTextField: "name",
        dataValueField: "id",
        filter: "contains",
        minLength: 1,
        delay: 500,
        dataSource: {
          serverFiltering: true,
          transport: {
            read: function (options) {
                return SearchApi.searchDepartmentByDivision(options, $scope.editUserInfo.divisionId);
            }
          },
          // group: { field: "group" }
        },
        open: function (e) {
          $timeout(function () {
            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
          });
        },
        select: function (e) {
         $scope.editUserInfo.departmentId = e.dataItem.id;
         $scope.editUserInfo.departmentName = e.dataItem.name
        }
      };

      // ----- event listening
      $scope.$on('onSortingChange', function (event, data) {
        getDataForGridView();
      });

      $scope.$on('onTaggingChange', function (event, data) {
        getDataForGridView();            
    });

      $scope.$on('changeView', function (event, data) {
        $scope.isGridView = data === 'grid' ? true : false;
        
    });

      $scope.getDataForPeopleTag = function(){
        $location.search('sortBy', '10');
        getDataForGridView();
      }

      function handleGetProfilePrerequisite(){
        profileAPI.GetProfilePrerequisite().then(function (res) {
          if (res != null || res != "") {
             console.log("=====data",res)
          }
          $scope.eventsLoad = true;
        });
      }
      function getDataForGridView (pageIndex,searchText,categoryList){
        $scope.loadingPeople = true;
        $scope.isEmptyPeople = false;
        var searchText = $("#txtSearchKeyword").val();
        if(searchText){
            $scope.searchKeyword = searchText;
        }
        var tags;
         var sorting;
         var docType;
         var queryUrl = $location.search();
        if (queryUrl.sortBy == undefined || queryUrl.sortBy == null) {
            sorting = $scope.listSortBy[0].id;
        } else {
            sorting = queryUrl.sortBy;
        }
        if (queryUrl.tags == undefined || queryUrl.tags == null) {
        //    tags = $scope.listSortBy[0].id;
        } else {
            tags = queryUrl.tags;
            $scope.peopleSearchTag.forEach(function(tag) {
                if(tags.includes(tag.value)){
                    tag.selected = true;
                }
                else{
                    tag.selected = false;
                }
            });
        }
        var obj = {
            "category": $scope.category,
            "sortBy": sorting,
            "filterBy": [],
            "searchKeyword": $scope.searchKeyword ? $scope.searchKeyword : "",
            "isSME": $scope.peopleSearchTag[1].selected,
            "hasExpertInterview": $scope.peopleSearchTag[2].selected,
            "isFollowing": $scope.peopleSearchTag[3].selected,
            "skip": pageIndex ? (pageIndex - 1)*9 : (vm.pageIndex - 1)*9,
            "take": 9,
            "sortField": "string",
            "sortDir": "string",
            "isExport": true,
            "searchTerm": "string",
            "IsPeople":true
          }
        searchPageAPI.GetPeopleForGridView(obj).then(function(res){
            if(res != null || res != ""){
                $scope.listAllPeoples = res.data;
                vm.found = res.total;
                $scope.loadingPeople = false;
               if(res.data.length == 0){
                 $scope.isEmptyPeople = true;
               }
            }
        })
    }
      function _onInit() {
        if($state.params && $state.params['#']){
          $scope.pageShow = 'manageSubsciption';
        }
        else{
          $scope.pageShow = 'editDetails';
        }
        vm.userInfo = UserProfileApi.getUserInfo();
        $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
        handleGetProfilePrerequisite();

        //get all subscription
        var filter = {
          userId: vm.userInfo.userId,
          type: "All",
          skip: 0,
          take: 10
        }
        profileAPI.manageSubscription(filter).then(function (data) {
          $scope.subscriptions = formatSubscriptionData(data);
        });

        //get Cop subscription
        var filterCoP = {
          userId: vm.userInfo.userId,
          type: "CoP",
          skip: 0,
          take: 1000
        }
        profileAPI.manageSubscription(filterCoP).then(function (data) {
          $scope.subscriptionsCOP = formatAlphabet(formatSubscriptionData(data));
        });

        //get interest subscription
        var filterInterest = {
          userId: vm.userInfo.userId,
          type: "Interest",
          skip: 0,
          take: 1000
        }
        profileAPI.manageSubscription(filterInterest).then(function (data) {
          $scope.subscriptionsInterest = formatAlphabet(formatSubscriptionData(data));
          console.log($scope.subscriptionsInterest);
          debugger
        });

    }

    function formatAlphabet(data) {
      var rv = [];
      data = data.sort(function(a,b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      if(data.length !==0){
        rv.push({firstChar: data[0].name.charAt(0).toUpperCase(), items: [] });
        data.forEach(function(v,i){
          if(rv[rv.length-1].firstChar == v.name.charAt(0).toUpperCase()){
            rv[rv.length-1].items.push(v);
          }else{
            rv.push({firstChar: v.name.charAt(0).toUpperCase(), items: [v] })
          }
        })
      }
     return rv;
    }

    function formatSubscriptionData(data) {
      var rv = [];
      data.forEach(function(v,i) {
        var icon = "/assets/icons/new-icons/" + v.type.toLowerCase()+ "-";
        if(v.isSubscribed){
          icon+="fill.svg";
        }else{
          icon+="outline.svg";
        }
        v.imageUrl = icon;
        rv.push(v);
      })
      return rv;
    }


    $scope.onSubscriptionClick = function(item){
      if(item.type == "CoP"){
        if(!item.isSubscribed){
          $scope.userInfo = UserProfileApi.getUserInfo(); 
          $scope.postData = {
            userId : $scope.userInfo.userId,
            copId: item.copId+""
           }
    
          LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
            updateSubscription(item.id);
            $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
           },function (error) {
             logger.error(error);
           });
        }else{
          $scope.userInfo = UserProfileApi.getUserInfo(); 
        
          $scope.postData = {
            requesterId : $scope.userInfo.userId,
            copId: item.copId,
            channelName : "General"
           }
    
           profileAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
            updateSubscription(item.id);
            $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
          },function (error) {
            logger.error(error);
          });
        }
      }else

      if(item.type== "People"){
        searchPageAPI.FollowingPeople(item.id).then(function(res){
          $scope.loadingPeople = true;
          updateSubscription(item.id);
          $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
          getDataForGridView();
      })
      }else

      if(item.type == "Interest"){
        if(!item.isSubscribed){
          var idsPost = [];

          $scope.editUserInfo.interest.forEach(function(element) {
            idsPost.push(element.id);
          })
  
          idsPost.push(item.id);
          var postData = { ids: idsPost };
          KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {
            if (data.result == true) {
              updateSubscription(item.id);
              $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
              }
          });
        }else{
          var idsPost = [];

        $scope.editUserInfo.interest.forEach(function(element) {
          if(element.id != item.id) {
            idsPost.push(element.id);
          }
        })
        var postData = { ids: idsPost };
        KnowledgeDocumentApi.updateMyInterestDisciplines(postData).then(function (data) {

          if (data.result == true) {
            updateSubscription(item.id);
            $scope.$emit('onOtherMenuItemLoad' , vm.userInfo.userId);
            }
        });
        }
      }
    }

    function updateSubscription(id){
      $scope.subscriptions.forEach(function(v,i){
        if(v.id == id){
          v.isSubscribed = !v.isSubscribed;
        }
      })
      $scope.subscriptionsCOP.forEach(function(v,i){
        v.items.forEach(function(v2,i2){
          if(v2.id == id){
            v2.isSubscribed = !v2.isSubscribed;
          }
        })
      })
      $scope.subscriptionsInterest.forEach(function(v,i){
        v.items.forEach(function(v2,i2){
          if(v2.id == id){
            v2.isSubscribed = !v2.isSubscribed;
          }
        })
      })
    }

    _onInit();
  }

})();
