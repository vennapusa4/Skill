(function () {
    'use strict';

    angular
        .module('app.collection')
        .controller('collectionDetailAdminNewController', CollectionDetailAdminNewController);

    /** @ngInject */
    function CollectionDetailAdminNewController($scope, $state, $stateParams, logger, CollectionApi, KnowledgeDiscoveryApi) {

        var vm = this;

        vm.showAllKnowledge = false;
        vm.RecommendedKnowledgesPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 4,
            sortField: "id",
            sortDir: "ace",
            isExport: true,
            maxSize: 5
        };
        vm.KnowledgesPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 12,
            sortField: "id",
            sortDir: "ace",
            isExport: true,
            maxSize: 5
        };
        vm.SaveChangeCollection = saveChangeCollection;
        vm.DeleteCollection = deleteCollection;
        vm.UploadedImage = uploadedImage;
        vm.ShowEditCollection = showEditCollection;
        vm.CanceChangeCollection = canceChangeCollection;
        vm.ShowAddToCollection = showAddToCollection;
        vm.SavedKdToColection = savedKdToColection;
        vm.GetKnowledges = getKnowledges;
        activate();
        function activate() {
            getCollectionById();
            getRecommendedKnowledge();
            // getKnowledges();
        }

        function showEditCollection() {
            vm.EditCollection = {
                id: vm.Collection.collectionId,
                collectionName: vm.Collection.collectionName,
                collectionDescription: vm.Collection.collectionDescription,
                coverImageId: vm.Collection.coverImageId,
                coverImage: vm.Collection.imageUrl
            }
            //CollectionApi.openForm("#EditCollection");
        }

        function getCollectionById() {
            CollectionApi.getCollection({ id: $stateParams.id },
                function (response) {
                    vm.Collection = response;
                },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        }

        function getRecommendedKnowledge() {
            var data = {
                skip: (vm.RecommendedKnowledgesPagging.pageIndex - 1) * vm.RecommendedKnowledgesPagging.pageSize,
                take: vm.RecommendedKnowledgesPagging.pageSize,
                sortField: vm.RecommendedKnowledgesPagging.sortField,
                sortDir: vm.RecommendedKnowledgesPagging.sortDir,
                isExport: vm.RecommendedKnowledgesPagging.isExport,
                excludeKdIds: [],
            };
            CollectionApi.getRecommendedKnowledge({ id: $stateParams.id, pagging: data }, function (response) {
                vm.RecommendedKnowledges = response;
                vm.RecommendedKnowledgesPagging.total = vm.RecommendedKnowledges.total;
            },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        }

        function saveChangeCollection() {
            var data = {
                id: vm.EditCollection.id,
                collectionName: vm.EditCollection.collectionName,
                collectionDescription: vm.EditCollection.collectionDescription,
                coverImageId: vm.EditCollection.coverImageId,
            }
            CollectionApi.updateCollection(data, function (response) {
                if (response.id == true) {
                    logger.success('Changed collection successfully.');
                    CollectionApi.closeForm("#EditCollection");
                    getCollectionById();
                }
                else {
                    logger.error('Changed collection failed.');
                }
            },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        };

        function deleteCollection() {
            CollectionApi.deleteCollection({ id: vm.EditCollection.id }, function (response) {
                if (response.result == true) {
                    logger.success('Deleted collection successfully.');
                   // $state.go('app.LandingPageController');
                }
                else {
                    logger.error('Deleted collection failed.');
                }
            }, function (response) {
                logger.error(response.data.errorMessage);
            });
        };

        function uploadedImage(data) {
            vm.EditCollection.coverImage = {
                id: data.id,
                result: data.result,
                name: data.name
            }
            vm.EditCollection.coverImageId = data.id;
        }

        function canceChangeCollection() {
            CollectionApi.closeForm("#EditCollection");
        }

        vm.kdcollectionsModel = {};

        function showAddToCollection(kd_id) {
            vm.kdcollectionsModel = {};
            CollectionApi.getCollectionsByKdId({ id: kd_id }, function (response) {
                vm.kdcollectionsModel = response;
                vm.kdcollectionsModel.kd_id = kd_id;
            }, function (response) {
                logger.error(response.data.errorMessage);
            });
        }

        function savedKdToColection(data) {
            CollectionApi.closeForm("#AddCollection");
            vm.kdcollectionsModel = {};
        }

        function getKnowledges() {

            vm.showAllKnowledge = true;
            var data = {
                skip: (vm.KnowledgesPagging.pageIndex - 1) * vm.KnowledgesPagging.pageSize,
                take: vm.KnowledgesPagging.pageSize,
                sortField: vm.KnowledgesPagging.sortField,
                sortDir: vm.KnowledgesPagging.sortDir,
                isExport: vm.KnowledgesPagging.isExport,
                excludeKdIds: _.map(vm.RecommendedKnowledges.data, 'kdId'),
            };

            var excludeKdIds = _.map(vm.RecommendedKnowledges.data, 'kdId');

            CollectionApi.getRecommendedKnowledge({ id: $stateParams.id, excludeKdIds: excludeKdIds, pagging: data }, function (response) {
                vm.Knowledges = response;
                vm.KnowledgesPagging.total = vm.Knowledges.total;
            }, function (response) {
                logger.error(response.data.errorMessage);
            });
        }

        function initShareCollection() {
            $scope.ShareEmails = [];
        }

        initShareCollection();

        $scope.EmailSources = {
            placeholder: "Select user...",
            dataTextField: "PersonName",
            dataValueField: "Id",
            minLength: 1,
            delay: 500,
            valuePrimitive: true,
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return KnowledgeDiscoveryApi.getEmails(options)
                    }
                }
            }), open: function (e) {
                setTimeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                }, 100);
            },
            template: '<strong>#: data.PersonName #</strong><br/><small>#: data.PersonDept #</small>',
            select: function (e) {
                var index = _.findIndex($scope.ShareEmails, function (item) { return item.value == e.dataItem.Id });
                if (index == -1) {
                    $scope.$apply(function () {
                        $scope.ShareEmails.push({ value: e.dataItem.Id, label: e.dataItem.PersonName ? e.dataItem.PersonName : e.dataItem.Id });
                    });
                }
            },
        };

        $scope.ShareCollections = function () {
            if (!vm.Collection) return;
            $("#SubmitModal").modal('hide');
            if ($scope.ShareEmails && $scope.ShareEmails.length > 0) {
                var postData = { title: vm.Collection.collectionName, CollectionId: vm.Collection.collectionId, lstMailShare: $scope.ShareEmails };
                CollectionApi.shareCollection(postData).then(function (response) {
                    if (response && response.id) {
                        vm.Collection.totalSharesCount += $scope.ShareEmails.length;
                        $scope.ShareEmails = [];
                        return;
                    }
                    $("#SubmitModal").modal('show');
                }, function (response) {
                    logger.error(response.data.errorMessage);
                    $("#SubmitModal").modal('show');
                });
            }
        }

        $scope.hideDialog = function () {
            initShareCollection();
        };
    }
})();
