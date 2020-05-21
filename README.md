MEMBERS ONLY

By I. Mahle

A project of The Odin Project: https://www.theodinproject.com/courses/nodejs/lessons/members-only

Instructions

1. Save all files in a folder
2. Run npm install
3. Run npm start
4. Open http://localhost:3000/ in a browser

To populate the database: see instructions in populatedb.js

Discussion
I used the following technologies: HTML, Javascript & Mongodb & Nodejs (Express).

This app is an exclusive clubhouse where members can write posts. Inside the clubhouse (when logged in), members can see who the author of a post is but people from the outside can only see the story and wonder who wrote it.
The app uses authentication with passport. When a user signs up, he/she is not automatically given membership status. The user needs to enter a secret passcode (jointheclub) correctly in order to become a member. Only admins (admin status given at sign up) can delete messages. For the views pug-templates with bootstrap and grids are used. The app is fully responsive and can be viewed on screens of all sizes.

A live version of this app can be found at https://mighty-dusk-67107.herokuapp.com

Requirements
npm

Background image by Ricardo Gomez Angel on https://unsplash.com
