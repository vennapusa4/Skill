/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillExpertListingVideo', skillExpertListingVideo);

    /** @ngInject */
    function skillExpertListingVideo() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                expertInterviewId: '<',
            },
            controller: function ($scope, ExpertInterviewApi) {
                $scope.videos = null;

                function _initVideo() {
                    $("#mediaplayer").kendoMediaPlayer({
                        autoPlay: false
                    });

                    var templateHtml = $("#templateVideoListing").html();

                    $("#listView").kendoListView({
                        dataSource: $scope.videos,
                        selectable: true,
                        scrollable: true,
                        template: kendo.template(templateHtml),
                        change: onChange,
                        dataBound: onDataBound
                    });
                }

                function onChange() {
                    var index = this.select().index();
                    var dataItem = this.dataSource.view()[index];
                    $("#mediaplayer").data("kendoMediaPlayer").media(dataItem);
                }

                function onDataBound() {
                    this.select(this.element.children().first());
                }

                function _getExpertVideo() {
                    ExpertInterviewApi.getVideos($scope.expertInterviewId).then(function (response) {
                        if (response && response.length > 0) {
                            // var cloneRes = response;
                            // var cloneRes = [];
                            // cloneRes.push(response[0]);

                            // if (response.length > 1) {
                            //     $("#mediaplayer").kendoMediaPlayer({
                            //         autoPlay: true,
                            //         navigatable: true,
                            //         media: response[0]
                            //     });

                            //     $("#mediaplayer").data("kendoMediaPlayer").media(response[0]);
                            // } else {
                            $scope.videos = new kendo.data.DataSource({
                                data: response
                            });;

                            _initVideo();
                            // }
                        }
                    });
                };

                $scope.getExpertVideo = _getExpertVideo;
                $scope.getExpertVideo();
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/skill-expert-listing-video.html',
            link: function ($scope, $element) {
                $scope.element = $($element);
            }
        };
    }
})();
