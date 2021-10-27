(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .factory('SearchApi', SearchApi);

    /** @ngInject */
    function SearchApi($resource, appConfig, $q, $timeout) {
        var $q = $q;
        var $timeout = $timeout;

        var api = {
            Suggestions: $resource(appConfig.SkillApi + 'api/Search/Suggestions', {}, {
                save: { method: 'POST', isArray: true }
            }),
            GetDisciplineSuggestions: $resource(appConfig.SkillApi + 'api/Search/GetDisciplineSuggestions', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchUser: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchAuthor', {}, {
                save: { method: 'POST', isArray: true }
            }),
            searchUserForPointAdmin: $resource(appConfig.SkillApi + 'api/User/SearchByName', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchSmeUser: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSmeUser'),
            SearchProject: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchProject', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchPPMS: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchPPMSActivities', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchPRA: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchPRAElements', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchProjectPhase: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchProjectPhase', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchWell: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchWell', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchWellType: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchWellTypes', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchWellPhase: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchWellPhase', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchWellOperation: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchWellOperation', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchWellOperationByWellPhase: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchWellOperation', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchEquipment: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchEquipment', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchKeyWord: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchKeyWord', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchInformations: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchInformations', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchLocation: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchLocation', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchCountry: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/GetCountry', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchSuggestions: $resource(appConfig.SkillApi + 'api/Search/SearchSuggestions', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchSuggestionsForExpert: $resource(appConfig.SkillApi + 'api/Search/SearchSuggestionsForExpert', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchSuggestionsText: $resource(appConfig.SkillApi + 'api/Search/SearchSuggestions'),

            SearchKnowledgeDiscovery: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/SearchResult'),

            SearchKnowledgeCustom: $resource(appConfig.SkillApi + 'api/Lookup/SearchKnowledgeCustom', {}, {
                save: { method: 'POST', isArray: true }
            }),
            AddSearchText: $resource(appConfig.SkillApi + 'api/Search/AddSearchText'),

            SearchSocieties: $resource(appConfig.SkillApi + 'api/KnowledgeShare/SearchSocieties', {}, {
                save: { method: 'POST', isArray: true }
            }),
            SearchAreaOfExpertise: $resource(appConfig.SkillApi + 'api/Search/SearchAreaOfExpertise'),
            SearchSkill: $resource(appConfig.SkillApi + 'api/Search/SearchSkill'),
            SearchExperience: $resource(appConfig.SkillApi + 'api/Search/SearchExperience'),
            SearchDivision: $resource(appConfig.SkillApi + 'api/User/GetDivisions', {}, {
                query: { method: 'GET', isArray: true }
            }),
            SearchDepartment: $resource(appConfig.SkillApi + 'api/User/GetDepartments', {}, {
                query: { method: 'GET', isArray: true }
            }),
            SearchDepartmentByDivision: $resource(appConfig.SkillApi + 'api/User/GetDepartmentsByDivision', {}, {
                query: { method: 'GET', isArray: true }
            }),
            SearchCOP: $resource(appConfig.SkillApi + 'api/Search/searchCOP'),

            SearchKnowledgeRef: $resource(appConfig.SkillApi + 'api/KnowledgeShare/GetAllKnowledgeDocument?filter=:filter'),
            SearchKnowledgeDocumentCollection: $resource(appConfig.SkillApi + '/api/Collection/SearchKnowledgeDocumentCollection?collectionId=:collectionId&filter=:filter'),
            
            GetUsers: $resource(appConfig.SkillApi + 'api/User/SearchByName', {}, {
                save: { method: 'POST', isArray: true }
            }),
            
        };

        function getSuggestions(options, category) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.Suggestions.save({ SearchText: SearchText, Category: category }).$promise.then(function (res) {
                options.success(res);
            }, function (err) {
                options.error(err);
            });
        }

        function getDisciplineSuggestions(options) {

            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.GetDisciplineSuggestions.save({ SearchText: SearchText }).$promise.then(function (res) {

                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }

        function searchUser(options, authors) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(authors, function (o) { return o.name });

            api.SearchUser.save({ searchTerm: searchTerm }, JSON.stringify(exists), function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function searchUserForPointAdmin(options, authors) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var exists = [];
            _.each(authors, function (x, xIndex) {
                exists.push(x.id);
            });

            api.searchUserForPointAdmin.save(null, { Name: searchTerm, AddedUserIds: exists }, function (res) {
                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function searchInformations(options, postData) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };

            api.SearchInformations.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function searchSocieties(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };

            api.SearchSocieties.save(getData, null, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function searchLocation(options) {
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            api.SearchLocation.save(getData, null, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
        }

        function searchCountry(options) {
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                filter: searchTerm,
            };
            api.SearchCountry.save(getData, null, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
        }

        function SearchProject(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchProject.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchProjectPhase(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchProjectPhase.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchPPMS(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.SearchPPMS.save({ searchTerm: searchTerm }, [], function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });

            return deferred.promise;
        }

        function SearchPRA(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.SearchPRA.save({ searchTerm: searchTerm }, [], function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        function SearchWell(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];
            api.SearchWell.save(getData, postData, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        function SearchWellType(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.SearchWellType.save({ searchTerm: searchTerm }, [], function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        function SearchWellPhase(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchWellPhase.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchWellOperation(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchWellOperation.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }
        function SearchWellOperationByWellPhase(options, wellPhaseId) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var getData = {
                searchTerm: searchTerm,
                wellPhaseId: wellPhaseId
            };
            var postData = [];

            api.SearchWellOperationByWellPhase.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchEquipment(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            if (searchTerm == null) searchTerm = '';
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchEquipment.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchKeyWord(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            if (searchTerm == null) searchTerm = '';
            var getData = {
                searchTerm: searchTerm,
            };
            var postData = [];

            api.SearchKeyWord.save(getData, postData, function (res) {

                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        function SearchSuggestions(options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchSuggestions.save({ SearchText: SearchText }).$promise.then(function (res) {

                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }

        function SearchSuggestionsWithoutContributor(options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchSuggestions.save({ SearchText: SearchText }).$promise.then(function (res) {

                var res = _.remove(res, function (o) {
                    return o.type !== 'Contributors';
                });
                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }

        function SearchSuggestionsForExpert(options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchSuggestionsForExpert.save({ SearchText: SearchText }).$promise.then(function (res) {

                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }

        function SearchKnowledgeDiscovery(postData) {

            var deferred = $q.defer();
            api.SearchKnowledgeDiscovery.save({}, postData, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function SearchKnowledgeCustom(options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchKnowledgeCustom.save({ SearchText: SearchText }).$promise.then(function (res) {
                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }

        function AddSearchText(searchText) {

            var deferred = $q.defer();
            api.AddSearchText.save({}, { searchText: searchText }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function _SearchAreaOfExpertise(SearchText) {
            var deferred = $q.defer();
            if (SearchText) {
                api.SearchAreaOfExpertise.save({ SearchText: SearchText }).$promise.then(function (res) {
                    deferred.resolve(res.searchValues);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve([]);
            }

            return deferred.promise;
        }

        function _SearchSkill(SearchText) {
            var deferred = $q.defer();
            if (SearchText) {
                api.SearchSkill.save({ SearchText: SearchText }).$promise.then(function (res) {
                    deferred.resolve(res.searchValues);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve([]);
            }

            return deferred.promise;
        }

        function _SearchExperience(SearchText) {
            var deferred = $q.defer();
            if (SearchText) {
                api.SearchExperience.save({ SearchText: SearchText }).$promise.then(function (res) {
                    deferred.resolve(res.searchValues);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve([]);
            }

            return deferred.promise;
        }

        function _SearchDivision(options) {
                var SearchText = _.get(options, 'data.filter.filters[0].value');
                api.SearchDivision.query({
                    searchText: SearchText
                }, function (data) {
                    options.success(data);
                }, function (data) {
                    options.error(data);
                });
            }

        function _SearchDepartment(options) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchDepartment.query({
                searchText: SearchText
            }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }
        function _SearchDepartmentByDivision(options, id) {
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            api.SearchDepartmentByDivision.query({
                searchText: SearchText,
                divisionId: id
            }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function _SearchCOP(SearchText) {
            var deferred = $q.defer();
            if (SearchText) {
                api.SearchCOP.save({ SearchText: SearchText }).$promise.then(function (res) {
                    deferred.resolve(res.searchValues);
                }, function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve([]);
            }

            return deferred.promise;
        }

        function SearchKnowledgeRef(options, kd) {
            var deferred = $q.defer();
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(kd, function (o) { return o.title });
            api.SearchKnowledgeRef.query({ filter: SearchText }, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        function SearchKnowledgeDocumentCollection(options, kd, collectionId) {
            var deferred = $q.defer();
            var SearchText = _.get(options, 'data.filter.filters[0].value');
            var exists = _.map(kd, function (o) { return o.title });
            api.SearchKnowledgeDocumentCollection.query({ collectionId: collectionId, filter: SearchText }, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        function GetUsers(options, authors){

            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            var exists = [];
            _.each(authors, function (x, xIndex) {
                exists.push(x.id);
            });

            api.GetUsers.save(null, { Name: searchTerm, AddedUserIds: exists }, function (res) {
                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }

        return {
            api: api,

            getSuggestions: getSuggestions,
            getDisciplineSuggestions: getDisciplineSuggestions,
            searchUser: searchUser,
            searchUserForPointAdmin: searchUserForPointAdmin,
            searchInformations: searchInformations,
            searchLocation: searchLocation,
            searchCountry: searchCountry,
            SearchProject: SearchProject,
            SearchProjectPhase: SearchProjectPhase,
            SearchPPMS: SearchPPMS,
            SearchPRA: SearchPRA,
            SearchWell: SearchWell,
            SearchWellType: SearchWellType,
            SearchWellPhase: SearchWellPhase,
            SearchWellOperation: SearchWellOperation,
            SearchWellOperationByWellPhase: SearchWellOperationByWellPhase,
            SearchEquipment: SearchEquipment,
            SearchKeyWord: SearchKeyWord,
            SearchSuggestions: SearchSuggestions,
            SearchSuggestionsWithoutContributor: SearchSuggestionsWithoutContributor,
            SearchKnowledgeDiscovery: SearchKnowledgeDiscovery,
            SearchKnowledgeCustom: SearchKnowledgeCustom,
            SearchSuggestionsForExpert: SearchSuggestionsForExpert,
            AddSearchText: AddSearchText,
            searchSocieties: searchSocieties,
            searchAreaOfExpertise: _SearchAreaOfExpertise,
            searchSkill: _SearchSkill,
            searchExperience: _SearchExperience,
            searchDivision: _SearchDivision,
            searchDepartment:_SearchDepartment,
            searchDepartmentByDivision: _SearchDepartmentByDivision,
            searchCOP: _SearchCOP,
            searchKnowledgeRef: SearchKnowledgeRef,
            SearchKnowledgeDocumentCollection: SearchKnowledgeDocumentCollection,
            GetUsers: GetUsers
        };
    }

})();
