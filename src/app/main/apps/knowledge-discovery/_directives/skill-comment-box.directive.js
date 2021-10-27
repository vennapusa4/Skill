/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillCommentBox', skillCommentBox);

  /** @ngInject */
  function skillCommentBox() {
    return {
      restrict: 'AE',
      // replace: true,
      scope: {
        kdId: '<',
        kdType: '<',
        callback: '&',
        hiddenimg: '<'
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

        $scope.confirmInfo = {};

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


        $scope.EmailSource = {
          dataTextField: "PersonName",
          dataValueField: "Id",
          autoBind: false,
          delay: 500,
          // valuePrimitive: true,
          dataSource: new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
              read: function (options) {
                return KnowledgeDiscoveryApi.getEmails(options)
              }
            }
          }),
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
            });
          }
        };

        function _getComments() {
          CommentApi.api.all.save({}, { KDId: $scope.kdId },
            function (response) {
              $scope.kdComments = response;
              if (_.isFunction($scope.callback)) {
                var total = $scope.kdComments.total || 0;
                $scope.callback({ totalComment: total });
              }
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

        function _getIdeas() {
          IdeaApi.getAll($scope.kdId).then(function (response) {
            $scope.kdIdeas = response;
            // $log.info('Retrieved ideas successfully.');
          }, function (response) {
            $scope.kdIdeas = [];
            if (response.status !== 404)
              logger.error(response.data.errorMessage);
          });
        };

        function _getAllIdeaCategories() {
          IdeaApi.getAllIdeaCategories().then(function (response) {
            $scope.arrIdeaCategory = response;
          });
        }

        function _resetIdeaModel() {
          $scope.ideaModel = {
            kdId: $scope.kdId,
            title: null,
            description: null,
            ideaCategoryId: null,
            shareToDepartment: false,
            shareToCop: false,
            shareToEmail: false,
            isSkip: $rootScope.userInfo.userAppConfiguration.skipIdeaDialog,
            emails: []
          };
        }

        function _nextIdea() {
          if (!$rootScope.userInfo.userAppConfiguration.skipIdeaDialog) {
            IdeaApi.getConfirmInfo().then(function (data) {
              $scope.confirmInfo = data;
              $("#ModalIdea").modal('hide');
              $("#SubmitModal").modal('show');
            });
          } else {
            _postIdea();
          }
        }

        function _postIdea() {
          if ($scope.ideaModel.shareToEmail && ($scope.ideaModel.emails == null || $scope.ideaModel.emails.length <= 0)) {
            return;
          }
          IdeaApi.addIdea($scope.ideaModel).then(function (response) {
            if (response) {
              $rootScope.userInfo.userAppConfiguration.skipIdeaDialog = $scope.ideaModel.isSkip;
              UserProfileApi.saveUserInfo($rootScope.userInfo);
              _getIdeas();

              $("#ModalIdea").modal('hide');
              $("#SubmitModal").modal('hide');
              _resetIdeaModel();
            }
          }, function (response) {
            logger.error(response.data.errorMessage);
          });
        }

        function _showReplyIdea(idea) {
          if (!$scope.showReplyForIdea) {
            $scope.showReplyForIdea = idea;
          } else {
            if ($scope.showReplyForIdea.ideaId == idea.ideaId) {
              $scope.showReplyForIdea = null;
            } else {
              $scope.showReplyForIdea = idea;
            }
          }
        }

        function _replyIdea(idea, ideaText) {
          var replyRequest = { id: idea.ideaId, reply: ideaText };
          IdeaApi.api.replyIdea.save({}, replyRequest,
            function (response) {
              _getIdeas();
              $scope.replyIdeaText = '';
              $scope.showReplyForIdea = '';
            }, function (response) {
              logger.error(response.data.errorMessage);
            });
        };

        function _likeIdea(idea) {
          var isLiked = idea.isLiked || false;
          if (isLiked) {
            idea.isLiked = false;
            KnowledgeDocumentApi.postLike(idea.ideaId, false).then(function (data) {
              if (!data.isSuccess) {
                idea.isLiked = true;
              }
            }, function (error) {
              idea.isLiked = true;
            });
          } else {
            idea.isLiked = true;
            KnowledgeDocumentApi.postLike(idea.ideaId, true).then(function (data) {
              if (!data.isSuccess) {
                idea.isLiked = false;
              }
            }, function (error) {
              idea.isLiked = false;
            });
          }

          return false;
        };

        function _deleteIdeaReply(reply) {
          var deleteRequest = { ideaReplyId: reply.replyId };
          IdeaApi.api.deleteIdeaReply.save({}, deleteRequest,
            function (response) {
              _getIdeas();
            }, function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        }

        function _showTranslated(comment) {
          $scope.translatedText = '';
          if (!$scope.showTranslatedForComment) {
            $scope.showTranslatedForComment = comment;
            translateSingleComment(comment);
            $scope.showTranslatedForComment.isTranslated = true;
          } else {
            if ($scope.showTranslatedForComment.commentId == comment.commentId) {
              $scope.showTranslatedForComment = null;
              //$scope.showTranslatedForComment.isTranslated = false;
            } else {
              $scope.showTranslatedForComment = comment;
              translateSingleComment(comment);
              $scope.showTranslatedForComment.isTranslated = true;
            }
          }
        }

        function translateSingleComment(comment){
          TranslatorApi.api.TranslateSingleText.save({}, {
            textToTranslate: comment.commentText,
            toLanguage: $scope.$parent.selectedLanguage
          },
            function (response) {
              $scope.translatedText = response.translatedText;
            },
            function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        }

        $scope.getComments = _getComments;
        $scope.showReply = _showReply;
        $scope.postComment = _postComment;
        $scope.likeComment = _likeComment;
        $scope.deleteComment = _deleteComment;
        $scope.replyComment = _replyComment;
        $scope.pinComment = _pinComment;
        $scope.getIdeas = _getIdeas;
        $scope.getAllIdeaCategories = _getAllIdeaCategories;
        $scope.resetIdeaModel = _resetIdeaModel;
        $scope.nextIdea = _nextIdea;
        $scope.postIdea = _postIdea;
        $scope.showReplyIdea = _showReplyIdea;
        $scope.likeIdea = _likeIdea;
        $scope.replyIdea = _replyIdea;
        $scope.deleteIdeaReply = _deleteIdeaReply;
        $scope.showTranslated = _showTranslated;

        $scope.getComments();
        $scope.getIdeas();
        $scope.getAllIdeaCategories();
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-comment-box.html',
    };
  }
})();
