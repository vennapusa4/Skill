(function () {
  'use strict';

  angular
    .module('app.faq')
    .controller('FaqController', FaqController);

  /** @ngInject */
  function FaqController($scope, FaqApi, logger, $log) {
    var vm = this;
    vm.faqTopics = [];
    vm.faqDetails = [];
    vm.getFAQDetails = getFAQDetails;
    vm.displaySelectedTopicFAQs = displaySelectedTopicFAQs;
    vm.postTagging = postTagging;

    $scope.$parent.isopen = ($scope.$parent.default === $scope.item);

    $scope.$watch('isopen', function (newvalue, oldvalue, $scope) {
      $scope.$parent.isopen = newvalue;
    });

    activate();

    function activate() {
      getFAQTopics();
    };

    function getFAQTopics() {
      FaqApi.api.topics.get({}, {},
        function (response) {
          vm.faqTopics = response.topics;
          $log.info(response);
          if (response.topics.length > 0) {
            vm.selectedTopic = response.topics[0];
            getFAQDetails(vm.selectedTopic);
          }
        }, function (response) {
          logger.error(response.data.errorMessage);
        });
    }

    function getFAQDetails(loadMore) {
      var faqRequest = { topicId: vm.selectedTopic.topicId, skip: (loadMore ? vm.faqDetails.length : 0) };
      FaqApi.api.faq.query({}, faqRequest,
        function (response) {
          $log.info(response);
          if (loadMore) {
            vm.faqDetails = vm.faqDetails.concat(response.faQs);
          }
          else {
            vm.faqDetails = response.faQs;
          }
          if (response.totalRecordsCount > vm.faqDetails.length) {
            vm.showLoadMoreButton = true;
          }
          else {
            vm.showLoadMoreButton = false;
          }
        }, function (response) {
          vm.faqDetails = [];
          logger.error(response.data.errorMessage);
        });
    };

    function displaySelectedTopicFAQs(topic) {
      vm.selectedTopic = topic;
      getFAQDetails();
    };

    function postTagging(faq, isLiked) {
      if (faq.isTagged && faq.isLiked === isLiked)
        return;

      var likeRequest = { faqId: faq.faqId, taggingTypeName: (isLiked ? 'Like' : 'Dislike'), taggingTypeValue: isLiked };
      FaqApi.api.tagging.save({}, likeRequest,
        function (response) {
          faq.isTagged = true;
          faq.isLiked = isLiked;
          if (isLiked) {
            faq.likesCount += 1;
            faq.dislikesCount -= 1;
          }
          else {
            faq.dislikesCount += 1;
            faq.likesCount -= 1;
          }
          $log.info('Posted tagging successfully.');
        }, function (response) {
          logger.error(response.data.errorMessage);
        });
    };
  }
})();
