(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope,  $timeout, $interval, $http, $state, $templateCache, $location ,$cookies, $window, AccountApi, UserProfileApi, appConfig) {
        console.log("index run");
        var isLoggedIn = false;
        var isIE = false;

        //debugger;
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            //debugger;
            $cookies.remove(k);
        });

        function isIEBrowser() {
            var ua = navigator.userAgent;
            var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
            
            return is_ie; 
          }
        isIE = isIEBrowser();
        //var searchStr = $window.location.pathname;// $location.search().code;
        if(isIE){
          
            $('#warningIE').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#back-drop-div').show();
        }
        else
        {
           // debugger;
            //validateToken();
            checkTokenValidation(true);

            var searchStr = $window.location.hash == "" ? $window.location.pathname : $window.location.hash;
            var url = $window.location.href;

           // debugger;
            var tempSearchStr = searchStr;
            var indexOfHash = searchStr.indexOf('#');
            var restOfLength = searchStr.length - indexOfHash;
            searchStr = searchStr.substring(indexOfHash + 1, restOfLength);
        //  debugger;
        //  console.log(searchStr);
            var codeExist = searchStr != undefined && searchStr.length > 1 ? true : false;
           // debugger;
            if(codeExist == true){
                //debugger;
                searchStr = searchStr.replace("/",'');
                var arr = searchStr.split("&");
                var id_token = "";
                var code = "";
                //debugger;
                for(i = 0; i<arr.length; i++){
                    if(arr[i].includes("id_token")){
                        id_token = arr[i].replace("id_token=","");
                    }
                    if(arr[i].includes("code")){
                        code = arr[i].replace("code=","");
                    }
                }
            // console.log('id_token', id_token);
            //  console.log('code', code);
                // if(arr[1] != undefined & arr[1] != null && arr.length > 1){
                //     id_token =arr[1].replace("id_token=","");
                // }
                // var code = arr[0].replace("code=","");
                // if(code && id_token){
                //     login(code, id_token);
                // }
            }
            var warningGiven = false;

            $interval(function(){
                //validateToken();
                checkTokenValidation(false);
            }, 60000);
            $interval(function(){
                //validateToken();
                checkTokenValidation(true);
            }, 2000);
           // debugger;
            if(codeExist && code){
               // debugger;
                if ($window.location.href.includes('?')) { 
                    $window.history.pushState({}, null, location.href.split('?')[0]); 
                }
                localStorage["LandingSource"] = "login";
                login(code, id_token);
            }
            else if(localStorage.getItem('access-token')){
                isLoggedIn = true;
               
            }
            else{
                if(codeExist){
                    //localStorage["RedirectUrl"]= tempSearchStr;
                    localStorage["RedirectUrl"]= url;
                }
                $http.defaults.headers.common['AccessToken'] = "";
                $http.defaults.headers.common['AbbreviationToken'] = "";
                authorize();
            }
        }
        // function validateToken(){
        //     if(isLoggedIn){
        //         var isValid = checkTokenValidation();
        //         if(!isValid){
        //                 $http.defaults.headers.common['AccessToken'] = "";
        //                 $rootScope.$broadcast("reAuthorize", {true});
        //         }
        //     }
        // }
        
       

        function checkTokenValidation(perSecond){
            //debugger;
            if(isLoggedIn){
                if(localStorage['token-issue-time'] && localStorage['token-expiry-time']){
                    var issueFrom = new Date(localStorage['token-issue-time']);
                    var validTo =  new Date(localStorage['token-expiry-time']);
                    var loginTime = new Date(localStorage['login-time']);
                    var diff = (validTo - issueFrom);
                    var currTime = new Date();
                    var diffOfCurrentTime = (currTime - loginTime);
                    var minsRemains = Math.ceil((diff - diffOfCurrentTime)/ (60*1000));

                    if(!perSecond){
                        if(minsRemains <=1){
                            $http.defaults.headers.common['AccessToken'] = "";
                            $http.defaults.headers.common['AbbreviationToken'] = "";
                            $rootScope.$broadcast("reAuthorize", { mins : 0, isExpires: true});
                            return false;
                        }
                        else{
                            if(minsRemains == 5){
                                $rootScope.$broadcast("reAuthorize", { mins : minsRemains, isExpires: false});
                            }
                            return true;
                        }
                    }
                    else{
                        if(minsRemains <= 1){
                            $http.defaults.headers.common['AccessToken'] = "";
                            $http.defaults.headers.common['AbbreviationToken'] = "";
                            $rootScope.$broadcast("reAuthorize", { mins : 0, isExpires: true});
                            return false;
                        }
                    }
                }
                else{
                    $http.defaults.headers.common['AccessToken'] = "";
                    $http.defaults.headers.common['AbbreviationToken'] = "";
                    $rootScope.$broadcast("reAuthorize", { mins : 0, isExpires: true});
                    return false;
                }
            }
        }
        
        function login(code, id_token) {
            var postData = {
                accessToken: id_token,
                applicationId: appConfig.applicationId,
                code : code,
                client: {
                    ip: '127.0.0.1',
                    hostname: 'Test',
                    userAgent: 'Test'
                }
            };
             
            AccountApi.api.login.save({}, postData,
                // Success
                function (response) {
                    //console.log(response);
                   // debugger;
                   response ={"accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Inc5OU05bXBsMU91Vjk5RklKNTBiNUZkbGpfZyJ9.eyJhdWQiOiJtaWNyb3NvZnQ6aWRlbnRpdHlzZXJ2ZXI6N2ZhMzkzMWQtNDNhYi00YTRkLWJjMWQtZjZmYjYxNDg2YmZlIiwiaXNzIjoiaHR0cDovL3N0cy5wZXRyb25hcy5jb20vYWRmcy9zZXJ2aWNlcy90cnVzdCIsImlhdCI6MTYzNTM0MDg2MywiZXhwIjoxNjM1MzY5NjYzLCJlbWFpbCI6InJhbWFzdWJiYXJlZGR5LnZlbm5hQHBldHJvbmFzLmNvbS5teSIsIndpbmFjY291bnRuYW1lIjpbInJhbWFzdWJiYXJlZGR5LnZlbm5hIiwiUEVUUk9OQVNcXHJhbWFzdWJiYXJlZGR5LnZlbm5hIl0sIkRpc3BsYXlOYW1lIjoiUmFtYSBTdWJiYSBSZWRkeVZlbm5hcHVzYSIsIk9iamVjdEdVSUQiOiJXQW1QNDNwUEFFT0IrbnFkaGxGYURRPT0iLCJlbXBsb3llZW51bWJlciI6IkMwMDUwMTI1IiwiZGVwYXJ0bWVudCI6IlNvZnR3YXJlIEVuZ2luZWVyaW5nIFx1MDAyNiBUZXN0aW5nIiwiRGl2aXNpb24iOiJEaWdpdGFsIEVuZ2luZWVyaW5nIiwiY29tcGFueSI6IlBFVFJPTkFTIERpZ2l0YWwgU2RuLiBCaGQuIiwiYXBwdHlwZSI6IkNvbmZpZGVudGlhbCIsImFwcGlkIjoiN2ZhMzkzMWQtNDNhYi00YTRkLWJjMWQtZjZmYjYxNDg2YmZlIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiYXV0aF90aW1lIjoiMjAyMS0xMC0yNlQxMDoyNDo0OC4wNzVaIiwidmVyIjoiMS4wIiwic2NwIjoib3BlbmlkIn0.WUSjr3a5KzavCbF8UFHwyB5xZgzOOPVTTTzhUYN7J4J6lLZxqF24CDYy_KZFzifBDXh6L0EpSQAxO6KLhc4PTPsIq1i2RyYGcxSeSPZSIKGoh_ytP-zmO7siLm4cJd5h-DwbApXwB04tw9sxBrVjKMFWSxq5ZFm6Rvo0swNM8yTqkdzxrOFG5oSvXLnxXiHlBzDftmEA1T3HYMA60qNka11SUDs3Kvy6_tCHGOT-qgffNa9id-zYZkZ-oQ5XUCdcHHaxadkfYjXJFcof9J7U-QlrATb2n7fOt2lWE0MpUGOcPRN9ArtMjhVgXemDIe2BWf1zH_P1DKsRj0eUGVVo5g","userId":62581,"displayName":"Rama Subba ReddyVennapusa","email":"ramasubbareddy.venna@petronas.com.my","domain":null,"opu":"PETRONAS Digital Sdn. Bhd.","hasImage":false,"imageUrl":null,"divisionName":"Digital Engineering","departmentName":"Software Engineering & Testing","primaryDisciplineName":null,"lastLoginDate":null,"skillExpertise":null,"cop":null,"location":null,"locationId":null,"ranking":null,"nickName":null,"isFisrtLogin":false,"roles":[],"userAppConfiguration":{"skipShareDocumentDialog":false,"isShowAddRemoveDialog":true,"skipWorkingProjectDialog":false,"skipIdeaDialog":false},"tokenIssueTime":"2021-10-27T21:22:33.3626625+08:00","tokenExpiresTime":"2021-10-28T05:21:03+08:00","userDisciplines":null};
                    if(response.accessToken && response.tokenIssueTime 
                        && response.tokenExpiresTime && response.roles
                        && response.userId && response.email
                        && response.displayName 
                    ){
                        var encryptedToken = CryptoJS.AES.encrypt(response.accessToken, appConfig.passwordKey).toString();
                        localStorage["incompleteLoginCounter"] = 0;
                        localStorage['access-token'] = encryptedToken;
                        localStorage['login-time'] = new Date();
                        localStorage['token-issue-time'] = response.tokenIssueTime;
                        localStorage['token-expiry-time'] = response.tokenExpiresTime;
                        
                        //debugger;
                        localStorage.UserInfo = JSON.stringify(response);
    
                        localStorage['userId'] = response.userId;
                        localStorage['email'] = response.email;
                        localStorage['photo'] = response.photo;
                        localStorage['photoUrl'] = response.photoUrl;
                        localStorage['displayName'] = response.displayName;
                        localStorage['nickName'] = response.nickName;
                        localStorage['lastLoginDate'] = response.lastLoginDate;
                        localStorage['roles'] = JSON.stringify(response.roles);
                        //debugger;
                        localStorage['skillExpertise'] = response.skillExpertise;
                        localStorage['tel'] = response.tel;
                        localStorage['departmentName'] = response.departmentName;
                        localStorage['divisionName'] = response.divisionName;
                        localStorage['location'] = response.location;
                        localStorage['locationId'] = response.locationId;
                        localStorage['firsttime'] = response.isFisrtLogin;
                      
                        isLoggedIn = true;
                       // $state.reload();
                       $http.defaults.headers.common['AccessToken'] = CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
                
    
                       $rootScope.$broadcast("tokenStaus", true);
                       //debugger;
                       if(localStorage.getItem("RedirectUrl")){
                          // debugger;
                          
                           $window.location.href =localStorage.getItem("RedirectUrl");
                           localStorage["RedirectUrl"]=  "";
                       }
                      
                    }
                    else{
                       // debugger;
                        $rootScope.$broadcast("incompleteLogin", true);
                        
                        // localStorage.clear();
                        // var cookies = $cookies.getAll();
                        // angular.forEach(cookies, function (v, k) {
                        //    // debugger;
                        //     $cookies.remove(k);
                        // });
                        // authorize();
                    }
                    
                },

                // Error
                function (response) {

                    // vm.loading = false;
                    // vm.isValid = false;
                }
            )
        }
        function authorize() {
            var authorizationUrl = appConfig.authorization_endpoint;
            var client_id = appConfig.client_id;
            var client_secret = appConfig.client_secret;
            var redirect_uri = appConfig.redirect_uri;

            var response_mode ="query";
            var response_type = "code id_token";
            var scope = "openid name offline_access";
            var nonce = "N" + Math.random() + "" + Date.now();
            var state = Date.now() + "" + Math.random();
        
             
            var url =
                authorizationUrl + "?" +
                // "response_mode=" + encodeURI(response_mode) + "&" +
                "response_type=" + encodeURI(response_type) + "&" +
                "client_id=" + encodeURI(client_id) + "&" +
                "client_secret"+ encodeURI(client_secret) + "&" +
                "redirect_uri=" + encodeURI(redirect_uri) + "&" +
                "scope=" + encodeURI(scope) + "&" +
                "nonce=" + encodeURI(nonce) + "&" +
                "state=" + encodeURI(state);
                 
                $window.location = url;
        }


        // Activate loading indicator
        $templateCache.put("/app/core/template/skill-pagination.html", '<li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href="javascript:void(0)" ng-click="selectPage(1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle>{{::getText(\'first\')}}</a></li> <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href="javascript:void(0)" ng-click="selectPage(page - 1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle><i class="icon-left-open"></i></a></li> <li role="menuitem" ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href="javascript:void(0)" ng-click="selectPage(page.number, $event)" ng-disabled="ngDisabled&&!page.active" uib-tabindex-toggle>{{page.text}}</a></li> <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href="javascript:void(0)" ng-click="selectPage(page + 1, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle><i class="icon-right-open"></i></a></li> <li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href="javascript:void(0)" ng-click="selectPage(totalPages, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'last\')}}/a></li>');
        $rootScope.activeTopMenu = function () {
            if (!$rootScope.TopNavItems || $rootScope.TopNavItems.length <= 0) return;
            var hasActive = false;
            for (var i = 0; i < $rootScope.TopNavItems.length; i++) {
                $rootScope.TopNavItems[i].isActive = false;
                if (hasActive) continue;
                if ($rootScope.TopNavItems[i].url) {
                    if ($rootScope.TopNavItems[i].url.indexOf('/knowledge-discovery') != -1
                        && $rootScope.TopNavItems[i].url.indexOf('/validate') == -1
                        && $rootScope.TopNavItems[i].url.indexOf('/build') == -1

                        && $location.url().indexOf('/knowledge-discovery') != -1
                        && $location.url().indexOf('/validate') == -1
                        && $location.url().indexOf('/build') == -1) {
                        $rootScope.TopNavItems[i].isActive = true;
                        hasActive = true;
                    }
                    else if ($rootScope.TopNavItems[i].url.indexOf('/insights-') != -1 && $state.current.name.indexOf('insights') != -1) {
                        $rootScope.TopNavItems[i].isActive = true;
                        hasActive = true;
                    }
                    else if ($rootScope.TopNavItems[i].url.indexOf('/trending-') != -1 && $state.current.name.indexOf('insights') != -1) {
                        $rootScope.TopNavItems[i].isActive = true;
                        hasActive = true;
                    }
                    else if ($rootScope.TopNavItems[i].url.indexOf('/expert-directory') != -1 && $state.current.name.indexOf('expertDirectory') != -1) {
                        $rootScope.TopNavItems[i].isActive = true;
                        hasActive = true;
                    }
                    else if ($rootScope.TopNavItems[i].url.indexOf('/leaderboard/') != -1 && $state.current.name.indexOf('leaderboard') != -1) {
                        $rootScope.TopNavItems[i].isActive = true;
                        hasActive = true;
                    }
                }

                if ($rootScope.TopNavItems[i].topNavigationSubItems.length > 0) {
                    for (var j = 0; j < $rootScope.TopNavItems[i].topNavigationSubItems.length; j++) {
                        var item = $rootScope.TopNavItems[i].topNavigationSubItems[j];
                        if (item.url
                            && item.url.indexOf('/knowledge-discovery') != -1
                            && (item.url.indexOf('/validate') !== -1
                                || item.url.indexOf('/build') !== -1)
                            && $location.url().indexOf('/knowledge-discovery') != -1
                            && ($location.url().indexOf('/validate') !== -1
                                || $location.url().indexOf('/build') !== -1)) {
                            $rootScope.TopNavItems[i].isActive = true;
                            hasActive = true;
                        }
                    }
                }
            }
            if (!hasActive) $rootScope.TopNavItems[0].isActive = true;
        }

        $rootScope.activeLeftMenu = function () {
            try {
                $rootScope.isCurrentMasterData = $state.current.name.indexOf('appAdmin.masterDataAdmin') != -1;;
            } catch (error) {

            }
        }

        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (e, curState) {
                
                try {
                    if (curState.views != null && e.targetScope.state.current.views != null &&
                        (curState.views.hasOwnProperty('subContent@app.myAccountUser')
                            || curState.views.hasOwnProperty('subRightContent@app.myAccountUser.myExpertProfile')) &&
                        (e.targetScope.state.current.views.hasOwnProperty('subContent@app.myAccountUser')
                            || e.targetScope.state.current.views.hasOwnProperty('subRightContent@app.myAccountUser.myExpertProfile')
                        )) {
                    }
                    else if (curState.views != null && e.targetScope.state.current.views != null &&
                        (curState.views.hasOwnProperty('subContent@app.userProfile')
                            || curState.views.hasOwnProperty('subRightContent@app.userProfile.myExpertProfile')) &&
                        (e.targetScope.state.current.views.hasOwnProperty('subRightContent@app.userProfile.myExpertProfile')
                            || e.targetScope.state.current.views.hasOwnProperty('subContent@app.userProfile')
                        )) {
                    }
                    else if (curState.views != null && e.targetScope.state.current.views != null &&
                        curState.views.hasOwnProperty('subContent@app.knowledgeDiscovery') &&
                        e.targetScope.state.current.views.hasOwnProperty('subContent@app.knowledgeDiscovery')) {
                    }
                    else if (curState.views != null && e.targetScope.state.current.views != null &&
                        curState.name.indexOf('app.myAccountUser.submissions') != -1 &&
                        e.targetScope.state.current.name.indexOf('app.myAccountUser.submissions') != -1) {
                    }
                    else if (curState.views != null && e.targetScope.state.current.views != null &&
                        curState.name.indexOf('app.myAccountUser.pendingActions') != -1 &&
                        e.targetScope.state.current.name.indexOf('app.myAccountUser.pendingActions') != -1) {
                    }
                    else {
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    }
                } catch (error) {

                }
                $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function (e, curState) {
            if(localStorage.getItem("access-token") && !isIE){
                // FPT add for Title page, and scoll to Top
                $rootScope.libraryType = '';
                $rootScope.title = $state.current.title;
                $rootScope.userInfo = UserProfileApi.getUserInfo();
                $rootScope.activeTopMenu();
                $rootScope.activeLeftMenu();

                if (!localStorage.getItem('access-token') && !$rootScope.redirectState && $state.current.name !== 'app.pages_about_tnc') {
                    if ($state.current.name !== 'app.pages_auth_login') {
                        $rootScope.redirectState = $state.current.name;
                        $rootScope.redirectParams = $state.params;
                    }
                    // $state.go('app.pages_auth_login');
                    isLoggedIn = false;
                    authorize();
                } else if (localStorage.getItem('access-token') && $rootScope.redirectState) {
                    $state.go($rootScope.redirectState, { id: $rootScope.redirectParams.id });
                    $rootScope.redirectState = null;
                    $rootScope.redirectParams = null;
                }

                // $timeout(function () {
                //     $rootScope.loadingProgress = false;
                // });
            }
            else{
                $rootScope.loadingProgress = true;
            }
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            if(!isIE){
                stateChangeStartEvent();
                stateChangeSuccessEvent();
            }
        });
    }
})();
