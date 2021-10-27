(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('selectedComment', selectedComment);

    /* @ngInject */
    function selectedComment() {
        return {
            restrict: 'EA',
            scope: {
                commentList: "=",
                commentPost: "&",
                isPosting: "=",
                canComment: "=",
                commentLoading: "="
            },
            templateUrl: 'app/core/directives/selected-comment/selected-comment.html',
            link: function (scope, element) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.commentPost({ commentText: scope.commentList.newComment });
                        event.preventDefault();
                    }
                });
            }
        }
    }

})();