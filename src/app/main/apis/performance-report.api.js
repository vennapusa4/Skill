(function () {
    'use strict';

    angular
        .module('app.performanceReport')
        .factory('performanceReportAPI', performanceReportAPI);

    /** @ngInject */
    function performanceReportAPI($resource, appConfig, $q , UserProfileApi) {
        var $q = $q; 
        
        var api = {
            getAllPerformanceReportTemplates: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/GetAllPerformanceReportTemplates'),
            getAllReportTemplateType: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/GetPerformanceReportTemplateTypes', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getById: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/GetAllPerformanceReportDetails', {}, {
                query: { method: 'GET', isArray: false }
            }),
            //saveTemplate: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/Save'),       
            saveTemplate: function (type) {
                return $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/Save',  {}, {
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

            downloadTemplate: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/download', {}, {
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

            
        };

       
       function getAllPerformanceReportTemplates(option, keyword) {
        var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
        var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
        var keyword = keyword !== undefined ? keyword : "";
        var skip = option.data.skip !== undefined ? option.data.skip : 0;
        var take = option.data.take !== undefined ? option.data.take : 10;
        api.getAllPerformanceReportTemplates.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
            option.success(data);
        }, function (data) {
            option.error(data);
        });
        }

        function getAllReportTemplateType() {
            var deferred = $q.defer();
            api.getAllReportTemplateType.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getById(idx) {
            var deferred = $q.defer();
            api.getById.query({ Id: idx }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function saveTemplate(type , fd) {
             //debugger;
            // return api.saveTemplate.save(file , postData).$promise;
            var defer = $q.defer();
            api.saveTemplate(type).save(fd,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        }

        function downloadTemplate(templateid) {
            var deferred = $q.defer();
            api.downloadTemplate.get({ id: templateid }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        return {
            api: api,
            getAllPerformanceReportTemplates: getAllPerformanceReportTemplates,
            getAllReportTemplateType : getAllReportTemplateType,
            getById:getById,
            saveTemplate : saveTemplate,
            downloadTemplate: downloadTemplate

        };
    }

})();