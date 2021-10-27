(function () {
  'use strict';

  angular
    .module('app.knowledgeManagement')
    .factory('KnowledgeManagementApi', KnowledgeManagementApi);

  /** @ngInject */
  function KnowledgeManagementApi($resource, appConfig, $q) {

    var api = {
      knowledges: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/GetKnowledgeDocuments', {}, {
        query: { method: 'POST' }
      }),
      getTAknowledges: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/GetTechnicalAlerts', {}, {
        query: { method: 'POST' }
      }),
      getTAImplementation: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/GetTAImplementations', {}, {
        query: { method: 'POST' }
      }),
      exportSQLCommand: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/GetQueryString', {}, {
        query: {
          method: 'POST',
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
            saveAs(file, 'Knowledge Management_SQLQuery.sql');
          }
        }
      }),
      validateKnowledges: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/Validate'),
      deleteKnowledges: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/Delete'),
      updateKnowledge: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/UpdateKnowledgeDocument'),
      getSkipStatus: $resource(appConfig.SkillApi + '/api/Admin/SystemSettings/GetAll' , {}, {
        query: { method: 'POST' }
      }),
      skipReview: $resource(appConfig.SkillApi + '/api/Admin/SystemSettings/Update' , {}, {
        query: { method: 'POST' }
      }),
      getKnowledgeDocumentSettingById: $resource(appConfig.SkillApi + '/api/Admin/KnowledgeDocument/GetKnowledgeDocumentSettingById'),
      getAllStatus: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeDocument/AllStatus', {}, {
        query: {
          method: 'GET',
          cache: true,
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }),
      getAllLLType: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeDocument/AllLLType', {}, {
        query: {
          method: 'GET',
          cache: true,
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }),
      getAllCollection: $resource(appConfig.SkillApi + 'api/Admin/Collection/GetAllCollections', {}, {
        query: {
          method: 'GET',
          cache: true,
          isArray: false,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }),
      getAllKnowledgeByCollection: $resource(appConfig.SkillApi + 'api/Admin/Collection/GetAllknowledgebyCollId', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      batchUpdate: $resource(appConfig.SkillApi + 'api/Admin/KnowledgeDocument/UpdateKnowledgeDocumentMulti'),
      ExportToExcel: function (type) {
        return $resource(appConfig.SkillApi + 'api/Admin/KnowledgeDocument/ExportToExcel', {}, {
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

              // var disposition = headers('content-disposition');
              // disposition = disposition ? disposition.split(';') : [];
              // var filename = disposition.length > 1 ? disposition[1].split('=')[1] : null;
              // return {
              //     Blob: new Blob([data], { type: headers('content-type') }),
              //     Filename: filename
              // };
            }
          }
        })
      },
    };

    function getTAImplementation(option, keyword, filterBy, total, isWithReplication) {
      
      // var queryObj = {
      //   searchTerm: searchTerm,
      //   filterBy: filterBy,
      //   skip: options.data.skip,
      //   take: options.data.take,
      //   sortField: _.get(options, 'options.data.sort[0].field', ''),
      //   sortDir: _.get(options, 'options.data.sort[0].dir', ''),
      //   isExport: (options.data.take === total),
      //   isWithReplication: isWithReplication,
      // }

      var skip = option.data.skip;
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var isExport = (option.data.take === total);
      var Take =  option.data.take;
      var Aggregate = null;
      var Group = null;
      var searchTerm = keyword == null || undefined ? "" : keyword;
      var isWithReplication = isWithReplication;

      api.getTAImplementation.query({ Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm, isWithReplication:isWithReplication}).$promise.then(function (res) {
        option.success(res);
      }, function (err) {
        option.error(err);
      });
    };

    function getTAknowledges(option, keyword, filterBy, total){
      var skip = option.data.skip;
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var isExport = (option.data.take === total);
      var Take =  option.data.take;
      var Aggregate = null;
      var Group = null;
      var searchTerm = keyword == null || undefined ? "" : keyword;
      var isWithReplication = isWithReplication;

      api.getTAknowledges.query({ Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm, isWithReplication:isWithReplication}).$promise.then(function (res) {
        option.success(res);
      }, function (err) {
        option.error(err);
      });
    }
    function getKnowledges(option, keyword, filterBy, total, isWithReplication) {
      
      // var queryObj = {
      //   searchTerm: searchTerm,
      //   filterBy: filterBy,
      //   skip: options.data.skip,
      //   take: options.data.take,
      //   sortField: _.get(options, 'options.data.sort[0].field', ''),
      //   sortDir: _.get(options, 'options.data.sort[0].dir', ''),
      //   isExport: (options.data.take === total),
      //   isWithReplication: isWithReplication,
      // }

      var skip = option.data.skip;
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var isExport = (option.data.take === total);
      var Take =  option.data.take;
      var Aggregate = null;
      var Group = null;
      var searchTerm = keyword == null || undefined ? "" : keyword;
      var isWithReplication = isWithReplication;

      api.knowledges.query({ Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm, isWithReplication:isWithReplication}).$promise.then(function (res) {
        option.success(res);
      }, function (err) {
        option.error(err);
      });
    };

  function skipReview(status){
      var deferred = $q.defer();
      api.skipReview.save({},{ SkipReview : status}, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getSkipStatus(){
      var deferred = $q.defer();
      api.getSkipStatus.query({ }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }


    function exportWithReplication(options, searchTerm, filterBy, total) {
      var queryObj = {
        searchTerm: searchTerm,
        filterBy: filterBy,
        skip: options.data.skip,
        take: options.data.take,
        sortField: _.get(options, 'options.data.sort[0].field', ''),
        sortDir: _.get(options, 'options.data.sort[0].dir', ''),
        isExport: (options.data.take === total)
      }

      api.exportWithReplication.query(queryObj).$promise.then(function (res) {
        options.success(res);
      }, function (err) {
        options.error(err);
      });
    };

    function validateKnowledges(ids) {
      var deferred = $q.defer();

      api.validateKnowledges.save({}, ids, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function updateKnowledge(item) {
      var deferred = $q.defer();

      api.updateKnowledge.save({}, item, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function deleteKnowledges(ids) {
      var deferred = $q.defer();

      api.deleteKnowledges.save({}, ids, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getCollections(){
      var deferred = $q.defer();
      api.getAllCollection.query({ }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }
    function getKnowledgeCollection(option, id){
      var deferred = $q.defer();
      api.getAllKnowledgeByCollection.query({CollectionId: id }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function getKnowledgeDocumentSettingById(id) {
      var deferred = $q.defer();

      api.getKnowledgeDocumentSettingById.save({ id: id }, {}, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getAllRefs() {
      return $q.all({
        allLLType: api.getAllLLType.query().$promise,
        allStatus: api.getAllStatus.query().$promise,
      });
    }

    function ExportToExcel(searchTerm) {
      var queryObj = {
        searchTerm: searchTerm,
        skip: 0,
        take: 1000000000
      }
      return api.ExportToExcel(queryObj).$promise;
    }

    return {
      api: api,
      getAllRefs: getAllRefs,
      getKnowledges: getKnowledges,
      getTAknowledges:getTAknowledges,
      getTAImplementation:getTAImplementation,
      getCollections: getCollections,
      getKnowledgeCollection: getKnowledgeCollection,
      exportWithReplication: exportWithReplication,
      validate: validateKnowledges,
      deleteKnowledges: deleteKnowledges,
      updateKnowledge: updateKnowledge,
      getKnowledgeDocumentSettingById: getKnowledgeDocumentSettingById,
      ExportToExcel: ExportToExcel,
      skipReview:skipReview,
      getSkipStatus: getSkipStatus 
    };
  }

})();
