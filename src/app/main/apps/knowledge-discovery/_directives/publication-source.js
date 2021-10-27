/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    var mod = angular.module('app.knowledgeDiscovery');

    /*publication-book*/
    mod.directive('publicationBook', publicationBook);
    function publicationBook() {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi, $rootScope) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.bookTitle = 'Book Title <strong class="req">*</strong>';
                $scope.QuestionsEnglish.publicationDate = 'Published Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.QuestionsEnglish.isbn = 'ISBN <strong class="req">*</strong>';
                $scope.QuestionsEnglish.websiteURL = 'URL';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get')) {
                        $scope.Field.bookTitle = data.Get(_.snakeCase(data.Type) + '.bookTitle');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                        $scope.Field.isbn = data.Get(_.snakeCase(data.Type) + '.isbn');
                        $scope.Field.url = data.Get(_.snakeCase(data.Type) + '.url');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.bookTitle = data.Get('bookTitle');
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    $scope.Field.isbn = data.Get('isbn');
                    $scope.Field.url = data.Get('url');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.bookTitle', $scope.Field.bookTitle);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                    data.Set(_.snakeCase(data.Type) + '.isbn', $scope.Field.isbn);
                    data.Set(_.snakeCase(data.Type) + '.url', $scope.Field.url);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.bookTitle);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                    data.Set('isbn', $scope.Field.isbn);
                    data.Set('url', $scope.Field.url);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                  }
                }

                $scope.$on('disableField', function (event, value) {
                  $scope.disableField = value;
                });
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-book.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-book*/

    /*publication-event*/
    mod.directive('publicationHappening', publicationEvent);
    function publicationEvent(KnowledgeService) {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.Societies = [];
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.eventName = 'Event/Initiative Name<strong class="req">*</strong>';
                $scope.QuestionsEnglish.eventDate = 'Event/Initiative Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    $scope.Societies = KnowledgeService.getBuild('societies');
                    $scope.Field.society = _.head($scope.Societies);

                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.eventName = data.Get(_.snakeCase(data.Type) + '.eventName');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                        //  $scope.Field.society = data.Get(_.snakeCase(data.Type) + '.society');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.eventName = data.Get('eventName');
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    // $scope.Field.society = { id: data.Get('societyId') };
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.eventName', $scope.Field.eventName);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    // data.Set(_.snakeCase(data.Type) + '.society', $scope.Field.society);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.eventName);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    //  data.Set('societyId', $scope.Field.society.id);
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-happening.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-event*/

    /*publication-media*/
    mod.directive('publicationDigital', publicationDigital);
    function publicationDigital(KnowledgeService) {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.MediaTypes = [];
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.mediaType = 'Digital Media Type <strong class="req">*</strong>';
                $scope.QuestionsEnglish.publishedDate = 'Published Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.QuestionsEnglish.websiteURL = 'URL';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    $scope.MediaTypes = KnowledgeService.getBuild('mediaTypes');
                    $scope.Field.mediaType = !_.isEmpty(_.head($scope.MediaTypes)) ? _.head($scope.MediaTypes).id : null;

                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.mediaType = data.Get(_.snakeCase(data.Type) + '.mediaType');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.url = data.Get(_.snakeCase(data.Type) + '.url');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.mediaType = data.Get('digitalMediaTypeId').toString();
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    $scope.Field.url = data.Get('url');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.mediaType', $scope.Field.mediaType);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    data.Set(_.snakeCase(data.Type) + '.url', $scope.Field.url);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('digitalMediaTypeId', $scope.Field.mediaType);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    data.Set('url', $scope.Field.url);
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                    angular.forEach($scope.MediaTypes, function (value, key) {
                      TranslatorApi.api.TranslateSingleText.save({}, {
                        textToTranslate: value.name,
                        fromLanguage: "en",
                        toLanguage: $scope.$parent.Field.originalLanguage
                      },
                        function (response) {
                          value.name = response.translatedText;
                        },
                        function (response) {
                          if (response.status !== 404)
                            logger.error(response.data.errorMessage);
                        });

                    });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-digital.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-media*/

    /*publication-journal*/
    mod.directive('publicationJournal', publicationMedia);
    function publicationMedia() {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi,$rootScope) {
            //  alert($scope.disabled)
                $scope.disableField = $scope.disabled;

                $scope.$watch('disabled', function () {
                 // alert($scope.disabled);
                });
                $scope.Field = {};
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.journalTitle = 'Journal Title <strong class="req">*</strong>';
                $scope.QuestionsEnglish.publishedDate = 'Published Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.QuestionsEnglish.websiteURL = 'URL';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.journalTitle = data.Get(_.snakeCase(data.Type) + '.journalTitle');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                        $scope.Field.url = data.Get(_.snakeCase(data.Type) + '.url');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.journalTitle = data.Get('bookTitle');
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    $scope.Field.url = data.Get('url');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.journalTitle', $scope.Field.journalTitle);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                    data.Set(_.snakeCase(data.Type) + '.url', $scope.Field.url);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.journalTitle);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                    data.Set('url', $scope.Field.url);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                  }
                }

                // $scope.disableFields = function(event, value){
                //   alert(value);
                // }
                // $rootScope.$on('disableFields', function (event, value) {
                //   $scope.disableField = value;
                // });

                
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-journal.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-journal*/

    /*publication-news*/
    mod.directive('publicationNews', publicationNews);
    function publicationNews() {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.newspaperName = 'Newspaper Name <strong class="req">*</strong>';
                $scope.QuestionsEnglish.publishedDate = 'Published Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.QuestionsEnglish.websiteURL = 'URL';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.newspaperName = data.Get(_.snakeCase(data.Type) + '.newspaperName');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.url = data.Get(_.snakeCase(data.Type) + '.url');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.newspaperName = data.Get('newspaperName');
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    $scope.Field.url = data.Get('url');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.newspaperName', $scope.Field.newspaperName);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    data.Set(_.snakeCase(data.Type) + '.url', $scope.Field.url);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.newspaperName);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    data.Set('url', $scope.Field.url);
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-news.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-news*/

    /*publication-magazine*/
    mod.directive('publicationMagazine', publicationMagazine);
    function publicationMagazine() {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope, PublicationService,TranslatorApi) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.magazineName = 'Magazine Name <strong class="req">*</strong>';
                $scope.QuestionsEnglish.publishedDate = 'Published Date <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.QuestionsEnglish.websiteURL = 'URL';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.magazineName = data.Get(_.snakeCase(data.Type) + '.magazineName');
                        $scope.Field.publishedDate = data.Get(_.snakeCase(data.Type) + '.publishedDate');
                        $scope.Field.url = data.Get(_.snakeCase(data.Type) + '.url');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.magazineName = data.Get('magazineName');
                    $scope.Field.publishedDate = moment(data.Get('publishedDate'), 'DD/MM/YYYY HH:mm:ss A').format('DD/MM/YYYY');
                    $scope.Field.url = data.Get('url');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.magazineName', $scope.Field.magazineName);
                    data.Set(_.snakeCase(data.Type) + '.publishedDate', $scope.Field.publishedDate);
                    data.Set(_.snakeCase(data.Type) + '.url', $scope.Field.url);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.magazineName);
                    data.Set('publishDate', PublicationService.TransformDateValue($scope.Field.publishedDate));
                    data.Set('url', $scope.Field.url);
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-magazine.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-magazine*/

    /*publication-conference*/
    mod.directive('publicationConference', publicationConference);
    function publicationConference(KnowledgeService, SearchApi, $timeout, KnowledgeShareApi) {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope,TranslatorApi) {
                var date = new Date();
                var year = date.getFullYear();
                console.log(year);
                $scope.currentYear = year + 1;
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.Countries = [];
                $scope.Societies = [];
                $scope.MediaTypes = [];
                $scope.Months = _.map(moment.monthsShort(), function (val, idx) { return { id: idx, title: val } });
                $scope.Years = _.range(2001, $scope.currentYear);
                $scope.Field.pubMonth = _.head(_.filter($scope.Months, function (o) { return o.title === moment().format('MMM') }));
                $scope.Field.pubYear = parseInt(moment().format('YYYY'));
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.eventName = 'Event Name <strong class="req">*</strong>';
                $scope.QuestionsEnglish.country = 'Country <strong class="req">*</strong>';
                $scope.QuestionsEnglish.audienceLevel = 'Audience Level <strong class="req">*</strong>';
                $scope.QuestionsEnglish.society = 'Society <strong class="req"></strong>';
                $scope.QuestionsEnglish.newSociety = 'New Society';
                $scope.QuestionsEnglish.newSocietyMsg = 'Create new entry for society or keyword. May require admin moderation.';
                $scope.QuestionsEnglish.newSocietyName = 'Society Name <strong class="req">*</strong>';
                $scope.QuestionsEnglish.pubMonthYear = 'Publication Month & Year <strong class="req">*</strong>';
                $scope.QuestionsEnglish.author = 'Author <strong class="req"></strong>';
                $scope.QuestionsEnglish.externalAuthor = 'External Author(s)';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    $scope.AudienceLevels = KnowledgeService.getBuild('audienceLevels');
                    $scope.Countries = KnowledgeService.getBuild('countries');
                    $scope.Societies = KnowledgeService.getBuild('societies');
                    $scope.Field.audienceLevel = !_.isEmpty(_.head($scope.AudienceLevels)) ? _.head($scope.AudienceLevels).id : null;
                    $scope.Field.country = _.head($scope.Countries);
                    //$scope.Field.society = _.head($scope.Societies);

                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        $scope.Field.eventName = data.Get(_.snakeCase(data.Type) + '.eventName');
                        $scope.Field.country = data.Get(_.snakeCase(data.Type) + '.country');
                        $scope.Field.audienceLevel = data.Get(_.snakeCase(data.Type) + '.audienceLevel');
                        $scope.Field.society = data.Get(_.snakeCase(data.Type) + '.society');
                        $scope.Field.societyId = data.Get(_.snakeCase(data.Type) + '.societyId');
                        $scope.Field.pubMonth = data.Get(_.snakeCase(data.Type) + '.pubMonth');
                        $scope.Field.pubYear = data.Get(_.snakeCase(data.Type) + '.pubYear');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    $scope.Field.eventName = data.Get('eventName');
                    $scope.Field.country = { id: data.Get('countryId') };
                    $scope.Field.audienceLevel = data.Get('audienceLevelId');
                    $scope.Field.societyId = data.Get('societyId');
                    $scope.Field.pubMonth = { id: data.Get('publicationMonth') };
                    $scope.Field.pubYear = data.Get('publicationYear');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    
                    if ($scope.Field.societyId !== null) {
                        _.each($scope.Societies, function (o) {
                            if ($scope.Field.societyId == o.id) {
                                $scope.Field.society = o.societyName;
                            }
                        });
                    }
                    offGet();
                });

                //Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.eventName', $scope.Field.eventName);
                    data.Set(_.snakeCase(data.Type) + '.country', $scope.Field.country);
                    data.Set(_.snakeCase(data.Type) + '.audienceLevel', $scope.Field.audienceLevel);
                    data.Set(_.snakeCase(data.Type) + '.society', $scope.Field.society);
                    data.Set(_.snakeCase(data.Type) + '.societyId', $scope.Field.societyId);
                    data.Set(_.snakeCase(data.Type) + '.pubMonth', $scope.Field.pubMonth);
                    data.Set(_.snakeCase(data.Type) + '.pubYear', $scope.Field.pubYear);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('bookTitle', $scope.Field.eventName);
                    data.Set('countryId', $scope.Field.country.id);
                    data.Set('audienceLevelId', parseInt($scope.Field.audienceLevel));
                    data.Set('societyId', $scope.Field.societyId);
                    data.Set('pubMonth', parseInt($scope.Field.pubMonth.id + 1));
                    data.Set('pubYear', parseInt($scope.Field.pubYear));
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                });

                $scope.SourceSociety = {
                    dataTextField: "title",
                    dataValueField: "id",
                    filter: "contains",
                    minLength: 1,
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                return SearchApi.searchSocieties(options);
                            }
                        }
                    },
                    open: function (e) {
                        $timeout(function () {
                            e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel no_grouping');
                        });
                    },
                    select: function (e) {
                        $scope.Field.societyId = e.dataItem.id;
                    },

                    noDataTemplate: kendo.template($(".search_template_society").html()),
                };

                $scope.AddNew = function () {
                    $scope.NewError = false;
                    if (!$scope.NewSocietyName) {
                        $scope.NewError = true;
                        return;
                    }

                    $("#ModalCreateSociety").modal('hide');
                    $scope.Field.society = null;
                    $scope.Field.societyId = null;
                    var postData = { Title: $scope.NewSocietyName };
                    KnowledgeShareApi.addSociety(postData).then(function (res) {
                        $scope.NewSocietyName = '';
                    }, function (err) {
                        toastr(err.data.message, 'SKILL');
                    });
                };

                $scope.CancelNew = function () {
                    $scope.Field.society = null;
                    $scope.Field.societyId = null;
                }

                $scope.Hide = function () {
                    $scope.SocietyPopup.close();
                    $scope.Field.society = null;
                    $scope.Field.societyId = null;
                };

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                    angular.forEach($scope.AudienceLevels, function (value, key) {
                      TranslatorApi.api.TranslateSingleText.save({}, {
                        textToTranslate: value.audienceLevelName,
                        fromLanguage: "en",
                        toLanguage: $scope.$parent.Field.originalLanguage
                      },
                        function (response) {
                          value.audienceLevelName = response.translatedText;
                        },
                        function (response) {
                          if (response.status !== 404)
                            logger.error(response.data.errorMessage);
                        });

                    });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-conference.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-conference*/

    /*publication-success-story*/
    mod.directive('publicationSuccessStory', publicationSuccessStory);
    function publicationSuccessStory(KnowledgeService, SearchApi, $timeout, KnowledgeShareApi) {
        return {
            restrict: 'AE',
            scope: {
              disabled:'='
            },
            controller: function ($scope,TranslatorApi) {
                $scope.disableField = $scope.disabled;
                $scope.Field = {};
                $scope.programmeNames = [];
                $scope.Societies = [];
                $scope.MediaTypes = [];
                $scope.Months = _.map(moment.monthsShort(), function (val, idx) { return { id: idx, title: val } });
                $scope.Years = _.range(1900, new Date().getFullYear() + 5);
                $scope.Field.programmeMonth = _.head(_.filter($scope.Months, function (o) { return o.title === moment().format('MMM') }));
                $scope.Field.programmeYear = parseInt(moment().format('YYYY'));
                $scope.Field.isBoldStory = false;
                $scope.Field.doingDifferently = '';
                $scope.Field.caseForChange = '';
                $scope.Field.isWinner = false;
                $scope.Field.winnerText = '';
                $scope.Field.freetextProgrammeName = '';
                $scope.Field.freetextBoldStory = '';
                $scope.QuestionsEnglish = {};
                $scope.Questions = {};
                $scope.QuestionsEnglish.isBoldStory = 'Is this a bold Story?';
                $scope.QuestionsEnglish.collaboration = 'Collaboration';
                $scope.QuestionsEnglish.doingDifferently = 'Doing things differently <strong class="req">*</strong>';
                $scope.QuestionsEnglish.caseForChange = 'Case for change <strong class="req">*</strong>';
                $scope.QuestionsEnglish.programmeName = 'Programme Name <strong class="req">*</strong>';
                $scope.QuestionsEnglish.programmeYear = 'Programme Year <strong class="req">*</strong>';
                $scope.QuestionsEnglish.programmeMonth = 'Programme Month';
                $scope.QuestionsEnglish.author = 'Author';
                $scope.QuestionsEnglish.externalAuthor = 'External Author';
                $scope.QuestionsEnglish.winner = 'Winner';
                $scope.Questions = $scope.QuestionsEnglish;

                var offInit = $scope.$on('Init', function (event, data) {
                    $scope.programmeNames = KnowledgeService.getBuild('programmeResponses');
                    $scope.Field.programmeName = _.head($scope.programmeNames);

                    $scope.collaborations = KnowledgeService.getBuild('collaborationResponses');
                    //$scope.collaboration = KnowledgeService.getAttr('collaboration');
                    //Bind previous value when change Source
                    if (data.hasOwnProperty('Get') && data.Get(_.snakeCase(data.Type))) {
                        var tempProgrammeId = data.Get(_.snakeCase(data.Type) + '.programmeId');
                        $scope.Field.programmeName = _.find($scope.programmeNames, function (item, index) {
                            return item.id == tempProgrammeId;
                        });
                        $scope.Field.programmeMonth = data.Get(_.snakeCase(data.Type) + '.programmeMonth');
                        $scope.Field.programmeYear = data.Get(_.snakeCase(data.Type) + '.programmeYear');
                        $scope.Field.externalAuthor = data.Get(_.snakeCase(data.Type) + '.externalAuthor');
                        $scope.Field.isBoldStory = data.Get(_.snakeCase(data.Type) + '.isBoldStory');
                        $scope.Field.doingDifferently = data.Get(_.snakeCase(data.Type) + '.doingDifferently');
                        $scope.Field.caseForChange = data.Get(_.snakeCase(data.Type) + '.caseForChange');
                        $scope.Field.isWinner = data.Get(_.snakeCase(data.Type) + '.isWinner');
                        $scope.Field.winnerText = data.Get(_.snakeCase(data.Type) + '.winnerText');
                        $scope.Field.freetextProgrammeName = data.Get(_.snakeCase(data.Type) + '.freetextProgrammeName');
                        $scope.Field.freetextBoldStory = data.Get(_.snakeCase(data.Type) + '.freetextBoldStory');
                    }
                    offInit();
                    _languageChange($scope.$parent.Field.originalLanguage);
                });

                var offGet = $scope.$on('Get', function (event, data) {
                    var tempProgrammeId = data.Get('programmeId');
                    $scope.Field.programmeName = _.find($scope.programmeNames, function (item, index) {
                        return item.id == tempProgrammeId;
                    });
                    $scope.Field.programmeMonth = { id: data.Get('programmeMonth') };
                    $scope.Field.programmeYear = data.Get('programmeYear');
                    $scope.Field.externalAuthor = data.Get('externalAuthor');
                    $scope.Field.isBoldStory = data.Get('isBoldStory');
                    $scope.Field.doingDifferently = data.Get('doingDifferently');
                    $scope.Field.caseForChange = data.Get('caseForChange');
                    $scope.Field.isWinner = data.Get('isWinner');
                    $scope.Field.winnerText = data.Get('winnerText');
                    $scope.Field.freetextProgrammeName = data.Get('freetextProgrammeName');
                    $scope.Field.freetextBoldStory = data.Get('freetextBoldStory');
                    offGet();
                    console.log($scope.Field);
                });

                ////Keep previous value when change Source
                $scope.$on('Change', function (event, data) {
                    data.Set(_.snakeCase(data.Type) + '.programmeId', $scope.Field.programmeName);
                    data.Set(_.snakeCase(data.Type) + '.programmeMonth', $scope.Field.programmeMonth);
                    data.Set(_.snakeCase(data.Type) + '.programmeYear', $scope.Field.programmeYear);
                    data.Set(_.snakeCase(data.Type) + '.externalAuthor', $scope.Field.externalAuthor);
                    data.Set(_.snakeCase(data.Type) + '.isBoldStory', $scope.Field.isBoldStory);
                    data.Set(_.snakeCase(data.Type) + '.doingDifferently', $scope.Field.doingDifferently);
                    data.Set(_.snakeCase(data.Type) + '.caseForChange', $scope.Field.caseForChange);
                    data.Set(_.snakeCase(data.Type) + '.isWinner', $scope.Field.isWinner);
                    data.Set(_.snakeCase(data.Type) + '.winnerText', $scope.Field.winnerText);
                    data.Set(_.snakeCase(data.Type) + '.freetextProgrammeName', $scope.Field.freetextProgrammeName);
                    data.Set(_.snakeCase(data.Type) + '.freetextBoldStory', $scope.Field.freetextBoldStory);
                    var collaborationSelected = [];
                    _.each($scope.collaborations, function (collaboration, index) {
                        if (collaboration.isSelected) {
                            collaborationSelected.push(collaboration.id);
                        }
                    });
                    data.Set(_.snakeCase(data.Type) + '.collaborationResponses', collaborationSelected);
                });

                $scope.$on('Submit', function (event, data) {
                    data.Set('programmeId', $scope.Field.programmeName.id);
                    data.Set('programmeMonth', parseInt($scope.Field.programmeMonth.id + 1));
                    data.Set('programmeYear', parseInt($scope.Field.programmeYear));
                    data.Set('externalAuthor', $scope.Field.externalAuthor);
                    data.Set('isBoldStory', $scope.Field.isBoldStory);
                    data.Set('doingDifferently', $scope.Field.doingDifferently);
                    data.Set('caseForChange', $scope.Field.caseForChange);
                    data.Set('isWinner', $scope.Field.isWinner);
                    data.Set('winnerText', $scope.Field.winnerText);
                    data.Set('freetextProgrammeName', $scope.Field.freetextProgrammeName);
                    data.Set('freetextBoldStory', $scope.Field.freetextBoldStory);
                    var collaborationSelected = [];
                    _.each($scope.collaborations, function (collaboration, index) {
                        if (collaboration.isSelected) {
                            collaborationSelected.push(collaboration.id);
                        }
                    });
                    data.Set('collaborationIds', collaborationSelected);
                });

                $scope.$on('changeInputLanguage', function(event, data) {
                    var inputLanguage = data.inputLanguage;
                    _languageChange(inputLanguage);
                });

                function _languageChange(inputLanguage) {
                  if (inputLanguage == "en" || inputLanguage == undefined) {
                    $scope.Questions = $scope.QuestionsEnglish;
                  }
                  else {
                    TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
                      textToTranslate: $scope.QuestionsEnglish,
                      fromLanguage: "en",
                      toLanguage: inputLanguage
                    },
                      function (response) {
                        $scope.Questions = response.translatedText;
                      },
                      function (response) {
                        if (response.status !== 404)
                          logger.error(response.data.errorMessage);
                      });
                    angular.forEach($scope.collaborations, function (value, key) {
                      TranslatorApi.api.TranslateSingleText.save({}, {
                        textToTranslate: value.name,
                        fromLanguage: "en",
                        toLanguage: $scope.$parent.Field.originalLanguage
                      },
                        function (response) {
                          value.name = response.translatedText;
                        },
                        function (response) {
                          if (response.status !== 404)
                            logger.error(response.data.errorMessage);
                        });

                    });
                  }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/publication-success-story.html',
            link: function (scope) {
                scope.$emit('Completed', null);
            }
        };
    }
    /*End publication-success-story*/
})();
