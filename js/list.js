var authemail = ref.getAuth().password.email;

function authCallback(authData){
				if (authData){
						//alert("User is logged in!"); 
						console.log("User is logged in!"); 
						//document.getElementById("loginformid").submit();
						//window.location="welcome.html";
				}
				else {	
						
						//alert("User is not logged in!"); 
						console.log("User is not logged in!"); 
						//ref.offAuth(authCallback);
						window.location="login.html";
				}
				
					
}
function showMsg(element){
    var msgElement1 = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
    msgElement1.style.visibility="visible";
}

function showMsg2(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message-notToday"))[0];
    msgElement.style.visibility="visible";
}

function deleteHabit(element, habitID){
    var box = confirm("Are you sure you want to delete this habit?");
    if(box == true) {
        var child = element.parentNode.parentNode;
        var parent = child.parentNode;
        parent.removeChild(child);
        
        var habit = ref.child("habits")
        habit.child(habitID).set(null);
    }
	mixpanel.track("Habit Deleted");
}

function loadHabits(){
        
    habit = ref.child("habits");
    
    habit.once("value", function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var userSnapshot = childSnapshot.child("useremail");
            var user = userSnapshot.val();
            
			if (user == authemail)
			{
				var titleSnapshot = childSnapshot.child("habit");
				var title = titleSnapshot.val();
				
				var imageSnapshot = childSnapshot.child("image");
				var image = imageSnapshot.val();
				
				var frequencySnapshot = childSnapshot.child("frequency");
				var frequency = frequencySnapshot.val();
				
				var completedSnapshot = childSnapshot.child("completed");
				var completed = completedSnapshot.val();
				
				var totalSnapshot = childSnapshot.child("total");
				var total = totalSnapshot.val();
				
				var dailySnapshot = childSnapshot.child("daily");
				var daily = dailySnapshot.val();
				
				var weekdaysSnapshot = childSnapshot.child("weekdays");
				var days = [];
				weekdaysSnapshot.forEach(function(daySnapshot){
					var day = daySnapshot.val();
					days.push(day);
				});
				
				var habitID = childSnapshot.key();
				
				var progress = daily/frequency * 150;
				
				document.getElementById("habit-list").innerHTML += 
				"<li>" +
				"    <ul class=\"habit-info\">" +
				"        <li><div class=\"habit-name\">" + title + "</div></li>" + 
				"        <li><img class=\"habit-icon\" src=\"" + image + "\" alt=\"habit icon\"></li>" + 
				"    </ul>" + 
				"    <div id=\"" + title + "\" class=\"message\">" + 
				"        <span class=\"message-total\">" + 
				"            <strong>" + completed + "</strong> days in a row! Best Record: <strong>" + total + "</strong><br>" +
				"            <svg height=\"25\" width=\"150\">" + 
				"                <line x1=\"0\" y1=\"0\" x2=\"" + progress + "\" y2=\"0\" style=\"stroke:rgba(65, 131, 215, 0.8);stroke-width:25\" />" +
				"                <line x1=\"" + progress + "\" y1=\"0\" x2=\"150\" y2=\"0\" style=\"stroke:rgba(171,171,171,0.6);stroke-width:25\" />" +
				"            </svg>" + 
				"        </span><br>" + 
				"        <span class=\"message-today\">Completed <strong>" + daily + "/" + frequency + "</strong> for today!</span><br>" + 
				"        <span class=\"message-notToday\">You did not have to do this today!</span>" + 
				"    </div>" +
				"    <div id=\"" + title + "buttons\" class=\"habit-op\">";
				
				var d = new Date();
				var t = d.getDay();
				
				var today = false;
				for(var i=0; i<days.length; i++)
				{
					if (days[i] == t)
					{
						today = true;
					}
				}
				
				if(today)
				{
					document.getElementById(title + "buttons").innerHTML += 
					"        <button type=\"button\" class=\"op op-done\" onclick=\"update(\'" + habitID + "\');showMsg(this);\" title=\"done\">" +
					"            <img src=\"../img/done.svg\" alt=\"Done\">" +
					"        </button>";
				}
				else
				{
					document.getElementById(title + "buttons").innerHTML += 
					"        <button type=\"button\" class=\"op op-done\" onclick=\"showMsg2(this);\" title=\"done\">" +
					"            <img src=\"../img/done.svg\" alt=\"Done\">" +
					"        </button>";
				}
				
				document.getElementById(title + "buttons").innerHTML += 
				"        <button type=\"button\" class=\"op op-edit\" onclick=\"location.href='edit.html#" + habitID + "\'\" title=\"edit habit\">" +
				"            <img src=\"../img/edit.svg\" alt=\"Edit\">" +
				"        </button>" +
				"        <button type=\"button\" class=\"op op-del\" onclick=\"deleteHabit(this,\'" + habitID + "\');\" title=\"delete habit\">" +
				"            <img src=\"../img/delete.svg\" alt=\"Del\">" +
				"        </button>" +
				"    </div>" +
				"</li>";
			}
        });
    });
 
	mixpanel.track("Habits Loaded");
}

function update(habitID, title){
    var URL="habits/"+habitID;
    var habit=ref.child(URL);
    
            habit.once("value", function(snapshot){
            var userSnapshot = snapshot.child("usrid");
            var user = userSnapshot.val();
            
            var titleSnapshot = snapshot.child("habit");
            var title = titleSnapshot.val();
            
            var imageSnapshot = snapshot.child("image");
            var img_src = imageSnapshot.val();
            
            var frequencySnapshot = snapshot.child("frequency");
            var freq = frequencySnapshot.val();
            
            var completedSnapshot = snapshot.child("completed");
            var complete = completedSnapshot.val();
            
            var totalSnapshot = snapshot.child("total");
            var highest = totalSnapshot.val();
            
            var dailySnapshot = snapshot.child("daily");
            var current = dailySnapshot.val();
            
            var lastClickedSnapshot = snapshot.child("lastClicked");
            var lastClicked = lastClickedSnapshot.val();
            
            var lastCompletedSnapshot = snapshot.child("lastCompleted");
            var lastCompletedVal = lastCompletedSnapshot.val();
            
            var weekdaysSnapshot = snapshot.child("weekdays");
            var days = [];
            weekdaysSnapshot.forEach(function(daySnapshot){
                var day = daySnapshot.val();
                days.push(day);
            });
            
            var d = new Date();
            var t = d.getDay();

			// Check if its a new day
			if(lastClicked != t) {
				// If it is then daily is reset
				current = 0;
			}

			// Increment Daily
			current = current + 1;

			if(current >= freq) {

				current = freq;
				// Index used keep track of lastCompletedVal
				var index;
				doneToday = true;
				// Get Index of today
				for(var i = 0; i < days.length;i++) {
					if(days[i] == t) {
						index = i;
					}
				}	
				// Set Index to end of array if we are at beginning of array
				if(index-1 < 0) {
					index = days.length;
				}

				// Check to see if Habit has been completed in its prev selected day
				if(complete == 0) {
					complete = complete + 1;
					lastCompletedVal = t;
				}
				else if(lastCompletedVal == days[index-1]) {
					// Increment days in a row
					complete = complete + 1;
					lastCompletedVal = t;					
				}
				else if(lastClicked != t) {
					complete = 0;
				}	
			}
			else{
				// Index used keep track of lastCompletedVal
				var index2;

				// Get Index of today
				for(var j = 0; j < days.length;j++) {
					if(days[j] == t) {
						index2 = j;
					}
				}	
				// Set Index to end of array if we are at beginning of array
				if(index2-1 < 0) {
					index2 = days.length;
				}
				if(lastClicked != t && lastCompletedVal != days[index2-1]) {
					complete = 0;
				}
			}
			
			// Update best Record	
			if(complete > highest) {
				highest = complete;
			}

            
            var progress = current/freq * 150;
            
        habit.set({image: img_src, weekdays: days, frequency: freq, completed: complete, total: highest, daily: current, lastClicked: t, lastCompleted: lastCompletedVal, useremail:authemail, habit: title });

        createNotification(title,d,freq);
        
        document.getElementById(title).innerHTML =
        "        <span class=\"message-total\">" + 
        "            <strong>" + complete + "</strong> days in a row! Best Record: <strong>" + highest + "</strong><br>" +
        "            <svg height=\"25\" width=\"150\">" + 
        "                <line x1=\"0\" y1=\"0\" x2=\"" + progress + "\" y2=\"0\" style=\"stroke:rgba(65, 131, 215, 0.8);stroke-width:25\" />" +
        "                <line x1=\"" + progress + "\" y1=\"0\" x2=\"150\" y2=\"0\" style=\"stroke:rgba(171,171,171,0.6);stroke-width:25\" />" +
        "            </svg>" + 
        "        </span><br>" + 
        "        <span class=\"message-today\">Completed <strong>" + current + "/" + freq + "</strong> for today!</span><br>" +
        "        <span class=\"message-notToday\">You did not have to do this today!</span>";
    });
	mixpanel.track("Habit Updated");
}