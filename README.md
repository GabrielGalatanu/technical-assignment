# technical-assignment

## Description

Real time chat application using Node.js, Express.js, Socket.io and React.js. Users have to create an account and login to use the chat application. The application has a simple UI that allows users to send messages to each other in real time. The application also has a feature that allows users to create groups and edit their profile.

## Installation

1. Navigate to both the frontend and backend folders and run "npm install" to install all dependencies.
2. Create a MySQL database and update the config file in the backend folder with your database credentials.
3. In the backend folder, run "npx sequelize-cli db:migrate" to create the tables in the database.
4. Start both the frontend and backend servers by running "npm run start" in both folders.