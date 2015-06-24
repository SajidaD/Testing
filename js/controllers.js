
angular.module('starter.controllers', ['ionic-timepicker']).controller('ItemsCtrl', function($scope,DatasyncAdapter,$location,selectedIssue,latestLocation,$ionicTabsDelegate,$window,$rootScope,$timeout,$ionicHistory) {
	/* Added following code for binding datasync listeners to update UI */
	
	$ionicHistory.clearHistory();
	$ionicHistory.clearCache();
	
	latestLocation.updateLatestLatLong();
	
	$rootScope.currentLatLong={
		'lat':0,
		'longitude':0,
		'timeStamp':0		
		};
		
	$window.navigator.geolocation.getCurrentPosition(onSuccess, onError);
	function onSuccess(position)
	     {
	  		
			
		var pos={
		'lat':position.coords.latitude,
		'longitude':position.coords.longitude,
		'timeStamp':position.timestamp
		};
		
		console.log(pos);
		$rootScope.currentLatLong = JSON.stringify(pos);
		
		
	 }
	
	function onError(error) {
    	alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
	}
	
	
	console.log("STRATED *****");
	
	aiq.client.getCurrentUser({
    success: function(currentUser) {
        $scope.userName = currentUser.username;
        $rootScope.globalUser = currentUser.username;
        
        var todoStorage = DatasyncAdapter.getAdapter('Issue');
    todoStorage.initListeners(handler).fetch().then(function(items) {
    	
        $scope.items = items;
       
        var sortedData1 = _.where($scope.items,{status:'Unstarted'});
        var sortedData2 = _.where($scope.items,{status:'En route'});
        var sortedData3 = _.where($scope.items,{status:'Assessing'});
        var sortedData4 = _.where($scope.items,{status:'Resolving'});
        
        $scope.data = sortedData1.concat(sortedData2,sortedData3,sortedData4);
        
        var myIssuesArray = _.where($scope.items,{assignedTo:$rootScope.globalUser});
        var myAssessingIssue = _.where(myIssuesArray,{status:'Assessing'});
        var myEnrouteIssue = _.where(myIssuesArray,{status:'En route'});
        var myResolvingIssue = _.where(myIssuesArray,{status:'Resolving'});
        
        if(myAssessingIssue.length == 0 &&  myEnrouteIssue.length == 0 && myResolvingIssue.length == 0) {
        	
        	$rootScope.statusOnGoing = "FALSE";
        }
        else {
        	
        	$rootScope.statusOnGoing = "TRUE";
        }
        
    });
        
    }
});
$scope.navtitle = "Issues";
	  $scope.getdatetime = function(dateobj) {
	
  	var reportedDate = new Date(dateobj.reported).toDateString();
	 var currentDate = new Date().toDateString();
	
	 if (reportedDate === currentDate) {
	 	currentTimeStamp = new Date(dateobj.reported);
	 	currentTimeStamp = ('0' + currentTimeStamp.getHours()).slice(-2)+':'+('0' + currentTimeStamp.getMinutes()).slice(-2);//+':'+currentTimeStamp.getSeconds();
	 }
	 else {
	 	currentTimeStamp = new Date(dateobj.reported);//.toDateString();
	 	var monthNumber = currentTimeStamp.getMonth() + 1;
	 	currentTimeStamp = currentTimeStamp.getFullYear()+'-'+('0' + monthNumber).slice(-2)+'-'+('0' + currentTimeStamp.getDate()).slice(-2)+' '+('0' + currentTimeStamp.getHours()).slice(-2)+':'+('0' + currentTimeStamp.getMinutes()).slice(-2);
	 }
	 return currentTimeStamp;
	 }
	

	


  $scope.getDistanceFromLatLonInKm = function(item) {
  	
	  console.log("getDistanceFromLatLonInKm called");
	  
  	var obj = angular.fromJson(item.location);
  	
  	// var objCurrent =angular.fromJson(localStorage.getItem("posi"));
	
	
	//var objCurrent =angular.fromJson($rootScope.currentLatLong);
	var objCurrent =angular.fromJson(latestLocation.getLatLong());
  
	console.log("Root scope lat long" + $rootScope.currentLatLong);
  	if((objCurrent.lat == 0) && (objCurrent.longitude==0))
  	{
  		console.log("NA");
		isloaded = 'NO';
  		return "N.A.";
  	}
	 
    var	lat1 = objCurrent.lat;//19.122775;
    var	lon1 = objCurrent.longitude;//72.876573;
    	
    var	lat2 = obj.latitude//19.218331;
    var	lon2 = obj.longitude//72.978090;
    	
     var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
	console.log(d);
  
  return Math.round(d, 1);
  
} ; 

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
 
 Math.round = (function() {
  var originalRound = Math.round;
  return function(number, precision) {
    precision = Math.abs(parseInt(precision)) || 0;
    var multiplier = Math.pow(10, precision);
    return (originalRound(number * multiplier) / multiplier);
  };
})();
 
 $scope.userFirst = function(item){
    			return item.assignedTo !== $scope.userName;
}
	
$scope.statusFilter = function(item){
    			return item.status !== 'Unstarted';
}

 $scope.getDistanceFilter = function(item) {
  if(item.status == 'Unstarted')	{
  	var obj = angular.fromJson(item.location);
  	
	// var objCurrent =angular.fromJson(localStorage.getItem("posi"));
	var objCurrent =angular.fromJson($rootScope.currentLatLong);
    	lat1 = objCurrent.lat;//19.122775;
    	lon1 = objCurrent.longitude;//72.876573;
    	
    	lat2 = obj.latitude//19.218331;
    	lon2 = obj.longitude//72.978090;
    	
     var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
  
  return Math.round(d, 1);
  }
} ;

  $scope.getAssignedMember = function(item) {
  	if (item.status === 'Closed') {
  		if(item.assignedTo === $scope.userName){
  	$scope.boldName = "You";
  	return "Resolved by: ";
  	}
  	else {
  		$scope.boldName = item.assignedTo;
  	return "Resolved by: ";
  	}
  	}
  	else {
  		
  	if(item.assignedTo === $scope.userName){
  		
  	$scope.boldName = "You";
  	return "Assigned to: ";
  	}
  	else {
  		if (item.assignedTo ==='') {
   	$scope.boldName = "Currently not assigned";
  	return "";
  }
  else {
  	$scope.boldName = item.assignedTo;
  	return "Assigned: ";
  }
  }
  
   
  
 }
 }


	function indexOf(argument) {
	        var id = angular.isObject(argument) ? argument._id : argument;
	        var result = -1;
	        $scope.items.some(function(todo, index) {
	            if (todo._id === id) {
	                result = index;
	                return true;
	            }
	        });
	        return result;
	}
	
	/* Handler function to update list with sync data */
    function handler(operation, todo) {
        switch(operation) {
				case 'create':
					$scope.items.push(todo);
                	break;
				case 'update':
                	angular.extend($scope.items[indexOf(todo)], todo)
                	break;
				case 'destroy':
					$scope.items.splice(indexOf(todo), 1);    
	    }
    }
    
    
    $scope.next= function(objItem)
	{
		
    	selectedIssue.setItem(objItem); 
    	
    	$location.path("/tab/Details");
    }
    
  
  $scope.goPage = function(index) {
		  if(index == 0){
		  	
			  var sortedData1 = _.where($scope.items,{status:'Unstarted'});
			  var sortedData2 = _.where($scope.items,{status:'En route'});
			  var sortedData3 = _.where($scope.items,{status:'Assessing'});
			  var sortedData4 = _.where($scope.items,{status:'Resolving'});
			  $scope.data = sortedData1.concat(sortedData2,sortedData3,sortedData4);
		  }else {
		  	
			  var sortedData = _.where($scope.items,{status:'Closed'});
			  $scope.data = sortedData;
		  }
      $ionicTabsDelegate.$getByHandle('my-tabs').select(index);
	
  }  
    $scope.close = function() {
    	
        aiq.client.closeApp();
    };

    
}).controller('ItemsOpenCtrl', function($scope,DatasyncAdapter,$location) {
	/* Added following code for binding datasync listeners to update UI */
	var todoStorage = DatasyncAdapter.getAdapter('TODO.Item');
    todoStorage.initListeners(handler).fetch().then(function(items) {
        $scope.items = items;
       
    });
    
    $scope.navtitle = "Issues";
	
	function indexOf(argument) {
	        var id = angular.isObject(argument) ? argument._id : argument;
	        var result = -1;
	        $scope.items.some(function(todo, index) {
	            if (todo._id === id) {
	                result = index;
	                return true;
	            }
	        });
	        return result;
	}
	
	/* Handler function to update list with sync data */
    function handler(operation, todo) {
        switch(operation) {
				case 'create':
					$scope.items.push(todo);
                	break;
				case 'update':
                	angular.extend($scope.items[indexOf(todo)], todo)
                	break;
				case 'destroy':
					$scope.items.splice(indexOf(todo), 1);    
	    }
    }
    
}).controller('ItemsClosedCtrl', function($scope,DatasyncAdapter,$location) {
	/* Added following code for binding datasync listeners to update UI */
	var todoStorage = DatasyncAdapter.getAdapter('TODO.Item');
    todoStorage.initListeners(handler).fetch().then(function(items) {
        $scope.items = items;
    });
    
    $scope.navtitle = "Issues";
	
	function indexOf(argument) {
	        var id = angular.isObject(argument) ? argument._id : argument;
	        var result = -1;
	        $scope.items.some(function(todo, index) {
	            if (todo._id === id) {
	                result = index;
	                return true;
	            }
	        });
	        return result;
	}
	
	/* Handler function to update list with sync data */
    function handler(operation, todo) {
        switch(operation) {
				case 'create':
					$scope.items.push(todo);
                	break;
				case 'update':
                	angular.extend($scope.items[indexOf(todo)], todo)
                	break;
				case 'destroy':
					$scope.items.splice(indexOf(todo), 1);    
	    }
    }
    
}).controller('IssueInformationCtrl', function($scope,selectedIssue,$location) {
	alert("IssueInformationCtrl");

	 $scope.issueDetails = selectedIssue.getItem();

	$scope.Details= function(objItem)
	{
		selectedIssue.setItem(objItem);
		$location.path("Details");
	}


	$scope.SpareParts= function(objItem){
		selectedIssue.setItem(objItem);
		$location.path("SpareParts");
	}

	$scope.Directions= function(objItem){
		selectedIssue.setItem(objItem);
		$location.path("Directions");
	}

}).controller('DetailsCtrl', function($scope,selectedIssue,$location,$window, $ionicPopup,$rootScope) {
		//alert("DetailsCtrl");

	$scope.issueDetails = selectedIssue.getItem();

//calculate time 

  $scope.getdatetime = function(dateobj) {
	
  	var reportedDate = new Date(dateobj).toDateString();
	 var currentDate = new Date().toDateString();
	
	 if (reportedDate === currentDate) {
	 	currentTimeStamp = new Date(dateobj);
	 	currentTimeStamp = ('0' + currentTimeStamp.getHours()).slice(-2)+':'+('0' + currentTimeStamp.getMinutes()).slice(-2);//+':'+currentTimeStamp.getSeconds();
	 }
	 else {
	 	currentTimeStamp = new Date(dateobj);//.toDateString();
	 	var monthNumber = currentTimeStamp.getMonth() + 1;
	 	currentTimeStamp = currentTimeStamp.getFullYear()+'-'+('0' + monthNumber).slice(-2)+'-'+('0' + currentTimeStamp.getDate()).slice(-2)+' '+('0' + currentTimeStamp.getHours()).slice(-2)+':'+('0' + currentTimeStamp.getMinutes()).slice(-2);
	 }
	 return currentTimeStamp;
	 }


	// Calculate Distance Beetween points
	$scope.getDistanceFromSourceToDestination = function(item)
	{
		var DistanceInKM = null;
		//alert("Item"+JSON.stringify(item));
		try {

			var DestinationIssue = angular.fromJson(item);


			var SourceLocation =angular.fromJson($rootScope.currentLatLong);//angular.fromJson(localStorage.getItem("posi"));

            var	lat1 = SourceLocation.lat;//19.122775;
            var	lon1 = SourceLocation.longitude;//72.876573;
    	
            var	lat2 = DestinationIssue.latitude//19.218331;
            var	lon2 = DestinationIssue.longitude//72.978090;
            
			//Start Amrat
			var R = 6371; // Radius of the earth in km
			var dLat = deg2rad(DestinationIssue.latitude-SourceLocation.lat );
			var dLon = deg2rad( DestinationIssue.longitude-SourceLocation.longitude);
			var a =
					Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
					Math.sin(dLon/2) * Math.sin(dLon/2)
				;
			var TempVar = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var Distance = R * TempVar; // Distance in km

			DistanceInKM= Math.round(Distance, 1);
		}
		catch(exception )
		{
			alert(exception);
		}
		return DistanceInKM+" km";
	}

	function deg2rad(deg)
	{
		return deg * (Math.PI/180);
	}

}).controller('DirectionsCtrl', function($scope,selectedIssue,$location,$ionicLoading,$window) {
	//alert("DirectionsCtrl");

    $scope.show = function() {
       $ionicLoading.show({
         template: 'Loading...'
       });
     };
	 
     $scope.hide = function(){
       $ionicLoading.hide();
     };
	 
	$scope.issueDetails = selectedIssue.getItem();


	$scope.convertToString= function (value) {
		return "" + value;
	};

	$scope.stripHTML = function (value) 
	{
		
	var html = value;
	var div = document.createElement("div");
	div.innerHTML = html;
	var text = div.textContent || div.innerText || "";
	
	return text;
	};

	var pos ={
			'lat':0,
			'longitude':0,
			'timeStamp':""
		
			};
	
	try {
		
        $ionicLoading.show({
          template: 'Loading...'
        });
		
	
	
		$window.navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		function onSuccess(position)
		     {

 				pos.lat = position.coords.latitude;
 			   pos.longitude = position.coords.longitude;
 			  pos.timeStamp = position.timestamp;
 
			  var destination = $scope.issueDetails.location.latitude+","+$scope.issueDetails.location.longitude;
			  var source = pos.lat +","+pos.longitude;
			  
 			 // var request = {
				 // origin: source,//"59.322573, 18.404531",
				 // destination: destination,
				 // unitSystem: google.maps.DirectionsUnitSystem.METRIC,
				 // travelMode: google.maps.TravelMode.DRIVING
			 // };

			 // var response;
			 // var directionsService = new google.maps.DirectionsService();
			 // $scope.DirectionRoute = directionsService.route(request, function (response, status) {
				 // if (status == google.maps.DirectionsStatus.OK)
				 // {
					 // $scope.DirectionRoute =angular.fromJson(response.routes[0].legs[0].steps);
// 					
					 // $ionicLoading.hide();
// 
// 
		// }
		
		// });
		
		
		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();
	

  var request = {
				 origin: source,//"59.322573, 18.404531",
				 destination: destination,
				 travelMode: google.maps.TravelMode.DRIVING
			 };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
       directionsDisplay.setPanel(document.getElementById('directions-panel'));
       $ionicLoading.hide();
    }
  });

		
		
	

		 }
	
		function onError(error) {
			$ionicLoading.hide();
	    	alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
		}
		
			
		}catch(exception )
		{
			alert(exception);
			$ionicLoading.hide();
		}

}).controller('SparePartsCtrl', function($scope,selectedIssue,$location,$rootScope) {
	//alert("SpareParts");

	$scope.issueDetails = selectedIssue.getItem();
	// alert(JSON.stringify($scope.issueDetails));
if($scope.issueDetails.status == 'Closed' || $scope.issueDetails.assignedTo != $rootScope.globalUser ||$scope.issueDetails.status == 'Unstarted') {
	$scope.disableSpareParts = 'TRUE';
}
else {
	$scope.disableSpareParts = 'FALSE';
}

$rootScope.tempSpareParts= angular.copy($scope.issueDetails.spareParts);

	$scope.Details= function(objItem){
		selectedIssue.setItem(objItem);
		$location.path("/Details");
	}

	$scope.Directions= function(objItem){
		selectedIssue.setItem(objItem);
		$location.path("/Directions");
	}


}).controller('HomeTabCtrl', function($scope,selectedIssue,$location,$ionicHistory,DatasyncAdapter,$rootScope,onlineStatus,$ionicPopup ) {
	$scope.stateButtonName = selectedIssue.getNextState();
	
	 $scope.myGoBack = function() {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $location.path("/items");
  };
  
  $scope.issueDetails = selectedIssue.getItem();
  $scope.tabName = $scope.issueDetails.id;
   if($scope.issueDetails.status == 'Closed') {
   	$scope.showFooterButton = 'FALSE';
   }
   else {
  if($scope.issueDetails.assignedTo != $rootScope.globalUser) {
  	if ($scope.issueDetails.assignedTo == '' && $scope.issueDetails.status == 'Unstarted')
  	{
  		 
  		// $scope.showFooterButton = 'TRUE'
  		
  		// if($scope.issueDetails.status == 'Assessing' || $scope.issueDetails.status == 'En route' || $scope.issueDetails.status == 'Resolving'){
  	
  	if($rootScope.statusOnGoing == "TRUE") {
  		$scope.showFooterButton = 'FALSE';
  	}
  	else {
  		$scope.showFooterButton = 'TRUE';
  	}
  		
  		
  	 }
  	else {
  	$scope.showFooterButton = 'FALSE';
  	}
  	
  	
  	
  	
  }
  else if ($scope.issueDetails.assignedTo == $rootScope.globalUser) {
  	
  	if($scope.issueDetails.status == 'Assessing' || $scope.issueDetails.status == 'En route' || $scope.issueDetails.status == 'Resolving'){
  	
  	if($rootScope.statusOnGoing == "TRUE") {
  		
  		$scope.showFooterButton = 'TRUE';
  	}
  	else {
  		$scope.showFooterButton = 'FALSE';
  	}
  	}
  	else {
  	if($rootScope.statusOnGoing == "TRUE") {
  		$scope.showFooterButton = 'FALSE';
  	}
  	else {
  		$scope.showFooterButton = 'TRUE';
  	}
  	}
  }
  }
	$scope.GetPageToMove = function(index) {
		if (index == 0) {
			$scope.selectedTab = "details";
			$location.path("/tab/Details");
		} else if (index == 1) {
			$scope.selectedTab = "spareParts";
			$location.path("/tab/SpareParts");
			
		}else {
			$scope.selectedTab = "directions";
		if($scope.issueDetails.status == "Closed"){
			alert('Not Available.');
			return;
		}
		
  // document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    // function onDeviceReady() {
        
    // }
    
    

    
   // $scope.online_status_string = onlineStatus.isOnline();
   // // $scope.online_status_string = online ? 'online' : 'offline';
   // console.log($scope.online_status_string);
//    
   // if($scope.online_status_string == false) {
        	 // alert ('Network not available');
        	 // return;
         // }
         $location.path("/tab/Directions");
   
    // $scope.$watch('onlineStatus.isOnline()', function(online) {
        // $scope.online_status_string = online ? 'online' : 'offline';
        // if($scope.online_status_string == 'offline') {
        	// alert ('Network not available');
        	// return;
        // }
        // $location.path("/tab/Directions");
    // });
		
			
		}
	}
$scope.slots = {epochTime: 12600, format: 24, step: 5};

//Commented for Demo(sync with integration adapter)

// $scope.issueDetails.latestStateChange = $scope.slots.epochTime;

// var todoStorage = DatasyncAdapter.getAdapter('Issue');
// // alert('SyncData:'+ JSON.stringify($scope.issueDetails));
//  	
    // todoStorage.update($scope.issueDetails._id,$scope.issueDetails).then(function(items) {
        // // $scope.items = items;
     // //   alert('YoFinal:'+ JSON.stringify(items));
    // });
    
   selectedIssue.registerObserverCallback(setStateCallBack);
   function setStateCallBack(val){
   	 // alert('callback'+val);
   	switch(val) {
				case 'En route':
					val= 'Assessing';
					break;
				case 'Assessing':
                   val= 'Resolving';
                   break;
       
	    }
   	$scope.stateButtonName = val;//selectedIssue.getState();
   	  	if($scope.issueDetails.status = "Unstarted") {
   		$scope.issueDetails.assignedTo = $rootScope.globalUser;
   	}
   
  var todoStorage = DatasyncAdapter.getAdapter('Issue');
  
  	
      todoStorage.update($scope.issueDetails._id,$scope.issueDetails).then(function(items) {
      $scope.items = items;
      
      });
   	
   }
$scope.avcb = "enroute";
$scope.setTimerClicked= function()
	{
	$scope.issueDetails.status = "Closed";	
	
	var todoStorage = DatasyncAdapter.getAdapter('Issue');
 // alert('SyncData:'+ JSON.stringify($scope.issueDetails));
  	
      todoStorage.update($scope.issueDetails._id,$scope.issueDetails).then(function(items) {
      $scope.items = items;
	  
	  var alertPopup = $ionicPopup.alert({
	      title: 'Issue resolved!',
	      template: 'Your issue is resolved successfully!!'
	    });
	    alertPopup.then(function(res)
		 {
	        $ionicHistory.clearHistory();
	        $ionicHistory.clearCache();
	        $location.path("/items");
	    });
	
	  
     
     // alert('YoFinal:'+ JSON.stringify(items));
      });
	
    }
    
    $scope.sparePartsSaved= function(){
    	
    	 $rootScope.tempSpareParts = angular.copy($scope.issueDetails.spareParts);
    	
    }
    
    if($scope.issueDetails.status == 'Closed' || $scope.issueDetails.assignedTo != $rootScope.globalUser) {
	$scope.disableSpareParts = 'TRUE';
}
else {
	$scope.disableSpareParts = 'FALSE';
}

});
