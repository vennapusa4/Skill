(function () {
    'use strict';

    angular
        .module('app.abbreviation')
        .factory('abbreviationAPI', abbreviationAPI);

    /** @ngInject */
    function abbreviationAPI($resource, appConfig, $q , UserProfileApi) {
        var $q = $q; 
        
        var api = {
            getAllAbbreviations: $resource(appConfig.SkillApi + 'api/Abbreviation/GetAll'),
            getAllAbbreviationsLanding: $resource(appConfig.SkillApi + 'api/Abbreviation/GetAbbreviationsforLandingPage', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getAllReportTemplateType: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/GetPerformanceReportTemplateTypes', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getAllStatus: $resource(appConfig.SkillApi + 'api/Abbreviation/GetStatus'),
            getToken: $resource(appConfig.SkillApi + 'api/Abbreviation/GetToken', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getById: $resource(appConfig.SkillApi + 'api/Abbreviation/GetById', {}, {
                query: { method: 'GET', isArray: false }
            }),
            saveAbbreviations: $resource(appConfig.SkillApi + 'api/Abbreviation/Create', {}, {
                save: { method: 'POST', isArray: false }
            }),
            updateAbbreviations: $resource(appConfig.SkillApi + 'api/Abbreviation/Update', {}, {
                save: { method: 'POST', isArray: false }
            }),
            deleteAbbreviations: $resource(appConfig.SkillApi + 'api/Abbreviation/Delete', {}, {
                save: { method: 'POST', isArray: false }
            }),
        };

       
       function getAllAbbreviations(option, keyword, columnName, filterChar) {
           console.log('abbreviation api called');

            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            columnName = columnName !== undefined ? columnName : '';
            filterChar= filterChar !== undefined ? filterChar : '';
            api.getAllAbbreviations.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false, columnName: columnName, filterChar: filterChar }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }
        function getAllAbbreviationsLanding(option) {
            console.log('abbreviation landing api called');
 
            var defer = $q.defer();
             api.getAllAbbreviationsLanding.save(function (data) {
                defer.resolve(data);
             }, function (data) {
                defer.reject(data);
             });
             return defer.promise;
         }
        function getAllAbbreviationStatus(option, skip, take) {

            api.getAllStatus.save({}, {skip: skip, take: take }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });

            // var deferred = $q.defer();
            // api.getAllStatus.query({ skip: skip, take: take }, function (data) {
            //     deferred.resolve(data);
            // }, function (data) {
            //     deferred.reject(data);
            // });
            // return deferred.promise;
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
        function getToken() {
            var deferred = $q.defer();
            api.getToken.query({  }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function saveAbbreviations(fd) {
             //debugger;
            // return api.saveTemplate.save(file , postData).$promise;
            var defer = $q.defer();
            api.saveAbbreviations.save(fd,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        }
        function updateAbbreviations(fd) {
            //debugger;
           // return api.saveTemplate.save(file , postData).$promise;
           var defer = $q.defer();
           api.updateAbbreviations.save(fd,
               function (data) {
                   defer.resolve(data);
               },
               function (data) {
                   defer.reject(data);
               }
           );
           return defer.promise;
       }
        function deleteAbbreviations(fd) {
             //debugger;
            // return api.saveTemplate.save(file , postData).$promise;
            var defer = $q.defer();
            api.deleteAbbreviations.save(fd,
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
            getAllAbbreviations: getAllAbbreviations,
            getAllAbbreviationsLanding: getAllAbbreviationsLanding,
            getAllAbbreviationStatus: getAllAbbreviationStatus,
            getById:getById,
            getToken:getToken,
            saveAbbreviations:saveAbbreviations,
            updateAbbreviations:updateAbbreviations,
            deleteAbbreviations:deleteAbbreviations,
            downloadTemplate: downloadTemplate

        };
    }

})();