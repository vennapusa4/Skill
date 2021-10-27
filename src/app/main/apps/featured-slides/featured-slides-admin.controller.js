(function () {
    'use strict';

    angular
        .module('app.featuredSlides')
        .controller('FeaturedSlidesAdminController', FeaturedSlidesAdminController);

    /** @ngInject */
    function FeaturedSlidesAdminController($window, AdminFeaturedSlidesApi,$scope) {
        var vm = this;
        vm.isShowEditPanel = false;
        vm.selectedSlide = {};
        vm.selectedSlideClone = {};
        $scope.customStartDate;
        $scope.customEndDate;

        var currentDate = new Date();
        $scope.customStartDate =  kendo.parseDate(currentDate, "yyyy-MM-DD");
        $scope.customEndDate = kendo.parseDate(currentDate, "yyyy-MM-DD");

        vm.Sliders = [];
        function clearEditCollection() {
            vm.EditCollection = {
                id: "",
                collectionName: "",
                collectionDescription: "",
                coverImageId: "",
                coverImage: {}
            };

            vm.isEdit = false;
            vm.selectedSlide = {};
            vm.selectedSlideClone = {};
            vm.slideName = "";
            vm.searchKnowledge = "";
        }
        clearEditCollection();

        function init() {
            AdminFeaturedSlidesApi.getAllSlide().then(function (data) {
                if (data && data.data)
                    vm.Sliders = angular.copy(data.data);
            });
        }
        init();

        vm.addSlide = function () {
            clearEditCollection();
            vm.isShowEditPanel = true;
        }

        vm.editSlide = function (slide, index) {
            vm.isEdit = true;
            vm.selectedSlide = _.find(vm.Sliders, function (item) {
                return item.fdId == slide.fdId;
            });
            vm.selectedSlide.id = vm.selectedSlide.fdId;
            vm.selectedSlide.result = null;
            vm.slideName = "Slide " + (index + 1);
            vm.isShowEditPanel = true;

            if (vm.selectedSlide.kdId != null && vm.selectedSlide.kdId != '' && vm.selectedSlide.kdId != 0) {
                AdminFeaturedSlidesApi.getKnowledgeById(vm.selectedSlide.kdId).then(function (data) {
                    vm.selectedSlideClone = data;
                });
            }
            else {
                vm.selectedSlideClone = angular.copy(vm.selectedSlide);
            }
        }

        vm.cancelEdit = function () {
            clearEditCollection();
            vm.isShowEditPanel = false;
        }

        vm.removeItem = function (item) {
            var confirm = $window.confirm("Are you want to delete this item?");
            if (!confirm) return;

            AdminFeaturedSlidesApi.delete([item.fdId]).then(function (results) {
                if (results.result) {
                    init();
                }
            });
        }

        vm.save = function () {
            if (!vm.selectedSlide) return;

            vm.selectedSlide.title = vm.selectedSlide.kdTitle;
            vm.selectedSlide.startDate =  formatDate($scope.customStartDate);
            vm.selectedSlide.endDate =   formatDate($scope.customEndDate);
            AdminFeaturedSlidesApi.save(vm.selectedSlide).then(function (results) {
                if (results.result) {
                    clearEditCollection();
                    init();
                    vm.isShowEditPanel = false;
                }
            });
        }

        vm.UploadedImage = function uploadedImage(data) {
            vm.selectedSlide.coverImageId = data.id;
            vm.selectedSlide.result = data.result;
        }

        function formatDate(date) {
            //fix error display calendar when month,weekend, day
            // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
            var addMonth = 1;
            date = new Date(date);
            var day = ('0' + date.getDate()).slice(-2);
            var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
            var year = date.getFullYear();

            return year + '-' + month + '-' + day;
        }

        vm.Sources = {
            dataTextField: "text",
            dataValueField: "id",
            filter: "contains",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return AdminFeaturedSlidesApi.searchKnowledge(options)
                    }
                },
            },
            open: function (e) {
                setTimeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                }, 100);
            },
            select: function (e) {
                var kdId = e["dataItem"]["id"];
                AdminFeaturedSlidesApi.getKnowledgeById(kdId).then(function (data) {
                    var currentId = vm.selectedSlide.id;
                    vm.selectedSlide = data;
                    if (vm.isEdit) vm.selectedSlide.id = currentId;
                    vm.selectedSlide.result = null;
                    vm.selectedSlide.startDate =  formatDate($scope.customStartDate);
                    vm.selectedSlide.endDate =   formatDate($scope.customEndDate);
                    vm.selectedSlide.KnowledgeDocumentId = data.kdId;
                    vm.selectedSlideClone = angular.copy(vm.selectedSlide);
                });
            },
        };
    }
})();
