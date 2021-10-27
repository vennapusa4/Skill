(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,$window, $scope, $timeout, $state, $http, $cookies, appConfig, AccountApi) {

        var vm = this;
        $scope.reload = function(){
            $window.location.reload();
        }
        $scope.close =  function(){
            $('#tokenExpireWarning').modal('hide');
        }
        $scope.tokenExpireMessage = "";

        $scope.$on('reAuthorize', function (event, data) {
            var searchStr = $window.location.href;
            debugger;
            var urlPart = searchStr.split("/");
            if(urlPart.length >3 && urlPart[3].length > 0){
                //broadcast for notification
                if(!data.isExpires){
                    $scope.tokenExpireMessage = "Your session will expire with in "+data.mins+" min(s). Please save your changes.";
                    $('#tokenExpireWarning').modal('show');
                }
                else{
                    localStorage.clear();
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    $scope.errorMessage = "Your session expired. Please reload to login again.";
                    $('#tokenExpires').modal({backdrop: 'static', keyboard: false});
                    $scope.showReload = true;
                    
                }
                console.log('here');
            }
            else{
                //reload page
                if(data.isExpires){
                    localStorage.clear();
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    $window.location.reload();
                }
            }
          });

            $scope.errorMessage = "";
            $scope.showReload = false;

            $scope.$on('incompleteLogin', function (event, data) {
                debugger;
                if(data){
                    var counter = parseInt(localStorage["incompleteLoginCounter"]);
                    $http.defaults.headers.common['AccessToken'] = "";
                    $http.defaults.headers.common['AbbreviationToken'] = "";
                    localStorage.clear();
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function (v, k) {
                    // debugger;
                        $cookies.remove(k);
                    });

                
                    if(!counter){
                        counter = 0;
                    }
                    counter+=1;
                    localStorage["incompleteLoginCounter"] = counter;

                    if(counter <= 2){
                        $window.location.reload();
                    }
                    else{
                        $('#tokenExpires').modal({backdrop: 'static', keyboard: false});
                        $scope.errorMessage = counter == 3 ? "Login failed. Please try to reload this page by pressing (Control+F5) keys." : "Login Failed. Please try to clear the browser cache and reload the page or Please contact with administrator.";
                        $scope.showReload = counter == 3;
                    }
                    //$window.location.reload();
                }
            });
            (function activate() {
                if (localStorage.getItem('access-token')) {
                    $http.defaults.headers.common['AccessToken'] = CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
                }
            })();
        
    }
})();