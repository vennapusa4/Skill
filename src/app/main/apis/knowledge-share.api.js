(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('KnowledgeShareApi', KnowledgeShareApi);

    /** @ngInject */
    function KnowledgeShareApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            AdditionalSaveProject: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Additional/SaveProject'),
            AdditionalSaveWell: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Additional/SaveWell'),
            AdditionalSaveEquipment: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Additional/SaveEquipment'),
            AdditionalAddDeleteEquipment: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Additional/AddDeleteEquipment'),
            AdditionalSaveKeyWord: $resource(appConfig.SkillApi + 'api/KnowledgeShare/Additional/SaveKeyWord'),
            addSociety: $resource(appConfig.SkillApi + 'api/KnowledgeShare/CreateSocieties', {}, {
                save: { method: 'POST' }
            }),
        };

        function AdditionalSaveProject(postData) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: null
            };

            api.AdditionalSaveProject.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalDeleteProject(id) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: true
            };
            var postData = {
                id: id
            };

            api.AdditionalSaveProject.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalSaveWell(postData) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: null
            };

            api.AdditionalSaveWell.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalDeleteWell(id) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: true
            };
            var postData = {
                id: id
            };

            api.AdditionalSaveWell.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalSaveEquipment(postData) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: null
            };

            api.AdditionalSaveEquipment.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalDeleteEquipment(id) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: true
            };
            var postData = {
                id: id
            };

            api.AdditionalSaveEquipment.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalAddDeleteEquipment(ListAdditionalEquiqmentRequest, DeleteIds) {

            var deferred = $q.defer();
            var getData = {
            };
            var postData = {
                ListAdditionalEquiqmentRequest: ListAdditionalEquiqmentRequest,
                DeleteIds: DeleteIds
            };

            api.AdditionalAddDeleteEquipment.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalSaveKeyWord(postData) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: null
            };

            api.AdditionalSaveKeyWord.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function AdditionalDeleteKeyWord(id) {

            var deferred = $q.defer();
            var getData = {
                isDeleted: true
            };
            var postData = {
                id: id
            };

            api.AdditionalSaveKeyWord.save(getData, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function addSociety(postData) {
            var deferred = $q.defer();
            api.addSociety.save({}, postData, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });

            return deferred.promise;
        }
        return {
            api: api,

            AdditionalSaveProject: AdditionalSaveProject,
            AdditionalDeleteProject: AdditionalDeleteProject,

            AdditionalSaveWell: AdditionalSaveWell,
            AdditionalDeleteWell: AdditionalDeleteWell,

            AdditionalSaveEquipment: AdditionalSaveEquipment,
            AdditionalDeleteEquipment: AdditionalDeleteEquipment,

            AdditionalSaveKeyWord: AdditionalSaveKeyWord,
            AdditionalDeleteKeyWord: AdditionalDeleteKeyWord,
            AdditionalAddDeleteEquipment: AdditionalAddDeleteEquipment,
            addSociety: addSociety
        };
    }

})();