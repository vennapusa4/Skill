(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dialog', dialogService);

    /** @ngInject */
    function dialogService($mdDialog) {
        
        var vm = this;
        var service = {
            openDialog: openDialog,
            openLog: openLog,
            openSubTopicLog: openSubTopicLog,
            openInvite: openInvite,
            confirmStatus: confirmStatus,
            confirmDelete: confirmDelete,
            revert: revert,
            openSecurity: openSecurity,
            minutesType: minutesType,
            resendNotification: resendNotification
        };

        return service;

        //////////
        /**
         * Resolve api
         * @param action
         * @param parameters
         */

        function openDialog(dialog) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/core/services/template/message.html',
                parent: angular.element(document.body),
                targetEvent: dialog.event ? dialog.event : $('body'),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false,
                preserveScope: true,
                locals: { dialog: dialog }
            }).finally(function () {
                return 'success';
            })
        }

        function openLog(dialog) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/core/services/template/log.html',
                parent: angular.element(document.body),
                targetEvent: dialog.event ? dialog.event : $('body'),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false,
                preserveScope: true,
                locals: { dialog: dialog }
            }).finally(function () {
                return 'success';
            })
        }

        function openSubTopicLog(dialog) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/core/services/template/subtopic-log.html',
                parent: angular.element(document.body),
                targetEvent: dialog.event ? dialog.event : $('body'),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false,
                preserveScope: true,
                locals: { dialog: dialog }
            }).finally(function () {
                return 'success';
            })
        }

        function openInvite(dialog) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/core/services/template/invite.html',
                parent: angular.element(document.body),
                targetEvent: dialog.event ? dialog.event : $('body'),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false,
                preserveScope: true,
                locals: { dialog: dialog }
            }).finally(function () {
                return 'success';
            })
        }

        function confirmStatus(ev, status) {
            var titleText;
            var contentText;
            var confirmText;
            switch (status) {
                case "Draft":
                    titleText = "Are you sure you want to send this minutes for review?";
                    contentText = "Once the minutes is sent for review, the chairperson and the members will be able to review the minutes.";
                    confirmText = "Send for Review";
                    break;
                case "Pending Review":
                    titleText = "Are you sure you want to send this minutes for approval?";
                    contentText = "Once the minutes is send for approval, only the chairperson can approve the minutes.";
                    confirmText = "Send for Approval";
                    break;
                case "Pending Approval":
                    titleText = "Are you sure you want to approve this minutes?";
                    contentText = "Once the minutes is approved, no changes can be made.";
                    confirmText = "Approve Minutes";
                    break;
            }
            var confirm = $mdDialog.confirm()
                .title(titleText)
                .textContent(contentText)
                .ariaLabel('Update Status')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok(confirmText)
                .cancel('Cancel');
            return $mdDialog.show(confirm).then(function () {
                return true;
            }, function () {
                return false;
            });
        }

        function confirmDelete(ev) {
            var deleteObject;
            switch (ev.currentTarget.name) {
                case "discardMinute": deleteObject = "minutes";
                    break;
                case "deleteDiscussion": deleteObject = "agenda";
                    break;
                case "deleteItem": deleteObject = "item";
                    break;
            }
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete?')
                .textContent('Once it is deleted, you could not recover it.')
                .ariaLabel('Delete ' + deleteObject)
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Ok')
                .cancel('Cancel');
            return $mdDialog.show(confirm).then(function () {
                return true;
            }, function () {
                return false;
            });
        }

        function revert(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want return to edit mode?')
                .textContent('Once it is in edit mode, the minutes status will set back to Pending Review.')
                .ariaLabel('Revert status')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Ok')
                .cancel('Cancel');
            return $mdDialog.show(confirm).then(function () {
                return true;
            }, function () {
                return false;
            });
        }

        function openSecurity(dialog) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/core/services/template/security.html',
                parent: angular.element(document.body),
                targetEvent: dialog.event ? dialog.event : $('body'),
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false,
                preserveScope: true,
                locals: { dialog: '' }
            })
        }

        function minutesType(ev) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                templateUrl: 'app/core/services/template/createType.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
            }).then(function (response) {

            })
        }

        function resendNotification(ev, minuteId, member, chairperson) {
            vm.resendLoading = false;
            var members = [];
            members.unshift(chairperson);
            members = members.concat(member);
            $mdDialog.show({
                locals: { resendMinuteId: minuteId, resendMember: members },
                controller: function (api, resendMinuteId, resendMember, dialog, appConfig) {
                    var vm = this;
                    vm.resendMinuteId = resendMinuteId;
                    vm.resendMember = resendMember;
                    vm.memberChecked = memberChecked;
                    vm.allMemberChecked = allMemberChecked;
                    vm.memberCount = 0;
                    vm.resend = resend;
                    vm.cancel = cancel;

                    function memberChecked(resendMember) {
                        if (resendMember.isChecked) {
                            vm.memberCount++;
                        } else {
                            vm.memberCount--;
                        }
                        if (vm.memberCount === vm.resendMember.length) {
                            vm.resendMember.isChecked = true;
                        } else {
                            vm.resendMember.isChecked = false;
                        }
                    }

                    function allMemberChecked(resendMember) {
                        for (var i = 0; i < resendMember.length; i++) {
                            if (resendMember.length > 0) {
                                resendMember[i].isChecked = vm.resendMember.isChecked;
                            }
                        }
                        if (vm.resendMember.isChecked) {
                            vm.memberCount = resendMember.length;
                        } else {
                            vm.memberCount = 0;
                        }
                    }

                    function resend() {
                        vm.resendLoading = true;
                        var resendMember = []
                        for (var i = 0; i < vm.resendMember.length; i++) {
                            if (vm.resendMember[i].isChecked) {
                                resendMember.push(vm.resendMember[i]);
                                vm.resendMember[i].isChecked = false;
                            }
                        }
                        api.minutes.resendNotification.save({ recipients: resendMember, minuteId: vm.resendMinuteId }).$promise.then(function (response) {
                            if (response) {
                                vm.resendLoading = false;
                                $mdDialog.hide().then(function () {
                                    dialog.openDialog({
                                        event: event,
                                        body: appConfig.dialogs.resendNotification,
                                        success: true
                                    });
                                });
                            }
                        })
                    }

                    function cancel() {
                        for (var i = 0; i < vm.resendMember.length; i++) {
                            vm.resendMember[i].isChecked = false;
                        }
                        $mdDialog.cancel();
                    }
                },
                controllerAs: 'vm',
                templateUrl: 'app/core/services/template/resendNotification.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
            }).then(function (response) {
                return true;
            })
        }
    }

    function DialogController($scope, $mdDialog, dialog, api, logger, $state) {
        var vm = this;
        vm.searchSeriesText = '';
        vm.canCreate = false;
        vm.added = false;
        vm.searchSeries = searchSeries;
        vm.onAddSeries = onAddSeries;
        vm.onRemoveSeries = onRemoveSeries;
        vm.getSeriesAvailable = getSeriesAvailable;
        $scope.dialog = dialog.body;
        $scope.success = dialog.success;
        $scope.invitees = [];
        $scope.seriesName = [];

        if (dialog) {
            if ($scope.success) {
                $scope.title = $scope.dialog.title;
                $scope.message = $scope.dialog.success;
            } else if (dialog.fail) {
                for (var i = 0; i < dialog.fail.length; i++) {
                    $scope.message = dialog.fail[i].errors[0] + '<br />';
                }
                $scope.title = $scope.dialog.titleFail;
                // $scope.message = $scope.dialog.fail;
            }
        }

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function (answer) {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer, seriesName) {
            $scope.classificationIdByName = {};
            $scope.classification = api.classifications.query({}, function (response) {
                $.each(response, function (i, val) {
                    $scope.classificationIdByName[val.name] = val.classificationId;
                })
                if (!$scope.classificationId) {
                    $scope.classificationId = $scope.classificationIdByName['Open'];
                }

                var startDate = moment().clone().add(1, 'hours').startOf('hours')._d.toISOString();
                var postMinute = {
                    startDate: startDate,
                    endDate: moment(startDate).add(1, 'hours')._d.toISOString(),
                    classificationId: $scope.classificationId,
                    topics: [],
                    minuteTags: []
                }

                if (seriesName) {
                    if (typeof seriesName === 'object') {
                        postMinute.series = {
                            name: seriesName.name,
                            id: seriesName.id,
                            seriesSequenceNumber: seriesName.seriesSequenceNumber
                        };
                    } else if (typeof seriesName === 'string') {
                        postMinute.series = {
                            name: seriesName
                        }
                    }
                }

                postMinute.minuteTaker = {
                    userId: localStorage.getItem('userId'),
                    email: localStorage.getItem('email'),
                    photo: localStorage.getItem('photo') === 'null' ? null : localStorage.getItem('photo')
                }
                $scope.isLoading = true;

                if (seriesName.id) {
                    api.series.latest.save({ seriesId: seriesName.id }).$promise.then(function (response) {
                        postMinute.chairman = response.chairman;
                        postMinute.members = response.members;
                        postMinute.location = response.location;
                        for (var i = 0; i < response.topics.length; i++) {
                            response.topics[i].name = 'Matters Arising: ' + response.topics[i].name;
                        }
                        postMinute.topics = response.topics;
                        postMinute.classificationId = response.classificationId;
                        postMinute.minuteTags = response.minuteTags;
                        postMinute.baseSeriesMinuteId = response.baseSeriesMinuteId;
                        api.minutes.create.save({}, postMinute,
                            //Success
                            function (response) {
                                $scope.isLoading = false;
                                $mdDialog.hide();
                                $state.go('app.detail', { id: response.minuteId, series: response.seriesName, new: true });
                            },
                            //Fail
                            function (response) {
                                $scope.isLoading = false;
                                dialog.openDialog({
                                    body: appConfig.dialogs.saveDraft,
                                    success: false
                                })
                            }
                        )
                    }, function (response) {
                        $scope.isLoading = false;
                        logger.error(response.data.errorMessage);
                    })
                } else {
                    api.minutes.create.save({}, postMinute,
                        //Success
                        function (response) {
                            $scope.isLoading = false;
                            $mdDialog.hide();
                            $state.go('app.detail', { id: response.minuteId, series: response.seriesName, new: true });
                        },
                        //Fail
                        function (response) {
                            $scope.isLoading = false;
                            dialog.openDialog({
                                body: appConfig.dialogs.saveDraft,
                                success: false
                            })
                        }
                    )
                }


            });
        };
        $scope.searchUser = function (text) {
            return api.user.search.save({ name: text, skip: 0, take: 6 })
                .$promise.then(function (response) {
                    return response.result;
                })
        }
        var seriesLimit = 50;
        $scope.maxSeriesLength = function (chip) {
            if (!chip) return;
            if (chip.length >= seriesLimit) {
                $scope.seriesName[0] = $scope.seriesName[0].substring(0, seriesLimit);
            }
        }
        function searchSeries(text) {
            return api.series.search.save({ searchText: text, skip: 0, take: 5 }).$promise.then(function (response) {
                vm.canCreate = text === '' ? false : true;
                for (var j = 0; j < response.length; j++) {
                    if (response[j].lastMinuteStatus !== 'Approved') {
                        response[j].disabled = true;
                    }
                    if (response[j].name.toLowerCase() === text.toLowerCase()) {
                        vm.canCreate = false;
                    }
                }

                //If no response, mean can create new
                if (response.length === 0) {
                    vm.canCreate = true;
                    vm.added = false;

                    //Else, check if the response already added
                } else if (vm.added) {
                    vm.canCreate = true;
                }
                return response;
            })
        }

        function onAddSeries() {
            vm.added = true;
            vm.canCreate = true;
        }

        function onRemoveSeries() {
            vm.canCreate = false;
        }

        function getSeriesAvailable() {
            return vm.IsSeriesAvailable;
        }
        $scope.send = function () {
            var receivers = [];
            var obj = {};
            for (var i = 0; i < $scope.invitees.length; i++) {
                if (angular.isObject($scope.invitees[i])) {
                    obj = {
                        email: $scope.invitees[i].email,
                        userId: $scope.invitees[i].userId,
                        displayName: $scope.invitees[i].displayName,
                        photo: $scope.invitees[i].photo
                    };
                } else {
                    obj = {
                        email: $scope.invitees[i]
                    };
                }
                receivers.push(obj);
            }

            $scope.dialog.receivers = receivers;
            api.minutes.extract.save($scope.dialog).$promise.then(function (response) {
              //  console.log(response);
                logger.success('Extracted minute has been sent');
                $scope.cancel();
            })

        }
    }
})();