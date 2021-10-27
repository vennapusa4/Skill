/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillCommentBoxExpertInterview', skillCommentBoxExpertInterview);

    /** @ngInject */
    function skillCommentBoxExpertInterview() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                expertInterviewId: '<',
                callback: '&'
            },
            controller: function ($rootScope, $scope, logger, ExpertInterviewCommentApi) {
                $scope.expertInterviewComments = {};
                $scope.replyCommentText = '';

                function _getComments() {
                    ExpertInterviewCommentApi.api.all.save({}, { expertInterviewId: $scope.expertInterviewId },
                        function (response) {
                            $scope.expertInterviewComments = response;
                            if (_.isFunction($scope.callback)) {
                                var total = $scope.expertInterviewComments.total || 0;
                                $scope.callback({ totalComment: total });
                            }
                            // $log.info('Retrieved comments successfully.');
                        }, function (response) {
                            $scope.expertInterviewComments = [];
                            if (response.status !== 404)
                                logger.error(response.data.errorMessage);
                        });
                };

                function _postComment() {
                    var commentRequest = { expertInterviewId: $scope.expertInterviewId, commentText: $scope.commentText };
                    ExpertInterviewCommentApi.api.comments.save({}, commentRequest,
                        function (response) {
                            _getComments();
                            $scope.commentText = '';
                        }, function (response) {
                            logger.error(response.data.errorMessage);
                        });
                };

                function _showReply(comment) {
                    if (!$scope.showReplyForComment) {
                        $scope.showReplyForComment = comment;
                    } else {
                        if ($scope.showReplyForComment.commentId == comment.commentId) {
                            $scope.showReplyForComment = null;
                        } else {
                            $scope.showReplyForComment = comment;
                        }
                    }
                }

                function _likeComment(comment) {
                    var likeRequest = { id: comment.commentId, isLiked: !comment.isLiked };
                    ExpertInterviewCommentApi.api.likeComment.save({}, likeRequest,
                        function (response) {
                            _getComments();
                        }, function (response) {
                            logger.error(response.data.errorMessage);
                        });
                };

                function _deleteComment(comment) {
                    var deleteCommentRequest = { commentId: comment.commentId };
                    ExpertInterviewCommentApi.api.deleteComment.save({}, deleteCommentRequest,
                        function (response) {
                            _getComments();
                        }, function (response) {
                            if (response.status !== 404)
                                logger.error(response.data.errorMessage);
                        });
                };

                function _replyComment(comment, commentText) {
                    var replyRequest = { id: comment.commentId, reply: commentText };
                    ExpertInterviewCommentApi.api.replyComment.save({}, replyRequest,
                        function (response) {
                            _getComments();
                            $scope.replyCommentText = '';
                            $scope.showReplyForComment = '';
                        }, function (response) {
                            logger.error(response.data.errorMessage);
                        });
                };

                function _pinComment(comment) {
                    var pinCommentRequest = { commentId: comment.commentId, pinComment: !comment.isCommentPinned };
                    ExpertInterviewCommentApi.api.pinComment.save({}, pinCommentRequest,
                        function (response) {
                            _getComments();
                            $rootScope.$broadcast('UpdateInterest');
                            if (pinCommentRequest.pinComment)
                                logger.success('Pin Comment was successful.');
                            else
                                logger.success('Unpin Comment was successful.');
                        }, function (response) {
                            logger.error(response.data.errorMessage);
                        });
                };

                $scope.getComments = _getComments;
                $scope.showReply = _showReply;
                $scope.postComment = _postComment;
                $scope.likeComment = _likeComment;
                $scope.deleteComment = _deleteComment;
                $scope.replyComment = _replyComment;
                $scope.pinComment = _pinComment;
                $scope.getComments();
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/skill-comment-box-expert-interview.html',
        };
    }
})();
