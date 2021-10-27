(function () {
    'use strict';

    angular
        .module('app.adminReport')
        .factory('adminReportAPI', adminReportAPI);

    /** @ngInject */
    function adminReportAPI($resource, appConfig, $q , UserProfileApi) {
        var $q = $q; 
        
        var api = {
            getAllAbbreviations: $resource(appConfig.SkillApi + 'api/Abbreviation/GetAll'),
            getAllReportTemplateType: $resource(appConfig.SkillApi + 'api/Admin/PerformanceReport/GetPerformanceReportTemplateTypes', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getAllStatus: $resource(appConfig.SkillApi + 'api/Abbreviation/GetStatus'),
                
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
            updateKnowledgeReuse: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeReuse/Edit', {}, {
                save: { method: 'POST', isArray: false }
            }),
            deleteKnowledgeReuse: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeReuse/Delete', {}, {
                save: { method: 'POST', isArray: false }
            }),

            //Potential Value Tracking

            getAllKnowledgeReuse: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeReuse/GetAll'),
            getAllValueTracking: $resource(appConfig.SkillApi + 'api/Admin/GetAllPotentialValueKnowledges'),
            getSearchTermWithZeroResults: $resource(appConfig.SkillApi + 'api/Admin/Searchterms/GetAllZeroSearchResults'),
        };

        function getAllKnowledgeReuse(option, keyword,filterBy,total) {
        
            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;

            api.getAllKnowledgeReuse.save({}, { Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm}, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getAllValueTracking(option, keyword, filterBy, total) {
        
            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;

            api.getAllValueTracking.save({}, { Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm}, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getSearchTermWithZeroResults(option, keyword,total) {
        
            var keyword = keyword;
            var skip = option.data.skip;
            var take = option.data.take;
            var sortField = _.get(option, 'options.data.sort[0].field', 'searchTerm');
            var sortDir = _.get(option, 'options.data.sort[0].dir', 'asc');
            var Export= (option.data.take === total);

            api.getSearchTermWithZeroResults.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: Export }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

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
        function updateKnowledgeReuse(fd) {
           var defer = $q.defer();
           api.updateKnowledgeReuse.save(fd,
               function (data) {
                   defer.resolve(data);
               },
               function (data) {
                   defer.reject(data);
               }
           );
           return defer.promise;
       }
        function deleteKnowledgeReuse(fd) {
            var defer = $q.defer();
            api.deleteKnowledgeReuse.save(fd,
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
            getAllAbbreviationStatus: getAllAbbreviationStatus,
            getById:getById,
            saveAbbreviations:saveAbbreviations,
            updateAbbreviations:updateAbbreviations,
            deleteAbbreviations:deleteAbbreviations,
            downloadTemplate: downloadTemplate,
            getAllKnowledgeReuse:getAllKnowledgeReuse,
            updateKnowledgeReuse: updateKnowledgeReuse,
            deleteKnowledgeReuse: deleteKnowledgeReuse,
            getAllValueTracking: getAllValueTracking,
            getSearchTermWithZeroResults: getSearchTermWithZeroResults

        };
    }

})();