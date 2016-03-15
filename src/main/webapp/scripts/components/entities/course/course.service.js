(function() {
  'use strict';
  angular.module('islaApp')
    .factory('Course', courseService);

  function courseService($resource) {
    return $resource('api/courses/:id', {}, {
      query: {method: 'GET', isArray: true},
      get: {
        method: 'GET',
        transformResponse: function(data) {
          return angular.fromJson(data);
        }
      },
      update: {method: 'PUT'},
      getLectures: {
        merhod: 'GET',
        isArray: true,
        params: {courseId: '@courseId'},
        url: '/api/courses/:courseId/lectures'
      },
      getModerators: {
        merhod: 'GET',
        isArray: true,
        params: {courseId: '@courseId'},
        url: '/api/courses/:courseId/moderators'
      }
    });
  }
})();
