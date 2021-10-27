(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('CommentApi', CommentApi);

    /** @ngInject */
    function CommentApi($resource, appConfig, $q, $timeout) {
        var $q = $q;
        var $timeout = $timeout;

        var api = {

            likeLink: appConfig.MinutesApi + 'api/Comment/{Id}/Like',
            like: function (Id) {

                var link = api.likeLink.replace('{Id}', Id);
                return $resource(link);
            },
            all: $resource(appConfig.SkillApi + 'api/Comment/All'),
            comments: $resource(appConfig.SkillApi + 'api/Comment'),
            deleteComment: $resource(appConfig.SkillApi + 'api/Comment/Delete'),
            replyComment: $resource(appConfig.SkillApi + 'api/Comment/Reply'),
            likeComment: $resource(appConfig.SkillApi + 'api/Comment/Like'),
            pinComment: $resource(appConfig.SkillApi + 'api/Comment/Pin')
        };

        function like(Id, IsLiked) {

            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve(true);
            }, 500);

            return deferred.promise;
        }

        return {
            api: api,

            like: like,
        };
    }

})();