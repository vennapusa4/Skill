(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .factory('UserProfileApi', UserProfileApi);

    /** @ngInject */
    function UserProfileApi($resource, appConfig, $q, $timeout, $window, KnowledgeService) {
        var $q = $q;
        var $timeout = $timeout;
        var $window = $window;

        var api = {
            getPreviousInfor: $resource(appConfig.SkillApi + '/api/User/PreviousInfor', {}, {
                save: { method: 'POST', params: {}, isArray: true }
            }),
            rank: $resource(appConfig.SkillApi + '/api/UserProfile/Rank'),
            interestFeeds: $resource(appConfig.SkillApi + '/api/UserProfile/Interest/Feeds', {}, {
                save: { method: 'POST', params: {}, isArray: true }
            }),
            interestFeedsCollection: $resource(appConfig.SkillApi + 'api/UserProfile/Interest/Feeds/Collection'),
            summary: $resource(appConfig.SkillApi + 'api/UserProfile/Summary'),
            userProfile: $resource(appConfig.SkillApi + 'api/UserProfile'),
            getProfile: $resource(appConfig.SkillApi + 'api/User/GetProfile'),
            getAllUsers: $resource(appConfig.SkillApi + 'api/Admin/User/GetAllUsers', {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    ignoreLoadingBar: true,
                    cache: true
                }
            }),
            getAllUsersBySearchTerm: $resource(appConfig.SkillApi + 'api/Admin/User/GetAllUsersBySearchTerm', {}, {
                save: { method: 'POST', isArray: true }
            }),

            saveLibrary: $resource(appConfig.SkillApi + 'api/UserProfile/SaveLibrary'),
            loginProfile: $resource(appConfig.SkillApi + 'api/User/LoginProfile'),
            editProfile: $resource(appConfig.SkillApi + 'api/User/EditProfile'),
            getUserProfiles: $resource(appConfig.SkillApi + 'api/Admin/User/GetUserProfiles'),
            getUserTypes: $resource(appConfig.SkillApi + 'api/Admin/RuleType/GetAll'),
            GetAllDropdownAdminUsers: $resource(appConfig.SkillApi + 'api/Admin/User/GetAllDropdownAdminUser'),
            saveUserProfile: $resource(appConfig.SkillApi + 'api/Admin/User/Save'),
            delUserProfile: $resource(appConfig.SkillApi + 'api/Admin/User/Delete'),
            exportAllUsers: $resource(appConfig.SkillApi + 'api/Admin/User/ExportAllUsers', {}, {
                get: {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        'Accept': 'application/octet-stream'
                    },
                    responseType: 'blob',
                    cache: false,
                    transformResponse: function (data, headers) {
                        var contentType = headers('Content-Type');
                        var disposition = headers('Content-Disposition');
                        var defaultFileName = "download";
                        if (disposition) {
                            var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                            if (match[1])
                                defaultFileName = match[1];
                        }
                        defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                        var file = new Blob([data], {
                            type: contentType
                        });
                        saveAs(file, defaultFileName);
                    }
                }
            }),
            
            /*GetAllDropdownAdminUsers: $resource(appConfig.SkillApi + 'api/Admin/User/GetAllDropdownAdminUser', {}, {
              save: { method: 'GET', params: {}, isArray: true }
            }),*/
            Upload: function (userId) {
                var requestUrl = appConfig.SkillApi + 'api/User/UploadAvatar';
                if (userId) {
                    requestUrl = appConfig.SkillApi + 'api/User/UploadAvatar?userId=' + userId;
                }
                return $resource(requestUrl, {}, {
                    save: {
                        method: "POST",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/octet-stream'
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            return KnowledgeService.transform(null, data, headers);
                        }
                    }
                });
            },
            getAllRoles: $resource(appConfig.SkillApi + 'api/Admin/Role/GetAll'),

            getExpertProfilePaging: $resource(appConfig.SkillApi + 'api/User/ExpertExperience'),
            getAllWorkProjectExperience: $resource(appConfig.SkillApi + 'api/User/ExpertProfile/WorkProjectExperience'),
            getWorkProjectExperienceById: $resource(appConfig.SkillApi + 'api/User/ExpertProfile/WorkProjectExperience/Get/:id'),
            saveWorkProjectExperience: $resource(appConfig.SkillApi + 'api/User/ExpertProfile/WorkProjectExperience/Save'),
            deleteWorkProjectExperience: $resource(appConfig.SkillApi + 'api/User/ExpertProfile/WorkProjectExperience/Delete/:id/:skip'),
            resetSkipForConfirm: $resource(appConfig.SkillApi + 'api/User/Configuration/Reset'),
            getAllGTAUsers : $resource(appConfig.SkillApi + '/api/Admin/TechnicalAlert/GetGTAUserProfiles'),
            exportAllGTAUsers: $resource(appConfig.SkillApi + 'api/Admin/TechnicalAlert/GetGTAUserProfilestoExport', {}, {
                save: { method: 'POST', isArray: true }
            }),
        };

        function getAllGTAUsers(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            api.getAllGTAUsers.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function exportAllGTAUsers(){
            var deferred = $q.defer();
            api.exportAllGTAUsers.save({},
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;

        }

        function editUserProfile(postData) {

            var deferred = $q.defer();
            api.editProfile.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (response) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getRank(userId) {

            var deferred = $q.defer();
            if (userId == null) userId = 0;
            api.rank.get({ userId: userId }, function (data) {

                if (data != null && userId == null) {
                    var userProfile = getUserInfo();
                    if (userProfile != null) {

                        data.imageUrl = userProfile.imageUrl;
                        data.userName = userProfile.displayName;
                    }
                }
                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getProfile(userId) {

            var deferred = $q.defer();
            if (userId == null) userId = 0;
            api.getProfile.save({ userId: userId }, {}, function (data) {
                _.forEach(data.recentActivities, function (item) {
                    if (item.activityName == 'Like' || item.activityName == 'Save' || item.activityName == 'Share') {
                        item.activityName += 'd';
                    }
                    var dtNow = moment();
                    var dtbefore = moment(item.activityTime);
                    var duration = moment.duration(dtNow.diff(dtbefore));
                    if (duration._data.years > 0) {
                        item.activityTime = duration._data.years + " years";
                    } else if (duration._data.months > 0) {
                        item.activityTime = duration._data.months + " months";
                    } else if (duration._data.days > 0) {
                        item.activityTime = duration._data.days + " days";
                    } else if (duration._data.hours > 0) {
                        item.activityTime = duration._data.hours + " hours";
                    } else if (duration._data.minutes > 0) {
                        item.activityTime = duration._data.minutes + " minutes";
                    } else if (duration._data.seconds > 0) {
                        item.activityTime = duration._data.seconds + " seconds";
                    }
                });

                if (userId == null || userId <= 0) {
                    var oldUserInfo = getUserInfo();
                    oldUserInfo.recentActivities = null;
                    var newUserInfo = $.extend({}, oldUserInfo, data);
                    $window.localStorage.UserInfo = JSON.stringify(newUserInfo);
                    deferred.resolve(newUserInfo);
                }
                else {
                    deferred.resolve(data);
                }
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getPreviousInfor(userID) {
            var deferred = $q.defer();
            if (userId == null) userId = 0;
            api.getPreviousInfor.save({ userId: userID }, {}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getInterestFeeds(skip, take) {

            var deferred = $q.defer();
            api.interestFeeds.save({}, { skip: skip, take: take }, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getInterestFeedsCollection(skip, take) {

            var deferred = $q.defer();
            api.interestFeedsCollection.save({}, { skip: skip, take: take }, function (data) {
                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getUserProfile(option, keyword, filterBy, total) {

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;
           // var filter={operator:"or",filters:filterBy};
     
            api.getUserProfiles.save({}, { Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm}, function (data) {
                option.success(data);
            }, function (data) {

                option.error(data);
            });
        }

        function getUserType() {

            var defer = $q.defer();
            api.getUserTypes.query(function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });
            return defer.promise;
        }

        function getUserInfo() {

            if ($window.localStorage['userId'] != null) {
              //  debugger;
                var userInfo = {};
                if ($window.localStorage.UserInfo != null && $window.localStorage.UserInfo != '') {
                    userInfo = JSON.parse($window.localStorage.UserInfo);
                }
                else {
                    userInfo.userId = $window.localStorage['userId'];
                    if ($window.localStorage['email'] != null && $window.localStorage['email'].indexOf('@') != -1) {
                        userInfo.email = $window.localStorage['email'];
                    }
                    userInfo.photo = $window.localStorage['photo'];
                    if (userInfo.photo == null || userInfo.photo == '') {
                        // userInfo.photo = appConfig.noAvata;
                    }
                    userInfo.displayName = $window.localStorage['displayName'];
                    if (userInfo.displayName != null) {
                        userInfo.firstName = userInfo.displayName.substring(0, userInfo.displayName.indexOf(' '));
                    }

                    userInfo.lastLoginDate = $window.localStorage['lastLoginDate'];

                    userInfo.nickName = $window.localStorage['nickName'];

                    userInfo.accessToken = $window.localStorage['access-token'];
                    userInfo.imageUrl = $window.localStorage['imageUrl'];
                    userInfo.roles = [];
                    try {
                        userInfo.roles = JSON.parse($window.localStorage['roles']);
                    }
                    catch (err) {

                    }
                    userInfo.skillExpertise = $window.localStorage['skillExpertise'];
                    userInfo.tel = $window.localStorage['tel'];
                    userInfo.departmentName = $window.localStorage['departmentName'];
                    userInfo.divisionName = $window.localStorage['divisionName'];
                    userInfo.location = $window.localStorage['location'];
                    userInfo.locationId = $window.localStorage['locationId'];

                    $window.localStorage["UserInfo"] = userInfo;
                }

               // debugger;
               userInfo.isUser = !userInfo.isSMEUser;

               userInfo.isAdmin=userInfo.roles.indexOf("Administrator")!=-1;
               
                userInfo.isVCoPMCN = userInfo.roles.indexOf("VCoP MCN")!=-1;
                userInfo.isSMEUser = userInfo.roles.indexOf("SME User")!=-1;
                userInfo.isTechnicalAlertAdmin = userInfo.roles.indexOf("Technical Alert Administrator")!=-1;
                

               

                return userInfo;
            }

            return null;
        };

        function saveUserInfo(newUserInfo) {

            if (newUserInfo != null) {
                var oldUserInfo = getUserInfo();
                var userInfo = $.extend({}, oldUserInfo, newUserInfo);
                $window.localStorage.UserInfo = JSON.stringify(userInfo);
            }

        }

        function uploadAvartar(fd, userId) {

            var defer = $q.defer();
            api.Upload(userId).save(fd,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        function getAllDropdownAdminUser() {
            var deferred = $q.defer();

            api.GetAllDropdownAdminUsers.get({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getAllUsers() {
            var defer = $q.defer();
            api.getAllUsers.query(function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });
            return defer.promise;
        }

        function getAllUsersBySearchTerm(options, authors) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(authors, function (o) { return o.name });

            api.getAllUsersBySearchTerm.save({ searchTerm: searchTerm }, JSON.stringify(exists), function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }
        
        function saveUserProfile(postData) {
            var deferred = $q.defer();
            api.saveUserProfile.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        };
        function exportAllUsers() {
            var deferred = $q.defer();
            api.exportAllUsers.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function delUserProfile(ids) {
            var deferred = $q.defer();
            api.delUserProfile.save({}, ids, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        };

        function getLoginProfile(userId) {

            var deferred = $q.defer();
            if (userId == null) userId = 0;
            api.loginProfile.get({ userId: userId }, function (data) {

                data.isUser = !data.isSMEUser;
                data.roles.forEach(function (role) {
                    data.isAdmin = role.toUpperCase().indexOf('ADMINISTRATOR') != -1;
                    data.isVCoPMCN = role.toUpperCase().indexOf('VCOP MCN') != -1;
                    data.isSMEUser = role.toUpperCase().indexOf('SME user') != -1;  
                });


                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getAllRole() {
            var defer = $q.defer();
            api.getAllRoles.query(function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });
            return defer.promise;
        }

        function _getExpertProfilePaging(postData) {
            return api.getExpertProfilePaging.save({}, postData).$promise;
        }

        function _getAllWorkProjectExperience(userId) {
            if (!userId) userId = 0;
            return api.getAllWorkProjectExperience.query({ userId: userId }).$promise;
        }

        function _getWorkProjectExperienceById(id) {
            return api.getWorkProjectExperienceById.get({ id: id }).$promise;
        }

        function _saveWorkProjectExperience(postData) {
            return api.saveWorkProjectExperience.save({}, postData).$promise;
        }

        function _deleteWorkProjectExperience(id, skip) {
            return api.deleteWorkProjectExperience.remove({ id: id, skip: skip || false }).$promise;
        }
        function resetSkipForConfirm(userId, skipCollectionDialog, skipIdeaDialog, skipShareDocumentDialog, skipWorkingProjectDialog) {
            var deferred = $q.defer();
            api.resetSkipForConfirm.get(
                {
                    userId: userId,
                    isSkipCollectionDialog: skipCollectionDialog,
                    isSkipIdeaDialog: skipIdeaDialog,
                    isSkipShareDocumentDialog: skipShareDocumentDialog,
                    isSkipWorkingProjectDialog: skipWorkingProjectDialog
                }
                , function (data) {
                    deferred.resolve(data);
                }, function (data) {

                    deferred.reject(data);
                });
            return deferred.promise;
        }
        return {
            api: api,
            getPreviousInfor: getPreviousInfor,
            editUserProfile: editUserProfile,
            getRank: getRank,
            getProfile: getProfile,
            getInterestFeeds: getInterestFeeds,
            getUserProfile: getUserProfile,
            getUserType: getUserType,
            getUserInfo: getUserInfo,
            saveUserInfo: saveUserInfo,
            getInterestFeedsCollection: getInterestFeedsCollection,
            uploadAvartar: uploadAvartar,
            getAllDropdownAdminUser: getAllDropdownAdminUser,
            saveUserProfile: saveUserProfile,
            delUserProfile: delUserProfile,
            getAllUsers: getAllUsers,
            getLoginProfile: getLoginProfile,
            getAllRole: getAllRole,
            exportAllUsers:exportAllUsers,
            getExpertProfilePaging: _getExpertProfilePaging,
            getAllWorkProjectExperience: _getAllWorkProjectExperience,
            getWorkProjectExperienceById: _getWorkProjectExperienceById,
            saveWorkProjectExperience: _saveWorkProjectExperience,
            deleteWorkProjectExperience: _deleteWorkProjectExperience,
            resetSkipForConfirm: resetSkipForConfirm,
            getAllUsersBySearchTerm: getAllUsersBySearchTerm,
            getAllGTAUsers: getAllGTAUsers,
            exportAllGTAUsers:exportAllGTAUsers
        };
    }
})();
