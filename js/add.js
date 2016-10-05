var ref = new Firebase('https://burning-inferno-2190.firebaseio.com');

var authkey = "";
var useremail= "";
var userkey = "";
var image;

function resetfields(){
	document.getElementById("habitForm").reset();
}
function authCallback(authData){
				if (authData){

						console.log("User is logged in!"); 
				}
				else {	
						
						console.log("User is not logged in!"); 
						window.location="login.html";
				}				
}

function saveHabit(title) {
	
	authemail=ref.getAuth().password.email;
	var title = document.getElementById('title').value;
	//findHelper(title);
	habitRef = ref.child("habits");
	
	var flag = false;
	
	var img_src="";
	
	var checkboxes = document.getElementsByName('date');
	var days = [];
	var dropFreq = document.getElementById("freqDropdown");
    var selectedFreq = dropFreq.options[dropFreq.selectedIndex].value;
    var intervalVar;
	var freq = "";

	flag = true;
	for (var i=0, n=checkboxes.length;i<n;i++) 
    {
	        if (checkboxes[i].checked) 
	        {
	            days.push(checkboxes[i].value);
				flag = false;
	        }
	}
	
	if (document.getElementById('day_1').checked){
		freq=document.getElementById('day_1').value;
	}
	else if (document.getElementById('day_2').checked){
		freq=document.getElementById('day_2').value;
	} 
	else if (document.getElementById('day_3').checked){
		freq=document.getElementById('day_3').value;
	}
	else if (document.getElementById('other').checked){
		freq=document.getElementById('other_text').value;
	}
	else {
		flag = true;
	}
	if (title == "" ){
		flag = true;
	}
	if (image != null){
		img_src= image.getAttribute('src');
	}
	else {
		flag = true;
		}
	var d = new Date();
	var t = d.getDay();

	intervalVar = setReminder(dropFreq, selectedFreq, intervalVar);
	

if (flag == false){

	habitRef.once('value', function(snapshot){
		//this snapshot has a copy of ALL user obj's key
		var retval = false;
		//alert("start");
		snapshot.forEach(function(childSnapshot){
			
			var object = childSnapshot.val();
			var newtitle = object.habit;
		//	alert("new data: " + newtitle + " tested against title: " +title);
			
			if (newtitle == title ){
				retval = true;
				return true; 
				}
			//alert("looping");
		});
		if (retval == true){
			//alert("TRUE FOUND");
			$('#title').val("");
			alert("A Habit already exists with this name!");
				location.reload();
				return retval;
		}
		else{
			//alert("MATCH NOT FOUND");
			createhab(img_src, days,  freq, t, authemail, title, selectedFreq,  intervalVar);
				return retval;
		}

		
	});
}

if (flag){alert("There was an error in the entry");}
else{alert("Making room for your habit!");}

}
function createhab(img_src, days,  freq, t, authemail, title, selectedFreq,  intervalVar){
	habitRef.push({image: img_src, weekdays: days, frequency: freq, completed: 0, total: 0, daily: 0, lastClicked: t, lastCompleted: t, useremail:authemail, habit: title, notificationFreq: selectedFreq, invervalTimeVar: intervalVar},
		function (error){
			if (error){
				alert("ERROR CREATING HABIT");
				console.log("ERROR CREATING USER ACCOUNT!!");
			}
			else {
				//alert("SUCCESSFULLY SAVED HABIT");
				console.log("CREATED HABIT");
				mixpanel.track("Habit Added");
			}

});
}
function selectImage(name) {
	//Clear all the other effects
	document.getElementById('icon1').style.border = "none";
	document.getElementById('icon2').style.border = "none";
	document.getElementById('icon3').style.border = "none";
				
	//remove var from var image = ... to make image a global var
	image = document.getElementById(name);
	image.style.border = "5px solid #42A5F5";
	
}
			
function validateBoxes(theForm) {

	if(image == null ) {
		alert ('Please select an image');
		return false;
	}
	if (
	theForm.date_1.checked == false &&
	theForm.date_2.checked == false &&
	theForm.date_3.checked == false &&
	theForm.date_4.checked == false &&
	theForm.date_5.checked == false &&
	theForm.date_6.checked == false &&
	theForm.date_7.checked == false) 
    	{
		alert ('Please select at least one Weekly Frequency');
		return false;
	} 
    
	if(
	theForm.day_1.checked == false &&
	theForm.day_2.checked == false &&
	theForm.day_3.checked == false)
	{
	        if(
	        theForm.other.checked == true && 
	        theForm.other_text.value.length <= 0)
	        {
	            alert ('Please enter a Daily Frequency')
	            return false;
        	        }
        
	        if(
	        theForm.other.checked == true && 
	        theForm.other_text.value.length > 0)
	        {
	            return true;
	        }

	        alert ('Please select a Daily Frequency')
	        return false;
	} 
    
	return true;
}

function setReminder(dropdownFreq, theFreq, intervVar)
{
    
    var title = document.getElementById('title').value;
    var hour = 3600000;
    var intervVar = -1;

    //intervVar is the number that setInterval is currently at, used to pause the timer on the notification if notifications are turned off
    if(intervVar !== null){
        window.clearInterval(intervVar);
    }            

    if(theFreq >= 1 && theFreq <= 12 || theFreq == 24){
        intervVar = window.setInterval(function(){createNotification(title);}, theFreq*hour);
    }

    return intervVar;
        
}

function createNotification(title) {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
        }

        else if (Notification.permission === "granted") {
                var text = 'Hey, remember to complete your habit "' + title + '"!';
                var notification = new Notification('Habit Reminder', { body: text });
        }

        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                if(!("permission" in Notification)) {
                    Notification.permission = permission;
                }

                if (permission === "granted") {
                        var text = 'Hey, remember to complete habit "' + title + '"!';
                        var notification = new Notification('Habit Reminder', { body: text });
                }
            });
        }

    }