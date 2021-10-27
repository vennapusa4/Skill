(function () {
    'use strict';

    angular
        .module('app.ProfilePage')
        .factory('profileAPI', profileAPI);

    /** @ngInject */
    function profileAPI($resource, appConfig, $q , UserProfileApi) {
        var $q = $q; 
        var vm = this;
        vm.dataToExport = [];
        vm.data = [];
        vm.datasource = [];
        
        var api = {
             // My Ranking
            getMyRanking: $resource(appConfig.SkillApi + '/api/Leaderboard/MyRanking', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getMyEarnedBadges: $resource(appConfig.SkillApi + 'api/Leaderboard/MyEarnedBadges?id=', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getSubscribedCops: $resource(appConfig.SkillApi + 'api/UserProfile/SubscribedCoP', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getUnSubscribedArticles: $resource(appConfig.SkillApi + 'api/UserProfile/UnsubscribedArticles', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getInterests: $resource(appConfig.SkillApi + 'api/UserProfile/UserInterest', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getUpcomingEvents: $resource(appConfig.SkillApi + 'api/UserProfile/UpcomingEvents', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getCopDetailById: $resource(appConfig.SkillApi + 'api/UserProfile/CopDetailById', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getArticles: $resource(appConfig.SkillApi + 'api/UserProfile/Articles', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getCoPArticles: $resource(appConfig.SkillApi + 'api/UserProfile/CopArticles ', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getKnowledgeReuse :$resource(appConfig.SkillApi + '/api/UserProfile/Articles/KnowledgeReuse', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getContributionArticles: $resource(appConfig.SkillApi + 'api/UserProfile/MyContributionArticles', {}, {
                query: { method: 'POST', isArray: true }
            }),
            
            getChannelsByCopID: $resource(appConfig.SkillApi + 'api/UserProfile/ChannelsByCop', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getCrossCollaborationChannels: $resource(appConfig.SkillApi + 'api/UserProfile/CrossCollaborationChannels', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getUpComingEventsByCopID: $resource(appConfig.SkillApi + 'api/UserProfile/UpcomingEventsById', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getDiscussionsByCopId: $resource(appConfig.SkillApi + 'api/UserProfile/DiscussionsById', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getCoPAndMembers: $resource(appConfig.SkillApi + 'api/UserProfile/CopsAndMembers', {}, {
                query: { method: 'GET', isArray: true }
            }),

            checkChannelStatus: $resource(appConfig.SkillApi + 'api/UserProfile/CheckSubscribed', {}, {
                query: { method: 'GET', isArray: false }
            }),
            checkGeneralChannelStatus: $resource(appConfig.SkillApi + 'api/UserProfile/CheckSubscribedtoGeneral', {}, {
                query: { method: 'GET', isArray: false }
            }),
            // get divisions and departments of user profile
            GetProfilePrerequisite: $resource(appConfig.SkillApi + 'api/User/GetProfilePrerequisite', {}, {
                query: { method: 'GET', isArray: false }
            }),
            requestToJoinChannel: $resource(appConfig.SkillApi + 'api/UserProfile/RequestToJoinChannel'),
            requestToUnJoinChannel: $resource(appConfig.SkillApi + 'api/UserProfile/UnJoinChannel'),
            postNewDiscussion: $resource(appConfig.SkillApi + 'api/UserProfile/PostDiscussion'),
            approveChannel: $resource(appConfig.SkillApi + 'api/UserProfile/ApproveRequestToJoinChannel'),  
            getPendingActionsCount: $resource(appConfig.SkillApi + 'api/UserProfile/TotalPendingAction', {}, {
                query: { method: 'GET', isArray: false }
            }),  
            CheckOwner: $resource(appConfig.SkillApi + 'api/UserProfile/CheckOwner', {}, {
                query: { method: 'GET', isArray: false }
            }),   
            getCopToPostDiscussion: $resource(appConfig.SkillApi + 'api/UserProfile/CopsAndMembers', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getMemebersFromCop: $resource(appConfig.SkillApi + 'api/UserProfile/GetCopMembers', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getPendingActions: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetPendingActions', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getMySubmission: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetPendingSubmissions', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getPendingCopMembership: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetPendingCoPMemberShipApprovals', {}, {
                query: { method: 'POST', isArray: true }
            }),
            getWorkingAndprojects: $resource(appConfig.SkillApi + 'api/User/ExpertProfile/WorkProjectExperience'),
            getExpertExperience :  $resource(appConfig.SkillApi + 'api/UserProfile/ExpertExperience'),
            getExpertInterviews:  $resource(appConfig.SkillApi + 'api/UserProfile/getAllExpertinterviews'),
            getExpertInterviewDetail: $resource(appConfig.SkillApi + 'api/ExpertInterview/ExpertInterviewDetails?t=' + (new Date().getTime()), {}, {
                save: { method: 'POST' }
            }),
              
            getExpertInterviewProfile: $resource(appConfig.SkillApi + 'api/ExpertInterview/Profile'),
            getAllComments: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/All'),
            
            //get people you following
            getPeopleYouFollowing :  $resource(appConfig.SkillApi + '/api/SearchV2/PeopleYouFollow', {}, {
                query: { method: 'GET', isArray: true }
            }),
            manageSubscription :  $resource(appConfig.SkillApi + '/api/UserProfile/ManageSubscription', {}, {
                query: { method: 'GET', isArray: true }
            }),
        };

        function getAllComments(expertInterviewId) {
            var deferred = $q.defer();
            api.getAllComments.save({}, { expertInterviewId: expertInterviewId },
                function (data) {
                    deferred.resolve(data);
                  }, function (data) {
                    deferred.reject(data);
                  });
                return deferred.promise;
          }

        function getExpertInterviewProfile(expertInterviewId) {
            var deferred = $q.defer();
      
            api.getExpertInterviewProfile.get({ expertInterviewId: expertInterviewId }, function (data) {
              deferred.resolve(data);
            }, function (data) {
              deferred.reject(data);
            });
      
            return deferred.promise;
          }

        function getExpertInterviewDetail(expertInterviewId) {
            var deferred = $q.defer();
            api.getExpertInterviewDetail.save({}, { expertInterviewId: expertInterviewId },
              function (data) {
                deferred.resolve(data);
              }, function (data) {
                deferred.reject(data);
              });
            return deferred.promise;
          }

        function getExpertInterviews(userID){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getExpertInterviews.query({ UserId:  userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getExpertExperience(userID){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();                                                             
            api.getExpertExperience.query({ UserId: userID }, function (data) {
                deferred.resolve(data);                                                                                                                                                                                                                                                          
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getWorkingAndprojects(userID) {
            return api.getWorkingAndprojects.query({ userId:  userID }).$promise;
        }

       // My Ranking
       function getMyRanking() {
        var deferred = $q.defer();
        api.getMyRanking.query({}, function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
        }

        // My Earned Badges
        function getMyEarnedBadges() {
            var deferred = $q.defer();
            api.getMyEarnedBadges.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getSubscribedCops(userID){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getSubscribedCops.query({ UserId: userID }, function (data) {
                deferred.resolve(data);
               
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getChannelsByCopID(copID){
            var deferred = $q.defer();
            api.getChannelsByCopID.query({ copId: copID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getCrossCollaborationChannels(userID){
            var deferred = $q.defer();
            vm.userInfo = UserProfileApi.getUserInfo();
            api.getCrossCollaborationChannels.query({ userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function checkChannelStatus(copID){
            var deferred = $q.defer();
            api.checkChannelStatus.query({ copId: copID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function checkGeneralChannelStatus(copID){
            var deferred = $q.defer();
            api.checkGeneralChannelStatus.query({ copId: copID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function GetProfilePrerequisite() {
            var deferred = $q.defer();
            api.GetProfilePrerequisite.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getPendingActionsCount(){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getPendingActionsCount.query({ userId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getUpComingEventsByCopID(copID){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getUpComingEventsByCopID.query({ copId: copID ,UserId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getDiscussionsByCopId(discussionData){
            var deferred = $q.defer();
            api.getDiscussionsByCopId.save({}, discussionData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
        }

        function getUnSubscribedArticles(){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getUnSubscribedArticles.query({ UserId:  vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getInterests(userID){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getInterests.query({ UserId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getUpcomingEvents(){
            var deferred = $q.defer();
            api.getUpcomingEvents.query({ UserId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        
        function getCopDetailById(idx) {
            var deferred = $q.defer();
            api.getCopDetailById.query({ copId: idx }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
            
        function getArticles(postData) {
            var deferred = $q.defer();
            api.getArticles.save({}, postData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
            
        }

        function getCoPArticles(postData) {
            var deferred = $q.defer();
            api.getCoPArticles.save({}, postData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
            
        }

        

        function getKnowledgeReuse(postData) {
            var deferred = $q.defer();
            api.getKnowledgeReuse.save({}, postData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
            
        }

        function getContributionArticles(postData) {
            var deferred = $q.defer();
            api.getContributionArticles.save({}, postData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
            
        }

        function getPendingActions(option, keyword,filterData) {
            vm.userInfo = UserProfileApi.getUserInfo();
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "submissionDate";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "desc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            // debugger
            api.getPendingActions.save({}, { searchTerm: keyword,
                skip: skip,
                take: take,
                sortField: sortField, 
                sortDir: sortDir, 
                isExport: false,
                UserId: vm.userInfo.userId,
                isShowReview: false || filterData[1].selected,
                isShowValidate: false ||  filterData[2].selected,
                isShowEndorsed: false || filterData[3].selected,
            }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getMySubmission(option, keyword, filterData) {
            vm.userInfo = UserProfileApi.getUserInfo();
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "submissionDate";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "desc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            
            //apply filter
            api.getMySubmission.save({}, { searchTerm: keyword,
                 skip: skip,
                 take: take,
                 sortField: sortField,
                 sortDir: sortDir,
                 isExport: false,
                 UserId: vm.userInfo.userId,
                 isShowSubmission: false || filterData[1].selected,
                 isPendingReview: false ||  filterData[2].selected,
                 isShowValidationEndorsement: false || filterData[3].selected,
                 isValidated: false || filterData[4].selected,
                 isShowValueAmendment: false || filterData[5].selected,
                 isRejected: false || filterData[6].selected,
                 isShowAmendment: false || filterData[7].selected,
                 }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getPendingCopMembership(option, keyword) {
            vm.userInfo = UserProfileApi.getUserInfo();
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "kdTitle";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "desc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            api.getPendingCopMembership.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false,UserId: vm.userInfo.userId }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }
        
        function getCoPAndMembers(){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getCoPAndMembers.query({ UserId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getCopToPostDiscussion(){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.getCopToPostDiscussion.query({ userId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getMemebersFromCop(copID){
            var deferred = $q.defer();
            api.getMemebersFromCop.query({ copId: copID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
     
        function getPeopleYouFollowing(takeRecords, userId){
            var deferred = $q.defer();
            var query = { take: takeRecords };
            if(userId){
                query.userId = userId
            }
            api.getPeopleYouFollowing.query(query, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        
        function manageSubscription(query){
            var deferred = $q.defer();
            api.manageSubscription.query(query, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function requestToJoinChannel(postData) {
            return api.requestToJoinChannel.save(postData).$promise;
        }
        function requestToUnJoinChannel(postData) {
            return api.requestToUnJoinChannel.save(postData).$promise;
        }
        function postNewDiscussion(postData){
            return api.postNewDiscussion.save(postData).$promise;
        }
        
        function approveChannel(requestID){
            var deferred = $q.defer();
            api.approveChannel.save({requestId: requestID}, {} ,function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
        }

        function CheckOwner(copID , userID){
            var deferred = $q.defer();
            api.CheckOwner.query({ copId: copID , userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        return {
            api: api,
            getMyRanking: getMyRanking,
            getMyEarnedBadges : getMyEarnedBadges,
            getSubscribedCops : getSubscribedCops,
            getUnSubscribedArticles: getUnSubscribedArticles,
            getInterests:getInterests,
            getUpcomingEvents:getUpcomingEvents,
            getCopDetailById: getCopDetailById,
            getArticles:getArticles,
            getCoPArticles: getCoPArticles,
            getKnowledgeReuse:getKnowledgeReuse,
            getContributionArticles:getContributionArticles,
            getChannelsByCopID : getChannelsByCopID,
            getUpComingEventsByCopID : getUpComingEventsByCopID,
            getDiscussionsByCopId:getDiscussionsByCopId,
            getCoPAndMembers : getCoPAndMembers,
            requestToJoinChannel : requestToJoinChannel,
            postNewDiscussion: postNewDiscussion,
            approveChannel:approveChannel,
            getCrossCollaborationChannels: getCrossCollaborationChannels,
            checkChannelStatus:checkChannelStatus,
            checkGeneralChannelStatus:checkGeneralChannelStatus,
            requestToUnJoinChannel:requestToUnJoinChannel,
            getPendingActionsCount: getPendingActionsCount,
            CheckOwner:CheckOwner,
            getCopToPostDiscussion:getCopToPostDiscussion,
            getMemebersFromCop:getMemebersFromCop,
            getPendingActions:getPendingActions,
            getMySubmission:getMySubmission,
            getPendingCopMembership:getPendingCopMembership,
            getWorkingAndprojects : getWorkingAndprojects,
            getExpertExperience: getExpertExperience,
            getExpertInterviews:getExpertInterviews,
            getExpertInterviewDetail: getExpertInterviewDetail,
            getExpertInterviewProfile: getExpertInterviewProfile,
            getAllComments: getAllComments,
            GetProfilePrerequisite: GetProfilePrerequisite,
            getPeopleYouFollowing : getPeopleYouFollowing,
            manageSubscription: manageSubscription
        };
    }

})();