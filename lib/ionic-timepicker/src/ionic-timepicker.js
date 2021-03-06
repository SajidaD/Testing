//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

angular.module('ionic-timepicker', ['ionic', 'ionic-timepicker.templates'])

// Defining `ionicTimepicker` directive
  .directive('ionicTimepicker', ['$ionicPopup','selectedIssue', function ($ionicPopup,selectedIssue) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        etime: '=etime',        //epoch time getting from a template
        format: '=format',      //format getting from a template
        step: '=step'           //step getting from a template
      },
      link: function (scope, element, attrs) {
        
        element.on("click", function () {
scope.state = selectedIssue.getNextState();
         // alert('STATE:'+scope.state);
        if(scope.state == 'En route') {
        	scope.message = 'Time to get on site';
        }
        else if(scope.state == 'Assessing') {
        	scope.message = 'Estimated time to assess the issue:';
        } 
        if(scope.state == 'Resolving') {
        	scope.message = 'Estimated time to resolve:';
        }
          var obj = {epochTime: scope.etime, step: scope.step, format: scope.format};

          scope.time = {hours: 0, minutes: 0, meridian: ""};

          var objDate = new Date(obj.epochTime * 1000);       // Epoch time in milliseconds.

          scope.increaseHours = function () {
          	// alert(selectedIssue.getState());
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours != 12) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 1;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours != 23) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 0;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          scope.decreaseHours = function () {
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours > 1) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 12;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours > 0) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 23;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          scope.increaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);

            if (scope.time.minutes != (60 - obj.step)) {
              scope.time.minutes += obj.step;
            } else {
              scope.time.minutes = 0;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          scope.decreaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);
            if (scope.time.minutes != 0) {
              scope.time.minutes -= obj.step;
            } else {
              scope.time.minutes = 60 - obj.step;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          if (obj.format == 12) {

            scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
            scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
            scope.time.minutes = (objDate.getUTCMinutes());

            if (scope.time.hours == 0 && scope.time.meridian == "AM") {
              scope.time.hours = 12;
            }

            scope.changeMeridian = function () {
              scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
            };
            
            

            $ionicPopup.show({
              templateUrl: 'time-picker-12-hour.html',
              title: scope.state,
              subTitle: scope.message,
              scope: scope,
              buttons: [
                {text: 'Close'},
                {
                  text: 'Set',
                  type: 'button-positive',
                  onTap: function (e) {
					// selectedIssue.setState(scope.state);
                    scope.loadingContent = true;

                    var totalSec = 0;

                    if (scope.time.hours != 12) {
                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                      totalSec = scope.time.minutes * 60;
                    }

                    if (scope.time.meridian === "AM") {
                      totalSec += 0;
                    } else if (scope.time.meridian === "PM") {
                      totalSec += 43200;
                    }
                    scope.etime = totalSec;
                  }
                }
              ]
            })

          }

          if (obj.format == 24) {

            scope.time.hours = (objDate.getUTCHours());
			scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
            scope.time.minutes = (objDate.getUTCMinutes());
			scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
			var str1 = "New state: ";
			var res = str1.concat(scope.state);
            $ionicPopup.show({
              templateUrl: 'time-picker-24-hour.html',
              title: res,
              subTitle: scope.message,
              scope: scope,
              buttons: [
                {text: 'Cancel'},
                {
                  text: 'Confirm',
                  type: 'button-positive',
                  onTap: function (e) {
					
                    scope.loadingContent = true;

                    var totalSec = 0;

                    if (scope.time.hours != 24) {
                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                      totalSec = scope.time.minutes * 60;
                    }
                    scope.etime = totalSec;
                    var finalTime = new Date();
                    selectedIssue.setState(scope.state,finalTime);
                  }
                }
              ]
            })

          }

        });

      }
    };
  }]);