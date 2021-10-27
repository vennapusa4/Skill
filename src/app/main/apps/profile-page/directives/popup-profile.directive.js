(function () {
    'use strict';

    angular.module('app.ProfilePage')
        .directive('popupProfile', popupProfile);

    /** @ngInject */
    function popupProfile(CollectionApi, $log, logger , profileAPI) {

        return {
            restrict: 'E',
            scope: {
                postType: "="
            },
            controller: function ($scope) {
                console.log("postType"+$scope.postType);
                $scope.copChannel = [];
                $scope.channelMembers = [];
                $scope.selectedChannel = {
                    "id": "",
                    "name" : ""
                }

                $scope.selectedMembers = [];
                
                $scope.approve = function () {
                    var datapost = {
                        team: $scope.ngModel.recents,
                        members: $scope.ngModel.collections
                    }
                }      

                profileAPI.getCopToPostDiscussion().then(function (res) {
                    if(res != null || res != "")
                    {
                        res.forEach(function (data) {
                            $scope.copChannel.push(data);
                        });
                    }
                });
                
                $scope.selectChannel = function(id , name){
                    $scope.selectedChannel.id = id;
                    $scope.selectedChannel.name = name;
                    $scope.channelMembers = [];

                    profileAPI.getMemebersFromCop(id).then(function (res) {
                        if(res != null || res != "")
                        {
                            res.forEach(function (member) {
                                $scope.channelMembers.push({"id":member.id , "displayName": member.displayName , "selected":false});
                            });
                        }
                    });

                    // $scope.copChannel.forEach(function (channel) {
                    //     if(channel.copId === $scope.selectedChannel.id){
                    //         if(channel.members != null){
                    //             channel.members.forEach(function(member){
                    //                 $scope.channelMembers.push({"id":member.id , "displayName": member.displayName , "selected":false});
                    //             });
                    //         }
                            
                    //     }
                    // });

                    $("#AddPopup").modal("hide");
                    $scope.$emit('channelSelection', $scope.selectedChannel);
                    $scope.selectedMembers= [];
                    $scope.$emit('memberSelection', null);
                }

                $scope.selectMember = function(id , name){
                    $scope.selectedChannel.id = id;
                    $scope.selectedChannel.name = name;
                }
                
                $scope.GetSelectedMembers = function(memberID, memberName){
                    $scope.selectedMembers= [];
                    for (var i = 0; i < $scope.channelMembers.length; i++) {
                        if ($scope.channelMembers[i].selected) {
                            var id = $scope.channelMembers[i].id;
                            var displayName = $scope.channelMembers[i].displayName;
                            $scope.selectedMembers.push({"id": id , "displayName" : displayName});
                        }
                    }
                    $scope.$emit('memberSelection', $scope.selectedMembers);
                      $("#AddPopup").modal("hide");
                }
            },
            templateUrl: 'app/main/apps/profile-page/directives/popup-profile.html'
            
        };
    }
})();
