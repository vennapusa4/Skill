(function () {
    'use strict';

    angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

    /** @ngInject */
    function HeaderController($rootScope, $mdSidenav, $translate, $location, $mdToast, $scope, $state, $timeout, $window, CommonApi, $interval, UserProfileApi, $cookies , profileAPI) {
        var vm = this;

        $scope.showSearch = false;
        $scope.showIconSearch = false;
        $scope.isDefiningSearch = false;
        $scope.userInfo;

        checkPage();
        vm.content = content;
        // Data
        $rootScope.global = {
            search: ''
        };

        $scope.currentRoute = '';

        
 

        $rootScope.$on('$stateChangeStart', function () {
            $('#MobileMenu').collapse('hide');
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            checkButtons();
            checkPage();
            checker();
            $scope.showSearch = false;
        });
        $scope.isUsingSearch = false;

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title': 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code': 'en',
                'flag': 'us'
            },
            es: {
                'title': 'Spanish',
                'translation': 'TOOLBAR.SPANISH',
                'code': 'es',
                'flag': 'es'
            },
            tr: {
                'title': 'Turkish',
                'translation': 'TOOLBAR.TURKISH',
                'code': 'tr',
                'flag': 'tr'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.redirect = redirect;

        //////////

        init();

        /**
         * Initialize
         */
        function init() {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];

            vm.userName = localStorage.getItem('email');
            vm.profilePhoto = localStorage.getItem('photo') === 'null' ? null : localStorage.getItem('photo');
            checkButtons();
            checker();

            if(localStorage.getItem("access-token")){
                loadTopNav();
            }
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status) {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout() {
            // Do logout here..
            // api.logout.save({}, {token: CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8)});
            localStorage.clear();
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            window.location = "";
            //$state.go('app.pages_auth_login');
            
        }

        /**
         * Change Language
         */
        function changeLanguage(lang) {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            if (lang.code !== 'en') {
                var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

                $mdToast.show({
                    template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 7000,
                    position: 'top right',
                    parent: '#content'
                });

                return;
            }

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu() {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }


        $scope.togglingSearch = function () {
            console.log('triggered');
            if($scope.isUsingSearch == true) {
                $scope.isUsingSearch = false;
                window.localStorage.setItem('isSearch', 'false');
            } else {
                $scope.isUsingSearch = true;
                window.localStorage.setItem('isSearch', 'true');
            }
        }
        function checker() {
            if($state.current.name === 'app.LandingPageController' || $state.current.name === 'app.copDirectory' || $state.current.name === 'app.SearchPage' || $state.current.name === 'app.SearchPage.knowledge' || $state.current.name === 'app.SearchPage.cop' || $state.current.name === 'app.SearchPage.media' || $state.current.name === 'app.SearchPage.collection' || $state.current.name === 'app.SearchPage.people') {
                $scope.showIconSearch = false;
                if($state.current.name === 'app.SearchPage' || $state.current.name === 'app.SearchPage.knowledge' || $state.current.name === 'app.SearchPage.cop' || $state.current.name === 'app.SearchPage.media' || $state.current.name === 'app.SearchPage.collection' || $state.current.name === 'app.SearchPage.people') {
                    $scope.isDefiningSearch = true;
                    if($state.current.name === 'app.SearchPage.media') {
                        window.localStorage.setItem('isSearch', 'false');
                        $scope.isUsingSearch = false;
                    } else if($state.current.name === 'app.SearchPage.people') {
                        if($location.hash()) {
                            window.localStorage.setItem('isSearch', 'true');
                            $scope.isUsingSearch = true;
                        } else {
                            window.localStorage.setItem('isSearch', 'false');
                            $scope.isUsingSearch = false;
                        }
                    } else {
                        window.localStorage.setItem('isSearch', 'true');
                        $scope.isUsingSearch = true;
                    }
                } else {
                    $scope.isDefiningSearch = false;
                }
            } else {
                $scope.showIconSearch = true;
            }

            if($state.current.name === 'app.SearchPage.knowledge' || $state.current.name === 'app.SearchPage.cop' || $state.current.name === 'app.SearchPage.collection' ) {
                $scope.currentRoute = 'Knowledge Discovery';
            } else if($state.current.name === 'app.SearchPage.people') {
                $scope.currentRoute = 'People';

            } else if($state.current.name === 'app.SearchPage.media') {
                $scope.currentRoute = 'Media';
                
            } else if($state.current.name === 'app.newTrending' || $state.current.name === 'app.newTrending.challenges' || $state.current.name === 'app.newTrending.ranking') {
                $scope.currentRoute = 'Trending';
                
            } else if($state.current.name === 'app.Abbreviation') {
                $scope.currentRoute = 'Abbreviation';
                
            } else {
                $scope.currentRoute = '';
            }
            console.log($scope.currentRoute);

        }


        function redirect(){   
            if($scope.userInfo.isAdmin){
                $state.go('appAdmin.knowledgeManagement.knowledges');
            }
            else if($scope.userInfo.isVCoPMCN){
                $state.go('appAdmin.copManagement.management');
            }
            else if($scope.userInfo.isTechnicalAlertAdmin){
                $state.go('appAdmin.technicalAlert.management');
            }
        }
        function checkButtons() {
            vm.minutesView = false;
            vm.createView = false;
            switch ($rootScope.state.current.name) {
                case 'app.minutes':
                    vm.minutesView = true;
                    break;
                case 'app.create':
                    vm.createView = true;
                    break;
            }
        }

        function checkPage() {
            vm.listPage = false;
            vm.minutesPage = false;
            switch ($state.current.name) {
                case 'app.list':
                    vm.listPage = true;
                    break;
                case 'app.detail':
                    vm.minutesPage = true;
                    break;
            }
        }

        function content(childFunc, event) {
            $scope.$$nextSibling.vm[childFunc](event);
        }
        // CommonApi.getTopNavigation().then(function (data) {
        //     $rootScope.TopNavItems = data;
        //     $rootScope.activeTopMenu();
        // });
        $scope.$on('tokenStaus', function (event, data) {
            if(data){ loadTopNav();}
        });
        function loadTopNav(){
            CommonApi.getTopNavigation().then(function (data) {
                $rootScope.TopNavItems = data;
                $rootScope.activeTopMenu();
                console.log($rootScope.TopNavItems);
            });
            getNotification();
        }

        $scope.task = {
            totalPendingTask: 0,
            pendingValidation: 0,
            pendingEndorsement: 0,
            draftItem: 0,
            totalPendingAction: 0
        };

        $scope.numberOfBadges = 0;
        var isRequestPending = false;
        function getNotification() {
            try {
                $scope.userInfo = UserProfileApi.getUserInfo();
                CommonApi.getNotification({ id: $scope.userInfo.userId }).then(function (data) {
                    isRequestPending = false;
                    if (data) {
                        $scope.task = data;
                    }
                });
                

               profileAPI.getPendingActionsCount().then(function (data) {
              //  isRequestPending = false;
                if (data) {
                    $scope.task.totalPendingAction = data.totalPendingAction;
                }
                });

                CommonApi.getBadgeNotification({ id: $scope.userInfo.userId }).then(
                    function (data) {
                        $scope.numberOfBadges = data != null ? data.numberOfBadges : 0;
                    },
                    function (err) {
                        $scope.numberOfBadges = 0;
                    }
                );
            } catch (e) {
                isRequestPending = false;
                $scope.task = 0;
            }
        }
        // getNotification();

        // Call API realtime
        $interval(function () {
            if (!isRequestPending) {
                getNotification();
                isRequestPending = true;
            }
        }, 1500000);

        $timeout(function () {
            $('#MobileMenu').on('show.bs.collapse', function () {
                $('body').toggleClass('modal-open');
            });

            $('#MobileMenu').on('hide.bs.collapse', function () {
                $('body').toggleClass('modal-open');
            });

        }, 1000);
    }

})();
