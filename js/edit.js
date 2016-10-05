ref = new Firebase('https://burning-inferno-2190.firebaseio.com');

var image;

function editHabit() {
	
	var title = document.getElementById('title').value;
	var img_src = image.getAttribute('src');
	var checkboxes = document.getElementsByName('date');
	var days = [];
             var dropFreq = document.getElementById("freqDropdown");
             var selectedFreq = dropFreq.options[dropFreq.selectedIndex].value;

	for (var i=0, n=checkboxes.length;i<n;i++) 
            {
                if (checkboxes[i].checked) 
                {
                    days.push(checkboxes[i].value);
                }
	}
	var freq = 0;
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
	
	habitRef = ref.child("habits");
    var d = new Date();
    var t = d.getDay();

    var intervalVar = setReminder(dropFreq, selectedFreq, intervalVar);

	habitRef.child(window.location.hash.substring(1)).update({image: img_src, weekdays: days, frequency: freq, completed: 0, total: 0, daily: 0, lastClicked: t, lastCompleted: t, useremail: authemail, habit: title, notificationFreq: selectedFreq, invervalTimeVar: intervalVar });
}