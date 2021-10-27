(function () {
    'use strict';

    angular
        .module('app.collection')
        .controller('collectionDetailController', CollectionDetailController);

    /** @ngInject */
    function CollectionDetailController(appConfig, $scope, $state,
        CollectionApi, $stateParams, logger, $log, KnowledgeDiscoveryApi, SearchApi, $timeout, $sce) {
        var vm = this;
        vm.kdIdFilter = 0;
        // vm.isAdmin = false;
        vm.urlImg = appConfig.SkillApi;
        vm.KnowledgesPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 12,
            sortField: "id",
            sortDir: "ace",
            isExport: true,
            maxSize: 5
        };
        vm.SimilarPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 4,
            sortField: "id",
            sortDir: "ace",
            isExport: true,
            maxSize: 5
        };
        vm.NewCollection = {};
        vm.getKnowledgeByCollection = getKnowledgeByCollection;
        vm.loadMoreSimilar = loadMoreSimilar;
        vm.SaveChangeCollection = saveChangeCollection;
        vm.UploadedImage = uploadedImage;
        vm.ShowEditCollection = showEditCollection;
        vm.CanceChangeCollection = canceChangeCollection;
        // vm.ShowRemoveFromCollection = showRemoveFromCollection;
        // vm.SavedRemoveKdFromColection = savedRemoveKdFromColection;
        vm.DeleteCollection = deleteCollection;
        vm.Similars = {};
        activate();

        function activate() {
            getCollectionById();
            getKnowledgeByCollection();
            getSimilarByCollection();
        }

        function showEditCollection() {
            vm.EditCollection = {
                collectionId: vm.Collection.collectionId,
                collectionName: vm.Collection.collectionName,
                collectionDescription: vm.Collection.collectionDescription,
                coverImageId: vm.Collection.coverImageId,
                coverImage: vm.Collection.imageUrl
            }
            
        }

        function getCollectionById() {
            CollectionApi.getCollection({ id: $stateParams.id },
                function (response) {
                    vm.Collection = response;
                    $log.info('Retrieved collection detail successfully.');
                },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        }
        $scope.renderHTML = function(html_code)
        {
            var decoded = angular.element('<textarea />').html(html_code).text();
            return $sce.trustAsHtml(decoded);
        };
        function getKnowledgeByCollection() {
            var data = {
                skip: (vm.KnowledgesPagging.pageIndex - 1) * vm.KnowledgesPagging.pageSize,
                take: vm.KnowledgesPagging.pageSize,
                sortField: vm.KnowledgesPagging.sortField,
                sortDir: vm.KnowledgesPagging.sortDir,
                isExport: vm.KnowledgesPagging.isExport,
            };
            CollectionApi.getKnowledgeByCollection({ id: $stateParams.id, knowledgeDocumentId: vm.kdIdFilter, pagging: data }, function (response) {
                _.each(response.data, function (item) {
                    item.collectionId = $stateParams.id;
                });

                vm.Knowledges = response;
                vm.KnowledgesPagging.total = vm.Knowledges.total;
                $log.info('Retrieved knowledge successfully.');
            },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        }

        function loadMoreSimilar() {
            vm.SimilarPagging.pageIndex++;
            getSimilarByCollection();
        }

        function getSimilarByCollection() {
            var data = {
                skip: (vm.SimilarPagging.pageIndex - 1) * vm.SimilarPagging.pageSize,
                take: vm.SimilarPagging.pageSize,
                sortField: vm.SimilarPagging.sortField,
                sortDir: vm.SimilarPagging.sortDir,
                isExport: vm.SimilarPagging.isExport,
            };

            CollectionApi.getSimilarByCollection({ id: $stateParams.id, pagging: data }, function (response) {
                vm.Similars.data = vm.Similars.data || [];
                vm.Similars.data.push.apply(vm.Similars.data, response.data);
                vm.Similars.total = response.total;
                vm.SimilarPagging.total = vm.Similars.total;
                vm.SimilarPagging.pageSize = 4;
                $log.info('Retrieved similars successfully.');
            },
                function (response) {
                    logger.error(response.data.errorMessage);
                });
        }

        function saveChangeCollection() {
            var data = {
                id: vm.EditCollection.collectionId,
                collectionName: vm.EditCollection.collectionName,
                collectionDescription: vm.EditCollection.collectionDescription,
                coverImageId: vm.EditCollection.coverImageId,
            }
            CollectionApi.updateCollection(data, function (response) {
                if (response.id == true) {
                    $log.info('Changed collection successfully.');
                    logger.success('Changed collection successfully.');
                    CollectionApi.closeForm("#EditCollection");
                    getCollectionById();
                }
                else {
                    $log.info('Changed collection failed.');
                    logger.error('Changed collection failed.');
                }
            },
                function (response) {
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

        function deleteCollection() {
            CollectionApi.deleteCollection({ id: vm.EditCollection.collectionId }, function (response) {
                if (response.result == true) {
                    $log.info('Deleted collection successfully.');
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


        $scope.SourceKnowledges = {
            dataTextField: "kdTitle",
            dataValueField: "kdId",
            filter: "contains",
            minLength: 0,
            delay: 500,
            placeholder:'Filter knowledge in this collection...',
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        var SearchText = _.get(options, 'data.filter.filters[0].value');
                        if (vm.kdIdFilter > 0 && (SearchText == null || SearchText.trim().length <= 0)) {
                            _Remove();
                        }
                        return SearchApi.SearchKnowledgeDocumentCollection(options, $scope.Knowledges, $stateParams.id);
                    }
                },
            },
        };

        $timeout(function () {
            var control = $scope.KDOfCollection;
            var autocompleteInput = control.element;
            autocompleteInput.on('click', function (e) {
                control.search('');
            });
        }, 1000);
        function _onSelect(e) {
            var idSelected = e.dataItem.kdId;
            vm.kdIdFilter = idSelected;
            getKnowledgeByCollection();
        };

        function _Remove() {
            vm.kdIdFilter = 0;
            getKnowledgeByCollection();
        };
        function _onOpen(e) {
            $timeout(function () {
                e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
        };
        $scope.onSelect = _onSelect;
        $scope.onOpen = _onOpen;
    }
})();
