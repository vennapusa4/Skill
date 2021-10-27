/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillCommentArticleBox', skillCommentArticleBox);

  /** @ngInject */
  function skillCommentArticleBox() {
    return {
      restrict: 'AE',
      // replace: true,
      scope: {
        kdId: '<',
        kdType: '<',
        callback: '&'
      },
      controller: function ($rootScope, $scope, $timeout, logger, CommentApi, IdeaApi, KnowledgeDiscoveryApi, KnowledgeDocumentApi, UserProfileApi, TranslatorApi) {
        $scope.kdComments = {};
        $scope.replyCommentText = '';
        $scope.replyIdeaText = '';
        $scope.translatedText = '';
       // $scope.showTranslatedForComment = false;
        $scope.kdIdeas = {};
        $scope.ideaModel = {};
        $scope.arrIdeaCategory = [];
        $scope.current= 1;
        $scope.sliceStart= 0;
        $scope.sliceEnd= 5;
        $scope.allPages = 0;

        $scope.Questions = {};
        $scope.Questions.comments = $scope.$parent.Questions.comments;
        $scope.Questions.postedon = $scope.$parent.Questions.postedon;
        $scope.Questions.reply = $scope.$parent.Questions.reply;
        $scope.Questions.deletecomment = $scope.$parent.Questions.deletecomment;
        $scope.Questions.translate = $scope.$parent.Questions.translate;
        $scope.Questions.hideTranslation = $scope.$parent.Questions.hideTranslation;
        $scope.Questions.like = $scope.$parent.Questions.like;
        $scope.Questions.dislike = $scope.$parent.Questions.dislike;
        if($scope.$parent.Questions.comments && $scope.$parent.Questions.postedon && $scope.$parent.Questions.reply
           && $scope.$parent.Questions.deletecomment && $scope.$parent.Questions.translate && $scope.$parent.Questions.hideTranslation
            && $scope.$parent.Questions.like && $scope.$parent.Questions.dislike ){
              $scope.Questions.comments = $scope.$parent.Questions.comments;
              $scope.Questions.postedon = $scope.$parent.Questions.postedon;
              $scope.Questions.reply = $scope.$parent.Questions.reply;
              $scope.Questions.deletecomment = $scope.$parent.Questions.deletecomment;
              $scope.Questions.translate = $scope.$parent.Questions.translate;
              $scope.Questions.hideTranslation = $scope.$parent.Questions.hideTranslation;
              $scope.Questions.like = $scope.$parent.Questions.like;
              $scope.Questions.dislike = $scope.$parent.Questions.dislike;
        }
        else{
          $scope.Questions.comments = "Comment";
          $scope.Questions.postedon = "Posted On";
          $scope.Questions.reply = "Reply";
          $scope.Questions.deletecomment = "Delete";
          $scope.Questions.translate = "Translate";
          $scope.Questions.hideTranslation = "Hide Translation";
          $scope.Questions.like = "Like";
          $scope.Questions.dislike = "Dislike";
        }

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          console.log($scope.$parent.Questions);
          $scope.Questions.comments = $scope.$parent.Questions.comments;
          $scope.Questions.postedon = $scope.$parent.Questions.postedon;
          $scope.Questions.reply = $scope.$parent.Questions.reply;
          $scope.Questions.deletecomment = $scope.$parent.Questions.deletecomment;
          $scope.Questions.translate = $scope.$parent.Questions.translate;
          $scope.Questions.hideTranslation = $scope.$parent.Questions.hideTranslation;
          $scope.Questions.like = $scope.$parent.Questions.like;
          $scope.Questions.dislike = $scope.$parent.Questions.dislike;
        });


        $scope.confirmInfo = {};

        $scope.$on('commentsAdded', function (event, data) {
          _getComments();
        });

        $scope.setPage = function (data) {
          $scope.current = data;
          $scope.sliceStart = (data - 1) * 10;
          $scope.sliceEnd = $scope.sliceStart + 10;
      }

      $scope.goNext = function () {
        $scope.setPage($scope.current + 1);
      }
      $scope.goPrev = function () {
        $scope.setPage($scope.current - 1);
      }
        
        function _getComments() {
          CommentApi.api.all.save({}, { KDId: $scope.kdId },
            function (response) {
              console.log("item [168165]")
              $scope.kdComments = response;
              if (_.isFunction($scope.callback)) {
                var total = $scope.kdComments.total || 0;
                $scope.allPages = Math.ceil($scope.kdComments.total / 10);
                $scope.callback({ totalComment: total });
              }
              console.log($scope.kdComments);
              console.log($scope.kdId);
              // $log.info('Retrieved comments successfully.');
            }, function (response) {
              $scope.kdComments = [];
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        };

        function _postComment() {
          var commentRequest = { kDId: $scope.kdId, commentText: $scope.commentText };
          CommentApi.api.comments.save({}, commentRequest,
            function (response) {
              console.log(response)
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
          CommentApi.api.likeComment.save({}, likeRequest,
            function (response) {
              _getComments();
            }, function (response) {
              logger.error(response.data.errorMessage);
            });
        };

        function _deleteComment(comment) {
          var deleteCommentRequest = { commentId: comment.commentId };
          CommentApi.api.deleteComment.save({}, deleteCommentRequest,
            function (response) {
              _getComments();
            }, function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        };

        function _replyComment(comment, commentText) {
          var replyRequest = { id: comment.commentId, reply: commentText };
          CommentApi.api.replyComment.save({}, replyRequest,
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
          CommentApi.api.pinComment.save({}, pinCommentRequest,
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
      templateUrl: 'app/main/apps/search-page/directive/skill-comment-article-box.html',
    };
  }
})();
