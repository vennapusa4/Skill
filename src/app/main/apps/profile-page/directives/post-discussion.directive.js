/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('postDiscussion', postDiscussion);

    /** @ngInject */
    function postDiscussion() {

        return {
            restrict: 'E',
            scope: {
            },
            controller: function ($scope, logger , profileAPI  ) {
                $scope.newDiscussion = "";    
                $scope.channels = [];
                $scope.selectedChannel;
                $scope.selectedChannelID;
                $scope.selectedMembersID = [];
                $scope.selectedMembers = [];
                $scope.removeChannel = function () {
                    $scope.selectedChannel = null;
                    $scope.selectedMembers = [];
                }
                
                $scope.setPostType = function (type) {
                    if (type == "channel") {
                        $scope.postType = "Channel";
                    }
                    else if (type == "people") {
                        $scope.postType = "People";
                    }
        
                }
                $scope.$on('channelSelection', function (event, channel) {
                    $scope.selectedChannel = channel.name;
                    $scope.selectedChannelID = channel.id;
                });
            
                $scope.$on('memberSelection', function (event, memberList) {
                    $scope.selectedMembers = [];
                    $scope.selectedMembersID = [];
                    if (memberList == null) {
                        $scope.selectedMembers = [];
                        $scope.selectedMembersID = [];
                    }
                    else if (memberList.length > 0) {
                        memberList.forEach(function (member) {
                            $scope.selectedMembers.push(member);
                            $scope.selectedMembersID.push(member.id);
                        });
                    }
                });
                $scope.postDiscussion = function (event) {
                    if (event.keyCode == 13) {
                        var postData = {
                            "CopId": $scope.selectedChannelID,
                            "taggedUserId": $scope.selectedMembersID,
                            "message": $scope.newDiscussion
                        }
        
                        profileAPI.postNewDiscussion(postData).then(function (data) {
                            logger.success("A New Discussion has been added Successfully");
                            $scope.newDiscussion = "" ; 
                            $scope.selectedChannel = null;
                            $scope.selectedChannelID = null;
                            $scope.selectedMembers = [];
                            $scope.selectedMembersID = [];
        
                        });
                    }
                }
            },
            templateUrl: 'app/main/apps/profile-page/directives/post-discussion.html'
            
        };
    }
})();
