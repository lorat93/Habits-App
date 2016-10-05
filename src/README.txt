README
HW4 MyPlate

Alexandra Huang
Lora Tam
Andre Le
Michio Takemoto

Lora -  Add/Edit habit should provide at least basic validation that required 	items are provided.
	Delete Habit should have confirmation popup
	Try to Guard against bad items/XSS(cosmetic)

Alexandra- Notifications linked to update of habits (using the Web Notifications API, which is not supported by IE but is supported by Chrome, Safari, and Firefox). 

Andre- CRUD functionality, UI focused JavaScript

Michio- Setting up/linking to Firebase, some of the CRUD functionality 

Note about notifications:
Once a habit is updated by clicking the checkmark, the function createNotification will be called, the user will then be asked for permission to receive notifications, and if granted, the notifications will be turned on. Notifications will be created at an even time interval throughout the day (i.e. if frequency of the habit is 3, the notifications will be sent out every 8 hours.). (Right now the notifications may not be fully functional--tried using setInterval() to run createNotification every hour or so to check to see if the time matches when the notification should go out, but this slows everything down quite a bit, so it is commented it out.) Ended up using Web Notifications because it is supported by most of the browsers and thus does not require including any new libraries. Web Notifications is also usable on mobile devices.
