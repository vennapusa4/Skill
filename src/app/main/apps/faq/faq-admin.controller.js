(function () {
    'use strict';

    angular
        .module('app.faq')
        .controller('FaqAdminController', FaqAdminController);

    /** @ngInject */
    function FaqAdminController($state, $stateParams, $window, FaqApi, logger) {
        var vm = this;
        vm.NewTopicTitle = '';
        vm.faqTopicItems = [];
        vm.faqItems = [];
        vm.isEditing = false;

        // Contructor
        (function _Init() {
            _GetAllTopic();
        })();

        // function
        function _GetAllTopic() {
            FaqApi.GetAllTopic().then(function (data) {
                vm.faqTopicItems = data.topics;

                _.forEach(vm.faqTopicItems, function (topic) {
                    topic.faqItems = [];
                });

                if (vm.faqTopicItems.length > 0 && $stateParams.topicId == null) {
                    $stateParams.topicId = vm.faqTopicItems[0].topicId;
                }
                vm.GetAllQuestion($stateParams.topicId);
            });
        }

        function _AddNewTopic() {
            if (vm.NewTopicTitle == null || vm.NewTopicTitle == '' || vm.NewTopicTitle.trim() == '') {
                alert('Please type Topic name before Create');
                return;
            }

            var saveData = {
                id: 0,
                title: vm.NewTopicTitle
            };
            FaqApi.FaqTopicsAddNew(saveData).then(function (data) {
                if (data != null) {
                    vm.NewTopicTitle = '';
                    vm.faqTopicItems.push(data);

                    $('#AccInfo .k-link').click();
                    logger.success('Create topic success!', 'SKILL');
                }
                else {
                    logger.error('Create topic failed!', 'SKILL');
                }
            });
        }

        function _DeleteTopic(topicId) {
            var confirm = $window.confirm("Are you sure you want to delete this topic?");
            if (!confirm) return;

            FaqApi.FaqTopicsDelete(topicId).then(function (data) {
                if (data.result == true) {
                    logger.success('Delete topic success!', 'SKILL');

                    _.remove(vm.faqTopicItems, function (topic) {
                        return topic.topicId == topicId;
                    });
                }
                else {
                    logger.error('Delete topic failed!', 'SKILL');
                }
            });
        }

        function _GetAllQuestion(topicId) {

            // Change URL with first topicItem
            $state.transitionTo($state.current, { topicId: topicId }, {
                reload: false, inherit: false, notify: false
            });
            $stateParams.topicId = topicId;

            // Update Active class
            _.forEach(vm.faqTopicItems, function (topic) {
                if (topic.topicId == topicId) topic.isActive = true;
                else topic.isActive = false;
            });

            vm.faqItems = [];
            FaqApi.GetFaqDetailsByTopicId(topicId).then(function (data) {
                if (data.length > 0) {
                    _.forEach(data, function (faq) {
                        faq.questionChange = angular.copy(faq.question);
                        faq.answerChange = angular.copy(faq.answer);
                    });
                    vm.faqItems = data;
                }
            });
        }

        function _DeleteQuestion(questionId) {
            var confirm = $window.confirm("Are you sure you want to delete this question?");
            if (!confirm) return;

            FaqApi.FaqDetailsDelete(questionId).then(function (data) {
                if (data.result == true) {
                    logger.success('Delete question success!', 'SKILL');

                    _.remove(vm.faqItems, function (faq) {
                        return faq.id == questionId;
                    });
                }
                else {
                    logger.error('Delete question failed!', 'SKILL');
                }
            });
        }

        function _SaveQuestion(item) {
            var saveData = {
                id: item.id == null ? 0 : item.id,
                question: item.questionChange,
                answer: item.answerChange,
                faqTopicId: item.faqTopicId
            };

            FaqApi.FaqDetailsUpdate(saveData).then(function (data) {
                if (data.id != null) {
                    item.id = data.id;
                    item.question = angular.copy(item.questionChange);
                    item.answer = angular.copy(item.answerChange);

                    if (item.isNew == null || item.isNew == false) {
                        item.isShow = false;
                    }
                    else {
                        item.isShow = false;
                        item.isNew = false;
                    }
                    vm.isEditing = false;

                    logger.success('Save question success!', 'SKILL');
                }
                else {
                    logger.error('Save question failed!', 'SKILL');
                }
            });
        }

        function _CancelEditQuestion(item) {
            if (item.isNew == null || item.isNew == false) {
                item.questionChange = angular.copy(item.question);
                item.answerChange = angular.copy(item.answer);

                item.isShow = false;
            }
            else {
                vm.isEditing = false;
                _.remove(vm.faqItems, function (faq) {
                    return faq.isNew == true;
                });
            }
        }

        function _AddNewQuestion() {
            for (var i = 0; i < vm.faqItems.length; i++) {
                vm.faqItems[i].isShow = false;
            }

            var faqItem = {
                answer: '',
                question: '',
                answerChange: '',
                questionChange: '',
                faqTopicId: $stateParams.topicId,
                isShow: true,
                isNew: true
            };
            vm.faqItems.push(faqItem);

            vm.isEditing = true;
        }

        // Public function
        vm.GetAllTopic = _GetAllTopic;
        vm.AddNewTopic = _AddNewTopic;
        vm.DeleteTopic = _DeleteTopic;
        vm.GetAllQuestion = _GetAllQuestion;
        vm.AddNewQuestion = _AddNewQuestion;
        vm.SaveQuestion = _SaveQuestion;
        vm.CancelEditQuestion = _CancelEditQuestion;
        vm.DeleteQuestion = _DeleteQuestion;
    }
})();