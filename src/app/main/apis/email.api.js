(function () {
    'use strict';

    angular
        .module('app.email')
        .factory('EmailApi', EmailApi);

    /** @ngInject */
    function EmailApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/EmailTemplate/GetAll'),
            details: $resource(appConfig.SkillApi + 'api/Admin/EmailTemplate/Detail'),
            save: $resource(appConfig.SkillApi + 'api/Admin/EmailTemplate/Save'),

            getDistributionList: $resource(appConfig.SkillApi + 'api/Admin/User/GetDistributionList', {}, {
                query: { method: 'POST' }
              }),
              getDistributionListUserTypes: $resource(appConfig.SkillApi + 'api/Admin/User/GetAllDistributionListUserType', {}, {
                  save: {method: 'GET'}
              }),
            deleteDistributionListUsers: $resource(appConfig.SkillApi + 'api/Admin/User/DeleteDistributionListUsers'),
            addDistributionListUser: $resource(appConfig.SkillApi + 'api/Admin/User/SaveDistributionList'),
            exportDistributionListToExcel: $resource(appConfig.SkillApi + 'api/Admin/User/ExportDistributionList', {}, {
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
            })
        };

        function getAll() {

            var deferred = $q.defer();
            api.getAll.query({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getDetails(id) {

            var deferred = $q.defer();
            api.details.get({ id: id }, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function save(templateName, subject, bodyContent) {

            var deferred = $q.defer();
            var postData = {
                id: 0,
                templateName: templateName,
                subject: subject,
                description: '',
                bodyContent: bodyContent,
            };

            api.save.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getDistributionList(option, keyword, distributionListUserTypeId, type,filterBy, total) {

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;

            api.getDistributionList.save({}, { 
                Take: Take, 
                Skip: skip,
                 sort :sortField, 
                 Filter : filterBy , 
                 Group : Group , 
                 Aggregate: Aggregate, 
                 SearchString : searchTerm,
                 distributionListUserTypeId: distributionListUserTypeId,
                 type: type  }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function exportDistributionListToExcel() {
            var deferred = $q.defer();
            api.exportDistributionListToExcel.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getDistributionListUserTypes() {
            var deferred = $q.defer();
            api.getDistributionListUserTypes.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        return {
            api: api,

            getAll: getAll,
            getDetails: getDetails,
            save: save,
            
            getDistributionList: getDistributionList,
            deleteDistributionListUsers: function(postData) {
                return api.deleteDistributionListUsers.save(postData).$promise;
            },
            addDistributionListUser: function(postData) {
                return api.addDistributionListUser.save(postData).$promise;
            },
            exportDistributionListToExcel: exportDistributionListToExcel,
            getDistributionListUserTypes: getDistributionListUserTypes
        };
    }

})();