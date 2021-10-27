(function () {
    'use strict';

    angular
        .module('app.adsSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('appAdmin.adsSetting', {
            title: 'Ads Setting',
            url: '/ads-setting',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/ads-setting/ads-setting.html',
                    controller: 'AdsSettingController as vm'
                }
            },
        });

    }

})();