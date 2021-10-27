(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery', ['ngSanitize', 'ui.bootstrap', 'chart.js'])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.knowledgeDiscovery', {
            title: 'Knowledge Discovery',
            url: '/knowledge-discovery',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery.html',
                    controller: 'KnowledgeDiscoveryController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.allKnowledge', {
            title: 'Knowledge Discovery - All Knowledge',
            url: '/all-knowledge?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/all-knowledge/template.html',
                    controller: 'KnowledgeAllKnowledgeController as vm'
                }
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.allKnowledgeFilter', {
            title: 'Knowledge Discovery - All Knowledge',
            url: '/all-knowledge?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/all-knowledge/template.html',
                    controller: 'KnowledgeAllKnowledgeController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.bestPractices', {
            title: 'Knowledge Discovery - Best Practices',
            url: '/best-practices?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/best-practices/template.html',
                    controller: 'KnowledgeBestListPracticesController as vm'
                }
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.bestPracticesFilter', {
            title: 'Knowledge Discovery - Best Practices',
            url: '/best-practices?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/best-practices/template.html',
                    controller: 'KnowledgeBestListPracticesController as vm'
                }
            }
        });

      // TECHNICAL ALERTS
      $stateProvider.state('app.knowledgeDiscovery.technicalAlerts', {
        title: 'Knowledge Discovery - Technical Alerts',
        url: '/technical-alerts?{copid: int}',
        views: {
          'subContent@app.knowledgeDiscovery': {
            templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/technical-alerts/template.html',
            controller: 'KnowledgeTechnicalAlertsListController as vm'
          }
        }
      });
      $stateProvider.state('app.knowledgeDiscovery.technicalAlertsFilter', {
        title: 'Knowledge Discovery - Technical Alerts',
        url: '/technical-alerts?{copid: int}',
        views: {
          'subContent@app.knowledgeDiscovery': {
            templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/technical-alerts/template.html',
            controller: 'KnowledgeTechnicalAlertsListController as vm'
          }
        }
      });
      // TECHNICAL ALERTS END

        $stateProvider.state('app.knowledgeDiscovery.lessonsLearnt', {
            title: 'Knowledge Discovery - Lessons Learnt',
            url: '/lessons-learnt?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/lesson-learnt/template.html',
                    controller: 'KnowledgeLessonLearntController as vm'
                }
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.lessonsLearntFilter', {
            title: 'Knowledge Discovery - Lessons Learnt',
            url: '/lessons-learnt?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/lesson-learnt/template.html',
                    controller: 'KnowledgeLessonLearntController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.publications', {
            title: 'Knowledge Discovery - Publications',
            url: '/publications?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/publications/template.html',
                    controller: 'KnowledgePublicationsController as vm'
                }
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.publicationsFilter', {
            title: 'Knowledge Discovery - Publications',
            url: '/publications?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/publications/template.html',
                    controller: 'KnowledgePublicationsController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.collections', {
            title: 'Knowledge Discovery - Collections',
            url: '/collections',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/collections/template.html',
                    controller: 'KnowledgeCollectionsController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.insights', {
            title: 'Knowledge Discovery - Insights',
            url: '/insights?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/share-experience-insights/template.html',
                    controller: 'KnowledgeShareExperienceInsightsController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.main', {
            title: 'Knowledge Discovery - Home',
            url: '/main',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/main/template.html',
                    controller: 'KnowledgeMain as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.insightsFilter', {
            title: 'Knowledge Discovery - Insights',
            url: '/insights?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/share-experience-insights/template.html',
                    controller: 'KnowledgeShareExperienceInsightsController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.idea', {
            title: 'Knowledge Discovery - Idea',
            url: '/idea?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/idea/template.html',
                    controller: 'KnowledgeIdeaController as vm'
                }
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.ideaFilter', {
            title: 'Knowledge Discovery - Idea',
            url: '/idea?{copid: int}',
            views: {
                'subContent@app.knowledgeDiscovery': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery/idea/template.html',
                    controller: 'KnowledgeIdeaController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.bestPractices.build', {
            title: 'Knowledge Discovery - Best Practices - Build',
            url: '/build?:id&:replicationID',
            params: { type: 'BP', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/build/template.html',
                    controller: 'KnowledgeBestPracticesBuildController as vm'
                },
                'footer@app': {},
            }
        });
        $stateProvider.state('app.knowledgeDiscovery.collections.build', {
            title: 'Knowledge Discovery - New Collection - Build',
            url: '/build?{id: int}',
            params: { type: 'BP', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/new-collection/build/template.html',
                    controller: 'KnowledgeNewCollectionBuildController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.bestPractices.improve', {
            title: 'Knowledge Discovery - Best Practices - Improve',
            url: '/improve/:id/:ln',
            params: { type: 'BP', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/improve/template.html',
                    controller: 'KnowledgeBestPracticesImproveController as vm'
                },
                'footer@app': {},
            }
        });
 

        $stateProvider.state('app.knowledgeDiscovery.bestPractices.validate', {
            title: 'Knowledge Discovery - Best Practices - Validate',
            url: '/validate/{id: int}',
            params: { type: 'BP', shareId: 0, shareTitle: '', shareLanguageCode: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/validate/template.html',
                    controller: 'KnowledgeValidateController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.bestPractices.completed', {
            title: 'Knowledge Discovery - Best Practices - Completed',
            url: '/completed/{id: int}',
            params: { type: 'BP' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/completed/template.html',
                    controller: 'KnowledgeCompletedController as vm'
                }
            }
        });

      // TECHNICAL ALERTS
      $stateProvider.state('app.knowledgeDiscovery.technicalAlerts.build', {
        title: 'Knowledge Discovery - Technical Alerts - Build',
        url: '/build?:id&:replicationID',
        params: { type: 'TA', shareId: 0, shareTitle: '' },
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/knowledge-discovery/technical-alerts/build/template.html',
            controller: 'KnowledgeTechnicalAlertsBuildController as vm'
          },
          'footer@app': {},
        }
      });

      $stateProvider.state('app.knowledgeDiscovery.technicalAlerts.improve', {
        title: 'Knowledge Discovery - Technical Alerts - Improve',
        url: '/improve/:id/:ln',
        params: { type: 'TA', shareId: 0, shareTitle: '' },
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/knowledge-discovery/technical-alerts/improve/template.html',
            controller: 'KnowledgeTechnicalAlertsImproveController as vm'
          },
          'footer@app': {},
        }
      });

      $stateProvider.state('app.knowledgeDiscovery.technicalAlerts.validate', {
        title: 'Knowledge Discovery - Technical Alerts - Validate',
        url: '/validate/{id: int}',
        params: { type: 'TA', shareId: 0, shareTitle: '', shareLanguageCode: '' },
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/knowledge-discovery/technical-alerts/validate/template.html',
            controller: 'KnowledgeTechnicalAlertsValidateController as vm'
          },
          'footer@app': {},
        }
      });

      $stateProvider.state('app.knowledgeDiscovery.technicalAlerts.completed', {
       title: 'Knowledge Discovery - Technical Alerts - Completed',
       url: '/completed/{id: int}',
       params: { type: 'TA' },
       views: {
         'content@app': {
           templateUrl: 'app/main/apps/knowledge-discovery/technical-alerts/completed/template.html',
           controller: 'KnowledgeTechnicalAlertsCompletedController as vm'
         }
       }
      });
      // TECHNICAL ALERTS END

        $stateProvider.state('app.knowledgeDiscovery.lessonsLearnt.build', {
            title: 'Knowledge Discovery - Lesson Learnt - Build',
            url: '/build?:id&:replicationID',
            params: { type: 'LL', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/lesson-learnt/build/template.html',
                    controller: 'KnowledgeLessonLearntBuildController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.lessonsLearnt.improve', {
            title: 'Knowledge Discovery - Lesson Learnt - Improve',
            url: '/improve/:id/:ln',
            params: { type: 'LL', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/lesson-learnt/improve/template.html',
                    controller: 'KnowledgeLessonLearntImproveController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.lessonsLearnt.validate', {
            title: 'Knowledge Discovery - Lesson Learnt - Validate',
            url: '/validate/{id: int}',
            params: { type: 'LL', shareId: 0, shareTitle: '', shareLanguageCode: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/lesson-learnt/validate/template.html',
                    controller: 'KnowledgeValidateController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.lessonsLearnt.completed', {
            title: 'Knowledge Discovery - Lesson Learnt - Completed',
            url: '/completed/{id: int}',
            params: { type: 'LL' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/completed/template.html',
                    controller: 'KnowledgeCompletedController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.publications.build', {
            title: 'Knowledge Discovery - Publication - Build',
            url: '/build?:id&:replicationID',
            params: { type: 'Pub', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/publication/build/template.html',
                    controller: 'KnowledgePublicationBuildController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.publications.improve', {
            title: 'Knowledge Discovery - Publication - Improve',
            url: '/improve/:id/:ln',
            params: { type: 'Pub', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/publication/improve/template.html',
                    controller: 'KnowledgePublicationImproveController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.publications.validate', {
            title: 'Knowledge Discovery - Publication - Validate',
            url: '/validate/{id: int}',
            params: { type: 'Pub', shareId: 0, shareTitle: '', shareLanguageCode: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/publication/validate/template.html',
                    controller: 'KnowledgeValidateController as vm'
                },
                'footer@app': {},
            },
        });

        $stateProvider.state('app.knowledgeDiscovery.publications.completed', {
            title: 'Knowledge Discovery - Publication - Completed',
            url: '/completed/{id: int}',
            params: { type: 'Pub' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/best-practices/completed/template.html',
                    controller: 'KnowledgeCompletedController as vm'
                }
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.knowledgeDetail', {
            title: 'Knowledge Details',
            url: '/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery-detail.html',
                    controller: 'KnowledgeDetailController as vm'
                }
            }
        });

        /* ADMIN */
        // $stateProvider.state('appAdmin.knowledgeDiscoveryAdmin', {
        //     title: 'Knowledge Discovery - Collection Admin',
        //     url: '/admin-knowledgeDiscovery',
        //     views: {
        //         'content@appAdmin': {
        //             templateUrl: 'app/main/apps/knowledge-discovery/knowledge-discovery-admin.html',
        //             controller: 'KnowledgeAdminController as vm'
        //         }
        //     },
        // });

        $stateProvider.state('app.knowledgeDiscovery.insights.build', {
            title: 'Knowledge Discovery - Insight - Build',
            url: '/build?{id: int}',
            params: { type: 'SEI', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/insights/build/template.html',
                    controller: 'KnowledgeInsightsBuildController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.insights.improve', {
            title: 'Knowledge Discovery - Insight - Improve',
            url: '/improve/:id/:ln',
            params: { type: 'SEI', shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/insights/improve/template.html',
                    controller: 'KnowledgeInsightsImproveController as vm'
                },
                'footer@app': {},
            }
        });

        $stateProvider.state('app.knowledgeDiscovery.insights.completed', {
            title: 'Knowledge Discovery - Insight - Completed',
            url: '/completed/{id: int}',
            params: { type: 'SEI' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/knowledge-discovery/insights/completed/template.html',
                    controller: 'KnowledgeInsightsCompletedController as vm'
                }
            }
        });
    }

})();
