# study-hall
A front-end UI for event creation/management using Angular 1.5.x and Leaflet Maps

---

### This application is one part of two. The backend (php and mySQL) was entirely completed by the co-developer, Jorge Rodriguez. The repo can be found here: https://github.com/jitorodriguez/EventNote

### The application can perform the following functionality:

* Create, Edit, Delete, and Select specific events either individually or in list form.

* User is able to edit the geolocation of an event by clicking to move the map marker.

* Events can either be public, private, or specifically run by a Registered Student Organization (RSO).

* A user with the role of Super Admin is able to accept and reject events. If an event is not accepted, a regular user can't see the event. Super Admins can only reject; they can't delete an event.

* All events seen in list form have an accompanying map on the right side that shows their locations. The public, private, and both, filter will clear and repopulate the map on the spot.

* An event page can have comments by users with access to that event. The comment creator can edit and delete, as well. For any given event, each user can only add one comment.

* A user can create an RSO group, edit, delete, or view it.

* The creator of an RSO group is able to create events attached to that RSO group. They can edit and delete those events.

* Due to design choices, Super Admin has no access to the RSO groups or events. They are not censored like public and private events.
