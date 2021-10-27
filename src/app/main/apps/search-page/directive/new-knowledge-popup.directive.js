/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('newKnowledgePopup', newKnowledgePopup);

    /** @ngInject */
    function newKnowledgePopup() {

        return {
            restrict: 'E',
            scope: {
                id: "=",

            },
            controller: function ($scope,KnowledgeDocumentApi,$rootScope,ExpertInterviewApi) {
                $scope.selectedArticle = null;
                function _onInit() {
                    
                }

                _onInit();
               
            },
            templateUrl: 'app/main/apps/search-page/directive/new-knowledge-popup.html'
            
        };
    }
})();
