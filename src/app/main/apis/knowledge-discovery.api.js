(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .factory('KnowledgeDiscoveryApi', KnowledgeDiscoveryApi);

    /** @ngInject */
    function KnowledgeDiscoveryApi($resource, appConfig, $q, KnowledgeService, Utils) {
        var $q = $q;

        var api = {
            Build: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Build/:type?id=:id'),
            Improve: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Improve/:type?id=:id&toLanguage=:toLanguage'),
            Validate: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Validate/:type?id=:id'),
            Save: function (type, nextValidate) {
                return $resource(appConfig.SkillApi + 'api/KnowledgeShare/Build/Save' + type + '?nextValidate=' + nextValidate);
            },
            SaveImprove: function (type, nextValidate,toLanguage) {
              return $resource(appConfig.SkillApi + 'api/KnowledgeShare/Improve/Save' + type + '?nextValidate=' + nextValidate + '&toLanguage=' + toLanguage);
            },
            SaveValidate: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Validate/Save/:type?isSubmit=:isSubmit&?isReviewer=:isReviewer'),
            SubmitValidate: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Validate/Submit/:type'),
            Complete: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Submit/Comleted/:type/:id'),
            GetDiscipline: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchDiscipline', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetSkill: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSkillReferenced'),
            GetSkillTA: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSkillReferencedTA'),
            GetSmeUser: $resource(appConfig.SkillApi + '/api/KnowledgeShare/SearchSmeUser', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetGtaUser: $resource(appConfig.SkillApi + '/api/KnowledgeShare/SearchGtaUser', {}, {
              save: {
                method: "POST",
                isArray: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            }),
            GetEmails: $resource(appConfig.SkillApi + '/api/KnowledgeShare/SearchEmailShare', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetValueTypes: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Validate/:type?id=:id'),
            BestPractices: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/BestPractices'),
            LessonsLearnt: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/LessonsLearnt'),
            Publications: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/Publications'),
            Collections: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/Collections'),
            Upload: function (type) {
                return $resource(appConfig.SkillApi + 'api/KnowledgeShare/Upload/' + type, {}, {
                    save: {
                        method: "POST",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/json'
                        }
                    }
                });
            },
            Avatar: function (userId) {
                return $resource(appConfig.SkillApi + 'api/KnowledgeShare/DowloadUserImage/' + userId, {}, {
                    get: {
                        method: "GET",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/octet-stream'
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            var contentDisposition = headers('Content-Disposition');
                            var dict = _.fromPairs(_.map(_.split(contentDisposition, ';'), function (o) {
                                return _.trim(o).split('=');
                            }));
                            var fileId = dict['id'];
                            return { url: Utils.getImage('avatar', fileId) };
                        }
                    }
                });
            },
            //UploadStatus: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Upload/Status/:id'),
            UploadStatus: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Upload/Status' , {}, {
                query: { method: 'GET', isArray: true }
            }),
            CollectionsSummaryLink: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/Collections/{Id}/Summary'),
            CollectionsSummary: function (Id) {
                var link = api.CollectionsSummaryLink.replace('{Id}', Id);
                return $resource(link);
            },
            mostEngaged: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/GetMostEngaged'),
            shareKnowledgeDiscovery: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/Share'),
            SaveBuildInsight: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SubmitInsightShareInperience'),
            SubmitInsightShareInperience: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Validate/SubmitInsightShare'),
            SearchKnowledgeReplication: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchKnowledgeReplications', {}, {
                save: { method: 'POST', isArray: true }
              }),
            SearchKnowledgeImplementationTA: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchKnowledgeImplementationTA', {}, {
                save: { method: 'POST', isArray: true }
              }),
            getAuditTrial: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/GetAuditTrial'),
            getKDTitle : $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/getKDTitle', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getDuplicateKD : $resource(appConfig.SkillApi + 'api/KnowledgeShare/CheckKdTitle', {}, {
                query: { method: 'GET', isArray: false }
            }), 
        };

        function SearchKnowledgeReplication(options, knowledge) {
            var deferred = $q.defer();
            var title = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(knowledge, function (o) { return o.knowledgeDocumentId });
      
            api.SearchKnowledgeReplication.save({ title: title }, JSON.stringify(exists), function (res) {
              options.success(res);
            }, function (res) {
      
              options.error(res);
            });
      
            return deferred.promise;
          }
          function SearchKnowledgeImplementationTA(options, knowledge) {
            var deferred = $q.defer();
            var title = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(knowledge, function (o) { return o.knowledgeDocumentId });
      
            api.SearchKnowledgeImplementationTA.save({ title: title }, JSON.stringify(exists), function (res) {
              options.success(res);
            }, function (res) {
      
              options.error(res);
            });
      
            return deferred.promise;
          }

        function getDiscipline(options, parentId, filters,languageCode) {
            var term = _.get(options, 'data.filter.filters[0].value');

            var getData = {
                searchTerm: term,
                languageCode: languageCode,
                parentId: parentId
            };
            api.GetDiscipline.save(getData, JSON.stringify(filters)).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.id, Text: o.name, ParentId: o.parentId } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        };

        function getSkill(options , kdID) {
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.GetSkill.query({ keyword: searchTerm,KdId: kdID }).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.documentId, Text: o.title } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        };


        function getSkillTA(options , kdID) {
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.GetSkillTA.query({ searchTerm: searchTerm,KdId: kdID }).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.documentId, Text: o.title } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        };

        function getValueTypes(options, type, id) {
            api.GetValueTypes.get({ type: type, id: id }).$promise.then(function (res) {
                var result = _.map(res.valueTypes, function (o) { return { Id: o.id, Text: o.valueTypeName } });
                options.success(result);
            }, function (err) {
                options.error(err);
            })
        };

        function getEmails(options) {
            var term = _.get(options, 'data.filter.filters[0].value');
            api.GetEmails.save({ searchTerm: _.isEmpty(term) ? '' : term }, JSON.stringify([])).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.email, PersonName: o.displayName, PersonDept: o.title, accountName: o.accountName } })
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        };

        function mostEngaged() {

            var deferred = $q.defer();
            api.mostEngaged.save({},
                function (data) {

                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
            );

            return deferred.promise;
        };

        function buildByType(type, id) {
            var defer = $q.defer();
            api.Build.get({ type: type, id: id },
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        function improveByType(type,toLanguage,id) {
            var defer = $q.defer();
            api.Improve.get({ type: type, toLanguage: toLanguage, id: id },
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        function saveByType(type, nextValidate, data, isReviewer) {
            var defer = $q.defer();
            api.Save(type, nextValidate, isReviewer).save(JSON.stringify(data),
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        // function SaveValidate(type, nextValidate, data, isReviewer){
        //     var defer = $q.defer();
        //     api.SaveValidate(type, isSubmit, isReviewer).save(JSON.stringify(data),
        //         function (data) {
        //             defer.resolve(data);
        //         },
        //         function (data) {
        //             defer.reject(data);
        //         }
        //     );
        //     return defer.promise;
        // }

        function saveImproveByType(type, nextValidate, data,toLanguage) {
            var defer = $q.defer();
            api.SaveImprove(type, nextValidate,toLanguage).save(JSON.stringify(data),
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        function getAvatar(userId) {
            var defer = $q.defer();
            api.Avatar(userId).get({},
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };

        function getAvatars(userIds) {
            var promises = [];
            _.forEach(userIds, function (userId) {
                promises.push(getAvatar(userId));
            });
            return $q.all(promises);
        };

        function getBestPractices(SortBy, SearchCategory, SearchText, Skip, Take) {


        };

        function getLessonsLearnt(SortBy, SearchCategory, SearchText, Skip, Take) {


        };

        function getPublications(SortBy, SearchCategory, SearchText, Skip, Take) {


        };

        function getCollections(SortBy, SearchCategory, SearchText, Skip, Take) {


        };

        function uploadAttachment(type, fd) {
            var defer = $q.defer();
            api.Upload(type).save(fd,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        };
        function getUploadStatus(id){
            // debugger;
            var deferred = $q.defer();
            
            api.UploadStatus.query({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getAuditTrial(id){
            // debugger;
            var deferred = $q.defer();
            
            api.getAuditTrial.query({ kdID: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getKDTitle(id){
            // debugger;
            var deferred = $q.defer();
            
            api.getKDTitle.query({ kdID: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getDuplicateKD(title){
            // debugger;
            var deferred = $q.defer();
            
            api.getDuplicateKD.query({title : title }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        
        function shareKnowledgeDiscovery(postData) {
            var deferred = $q.defer();
            api.shareKnowledgeDiscovery.save({}, postData,
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
            );
            return deferred.promise;
        }
        function SaveBuildInsight(postData) {
            var deferred = $q.defer();
            api.SaveBuildInsight.save({}, postData,
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
            );
            return deferred.promise;
        }
        function SubmitInsightShareInperience(postData) {
            var deferred = $q.defer();
            api.SubmitInsightShareInperience.save({}, postData,
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
            );
            return deferred.promise;
        }
        

        return {
            api: api,
            getDiscipline: getDiscipline,
            getSkill: getSkill,
            getSkillTA: getSkillTA,
            getValueTypes: getValueTypes,
            getEmails: getEmails,
            mostEngaged: mostEngaged,
            buildByType: buildByType,
            improveByType: improveByType,
            saveByType: saveByType,
            saveImproveByType: saveImproveByType,
            getAvatar: getAvatar,
            getAvatars: getAvatars,
            getUploadStatus: getUploadStatus,
            getBestPractices: getBestPractices,
            getLessonsLearnt: getLessonsLearnt,
            getPublications: getPublications,
            uploadAttachment: uploadAttachment,
            shareKnowledgeDiscovery: shareKnowledgeDiscovery,
            SaveBuildInsight: SaveBuildInsight,
            SubmitInsightShareInperience: SubmitInsightShareInperience,
            SearchKnowledgeReplication:SearchKnowledgeReplication,
            SearchKnowledgeImplementationTA:SearchKnowledgeImplementationTA,
            getAuditTrial:getAuditTrial,
            getKDTitle:getKDTitle,
            getDuplicateKD: getDuplicateKD
        };
    }

})();
