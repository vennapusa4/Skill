(function () {
  'use strict';

  angular
      .module('app.leaderboard')
      .factory('LeaderboardCommonService', LeaderboardCommonService);

  /** @ngInject */
  function LeaderboardCommonService(Utils) {
    function kmlFormatter(num, tofixed) {
      var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(3) + 'b';
      } else {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(3) + 'm';
        } else {
          if (num >= 1000) {
            return (num / 1000).toFixed(3) + 'k';
          } else {
            return num;
          }
        }
      }
      return result;
    }
    function dateTimeToText(str) {
      try {
        var date = new Date(str);
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
      } catch (e) {
        return str;
      }
    }

    return {
      kmlFormatter: kmlFormatter,
      dateTimeToText: dateTimeToText
    };
  }

})();
