(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('selectedDiscussion', selectedDiscussion);

    /* @ngInject */
    function selectedDiscussion() {
        return {
            restrict: 'EA',
            scope: false,
            templateUrl: 'app/core/directives/selected-discussion/selected-discussion.html',
            link: function (scope, element) {

                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.vm.postComment(scope.vm.sDiscussionItem, scope.vm.sDiscussionItem.newComment, scope.vm.sDiscussionType);
                        event.preventDefault();
                    }
                })
            }
        }
    }
})();