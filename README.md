USER ACCESS APP


API

- REST API With Nestjs
- Swagger documentation, nextjs logger, ...
- Folder Structure, Code Samples

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have these components on your local machine:

- An up-to-date release of [NodeJS](https://nodejs.org/) and YARN
- A SQL database with TYPEORM npm install --save typeorm mysql2 (https://docs.nestjs.com/recipes/sql-typeorm#sql-typeorm)

### 1.2 Project configuration

Start by cloning this project on your local machine.

``` sh
git clone https://github.com/omowonuola/feedelventures.git
yarn add to install dependencies
NOTE: The Main branch is the update branch for the codebase

The server is hosted here: https://allwelluserservice.herokuapp.com/
The client is hosted here: https://omowonuola.github.io/allwellclient
```
RUN WITH DOCKER

The server project is dockerized, you can run it through the docker-compose file has the necessary environment variables
```sh
# Launch the development server with docker

cd server(To run the server application)
docker-compose up
cd client(To run the client application)
```
RUN WITH SERVER

The next step will be to install all the dependencies of the project.

```sh
yarn install for the server and client folder seperately
```

For a standard development configuration, you can leave the default values for PORT, which has the default value of 8080.

### 1.3 Launch and discover with YARN

You are now ready to launch the NestJS application using the command below.

```sh

# Launch the client with npm command
yarn start

# Launch the development server with npm command
yarn run start:dev
```

You can now head to `https://allwelluserservice.herokuapp.com/api#/` and see the API Swagger docs. 
The example User API that gets allows user to signup is located at the `https://allwelluserservice.herokuapp.com/api#/UserController_signUp/` endpoint in the swagger documentation.

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── mail
│   ├── mail.modules.ts # The mail module file contains the import of the mailerService
│   ├── nodemailer.service.ts/  # The nodemailer file contains the implementation of the nodemailer for sending emails to users
├── dto
│   ├── change-password.dto.ts # The file contains the DTO for changing password process
|   ├── forgot-password.dto.ts # The file contains the DTO for the forgot password process
├── users
│   ├── user.controller.ts # The file for the websocket implementation
|   ├── user.entity.ts # The entity file contains the data model, structure and type for the authentication process, it references to the mysql database
|   ├── users.module.ts
|   ├── users.repository.ts # The repository file for the authentication references the database by running queries directly to the database
|   ├── users.service.ts # The service file has the user signup, signin, forgot password and reset password function which references the repository file
|   ├── user-decorator.ts
|   ├── jwt-passport.ts
|   ├── jwt-payload.ts
├──docker-compose.yaml # The docker directory that house the services and the docker environmental variables.
├──dockerfile # The dockerfile that has the ports and the command to run the application.
└── main.ts
```

## 3. Default NPM commands

The YARN commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using yarn NodeJS in development
yarn run start:dev (use this to start the application locally)

# Run the project' unit tests
yarn run test:watch(use this to start the unit testing locally)
```

## 4. Docker Command

The docker commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using npm NodeJS in development
docker-compose up

The docker configuration is in the docker-compose.yaml file

```


## 5. Project goals

The goal of this project is to build a user access flow that connects to the database using NestJS.

