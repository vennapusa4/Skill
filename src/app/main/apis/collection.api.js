(function () {
    'use strict';

    angular
        .module('app.collection')
        .factory('CollectionApi', CollectionApi);

    /** @ngInject */
    function CollectionApi($resource, appConfig, $q, CollectionService) {
        var $q = $q;
        var api = {
            GetCollection: $resource(appConfig.SkillApi + 'api/Collection/Detail/CollectionById', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetKnowledgeByCollection: $resource(appConfig.SkillApi + 'api/Collection/Detail/GetKnowledgeDocumentByColletionId', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetSimilarByCollection: $resource(appConfig.SkillApi + 'api/Collection/Detail/GetSimilarCollection', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            CreateCollection: $resource(appConfig.SkillApi + 'api/Collection/Create', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            UpdateCollection: $resource(appConfig.SkillApi + 'api/Collection/Update', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            DeleteCollection: $resource(appConfig.SkillApi + 'api/Collection/Delete', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetRecommendedKnowledge: $resource(appConfig.SkillApi + 'api/Collection/Detail/GetRecommendedKD', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            Upload: function (type) {
                return $resource(appConfig.SkillApi + 'api/Collection/UploadCoverImage', {}, {
                    save: {
                        method: "POST",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/octet-stream'
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            return CollectionService.transform(data, headers);
                        }
                    }
                });
            },
            GetCollectionsByKdId: $resource(appConfig.SkillApi + 'api/Collection/GetAllCollectionCheckedByExist', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            AddKdToCollections: $resource(appConfig.SkillApi + 'api/Collection/AddOrUpdateKdToCollections', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            AddKdToCollection: $resource(appConfig.SkillApi + 'api/Collection/AddKdToCollection'),
            RemoveKdFromCollection: $resource(appConfig.SkillApi + 'api/Collection/RemoveKdFromCollection', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            ActionUser: $resource(appConfig.SkillApi + 'api/Collection/ActionUser', {}, {
                save: {
                    method: "POST",
                    isArray: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            // GetAllKnowledgeDocumentWithoutCollection: $resource(appConfig.SkillApi + 'api/Collection/GetAllKnowledgeDocument'),
            PostTagging: $resource(appConfig.SkillApi + 'api/Collection/Tagging/Post'),
            CheckSkip: $resource(appConfig.SkillApi + 'api/Collection/CheckIsSkip'),
            shareCollection: $resource(appConfig.SkillApi + 'api/Collection/ShareMail'),
        };


        function getCollection(options, success, error) {
            api.GetCollection.save({ id: options.id }, {}).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };

        function getKnowledgeByCollection(options, success, error) {
            api.GetKnowledgeByCollection.save({ collectionID: options.id, knowledgeDocumentId: options.knowledgeDocumentId }, options.pagging).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };

        function getSimilarByCollection(options, success, error) {
            api.GetSimilarByCollection.save({}, options.pagging).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };

        function createCollection(options, success, error) {
            api.CreateCollection.save({}, options).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function updateCollection(options, success, error) {
            api.UpdateCollection.save({}, options).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function deleteCollection(options, success, error) {
            api.DeleteCollection.save({ id: options.id }, options).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function getRecommendedKnowledge(options, success, error) {
            api.GetRecommendedKnowledge.save({ collectionId: options.id }, options.pagging).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
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
        function getCollectionsByKdId(options, success, error) {
            api.GetCollectionsByKdId.save({ kdId: options.id }, {}).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function openForm(selector) {
            $(selector).modal("open");
        }
        function closeForm(selector) {
            $(selector).modal("hide");
        }
        function addKdToCollections(options, success, error) {
            api.AddKdToCollections.save({ kdId: options.kd_id }, options.data).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function addKdToCollection(options, success, error) {
            api.AddKdToCollection.save(options, {}).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function removeKdFromCollection(options, success, error) {
            api.RemoveKdFromCollection.save(options, {}).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        };
        function actionUser(options, success, error) {
            api.ActionUser.save({}, options).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        }
        // function GetAllKnowledgeDocumentWithoutCollection(collectionId, options, success, error) {
        //   api.Knowledges.save({ collectionId: collectionId }, options.pagging).$promise.then(function (res) {
        //     success(res);
        //   }, function (err) {
        //     error(err);
        //   });
        // }
        function isAdmin(success, error) {
            api.IsAdmin.save({}, {}).$promise.then(function (res) {
                success(res);
            }, function (err) {
                error(err);
            });
        }

        function postLike(collectionId, isLiked) {

            var deferred = $q.defer();
            var likeRequest = { id: collectionId, taggingID: 3, typeId: 1 };
            api.ActionUser.save({}, likeRequest, function (response) {

                deferred.resolve(response);
            }, function (response) {

                logger.error(response.data.errorMessage);
            });
            return deferred.promise;
        };

        function postSave(collectionId, isSavedToLibrary) {

            var deferred = $q.defer();
            var saveRequest = { id: collectionId, taggingID: 1, typeId: 1 };
            api.ActionUser.save({}, saveRequest, function (response) {

                deferred.resolve(response);
            }, function (response) {

                logger.error(response.data.errorMessage);
            });
            return deferred.promise;
        };

        function postShare(collectionId, isShared) {

            var deferred = $q.defer();
            var shareRequest = { id: collectionId, taggingID: 4, typeId: 1 };
            api.ActionUser.save({}, shareRequest, function (response) {

                deferred.resolve(response);
            }, function (response) {

                logger.error(response.data.errorMessage);
            });
            return deferred.promise;
        };

        function shareCollection(postData) {
            var deferred = $q.defer();
            api.shareCollection.save({}, postData,
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

            getCollection: getCollection,
            getKnowledgeByCollection: getKnowledgeByCollection,
            getSimilarByCollection: getSimilarByCollection,
            createCollection: createCollection,
            getRecommendedKnowledge: getRecommendedKnowledge,
            updateCollection: updateCollection,
            deleteCollection: deleteCollection,
            uploadAttachment: uploadAttachment,
            getCollectionsByKdId: getCollectionsByKdId,
            addKdToCollections: addKdToCollections,
            addKdToCollection: addKdToCollection,
            removeKdFromCollection: removeKdFromCollection,
            actionUser: actionUser,
            // getKnowledges: getKnowledges,
            openForm: openForm,
            closeForm: closeForm,
            postLike: postLike,
            postSave: postSave,
            postShare: postShare,
            shareCollection: shareCollection
            // GetAllKnowledgeDocumentWithoutCollection: GetAllKnowledgeDocumentWithoutCollection
        };
    }

})();
