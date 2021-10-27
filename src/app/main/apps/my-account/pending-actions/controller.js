(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('PendingActionsController', PendingActionsController);

    /** @ngInject */
    function PendingActionsController($state, KnowledgeDocumentApi , AdminSettingCoPApi,$scope ,profileAPI) {
        var vm = this;
        vm.isCopMembershipApproval = false;
        vm.arrSortby = [
            { id: 'HighestEngagement', name: 'Highest Engagement' },
            { id: 'LatestContribution', name: 'Latest Contribution' },
            { id: 'LatestValidation', name: 'Latest Validation' },
            { id: 'HighestValueRealised', name: 'Highest Value Realised' },
            { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
            { id: 'HighestReplication', name: 'Highest Replication' },
        ];
        vm.selectSortby = vm.arrSortby[0];

        vm.CountStatus = {
            totalPendingAction: 0,
            totalPendingValidation: 0,
            totalPendingEndorsement: 0,
            totalMembershipRequest : 0
        };

        function getCount(kw) {
            var postDataStatus = {
                status: '',
                keyword: kw,
                sortBy: 'HighestEngagement',
                skip: '',
                take: ''
            };
            /*
            KnowledgeDocumentApi.getCountOfMyPendingActions(postDataStatus).then(function (data) {
                vm.CountStatus = data;
                vm.statusDisplay = "All " + vm.CountStatus.countAll;
            });
            */

            profileAPI.getPendingActionsCount().then(function (data) {
                vm.CountStatus = data;
                vm.statusDisplay = "All " + vm.CountStatus.totalPendingAction;
            });
            };
        getCount('');

          $scope.$on('onApproval', function (event, count) {
            vm.CountStatus.totalMembershipRequest = count;
            vm.CountStatus.totalPendingAction =   vm.CountStatus.totalPendingValidation + vm.CountStatus.totalPendingEndorsement + vm.CountStatus.totalMembershipRequest
            
        });


        vm.status = '';
        vm.endorserStatus = '';
        switch ($state.current.name) {
            case 'app.myAccountUser.pendingActions':
                vm.status = 'Submit'
                vm.isCopMembershipApproval = false;
                vm.endorserStatus = 'Submit'
                init();
                break;
            case 'app.myAccountUser.pendingActions.pendingValidation':
                vm.status = 'Submit'
                vm.isCopMembershipApproval = false;
                vm.endorserStatus = ''
                init();
                break;
            case 'app.myAccountUser.pendingActions.pendingEndorsement':
                vm.status = ''
                vm.isCopMembershipApproval = false;
                vm.endorserStatus = 'Submit'
                init();
                break;
            case 'app.myAccountUser.pendingActions.pendingCopMembershipApproval':
                vm.status = '';
                vm.isCopMembershipApproval = true;
                break;
            default:
                break;
        }

        vm.RemoveFilter = function (status) {
            if (status == 'PendingValidation') {
                vm.status = 'Submit';
                vm.ResetSearch(status);
                vm.endorserStatus = '';
                vm.statusDisplay = 'Pending Validation ' + vm.CountStatus.totalPendingValidation;
                vm.isCopMembershipApproval = false;
               
            } else if (status == 'PendingEndorsement') {
                vm.status = 'submit';
                vm.ResetSearch(status);
                vm.endorserStatus = 'Submit';
                vm.statusDisplay = 'Pending Endorsement ' + vm.CountStatus.totalPendingEndorsement;
                vm.isCopMembershipApproval = false;
               
            } else if (status == 'pendingCopMembershipApproval') {
                vm.status = '';
                vm.isCopMembershipApproval = true;
            }   
            else {
                vm.status = 'Submit';
                vm.endorserStatus = 'Submit';
                vm.statusDisplay = "All " + vm.CountStatus.totalPendingAction;
                vm.isCopMembershipApproval = false;
                vm.ResetSearch(vm.status);
            }
            
        }

         function Search(status) {

            function getPostData(status) {
                return {
                    status: vm.status,
                    disciplineId: '',
                    createdMonth: '',
                    keyword: vm.keyword,
                    sortBy: vm.selectSortby.id,
                    skip: (vm.pageIndex - 1) * vm.pageSize,
                    take: vm.pageSize,
                    ViewType: status
                };
            }

            var postData = getPostData(status);
            KnowledgeDocumentApi.getMyPendingValidation(postData).then(function (data) {

                vm.MyPendingValidation = data;

                if (data.total > 0) {
                    vm.fromPos = postData.skip + 1;
                    vm.toPos = vm.fromPos + data.data.length - 1;
                }
                else {
                    vm.fromPos = 0;
                    vm.toPos = 0;
                }
            });
        }
        vm.ResetSearch = function (status) {

            vm.pageIndex = 1;
            Search(status);
        }
        function init(){
        // Submissions
        vm.keyword = '';
     

        vm.fromPos = 0;
        vm.toPos = 0;

        vm.changeSortBy = function () {
            vm.pageIndex = 1;
            Search(status);
        }

        /* PAGING */
        vm.pageIndex = 1;
        vm.pageSize = 16;
        vm.maxSize = 5;
        vm.setPage = function (pageNo) {
            vm.pageIndex = pageNo;
        };

        vm.pageChanged = function () {
            Search(status);
        };

        vm.MyPendingValidation = [];
        Search(status);
        }
  
     
        

        vm.changeSortByInMobile = function (sortBy) {
            vm.selectSortby = sortBy;
            vm.changeSortBy();
        }
    }
})();