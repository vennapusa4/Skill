(function () {
    'use strict';

    angular
        .module('app.ProfilePage')
        .controller('ActionsController', ActionsController);

    /** @ngInject */
    function ActionsController($scope, AdsSettingAPI, profileAPI, UserProfileApi,KnowledgeDocumentApi ,LandingPageAPI, appConfig, $timeout,$state , $stateParams, $mdDialog) {
        var vm = this;
        $scope.showMenu = false;
        vm.userRanking;
        $scope.cops = [];
        $scope.interests = [];
        vm.checkedIds = {};
        $scope.events = [];
        vm.userInfo;
        $scope.pagename = "ProfilePage";
        $scope.discussionTooltipshow2 = false;
        $scope.pendingActionLoad = false;
        $scope.submissionLoad = false;
        $scope.eventsLoad = false;
        $scope.recommendedArticleLoad = false;
        $scope.unsubscribedArticles = [];
        $scope.team = [];
        $scope.discussionData;
        $scope.pendingActions = [];
        $scope.mySubmissions = [];
        $scope.copyActions = [];
        $scope.copySubmission = [];
        $scope.pendingCopMemebersip = [];
        $scope.perPage= 5;
        $scope.current= 1;
        $scope.currentSub= 1;
        $scope.sliceStart= 0;
        $scope.sliceEnd= 5;
        $scope.sliceStartSub= 0;
        $scope.sliceEndSub= 5;
        $scope.Keyword = '';
        $scope.submissionKeyword = '';
        $scope.membershipKeyword = '';
        $scope.isSearch = false;
        $scope.isSubmissionSearch = false;
        $scope.isMembershipSearch = false;
        $scope.showCopApproval = false;
        $scope.pageSize = 10;
        $scope.Ads = null;
        $scope.submissionTag = [
          { "name": "All", "value": "All", "selected": true },
          { "name": "Draft", "value": "isShowSubmission", "selected": false },
          { "name": "Submitted", "value": "isPendingReview", "selected": false },
          { "name": "Reviewed", "value": "isShowValidationEndorsement", "selected": false },
          { "name": "Validated", "value": "isValidated", "selected": false },
          { "name": "Value Amendment", "value": "isShowValueAmendment", "selected": false },
          { "name": "Rejected", "value": "isRejected", "selected": false },
          { "name": "Amend", "value": "isShowAmendment", "selected": false }
        ];
        $scope.pendingActionTag = [
          { "name": "All", "value": "Alls", "selected": true },
          { "name": "Pending Review", "value": "isShowReview", "selected": false },
          { "name": "Pending Validation", "value": "isShowValidate", "selected": false },
          { "name": "Pending Endorsement", "value": "isShowEndorsed", "selected": false }
        ];
        $scope.changeTag = function(data){
          $scope.pendingActionTag.forEach(function(e){
            e.selected = e.value == data.value;
          })
          $("#pendingTable").data("kendoGrid").dataSource.read();
          // $("#pendingTable").data("kendoGrid").refresh();
        }

        $scope.setPage = function (data) {
            $scope.current = data;
            $scope.sliceStart = (data - 1) * 5;
            $scope.sliceEnd = $scope.sliceStart + 5;
        }
        $scope.setSubPage = function (data) {
            $scope.currentSub = data;
            $scope.sliceStartSub = (data - 1) * 5;
            $scope.sliceEndSub = $scope.sliceStartSub + 5;
        }
        $scope.checkedIds = [];
        $scope.checkPendingIds = [];

        $scope.selectItemId = null;
        $scope.checkItemPendingActions = function (data) {

          if (data.CheckItem) {
            $scope.checkPendingIds.push(data.id);
          } else {
            $scope.checkPendingIds = $scope.checkPendingIds.filter(function(v,i){
              return v !== data.id
            })
          }
        };

        $scope.checkItemSubmission = function (data) {

          if (data.CheckItem) {
            $scope.checkedIds.push(data.id);
          } else {
            $scope.checkedIds = $scope.checkedIds.filter(function(v,i){
              return v !== data.id
            })
          }
        };

        $scope.deleteAllItemsPendingAction = function () {
          var confirm = $mdDialog.confirm()
            .title("")
            .textContent("Are you sure want to delete this draft?")
            .ariaLabel('Update Status')
            .targetEvent()
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('OK')
            .cancel('Cancel');
          return $mdDialog.show(confirm).then(function () {
            debugger
            var postData = {
              "kdIds": $scope.checkPendingIds
          }
            KnowledgeDocumentApi.deleteAllDraftItem(postData).then(function(data){
              if(data.result){
                $scope.pendingGridDataSource.read();
              }
            }, function(err){
              console.log(err);
            })
            return true;
          }, function () {
            return false;
          });
        }

        $scope.deleteAllItemsSubmission = function () {
          var confirm = $mdDialog.confirm()
            .title("")
            .textContent("Are you sure want to delete this draft?")
            .ariaLabel('Update Status')
            .targetEvent()
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('OK')
            .cancel('Cancel');
          return $mdDialog.show(confirm).then(function () {
            debugger
            var postData = {
              "kdIds": $scope.checkedIds
          }
            KnowledgeDocumentApi.deleteAllDraftItem(postData).then(function(data){
              if(data.result){
                $scope.gridDataSource.read();
              }
            }, function(err){
              console.log(err);
            })
            return true;
          }, function () {
            return false;
          });
        }

        function getUpcomingEvents(){
            profileAPI.getUpcomingEvents().then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (event) {
                        $scope.events.push(event);
                    });
                }
                $scope.eventsLoad = true;

            });
        }

        function getActiveAds(){
          AdsSettingAPI.getAllActiveAds().then(function (res) {
            if(res != null){
              $scope.Ads = [];

              res.data.forEach(function (ads, index){
                if(index == 1){
                  $scope.Ads.push(ads);
                }

              });
            }

              if(res && res.data && res.data.length > 0){
                  $scope.Ads = res.data[0];
                  console.log($scope.Ads);
              } else {
                  $scope.Ads = null;
              }
            });
      }

        function getRecommendedArticles(){
            profileAPI.getUnSubscribedArticles().then(function (res) {
                if (res != null || res != "") {
                    res.forEach(function (event) {
                        $scope.unsubscribedArticles.push(event);
                    });
                }
                $scope.recommendedArticleLoad = true;
            });
        }


        function showPendingActions(){
            $scope.pendingActionLoad = false;
            $scope.pendingGridDataSource = new kendo.data.DataSource({
              transport: {
                read: function (options) {
                    if ($scope.isSearch) {
                        options.data.skip = 0;
                        $scope.isSearch = false;
                      }
                  return profileAPI.getPendingActions(options, $scope.Keyword,$scope.pendingActionTag);
                }
              },
              serverFiltering: true,
              serverSorting: true,
              serverPaging: true,
              pageSize: $scope.pageSize,
              schema: {
                data: function (e) {
                  $scope.pendingActionLoad = true;
                  console.log(e.data);
                  return e.data;
                },
                total: "total",
                model: {
                  fields: {
                    kdTitle: {
                      type: "string"
                    },
                    type: {
                      type: "string"
                    },
                    status: {
                      type: "string"
                    }
                  }
                }
              }
            });

            $scope.Search = function () {
              $scope.isSearch = true;
              $scope.pendingGridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
              });
            }

            //Grid definition
            $scope.mainGridOptions = {
              pageable: {
                pageSize: $scope.pageSize,
              },
              scrollable: false,
              sortable: true,
              filter: true,
              dataBound: function (e) {
                var view = this.dataSource.view();

              },
              dataSource: $scope.pendingGridDataSource,
              columns: [
                {
                  sortable: { allowUnsort: false },
                  width: 50,
                  field: "",
                  title: "",

                  template: function (dataItem) {
                   var disabled = dataItem.status !== 'Save as draft'
                      return "<input ng-disabled='"+disabled+"' type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItemPendingActions(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"

                  }
                },
                {
                    sortable: { allowUnsort: false },
                    width:"40%",
                    field: "kdTitle",
                    title: "Title",

                  template: function (dataItem) {

                    if(dataItem.docType == 'Lessons Learnt'){
                      return '<a ui-sref="app.knowledgeDiscovery.lessonsLearnt.build({id: dataItem.id})">'+dataItem.kdTitle+'</a';
                    }
                    else if(dataItem.docType == 'Best Practices'){
                      return '<a ui-sref="app.knowledgeDiscovery.bestPractices.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                    else if(dataItem.docType == 'Publications'){
                      return '<a ui-sref="app.knowledgeDiscovery.publications.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                    else if(dataItem.docType == 'Technical Alerts'){
                      return '<a ui-sref="app.knowledgeDiscovery.technicalAlerts.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                  }
                },
                {
                    sortable: { allowUnsort: false },
                  field: "type",
                  title: "Workflow Status",
                  template: function (dataItem) {
                    return "<span>" + dataItem.type + "</span>";
                  }
                },
                {
                    sortable: { allowUnsort: false },
                  field: "status",
                  title: "Knowledge Status",
                  template: function (dataItem) {
                    return "<span>" + dataItem.status + "</span>";
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  field: "submissionDate",
                  title: "Submission Date",
                  template: function (dataItem) {
                  return "<span>" + moment(dataItem.submissionDate).format('LL') + "</span>";
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"50px",
                  field: "",
                  title: "",
                  template: function (dataItem) {
                    if(dataItem.status === 'Save as draft') {
                      return "<span style='cursor: pointer' class='glyphicon glyphicon-trash' ng-click='handleDeletePending(dataItem,3)'></span>";
                    }
                    return "";
                  }
                },
              ]
            };

        }
        function showPendingSubmissions(){
            $scope.submissionLoad = false;
            $scope.gridDataSource = new kendo.data.DataSource({
              transport: {
                read: function (options) {
                    if ($scope.isSubmissionSearch) {
                        options.data.skip = 0;
                        $scope.isSubmissionSearch = false;
                      }
                  return profileAPI.getMySubmission(options, $scope.submissionKeyword,$scope.submissionTag);
                },
              },
              serverFiltering: true,
              serverSorting: true,
              serverPaging: true,
              pageSize: $scope.pageSize,
              schema: {
                data: function (e) {
                  $scope.submissionLoad = true;
                  return e.data;
                },
                total: "total",
                model: {
                  fields: {
                    kdTitle: {
                      type: "string"
                    },
                    type: {
                      type: "string"
                    },
                    status: {
                      type: "string"
                    }
                  }
                }
              }
            });
            $scope.SearchSubmissions = function () {
              $scope.isSubmissionSearch = true;
              $scope.gridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
              });
            }

            $scope.handleDeleteSubmission = function (KnowleadgeId) {
              debugger
              var postData = {
                  "kdIds": [KnowleadgeId.id]
              }
              KnowledgeDocumentApi.deleteAllDraftItem(postData).then(function (data) {
                if(data.result){
                  $scope.gridDataSource.read();
                }
              }, function (err) {
                  console.log(err);
              });
            }

            $scope.handleDeletePending = function (KnowleadgeId) {
              debugger
              var postData = {
                  "kdIds": [KnowleadgeId.id]
              }
              KnowledgeDocumentApi.deleteAllDraftItem(postData).then(function (data) {
                if(data.result){
                  $scope.gridDataSource.read();
                }
              }, function (err) {
                  console.log(err);
              });
            }

            //Grid definition
            $scope.mainSubmissionOptions = {
              pageable: {
                pageSize: $scope.pageSize,
              },
              scrollable: false,
              sortable: true,
              filter: true,
              dataBound: function (e) {
                var view = this.dataSource.view();

              },
              dataSource: $scope.gridDataSource,
              columns: [
                {
                  sortable: { allowUnsort: false },
                  width: 50,
                  field: "",
                  title: "",

                  template: function (dataItem) {
                    var disabled = dataItem.status !== 'Save as draft'
                      return "<input ng-disabled='"+disabled+"' type='checkbox' id='chk_{{dataItem.id}}' ng-model='dataItem.CheckItem' ng-change='checkItemSubmission(dataItem)' class='k-checkbox row-checkbox' ><label class='k-checkbox-label' for='chk_{{dataItem.id}}'></label>"


                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"30%",
                  field: "kdTitle",
                  title: "Title",
                  template: function (dataItem) {

                    if(dataItem.docType == 'Lessons Learnt'){
                      return '<a ui-sref="app.knowledgeDiscovery.lessonsLearnt.build({id: dataItem.id})">'+dataItem.kdTitle+'</a';
                    }
                    else if(dataItem.docType == 'Best Practices'){
                      return '<a ui-sref="app.knowledgeDiscovery.bestPractices.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                    else if(dataItem.docType == 'Publications'){
                      return '<a ui-sref="app.knowledgeDiscovery.publications.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                    else if(dataItem.docType == 'Technical Alerts'){
                      return '<a ui-sref="app.knowledgeDiscovery.technicalAlerts.build({id: dataItem.id})">'+dataItem.kdTitle+'</a>';
                    }
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"25%",
                  field: "type",
                  title: "Workflow Status",
                  template: function (dataItem) {
                    return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,2)'>" + dataItem.type + "</span>";
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"25%",
                  field: "status",
                  title: "Knowledge Status",
                  template: function (dataItem) {
                    return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,3)'>" + dataItem.status + "</span>";
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"20%",
                  field: "submissionDate",
                  title: "Submission Date",
                  template: function (dataItem) {
                  return "<span>" + moment(dataItem.submissionDate).format('LL') + "</span>";
                  }
                },
                {
                  sortable: { allowUnsort: false },
                  width:"50px",
                  field: "",
                  title: "",
                  template: function (dataItem) {
                    if(dataItem.status === 'Save as draft') {
                      return "<span style='cursor: pointer' class='glyphicon glyphicon-trash' ng-click='handleDeleteSubmission(dataItem,3)'></span>";
                    }
                    return "";
                  }
                },
              ]
            };

        }

        function showCoPMembershipApproval(){
            // $scope.pendingActionLoad = true;
            $scope.pendingCoPGridDataSource = new kendo.data.DataSource({
              transport: {
                read: function (options) {
                    if ($scope.isMembershipSearch) {
                        options.data.skip = 0;
                        $scope.isMembershipSearch = false;
                      }
                  return profileAPI.getPendingCopMembership(options, $scope.membershipKeyword);
                },
              },
              serverFiltering: true,
              serverSorting: true,
              serverPaging: true,
              pageSize: $scope.pageSize,
              schema: {
                data: function (e) {
                  if(e.data) {
                    $scope.showCopApproval = true;
                  }
                  return e.data;
                },
                total: "total",
                model: {
                  fields: {
                    channelId: {
                        type: "string"
                      },
                    title: {
                      type: "string"
                    },
                    type: {
                      type: "string"
                    },
                    status: {
                      type: "string"
                    }
                  }
                }
              }
            });

            $scope.SearchMemberships = function () {
              $scope.isMembershipSearch = true;
              $scope.pendingCoPGridDataSource.query({
                page: 1,
                pageSize: $scope.pageSize
              });
            }

            //Grid definition
            $scope.mainCoPMembershipOptions = {
              pageable: {
                pageSize: $scope.pageSize,
              },
              scrollable: false,
              sortable: false,
              filter: true,
              dataBound: function (e) {
                var view = this.dataSource.view();

              },
              dataSource: $scope.pendingCoPGridDataSource,
              columns: [

                {
                    sortable: { allowUnsort: false },
                  field: "title",
                  title: "Title",
                  template: function (dataItem) {
                    return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,1)'>" + dataItem.kdTitle + "</span>";
                  }
                },
                {
                    sortable: { allowUnsort: false },
                  field: "type",
                  title: "Type",
                  template: function (dataItem) {
                    return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,2)'>" + dataItem.type + "</span>";
                  }
                },
                {
                    sortable: { allowUnsort: false },
                  field: "status",
                  title: "Status",
                  template: function (dataItem) {
                    return "<span style='cursor: pointer' ng-click='ApplyFilterFromMasterData(dataItem,3)'>" + dataItem.status + "</span>  <button type='button' ng-click='vm.approveMembership(cop.channelId)' ng-if='dataItem.status == 'Pending Cop Membership''>Approve</button>";
                  }
                },
              ]
            };

            //apply filter for table
            $scope.$on('filterTableEvent',function(event,data,name){
                $scope.submissionTag.forEach(function(e){
                  e.selected = e.value == data.value;
                })
                $("#submissionTable").data("kendoGrid").dataSource.read();
            });
        }

        function _onInit() {
          getActiveAds();
            vm.userInfo = UserProfileApi.getUserInfo();
            $scope.$emit('onOtherMenuItemLoad' ,  vm.userInfo.userId);

            showPendingActions();
            showPendingSubmissions();
            showCoPMembershipApproval();
            getUpcomingEvents();
            getRecommendedArticles();
        }

        vm.approveMembership = function(channelID){

            profileAPI.approveChannel(channelID).then(function () {
                logger.success("Request Approved Successfully");
                vm.pendingCopMemebersip = [];
                $state.transitionTo($state.current, $stateParams, {reload: true});


            });

          }


        _onInit();

    }

})();
