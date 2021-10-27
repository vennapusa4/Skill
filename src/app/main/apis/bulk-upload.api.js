(function () {
    'use strict';

    angular
        .module('app.bulkUpload')
        .factory('BulkUploadApi', BulkUploadApi);

    /** @ngInject */
    function BulkUploadApi($resource, appConfig, $q, Utils) {
        var $q = $q;

        var api = {
            //GenerateBulkUploadTemplate: $resource(appConfig.SkillApi + 'api/BulkUpload/GenerateBulkUploadTemplate'),
            GenerateBulkUploadTemplate: function () {
                return $resource(appConfig.SkillApi + 'api/BulkUpload/GenerateBulkUploadTemplate', {}, {
                    save: {
                        method: "POST",
                        headers: {
                            'Accept': 'application/octet-stream'
                        },
                        transformRequest: function (data) {
                            var additionalInfo = {
                                equipments: _.map(data.additionalEquipments, function (o) {
                                    return {
                                        equipmentId: o.equipmentId
                                    }
                                }),
                                projects: _.map(data.additionalProjects, function (o) {
                                    return {
                                        projectId: o.projectId,
                                        projectPhaseId: o.projectPhaseId,
                                        ppmsActivityId: o.ppmsActivityId,
                                        praElementsId: o.praElementsId
                                    }
                                }),
                                well: _.map(data.additionalWells, function (o) {
                                    return {
                                        wellId: o.wellId,
                                        wellPhaseId: o.wellPhaseId,
                                        wellOperationId: o.wellOperationId,
                                        wellTypeId: o.wellTypeId
                                    }
                                }),
                                businessSectors: _.map(data.businessSectors, function (o) {
                                    return {
                                        typeId: o.typeId,
                                        name: o.name
                                    }
                                }),
                                keyWords: data.additionalKeyWords,
                                "originalLanguage" : data.originalLanguage
                            };
                            var result = {
                                "type": data.type,
                                "sourceId": data.sourceId,
                                "submittedBy": data.submittedBy,
                                "isAuthorAlso": data.isAuthor,
                                "authors": data.authors,
                                "cop": data.copId,
                                "coverImageId": data.coverId,
                                "location": data.locationId,
                                "additionalInfos": additionalInfo,
                                
                            };
                            if (data.type !== 'Publication') {
                                delete result.sourceId;
                            }
                            return JSON.stringify(result);
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            localStorage['bulk-upload-templatename'] = Utils.getContentDisposition(headers('Content-Disposition'), 'filename');
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                localStorage['bulk-upload-template'] = _.split(reader.result, ',')[1];
                            }
                            reader.readAsDataURL(data);
                            return { status: true };
                        }
                    }
                });
            },
            DownloadFile: function (type) {
                return $resource(appConfig.SkillApi + 'api/BulkUpload/DownloadFile/:id', {}, {
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
                            var file = new Blob([data], {
                                type: contentType
                            });
                            saveAs(file, type + '.xlsx');
                        }
                    }
                })
            },
            Import: $resource(appConfig.SkillApi + 'api/BulkUpload/Import', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    cache: false
                }
            }),
            GetSmeUser: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSmeUser', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetSmeUsers: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSmeUsers', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            GetUserProfiles: $resource(appConfig.SkillApi + 'api/KnowledgeShare/GetUserProfiles', {}, {
                save: {
                    method: "POST",
                    isArray: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }),
            Proceed: $resource(appConfig.SkillApi + 'api/BulkUpload/Proceed'),
            Submit: $resource(appConfig.SkillApi + 'api/BulkUpload/Submit'),
            GetBatchNumbers: $resource(appConfig.SkillApi + 'api/BulkUpload/BatchNumber '),
            GetBatch: $resource(appConfig.SkillApi + 'api/BulkUpload/KnowLedgeDocumentByBatchNumber/:batchNumber'),
        };

        function GenerateBulkUploadTemplate(request) {

            var deferred = $q.defer();
            api.GenerateBulkUploadTemplate().save({}, request, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
            //var deferred = $q.defer();
            //api.delete.delete({ header: header }, {}, function (data) {

            //    deferred.resolve(data);
            //}, function (data) {

            //    deferred.reject(data);
            //});

            //return deferred.promise;
            //return true;
        }

        function GetSmeUser(options, disciplines) {
            var term = _.get(options, 'data.filter.filters[0].value');
            api.GetSmeUser.save({ searchTerm: term }, JSON.stringify(disciplines)).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.id, Text: _.isEmpty(o.displayName) ? o.userName : o.displayName } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        }

        function GetSmeUsers(options) {
            var term = _.get(options, 'data.filter.filters[0].value');
            api.GetSmeUsers.save({ searchTerm: term }, null).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { Id: o.id, Text: _.isEmpty(o.displayName) ? o.userName : o.displayName } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        }

        function GetUserProfiles(options) {
            var term = _.get(options, 'data.filter.filters[0].value');
            api.GetUserProfiles.save({ searchTerm: term }).$promise.then(function (res) {
                var result = _.map(res, function (o) { return { id: o.id, title: _.isEmpty(o.displayName) ? o.userName : o.displayName } });
                options.success(result);
            }, function (err) {
                options.error(err);
            });
        }

        return {
            api: api,
            GenerateBulkUploadTemplate: GenerateBulkUploadTemplate,
            GetSmeUser: GetSmeUser,
            GetSmeUsers: GetSmeUsers,
            GetUserProfiles: GetUserProfiles
        };
    }
})();
