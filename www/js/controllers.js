/*
	Main controller
*/

(function(module) {
	module.controller('MainCtrl',function($scope, $ionicSideMenuDelegate, Tasks, $ionicPopup, $timeout) {
		$scope.tasks = Tasks.allTasks();
		$scope.searchQuery = {text:''};
		$scope.isSearchActive = false;
		$scope.categories = Tasks.allCategories();
		$scope.newCategory = {}
	  	$scope.priorities = [1,2,3,4,5];

	  	$scope.menuItems = [
		    {name:'Tasks',url:'tasks', icon:'ion-android-apps'}, 
	    	{name:'Categories',url:'categories', icon:'ion-android-funnel'},
	    	{name:'Statistic',url:'statistic', icon:'ion-pie-graph'},
	    	{name:'About',url:'about', icon:'ion-information-circled'}];

	  	$scope.activeMenuItem = $scope.menuItems[0];

	  	$scope.selectMenuItem = function(index) {
		    $scope.activeMenuItem = $scope.menuItems[index];
	    	$ionicSideMenuDelegate.toggleLeft(false);
	  	}

	  	$scope.toggleMenu = function() {
	    	$ionicSideMenuDelegate.toggleLeft();
	  	};

		$scope.showConfirm = function(title, template, success) {
		    var confirmPopup = $ionicPopup.confirm({
	      		title: title,
	      		template: template
	    	});
	    	confirmPopup.then(function(res) {
	      	if (res) {
	        	success();
	      	}
		    });
	  	}

	})
})(angular.module('TimeManager'));

/*
	Categories controller
*/

(function(module) {
	module.controller('CategoriesCtrl', function($scope, $ionicModal, Tasks, $ionicPopup) {
	  	$scope.newCategory = {}

		$ionicModal.fromTemplateUrl('templates/new-category.html', function(modal) {
	    	$scope.projectModal = modal;
	  	}, {
	    	scope: $scope
	  	});

		$scope.showNewCategory = function() {
	    	$scope.projectModal.show();
	  	}

		$scope.closeNewCategory = function() {
	    	$scope.newTask = {};
	    	$scope.projectModal.hide(); 
	  	}

	  	$scope.createNewCategory = function(category) {
		    $scope.categories.push ({
	      		name: category.name,
	      		description: category.description
	    	});
	    	Tasks.saveCategories($scope.categories);
	    	$scope.projectModal.hide();  
	    	$scope.newCategory = {};
	  	}

	  	$scope.deleteCategory = function(index) {
	    	$scope.showConfirm("Deleting '"+$scope.categories[index].name+"'",'Are you really want to delete this category?', function() {
	      		$scope.categories.splice(index,1);
	      		Tasks.saveCategories($scope.categories);
	    	});
	  	}
	})
})(angular.module('TimeManager'));

/*
	Tasks controller
*/

(function(module) {
	module.controller('TasksCtrl', function($scope, $ionicModal, $ionicPopup, Tasks, $filter) {

		$scope.init = function() {
			$ionicModal.fromTemplateUrl('templates/filters.html', function(modal) {
		   		$scope.filtersModal = modal;
		  	}, {
		    	scope: $scope
		  	});

		  	$ionicModal.fromTemplateUrl('templates/new-task.html', function(modal) {
		  	  	$scope.newTaskModal = modal;
		  	}, {
		    	scope: $scope
		  	});

		  	$ionicModal.fromTemplateUrl('templates/select.html', function(modal) {
		    	$scope.selectModal = modal;
		  	}, {
		  	  	scope: $scope
		  	});

		  	$ionicModal.fromTemplateUrl('templates/task.html', function(modal) {
			    $scope.taskModal = modal;
		  	}, {
			    scope: $scope
		  	});	

		  	$scope.filters = {}
	  		$scope.activeFilters = {
	    		all:true,
	  		  	today: false
	  		}
	  		$scope.doneFilters = {
				done: true,
		  		undone: true
			}
			$scope.specificFilter = {};
		}

		$scope.search = function(item) {
	    	if ($scope.checkDateFilter(item)) {
	      		if (!$scope.searchQuery.text) {
	        		return true;
	      		}
	      		var query = $scope.searchQuery.text.toLowerCase();
	      		if (item.shortDescription && item.shortDescription.toLowerCase().indexOf(query) > -1) {
	        		return true;
	      		}
	      		if (item.description && item.description.toLowerCase().indexOf(query) > -1) {
	        		return true;
	      		}
	    	}
	   		return false;
	  	}

	  	$scope.checkDateFilter = function(item) {
	    	if (item.addingDate && $scope.filterDate && $filter('date')(item.addingDate,'dd.MM.yyyy').indexOf($scope.filterDate) === -1) {
	      		return false;      
	    	}
	    	return true;
	  	}

	  	$scope.showSearch = function() {
		    $scope.searchQuery = {text:undefined};
	    	if ($scope.isSearchActive) {
	      		$scope.search($scope.searchQuery.text);
	    	}
	    	$scope.isSearchActive = !$scope.isSearchActive; 
	  	}
		
		$scope.showFilters = function() {
		    $scope.filtersModal.show();
	  	}

		$scope.applyFilters = function() {
	   		$scope.filtersModal.hide();
	  	}

	  	$scope.showNewTask = function() {
		    $scope.newTask = {};
	    	$scope.newTask.priority = 1;
	    	$scope.selectedCategoryIndex = 0;
	    	$scope.newTask.isStarted = false;
	    	$scope.newTaskModal.show();
	    	$scope.newTaskModal['backdropClickToClose'] = false;
	    	$scope.newTaskModal['hardwareBackButtonClose'] = false;
	    }

	  	$scope.closeNewTask = function() {
		    $scope.newTaskModal.hide();
	  	}

	  	$scope.showSelect = function() {
		    $scope.selectModal.show();
	  	}

	  	$scope.closeSelect = function() {
		    $scope.selectModal.hide();
	  	}
  
	  	$scope.selectCategory = function() {
	    	$scope.selectHeader = 'Select category';
	    	$scope.items = [];
	    	for (var i=0;i<$scope.categories.length;i++) {
	      		$scope.items[i] = {
	        		value : $scope.categories[i].name,
	        		checked : false
	      		} 
	      		if ($scope.selectedCategoryIndex == i) {
	        		$scope.items[i].checked = true;
	      		}
	    	}
	    	$scope.showSelect();
	    	$scope.selectItem = function(index) {
			   	$scope.selectedCategoryIndex = index;
	    		$scope.closeSelect();
	    	}
		}

		$scope.selectPriority = function() {
		    $scope.selectHeader = 'Select priority';
	    	$scope.items = [];
	    	for (var i=0;i<5;i++) {
	      		$scope.items[i] = {
	        		value : i+1,
		        	checked : false
	      		}
	      		if ($scope.newTask.priority === (i+1)) {
	        		$scope.items[i].checked = true;
	      		}
	    	}
	    	$scope.showSelect();

		    $scope.selectItem = function(index) {
	      		$scope.newTask.priority = index+1;
	      		$scope.closeSelect();
	    	}
	  	}

	  	$scope.createNewTask = function(newTask) {
		    $scope.closeNewTask();
	    	var date = new Date();
	    	$scope.tasks.push({
	        	shortDescription: newTask.shortDescription,
	        	description: newTask.description,
	        	addingDate : date,
	        	currentDate: (newTask.isStarted) ? date : null,
	        	isStarted: newTask.isStarted,
	        	isPaused: false,
	        	category: $scope.categories[$scope.selectedCategoryIndex],
	        	priority: newTask.priority,
	        	isDone: false,
	        	spendedTimeMs: 0
		    });
	    	$scope.updateSpendedTime($scope.tasks.length-1);
		    $scope.newTask = {};
	    	$scope.selectedCategoryIndex = -1;
	  	}

	  	$scope.showTask = function(task) {
		    $scope.currentTask = task;
	    	$scope.taskModal.show();
	  	}

	  	$scope.closeTask = function() {
		    $scope.taskModal.hide(); 
	  	}

	  	$scope.deleteTask = function(currentTask) {
		    $scope.showConfirm("Deleting '"+currentTask.shortDescription+"'",'Are you really want to delete this task?', function() {
	      		for (var i in $scope.tasks) {
			        if ($scope.tasks[i].shortDescription === currentTask.shortDescription && $scope.tasks[i].description === currentTask.description) {
	        	  		$scope.tasks.splice(i,1);    
	        		}
	      		}
	      		Tasks.saveTasks($scope.tasks);
	      		$scope.closeTask();
	    	});
	  	}

	  	$scope.startTask = function(index) {
	    	if ($scope.tasks[index].isStarted) {
	      		$scope.tasks[index].isPaused = false;
	    	}
	    	else {
	    	  	$scope.tasks[index].isStarted = true;
		    }
	    	$scope.tasks[index].currentDate = new Date().getTime();
	    	$scope.updateSpendedTime(index);
	  	}

	  	$scope.pauseTask = function(index) {
		    $scope.tasks[index].isPaused = true;
	    	$scope.tasks[index].spendedTimeMs += new Date().getTime() - $scope.tasks[index].currentDate;
	    	$scope.updateSpendedTime(index);
	  	}

		$scope.doTask = function(index) {
		    $scope.tasks[index].spendedTimeMs += new Date().getTime() - $scope.tasks[index].currentDate;
	    	$scope.tasks[index].isDone = true;
	    	$scope.updateSpendedTime(index);
	  	}

	  	$scope.updateSpendedTime = function(index) {
		    var hours = integerDivision($scope.tasks[index].spendedTimeMs,1000*60*60);
	    	var minutes = integerDivision($scope.tasks[index].spendedTimeMs - hours*1000*60*60, 1000*60);
	    	var seconds = integerDivision($scope.tasks[index].spendedTimeMs - hours*1000*60*60 - minutes*1000*60, 1000);
	    	$scope.tasks[index].spendedTime = {
	      		hours: hours,
	      		minutes: minutes,
	      		seconds: seconds
	    	}
	    	Tasks.saveTasks($scope.tasks); 
	  	}

		function integerDivision(x, y){
		    return (x-x%y)/y
	  	}

		$scope.setFilterDate = function(date) {
	  		$scope.activeFilters = {
	    		all:false,
	    		today: false
	  		}
	  		if (date === 'all') {
	    		$scope.filterDate = undefined;  
	    		$scope.activeFilters.all = true;
	  		} else if (date === 'today') {
	    		$scope.filterDate = $filter('date')(new Date(),'dd.MM.yyyy'); 
	    		$scope.activeFilters.today = true;
	  		}
	 	}

	 	$scope.setFilterDone = function(isDone) {
	  		$scope.filters.isDone = isDone;
	 	}
		
	 	$scope.updateDoneFilters = function() {
	  		if ($scope.doneFilters.done && $scope.doneFilters.undone) {
	    		$scope.filters.isDone = undefined;
	  		} else if ($scope.doneFilters.done) {
	    		$scope.filters.isDone = true;
	  		} else if ($scope.doneFilters.undone) {
	    		$scope.filters.isDone = false;
	  		} else if (!$scope.doneFilters.done && !$scope.doneFilters.undone) {
	    		$scope.filters.isDone = null;
	  		}
	 	}

	 	$scope.setSpecificFilterDate = function() {
	  		if ($scope.specificFilter) {
	    		$scope.filterDate = $filter('date')($scope.specificFilter.date,'dd.MM.yyyy'); 
	  		}
	  		$scope.filtersModal.hide();
	 	}
	})
})(angular.module('TimeManager'));


/*
	Statistic controller
*/

(function (module) {
	module.controller('StatisticCtrl',function($scope, Tasks) {

	  $scope.init = function() {
	    $scope.tasks = Tasks.allTasks();
	    $scope.categories = Tasks.allCategories();
	    $scope.labels = [];
	    $scope.data = [];
	    $scope.activeFilters = {
	      byCategories: true,
	      byPriorities: false
	    };
	    $scope.calculate();
	  }
	  
	  $scope.calculate = function() {
	    $scope.labels = [];
	    $scope.data = [];
	    if ($scope.activeFilters.byCategories) {
	      for (var i in $scope.categories) {
	        $scope.labels.push($scope.categories[i].name);
	        for (var j in $scope.tasks) {
	          if ($scope.tasks[j].category.name === $scope.categories[i].name) {
	            if ($scope.data[i]) {
	              $scope.data[i] += $scope.tasks[j].spendedTimeMs / (1000*60*60);
	            }
	            else {
	              $scope.data[i] = $scope.tasks[j].spendedTimeMs / (1000*60*60); 
	            }
	          }
	        }
	      }
	    }
	    else {
	      for (var i=1;i<=5;i++) {
	        $scope.labels.push(i);
	        $scope.data.push(0);
	        for (var j in $scope.tasks) {
	          if ($scope.tasks[j].priority === i) {
	            $scope.data[i-1] += $scope.tasks[j].spendedTimeMs / (1000*60*60);
	          }
	        }
	      }
	    }
	  }

	  $scope.setByCategories = function(isByCategory) {
	    $scope.activeFilters = {
	      byCategories: isByCategory,
	      byPriorities: !isByCategory
	    };
	    $scope.calculate();
	  }
	})
})(angular.module('TimeManager'));