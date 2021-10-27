(function () {
    'use strict';

    angular
        .module('app.adminSetting')
        .factory('AdminSettingCoPApi', AdminSettingCoPApi);

    /** @ngInject */
    function AdminSettingCoPApi($resource, appConfig, $q , CopService , UserProfileApi) {
        var $q = $q; 
        var vm = this;
        vm.dataToExport = [];
        vm.data = [];
        vm.datasource = [];
        
        var api = {
          //  GetAllCoPByCategorId: $resource(appConfig.SkillApi + 'api/Admin/Cop/GetAllCoPByCategorId'),
            GetAllCoPByCategorId: $resource(appConfig.SkillApi + 'api/Admin/Cop/GetAllCoPByCategorId' , {}, {
                query: { method: 'POST', isArray: false }
            }),
            addNew: $resource(appConfig.SkillApi + 'api/Admin/Cop/AddCoP'),
            ExportExcel : $resource(appConfig.SkillApi + 'api/Admin/Cop/ExportAllCopToExcel' , {}, {
                query: { method: 'GET', isArray: true }
            }),
            getById: $resource(appConfig.SkillApi + 'api/Admin/Cop/GetCoPById', {}, {
                query: { method: 'GET', isArray: false }
            }),
            update: $resource(appConfig.SkillApi + 'api/Admin/Cop/UpdateCoP'),
            GetAllCoPCategory : $resource(appConfig.SkillApi + 'api/Admin/Cop/GetAllCoPCategory', {}, {
                query: { method: 'GET', isArray: true }
            }),
            GetAllUsers:$resource(appConfig.SkillApi + 'api/user/AllUsers', {}, {
                save: { method: 'POST', isArray: true }
            }),
            GetPendingCopMembershipList:$resource(appConfig.SkillApi + 'api/Admin/Cop/PendingAction', {}, {
                save: { method: 'GET', isArray: true }
            }),
            getNoticeBoard: $resource(appConfig.SkillApi + 'api/Noticeboard/GetAll', {}, {
                save: { method: 'POST', isArray: false }
            }),
            createNoticeBoard: $resource(appConfig.SkillApi + '/api/Noticeboard/Create', {}, {
                save: { method: 'POST', isArray: false }
            }),
            updateNoticeBoard: $resource(appConfig.SkillApi + 'api/Noticeboard/Update', {}, {
                save: { method: 'POST', isArray: false }
            }),
            deleteNoticeBoard: $resource(appConfig.SkillApi + 'api/Noticeboard/DeleteMulti'),
            getTopNoticeForCoP: $resource(appConfig.SkillApi + '/api/Noticeboard/TopNoticeForCoP', {}, {
                save: { method: 'GET', isArray: false }
            }),
            GetInactiveCOP: $resource(appConfig.SkillApi + 'api/Admin/Cop/GetInaciveCops', {}, {
                save: { method: 'POST', isArray: false }
            }),
            
            deleteMultiInactiveCOP: $resource(appConfig.SkillApi + 'api/Admin/Cop/DeleteCoP'),
            getAuditTrail: $resource(appConfig.SkillApi + 'api/Admin/Cop/AuditTrail', {}, {
                save: { method: 'GET', isArray: true }
            }),

            GetMappingCOPs: $resource(appConfig.SkillApi + 'api/CopMapping/GetCoP', {}, {
                save: { method: 'GET', isArray: true }
            }),
            GetMappedDisciplines: $resource(appConfig.SkillApi + 'api/CopMapping/GetDiscipline', {}, {
                save: { method: 'GET', isArray: true }
            }),
            GetMappedSubDiscipline: $resource(appConfig.SkillApi + 'api/CopMapping/GetSubDiscipline', {}, {
                save: { method: 'POST', isArray: true }
            }),
            MapCopDiscipline: $resource(appConfig.SkillApi + 'api/CopMapping/MapCopDiscipline', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getMappedDataForExport: $resource(appConfig.SkillApi + 'api/CopMapping/COPDisciplineMapping/Export', {}, {
                save: { method: 'GET', isArray: true }
            }),
            getAllCoP: $resource(appConfig.SkillApi + '/api/SearchV2/SearchCoP', {}, {
                save: { method: 'POST', isArray: false }
            }),
        };

        function GetAllCoPByCategorId(option, keyword, categoryID, filterBy) {
            var deferred = $q.defer();

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;
            
            // api.GetAllCoPByCategorId.query({ 
            //     Take: Take, 
            //     Skip: skip, 
            //     sort :sortField, 
            //     Filter : filterBy , 
            //     Group : Group , 
            //     Aggregate: Aggregate, 
            //     SearchString : searchTerm,
            //     CategoryId: categoryID }, function (data) {
         
            //     option.success(data);
            // }, function (data) {
            //     option.error(data);
            // });

            api.GetAllCoPByCategorId.save({}, { 
                Take: Take, 
                Skip: skip, 
                sort :sortField, 
                Filter : filterBy , 
                Group : Group , 
                Aggregate: Aggregate, 
                SearchString : searchTerm,
                CategoryId: categoryID
             }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });

            
        }

        function getMappedDataForExport(){
            var deferred = $q.defer();
            api.getMappedDataForExport.query({ }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        

        function getTopNoticeForCoP(copId){
            var deferred = $q.defer();
            api.getTopNoticeForCoP.query({ copId: copId, topRecords: 10 }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getAuditTrail(id){
            var deferred = $q.defer();
            api.getAuditTrail.query({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function GetMappingCOPs(copId) {
            var deferred = $q.defer();
            api.GetMappingCOPs.query({ copId: copId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function GetMappedDisciplines(idx) {
            var deferred = $q.defer();
            api.GetMappedDisciplines.query({ copId: idx }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function GetMappedSubDiscipline(copId , disciplines) {
            return api.GetMappedSubDiscipline.save( {copId : copId , disciplineIds:disciplines}).$promise;

        }

        function MapCopDiscipline(postData){
            return api.MapCopDiscipline.save(postData).$promise;
        }
        
        function getById(idx) {
            var deferred = $q.defer();
            api.getById.query({ copId: idx }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function addNew(postData) {
            return api.addNew.save(postData).$promise;
        }

        function update(postData) {
            return api.update.save(postData).$promise;
        }

        function GetAllCoPCategory(){
            var deferred = $q.defer();
            api.GetAllCoPCategory.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getAllCoP(){
            var params ={
                category: [],
                docType: "All",
                filterBy: [],
                isExport: true,
                isShowEndorsed: false,
                isShowHasAudio: false,
                isShowHasValue: false,
                isShowHasVideo: false,
                isShowReplications: false,
                isShowValidate: false,
                isShowValidated: false,
                isdeepSearch: false,
                searchKeyword: "",
                searchKeywordTranslated: [""],
                searchTerm: "",
                skip: 0,
                sortBy: "LatestContribution",
                sortDir: "",
                sortField: "",
                take: 1000,
                userid: 0,
                year: 0,
            }
            return api.getAllCoP.save(params).$promise;
        }

        function ExportExcel(){
            var deferred = $q.defer();
            api.ExportExcel.query({ }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;

        }
     
        function GetAllUsers(options, authors){

            var deferred = $q.defer();
            var username = _.get(options, 'data.filter.filters[0].value');
            var exists = [];
            _.each(authors, function (x, xIndex) {
                exists.push(x.id);
            });

            api.GetAllUsers.save(null, { name: username , AddedUserIds: exists }, function (res) {
                options.success(res);
            }, function (res) {

                options.error(res);
            });

            return deferred.promise;
        }
        function GetInactiveCOP(option, keyword, filterBy, total) {

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;

            // var postData={
            //     Take: Take, 
            //     Skip: skip, 
            //     sort :sortField, 
            //     Filter : filterBy , 
            //     Group : Group , 
            //     Aggregate: Aggregate, 
            //     SearchString : searchTerm
            // }

            api.GetInactiveCOP.save({}, { Take: Take, 
                Skip: skip, 
                sort :sortField, 
                Filter : filterBy , 
                Group : Group , 
                Aggregate: Aggregate, 
                SearchString : searchTerm }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        

        function GetPendingCopMembershipList(){
            vm.userInfo = UserProfileApi.getUserInfo();
            var deferred = $q.defer();
            api.GetPendingCopMembershipList.query({ userId: vm.userInfo.userId }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        
        function getNoticeBoard(option, keyword, filterBy, total) {

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;
            
            api.getNoticeBoard.save({}, {
                Take: Take, 
                Skip: skip, 
                sort :sortField, 
                Filter : filterBy , 
                Group : Group , 
                Aggregate: Aggregate, 
                SearchString : searchTerm}, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }
        
        function createNoticeBoard(params) {
            var defer = $q.defer();
            api.createNoticeBoard.save({},params,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        }

        function updateNoticeBoard(params) {
            var defer = $q.defer();
            api.updateNoticeBoard.save({},params,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );
            return defer.promise;
        }

        return {
            api: api,
            GetAllCoPByCategorId: GetAllCoPByCategorId,
            addNew: addNew,
            update: update,
            getById: getById,
            GetAllCoPCategory: GetAllCoPCategory,
            getAllCoP:getAllCoP,
            ExportExcel: ExportExcel,
            GetAllUsers:GetAllUsers,
            GetPendingCopMembershipList : GetPendingCopMembershipList,
            getNoticeBoard: getNoticeBoard,
            createNoticeBoard:createNoticeBoard,
            updateNoticeBoard:updateNoticeBoard,
            deleteNoticeBoard : function (postData) {
                return api.deleteNoticeBoard.save(postData).$promise;
            },
             GetInactiveCOP: GetInactiveCOP,
            deleteMultiInactiveCOP: function (postData) {
                return api.deleteMultiInactiveCOP.save({copIds:postData}).$promise;
            },
            getAuditTrail: getAuditTrail,
            GetMappingCOPs:GetMappingCOPs,
            GetMappedDisciplines:GetMappedDisciplines,
            GetMappedSubDiscipline:GetMappedSubDiscipline,
            MapCopDiscipline: MapCopDiscipline,
            getMappedDataForExport:getMappedDataForExport,
            getTopNoticeForCoP: getTopNoticeForCoP
        };
    }

})();