(function () {
    'use strict';

    angular
        .module('app.commonImageSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.commonImageSetting', {
            title: 'Common Image Setting',
            url: '/common-image-setting',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/common-image-setting/common-image-setting.html',
                    controller: 'CommonImageSettingController as vm'
                },
            },
        });

    }

})();
