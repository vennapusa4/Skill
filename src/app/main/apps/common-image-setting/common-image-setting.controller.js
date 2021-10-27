(function () {
    'use strict';

    angular
        .module('app.commonImageSetting')
        .controller('CommonImageSettingController', CommonImageSettingController);

    /** @ngInject */
    function CommonImageSettingController(CommonImageApi, logger, $scope) {
        var vm = this;
        vm.IdSelected = 0;
        vm.KeySelected = "";
        vm.ImageUrl = "";

        vm.emailItems = [];
        // Get all Email from Server
        vm.GetAll = function () {
            CommonImageApi.getAll().then(function (data) {
                if (data != null && data.length > 0) {
                    vm.emailItems = data;
                    vm.LoadTabDetail(data[0].id, data[0].key);
                }
            });
        }
        vm.GetAll();

        vm.LoadTabDetail = function (id, name) {
            vm.IdSelected = id;
            vm.KeySelected = name;
            vm.ImageUrl = "";
            $(".k-upload-files.k-reset").find("li").remove();
            CommonImageApi.getDetails(name).then(function (data) {
                if (data != null) {
                    vm.ImageUrl = data.imageUrl;
                }
            });
        }

        // File selected
        vm.onSelect = function (e) {
            var fileInfo = e.files[0];
            var wrapper = this.wrapper;
            setTimeout(function () {
                addPreview(fileInfo, wrapper);
            });
        }
        function addPreview(file, wrapper) {
            var raw = file.rawFile;
            var reader = new FileReader();
            if (raw) {
                reader.onloadend = function (e) {
                    $scope.$apply(function () {
                        vm.ImageUrl = e.target.result;
                    });
                };
                reader.readAsDataURL(raw);
            }
        }
        // Remove file selected
        vm.onRemove = function (e) {
            $scope.$apply(function () {
                vm.ImageUrl = "";
            });
        }

        vm.Save = function () {
            CommonImageApi.save(vm.IdSelected, vm.KeySelected, "", vm.ImageUrl).then(function (data) {
                logger.success('Save success!', 'SKILL');
            });
        }
    }
})();
