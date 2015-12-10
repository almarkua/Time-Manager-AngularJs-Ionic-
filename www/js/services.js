angular.module('TimeManager.Services',[])
.factory('Tasks', function() {
  return {
    allTasks: function() {
      var tasksString = window.localStorage['tasks'];
      if(tasksString) {
        return angular.fromJson(tasksString);
      }
      return [];
    },
    saveTasks: function(tasks) {
      window.localStorage['tasks'] = angular.toJson(tasks);
    },
    allCategories: function() {
      var categoriesString = window.localStorage['categories'];
      if (categoriesString) {
        return angular.fromJson(categoriesString);
      }
      return [];
    },
    saveCategories: function(categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    }
  }
})