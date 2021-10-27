(function () {
    'use strict';

    angular
        .module('app.expertInterview')
        .factory('ExpertInterviewCommentApi', ExpertInterviewCommentApi);

    /** @ngInject */
    function ExpertInterviewCommentApi($resource, appConfig, $q, $timeout) {
        var $q = $q;
        var $timeout = $timeout;

        var api = {

            likeLink: appConfig.MinutesApi + 'api/ExpertInterviewComment/{Id}/Like',
            like: function (Id) {

                var link = api.likeLink.replace('{Id}', Id);
                return $resource(link);
            },
            all: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/All'),
            comments: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment'),
            deleteComment: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/Delete'),
            replyComment: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/Reply'),
            likeComment: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/Like'),
            pinComment: $resource(appConfig.SkillApi + 'api/ExpertInterviewComment/Pin')
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