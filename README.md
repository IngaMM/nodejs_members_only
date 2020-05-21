MEMBERS ONLY (CLUBHOUSE)

By I. Mahle

A project of The Odin Project: https://www.theodinproject.com/courses/nodejs/lessons/members-only

Instructions

1. Save all files in a folder
2. Run npm install
3. Run npm start
4. Open http://localhost:3000/ in a browser

To populate the database: see instructions in populatedb.js

Discussion
I used the following technologies: NodeJS, HTML, CSS.

This app is an exclusive clubhouse where members can write posts. Inside the clubhouse, i.e. when logged in, members can see who the author of a post is but people from the outside can only see the story and wonder who wrote it. The implementation is done with NodeJS/Express. Data are stored in a MongoDB-database. The app uses the Passport module for authentication. When a user signs up, he/she is not automatically given membership status. The user needs to enter a secret passcode (jointheclub) correctly to become a member. Only admins (admin status is given at sign-up) who are also members can delete messages. For the views pug-templates with Bootstrap and grids are used. The app is fully responsive and can be viewed on screens of all sizes. To log in you can create a personal account or use these data: username: user1@test.org, password: foobar.

A live version of this app can be found at https://clubhouse22.herokuapp.com

Requirements
npm

Background image by Ricardo Gomez Angel on https://unsplash.com
