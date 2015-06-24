angular.module('starter.services', [])

.service('DatasyncAdapter', function ($q, $rootScope) {
  'use strict';

  var cache = {};

  function getAdapter(type) {
    if (!cache[type]) {
      cache[type] = {
        create: function (data) {
        	
          var deferred = $q.defer();

          aiq.datasync.createDocument(type, data, {
            success: deferred.resolve,
            failure: deferred.reject
          });

          return deferred.promise;
        },

        fetch: function (options) {
          var deferred = $q.defer();

          aiq.datasync.getDocuments(type, {
            filters: (options || {}).filter,
            success: deferred.resolve,
            failure: deferred.reject
          });

          return deferred.promise;
        },

        update: function (id, data) {
        	
       // 	alert('YoData:'+ JSON.stringify(data));
        	
          var deferred = $q.defer();

          aiq.datasync.updateDocument(id, data, {
            success: deferred.resolve,
            failure: deferred.reject
          });

          return deferred.promise;
        },

        destroy: function (id) {
          var deferred = $q.defer();

          aiq.datasync.deleteDocument(id, {
            success: deferred.resolve,
            failure: deferred.reject
          });

          return deferred.promise;
        },

        initListeners: function (handler) {

          function wrapHandler(operation) {
	            return function (data) {
				//alert(JSON.stringify('name'+operation+JSON.stringify(data)));
              $rootScope.$apply(function () {
                handler(operation, data);
              });
            };
          }

          aiq.datasync.bind('document-created', {
            _type: type,
            callback: function (id) {
              aiq.datasync.getDocument(id, {
                success: wrapHandler('create')
              });
            }
          });
          aiq.datasync.bind('document-updated', {
            _type: type,
            callback: function (id) {
              aiq.datasync.getDocument(id, {
                success: wrapHandler('update')
              });
            }
          });
          aiq.datasync.bind('document-deleted', {
            _type: type,	         
            callback: wrapHandler('destroy')
          });

          return this;
        }
      };
    }

    return cache[type];
  }

  return {
    getAdapter: getAdapter,
    getDocument: function (id) {
      var deferred = $q.defer();

      aiq.datasync.getDocument(id, {
        success: deferred.resolve,
        failure: deferred.reject
      });

      return deferred.promise;
    }
  };
})

.service('latestLocation', function($rootScope,$window) {

	var latLong ={
		'lat':0,
		'longitude':0,
		'timeStamp':0
		};

		$window.navigator.geolocation.getCurrentPosition(onSuccess, onError);
		function onSuccess(position)
		     {

				latLong ={
			'lat':position.coords.latitude,
			'longitude':position.coords.longitude,
			'timeStamp':position.timestamp

			};
			// localStorage.setItem("posi",JSON.stringify(pos));

	//$rootScope.currentLatLong = JSON.stringify(pos);

	// alert($rootScope.currentLatLong);

	    // $scope.navtitle = "Issues";
		 }

		function onError(error) {
	    	alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
		}

	this.getLatLong = function()
		{
			return latLong;
		}

	this.updateLatestLatLong = function()
		{
			$window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

			function onSuccess(position)
			     {

					latLong ={
				'lat':position.coords.latitude,
				'longitude':position.coords.longitude,
				'timeStamp':position.timestamp
						

				};
				
				 latLong;
				 console.log('updated location' + latLong);
				// localStorage.setItem("posi",JSON.stringify(pos));

		//$rootScope.currentLatLong = JSON.stringify(pos);

		// alert($rootScope.currentLatLong);

		    // $scope.navtitle = "Issues";
			 }

			function onError(error) {
		    	alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');
			}


		}

  })
  
.service('selectedIssue', function($rootScope) {
  var obj = [];
  
  var observerCallbacks = [];

  //register an observer
  this.registerObserverCallback = function(callback){
    observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  var notifyObservers = function(val){
    angular.forEach(observerCallbacks, function(callback){
      callback(val);
    });
  };

  //example of when you may want to notify observers
  
  
  this.setItem = function(val){
  	obj = val;
  };
  
  this.getItem = function(){
  	return obj;
  };
  
  this.setState = function(val,timeParams){
  	// alert('Before'+obj.status);
  	obj.status = val;
  	obj.latestStateChange  = timeParams;
  	// alert('After'+obj.status);

  	notifyObservers(val);
  };
  
   

  
  
  this.getState = function(){
  	console.log("State:" +JSON.stringify(obj));
  	return obj.status;
  }
  
  this.getNextState = function(){
  	switch(obj.status) {
				case 'Unstarted':
					return 'En route';
				case 'En route':
                   return 'Assessing';
				case 'Assessing':
					return 'Resolving';
	    }
  }
  
 
  
})
.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $window.addEventListener("online", function () {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return onlineStatus;
}]);
