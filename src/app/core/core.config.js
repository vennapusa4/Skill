(function () {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, $translateProvider, $provide, fuseConfigProvider, $httpProvider) {
        // Enable debug logging
        $logProvider.debugEnabled(true);

        // toastr configuration
        toastr.options.timeOut = 2000;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.preventDuplicates = true;
        // toastr.options.progressBar = true;

        // uiGmapgoogle-maps configuration
        // uiGmapGoogleMapApiProvider.configure({
        //     //    key: 'your api key',
        //     v        : '3.exp',
        //     libraries: 'weather,geometry,visualization'
        // });

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // Text Angular options
        $provide.decorator('taOptions', [
            '$delegate', function (taOptions) {
                taOptions.toolbar = [
                    ['bold', 'italics', 'underline', 'ul', 'ol', 'quote']
                ];

                taOptions.classes = {
                    focussed: 'focussed',
                    toolbar: 'ta-toolbar',
                    toolbarGroup: 'ta-group',
                    toolbarButton: 'md-button',
                    toolbarButtonActive: 'active',
                    disabled: '',
                    textEditor: 'form-control',
                    htmlEditor: 'form-control'
                };

                return taOptions;
            }
        ]);

        // Text Angular tools
        $provide.decorator('taTools', [
            '$delegate', function (taTools) {
                taTools.bold.iconclass = 'icon-format-bold';
                taTools.italics.iconclass = 'icon-format-italic';
                taTools.underline.iconclass = 'icon-format-underline';
                taTools.ul.iconclass = 'icon-format-list-bulleted';
                taTools.ol.iconclass = 'icon-format-list-numbers';
                taTools.quote.iconclass = 'icon-format-quote';

                return taTools;
            }
        ]);

        /*eslint-disable */

        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars': false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile': true
        });

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });

        /*eslint-enable */

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }
})();