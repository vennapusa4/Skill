(function () {
    'use strict';

    angular
        .module('app.myAccount', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State - SMEUser
        $stateProvider.state('app.userProfile', {
            title: 'Expert Profile',
            url: '/user-profile',
            params: { id: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/my-account/user-profile.html',
                    controller: 'UserProfileController as vm'
                },
                'subContent@app.userProfile': {
                },
            },
        });

        $stateProvider.state('app.userProfile.contribution', {
            title: 'Expert Profile - Contribution',
            url: '/contribution?id',
            params: { id: null },
            views: {
                'subContent@app.userProfile': {
                    templateUrl: 'app/main/apps/my-account/contribution/template.html',
                    controller: 'ContributionController as vm'
                }
            },
        });

        $stateProvider.state('app.userProfile.myExpertProfile', {
            title: 'Expert Profile - myExperts Profile',
            url: '/my-expert-profile?id',
            params: { id: null },
            views: {
                'subContent@app.userProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/template.html',
                    controller: 'MyExpertProfileController as vm'
                }
            },
        });

        $stateProvider.state('app.userProfile.myExpertProfile.workingProject', {
            title: 'My Experts Profile - Working & Project',
            url: '/working-project',
            views: {
                'subRightContent@app.userProfile.myExpertProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/working-project/template.html',
                    controller: 'MyExpertProfileWorkingProjectController as vm'
                }
            },
        });

        $stateProvider.state('app.userProfile.myExpertProfile.myExpert', {
            title: 'My Experts Profile - myExpert',
            url: '/my-expert',
            views: {
                'subRightContent@app.userProfile.myExpertProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/my-expert/template.html',
                    controller: 'MyExpertProfileMyExpertController as vm'
                }
            },
        });

        $stateProvider.state('app.userProfile.myExpertInterview', {
            title: 'Expert Profile - Expert Interview',
            url: '/expert-interview?id',
            params: { id: null },
            views: {
                'subContent@app.userProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-interview/template.html',
                    controller: 'MyExpertInterviewController as vm'
                }
            },
        });

        // State - MyAccount
        $stateProvider.state('app.myAccountUser', {
            title: 'My Account User',
            url: '/my-account-user',
            abstract: true,
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/my-account/my-account.user.html',
                    controller: 'MyAccountUserController as vm'
                },
                'subContent@app.myAccountUser': {
                },
            },
        });

        $stateProvider.state('app.myAccountUser.myContribution', {
            title: 'My Contribution',
            url: '/my-contribution',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/my-contribution/template.html',
                    controller: 'MyContributionController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions', {
            title: 'Submissions',
            url: '/submissions',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.draft', {
            title: 'Submissions - Draft',
            url: '/draft',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.pendingValidation', {
            title: 'Submissions - Pending Validation',
            url: '/pending-validation',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.validated', {
            title: 'Submissions - Validated',
            url: '/validated',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.amend', {
            title: 'Submissions - Request for Amend',
            url: '/request-for-amend',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.rejected', {
            title: 'Submissions - Rejected',
            url: '/reject',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.pendingEndorserment', {
            title: 'Submissions - Pending Endorserment',
            url: '/pending-endorserment',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });


        $stateProvider.state('app.myAccountUser.submissions.endorsed', {
            title: 'Submissions - Endorsed',
            url: '/endorsed',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.endorsermentAmend', {
            title: 'Submissions - Request for Amend',
            url: '/endorser-request-for-amend',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.submissions.endorsermentRejected', {
            title: 'Submissions - Rejected',
            url: '/endorser-reject',
            views: {
                'leftFilter@app.myAccountUser.submissions': {
                    // templateUrl: 'app/main/apps/my-account/submissions/template.html',
                    // controller: 'SubmissionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.pendingActions', {
            title: 'Pending Actions',
            url: '/pending-actions',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/pending-actions/template.html',
                    controller: 'PendingActionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.pendingActions.pendingValidation', {
            title: 'Pending Validation',
            url: '/pending-validation',
            views: {
                'leftFilter@app.myAccountUser.pendingActions': {
                    //templateUrl: 'app/main/apps/my-account/pending-actions/template.html',
                    //controller: 'PendingActionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.pendingActions.pendingEndorsement', {
            title: 'Pending Endorsement',
            url: '/pending-endorsement',
            views: {
                'leftFilter@app.myAccountUser.pendingActions': {
                    //templateUrl: 'app/main/apps/my-account/pending-actions/template.html',
                    //controller: 'PendingActionsController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.pendingActions.pendingCopMembershipApproval', {
            title: 'Pending Cop Membership Approval',
            url: '/pending-cop-membership-approval',
            views: {
                'subContent@app.myAccountUser.pendingActions': {
                    templateUrl: 'app/main/apps/my-account/pending-actions/pending-cop-membership/cop-pending-approval.html',
                    controller: 'copPendingApprovalController as vm'
                }
            }
          });



        $stateProvider.state('app.myAccountUser.myLibraryKnowledge', {
            title: 'Bookmark - Knowledge',
            url: '/my-library-knowledge',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/my-library/knowledge.template.html',
                    controller: 'MyLibraryKnowledgeController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.myLibraryCollection', {
            title: 'Bookmark - Collection',
            url: '/my-library-collection',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/my-library/collection.template.html',
                    controller: 'MyLibraryCollectionController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.myExpertProfile', {
            title: 'My Experts Profile',
            url: '/my-expert-profile',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/template.html',
                    controller: 'MyExpertProfileController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.myExpertProfile.workingProject', {
            title: 'My Experts Profile - Working & Project',
            url: '/working-project',
            views: {
                'subRightContent@app.myAccountUser.myExpertProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/working-project/template.html',
                    controller: 'MyExpertProfileWorkingProjectController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.myExpertProfile.myExpert', {
            title: 'My Experts Profile - myExpert',
            url: '/my-expert',
            views: {
                'subRightContent@app.myAccountUser.myExpertProfile': {
                    templateUrl: 'app/main/apps/my-account/my-expert-profile/my-expert/template.html',
                    controller: 'MyExpertProfileMyExpertController as vm'
                }
            },
        });

        $stateProvider.state('app.myAccountUser.myExpertInterview', {
            title: 'Expert Interview',
            url: '/expert-interview',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/my-expert-interview/template.html',
                    controller: 'MyExpertInterviewController as vm'
                },
            },
        });

        $stateProvider.state('app.myAccountUser.chat', {
            title: 'Chat',
            url: '/chat',
            views: {
                'subContent@app.myAccountUser': {
                    templateUrl: 'app/main/apps/my-account/chat/template.html',
                    controller: 'ChatController as vm'
                }
            },
        });

    }

})();
