
# Technical Specification

**Authors:** Anisa Hoxha - 21413586, Zara Purewal - 21404176

## 0. Table of Contents

- [Technical Specification](#technical-specification)
- [0. Table of Contents](#0-table-of-contents)
- [1. Introduction](#1-introduction)
  - [1.1 Overview](#11-overview)
  - [1.2 Glossary](#12-glossary)
- [2. System Architecture](#2-system-architecture)
- [3. High-Level Design](#3-high-level-design)
  - [3.1 Use case Diagram](#31-use-case-diagram)
  - [3.2 Sequence diagram for logging in](#32-sequence-diagram-for-logging-in)
  - [3.3 Sequence Diagram for Plant Identification Tool](#33-sequence-diagram-for-plant-identification-tool)
  - [3.4 Sequence Diagram for Plant Welfare Assessment Tool](#34-sequence-diagram-for-plant-welfare-assessment-tool)
  - [3.5 Sequence Diagram for Creating Virtual Garden Planner Tool](#35-sequence-diagram-for-creating-virtual-garden-planner-tool)
- [4. Problems and Resolution](#4-problems-and-resolution)
  - [4.1 PlantID does not provide care instructions when identifying plants](#41-plantid-does-not-provide-care-instructions-when-identifying-plants)
  - [4.2 Minizinc not working with node.js](#42-minizinc-not-working-with-nodejs)
  -[4.3 Tracking User Through App](#43-Tracking-User-Through-App)
  -[4.4 Ensuring Different Elements Could Be Sent To Database](44-Ensuring-Different-Elements-Could-Be-Sent-To-Database)
- [5. Testing and Validation](#5-testing-and-validation)
  - [5.1 User Testing ](#51-user-testing-us)
  - [5.2 Machine learning threshold validation](#52-machine-learning-threshold-validation)
  - [5.3 MiniZinc Satisfiability Validation](#53-minizinc-satisfiability-validation)
  - [5.4 Form validation](#54-form-validation)
  - [5.5 Login session cookie testing](#55-login-session-cookie-testing)
  - [5.6 Unit Testing](#56-unit-testing)
- [6. Design](#6-design)
  - [6.1 Garden Planner UI:](#61-garden-planner-ui)
  - [6.2 Consistent Design:](#62-consistent-design)
  - [6.3 CSS and Bootstrap:](#63-css-and-bootstrap)
  - [6.4 Intuitive Design:](#64-intuitive-design)
- [7. Installation Guide](#7-installation-guide)
  - [Prerequisites:](#prerequisites)
- [8. Resources](#8-resources)
  - [8.1 Learning Resources](#81-learning-resources)
  - [8.2 Referential Resources](#82-referential-resources)
- [9. Appendices](#9-appendices)


## 1. Introduction

### 1.1 Overview

GardenLab is a garden planning assistance website. It has three main features; A virtual garden planner, a plant identification section, and a plant health assessment section.
The virtual garden planner requires users to choose the width and length of their garden, and then drag and drop images of plants onto the garden grid to represent where they want the plant to go. The dimension of the garden is relative to inputted width and height.
The plant identification and the plant assessment sections work in a similar fashion. Users can upload an image of a plant that they have saved locally, to either identify the plant or assess the health of the plant.
Plant identification returns images of similar plants, name of similar plants and probability that the suggested plant is correct. Users can click on the name of the plant which will bring up a google search that will provide care instructions of the plant.
Plant assessment returns images of possible things wrong with the plant, along with the name of the ailment and a probability that the suggestion is correct. Below each image is a set of treatments ranging from chemical treatment, biological treatments and preventative measures.


### 1.2 Glossary

- **node.js**: A javascript environment used to build our application.
- **express.js**: A node.js web application framework.
- **Constraint satisfaction engine**: A computational tool that efficiently finds solutions to constraint satisfaction problems.
- **MiniZinc**: A constraint satisfaction engine.
- **Multer**: A node.js middleware for handling multipart/form-data.
- **Axios**: A promise-based HTTP Client for node.js and the browser.
- **Dotenv**: A tool for managing environment variables in Node.js projects.
- **MongoDB**: The database used for this project.
- **PlantID API**: A plant and plant diseases machine learning API tool.
- **bycrypt**: A library used to hash passwords.
- **jest**: Testing framework for unit testing.
- **DOM**: Document Object Model.
- **JsDOM**: JavaScript implementation of many web standards.
- **.dzn file**: A data file compatible with MiniZinc.

## 2. System Architecture

![system](diagrams/System%20Architecture%20Diagram.png)

The system architecture is composed of three primary components: theGardenLab web app, the GardenLab database, and external API’s (Plant.id API). These components are interdependent, with at least two components continually interacting with each other.

When the user attempts to login on the GardenLab web interface, the web app sends the user's login credentials to the database. The details are then authenticated and if successful allow the user to access the rest of the web app.

The plant identification feature can be used to identify plants and provide care instructions. The user uploads a photo of the plant to the web app and the Plant.id API returns the name and care instructions of the plant.

Similarly, the plant well-being feature requires the user to upload a picture of the plant to the app, and the API provides a “healthy” diagnosis, or provides care instructions for the plant if it has any ailments.


One of the features a user can access is the virtual garden planner. The user fills in a form detailing the number of plants they want, their garden soil type and shade level of the garden. This information is saved in a .dzn file and can be run externally with minizinc.

While the constraint satisfaction engine couldn’t be successfully integrated with nodejs, we still allow for users to plan their gardens and drag and drop plants onto their garden grid. There is no constraint as to which plant they can choose from the array. 


## 3. High-Level Design

### 3.1 Use case Diagram

![use](diagrams/usecase.png)
The above use case diagram describes the main actors and their main interactions in Garden Lab. Below is a series of sequence diagrams that describe these interactions in depth.

### 3.2 Sequence diagram for logging in
![login](diagrams/loginSequenceDiagram.png)

The above sequence diagram is a standard diagram for logging into a web app. The user enters their details on the GardenLab login page, which are then sent to the GardenLab database. The database authenticates the data and, if successful, the user is redirected to the homepage. If unsuccessful, the user is asked to try and input their details again.

### 3.3 Sequence Diagram for Plant Identification Tool
![plantid](diagrams/loginSequenceDiagram.png)

The above sequence diagram describes the process of using the plant identification feature on GardenLab. Initially, the user must upload an image that has been locally saved on their machine. They must then submit the form. The web app then temporarily saves the file in an uploads folder and turns the file into a readable data stream to send to the API. The image is then posted to the API, and the API sends a response back in a JSON format. The web app then renders the data onto a webpage and displays it to the user. Finally, the web app deletes the image that was temporarily stored in the uploads folder.

### 3.4 Sequence Diagram for Plant Welfare Assessment Tool
![health](diagrams/plantHealthSeqDiagram.png)

The process of using the plant welfare assessment tool is very similar to the previous plant identification tool. The only difference is that the user must upload their image in a different form on a different page of the web app.


### 3.5 Sequence Diagram for Creating Virtual Garden Planner Tool
![create](diagrams/createGardenSeqDiagram.png)

The above diagram describes the process of creating a virtual garden on GardenLab. First the user must send a request to create a garden, along with some data such as types of plants the user may want and the orientation of the garden. The app saves the data in a .dzn file to be used externally with MiniZinc.

Once the user has chosen the dimensions of their garden, they may then modify the layout by dragging and dropping elements until they are satisfied. They must then save the garden in order to be able to access it on future logins.


## 4. Problems and Resolution

### 4.1 PlantID does not provide care instructions when identifying plants

When posting an image to the PlantID API, the json response does not contain any care information about the plant identified. There is also no other endpoint that provides care info, as its main two functionalities are identify and assess health. A work around for this is that clicking the name of a suggested match will send users to a google search, like “ 'plant name' care instructions”.


### 4.2 Minizinc not working with node.js

We wanted to use MiniZinc (a constraint satisfaction engine), to provide users with a list of plants that would be suitable due to the conditions of their garden. Initially we just wanted to allow users to choose the number of different plants they would like to have, and the type of solid and level of shade of their garden, with the plan to add more constraints later (such as hardiness level and watering level). While we did get a model with dummy data working, we could not integrate it with node.js. The only results we could ever get from it were an exit code of 1. We consulted the documentation, and reached out to our supervisor and other professors. MiniZinc is an open-source CSE, and has an online support group where developers can ask questions and get advice. We asked for help with this problem but got no response back from the online support group. 

Due to time constraints, we unfortunately could not find and implement another constraint satisfaction engine, without sacrificing quality from other features. Finally it was decided that for demonstration purposes, we would still take the information from the form, and demonstrate how this works in the MiniZinc IDE. We do still have a virtual garden feature, where users can drag and drop a plant on a spot in a virtual garden. However, the list of plants is not optimised for the garden using MiniZinc.

### 4.3 Tracking user through app

We realised we needed a way to be able to track a logged in user throughout the app. When a user logs in they need to be able to navigate away from the account login page to be able to save their virtual garden. In order to do this we had to implement a user session and use cookies to be able to uniquely identify a user and track them as they navigate through the app. We solved this by using passport.js, an authentication middleware, to be able to track users between pages so the virtual garden could be saved under their id. 

### 4.4 Ensuring different elements could be sent to database

We faced the problem of being able to send the garden grid to the database. As users can define their own unique inputs for the width and height of the garden, as well as placing different plant types onto the grid, we needed to be able to store this information efficiently and also be able to render the correct data on subsequent logins. 

There are a lot of moving parts to get this feature implemented correctly and at first we struggled to even send this data to the database. We managed to figure out what was going wrong by sending “CURL” requests to the database from the terminal and using console.logs at different points in the code to figure out what the issues could be.


## 5. Testing and Validation

### 5.1 User Testing

User testing was limited to the project team, with one person’s developments being tested by the other in the team. Some notable additions include the use of a title for the plant icons in the virtual garden planner. When testing, some plants were slightly difficult to distinguish. To remedy this, we include a title for each image that is displayed when the user hovers the mouse over the image. Below is an example of this.

![testing](diagrams/usertestingexample1.jpg)

Another example is that we ensured that every link and button changed its appearance in some way when the mouse is hovered over. For links, they will be underlined, and for buttons, the background colour will be darker in comparison. This was done using the pico.css framework, making sure that every element was labelled correctly in order for this to function.

We had originally had a user get rendered to the virtual garden page on login. Anisa suggested that we create a “hello” page so when the user logs in and clicks back to “account” they know they are already logged in.


### 5.2 Machine learning threshold validation

When using the PlantID API, the response could contain many possibilities for identification, each with their own probability score. We undertook threshold validation of the responses, in order to determine how many results to include. This was done by using 10 sample images where the name of the plant was known, and seeing how accurate the results were. 

From the results of this threshold testing, we found that the probability value itself was not a very reliable indicator itself. For example, the correct identification for a “tithonia” was given a probability of 82.3%, whereas the correct identification of “Echeveria colorata” was given a probability of only 21%.

However the results did find that 9/10 of the correct identifications were the first (i.e. highest probability) result given, whereas one correct identification was third in the list of suggestions. Given this result, in the results page, we only included a maximum of three suggestions from the API.

To avoid cluttering the technical specification, the images used for testings and the results can be found on the following google document: https://docs.google.com/document/d/1l2n45PIWELFxaPb76fZWLSR3JnMDVcZjpoEfhnUuFT8/edit?usp=sharing

### 5.3 MiniZinc Satisfiability Validation

For the moment, the data used by MiniZinc is hardcoded in a .dzn file. Due to the limited size of the data, we limited the number of plant suggestions that users can choose to a maximum of five. Any number greater than this is unsatisfiable.

### 5.4 Form validation

The user must create a unique username. “@” must be included in the email. Passwords must be secure, ie at least 8 in length, capital letter, symbols or console recommendation pops up.
Required fields in forms,  including when uploading an image for the plant identification and plant welfare tool, must be filled before submitting the form.


### 5.5 Login session cookie testing

When a user logs in, the password they input is hashed with bycrypt and compared to the previously hashed password in the database. We first ensured the user was logged in by using jwt to generate a token for the user if they had successfully logged in. If that is successful a user session is started using cookies to track the user while they are logged in.

### 5.6 Unit Testing

We used jest as our testing framework and JSDOM to simulate the DOM environment in Node.js. We tested our javascript functions to ensure that they behaved as expected.

## 6. Design

There are a number of UX/UI design principles that we followed in order to create an easy to navigate web app.

### 6.1 Garden Planner UI

Visual hierarchy on this page of first the grid where plants are to be dragged and dropped onto. The plants are located just under the grid for ease of access. The images were specifically selected to fit into a small 50px by 50px ratio. The plants are designed to be icons, so they are simple and their prominent features are emphasised for design. The grid width and dimension boxes can either have a value inputted into them or toggles up or down.

### 6.2 Consistent Design

Throughout pages the same font type and size were used for cohesiveness between pages. The navbar at the top of the page is a useful tool found across all pages to guide the user. We ensured elements were not cluttered on pages and adequate whitespace was there.This consistent minimalistic design allows for ease of user interaction.

### 6.3 CSS and Bootstrap

We used the pico2 css framework to ensure attractive style throughout the application. For certain elements such as the garden planner grid we needed to implement our own style rules so the grid would format nicely. This was put in our custom stylesheet.css so that grid cells did not separate. We used bootstrap in the plant identification results and plant welfare results page so that the suggestions are grouped in cards and rendered beside each other with a grey border for each item.

### 6.4 Intuitive Design

The app is designed in a way that should be intuitive to your average user. This app is not aimed for a technical audience so it should have an ease of navigation at the core of its design. The user should find it easy to understand the app, the design will act as a guide to make the flow through the app cohesive. 


## 7. Installation Guide

### Prerequisites:

Before beginning the installation of GardenLab, ensure you have the following:

An up-to-date web browser and stable internet connection
A text editor of your choice (e.g. Visual Studio Code)
Access to a command-line terminal
Node.js installed on your system (v20.11.1 is latest)
Git for version control

- Go to the git repository https://gitlab.computing.dcu.ie/purewaz2/2024-ca326-gardenlab and copy this link
- Run “git clone https://gitlab.computing.dcu.ie/purewaz2/2024-ca326-gardenlab” in your terminal to download the project files
- Navigate to the directory where the package.json file is in order to install dependencies for the project “cd 2024-ca326-gardenlab/code/gardenlab/backend”
- Run “npm install” in the terminal, packages will begin downloading.
- Install MongoDB from the MongoDB website and create an Atlas account
- Connect this database to this server through your unique connection string. Save this in your own .env file like so. MONGODB_URI=mongodb+srv://zarapurewal2:zara@cluster.4ixllyf.mongodb.net/
- Ensure you have added your current IP address to the project in MongoDB Atlas “network” section.
- For PlantID and plant disease features to work you will need to sign up for an API key on https://plant.id/
- Put this key in your .env file located in the backend folder. PLANTID_API_KEY = byC6XX9DWgaBYohdr914G3G1vaSWkka3YqQAOYKjqETlnQANEw
- Add your own text for secret to hash passwords in Database properly “secret=for hashing passwords”
- Run “npm start” in terminal
- Open up your web browser and go to http://localhost:3000 and the web app will load up

## 8. Resources

### 8.1 Learning Resources

The following resources have been used as learning materials over the course of this project

-   <https://www.minizinc.org/doc-2.8.2/en/part_2_tutorial.html> - Tutorial of all major aspects of modelling in MiniZinc, as well as practice exercises.

-   <https://www.youtube.com/playlist?list=PLj8827bRIwAuv2ZEaqaaZxddSXiMb2dML> - a series of online lectures and practice exercises on modelling in MiniZinc

-   <https://www.youtube.com/watch?v=rT1g_hLs_5A> - Online lecture about enumerated types in MiniZinc

-   <https://people.eng.unimelb.edu.au/pstuckey/papers/cpaior-typex.pdf> - "Enumerated Types and Type Extensions for MiniZinc" - Lecture notes from Monash University, Melbourne, Australia


### 7.2 Referential Resources

The following sources were used as references  for different parts of the project 

-   <https://plant.id/docs> -  API used for Plant Identification Tool and Plant Welfare Assessment Tool.

-   <https://expressjs.com/>  - Used as a reference for routing using the express framework for node.js.

-   <https://copyprogramming.com/howto/how-to-post-form-data-using-axios-in-node>  - Used as a reference when using axios to post form data.

-   <https://expressjs.com/en/resources/middleware/multer.html> - Used as a reference for using multer to process image files in form data when posting to an API.

-   <https://www.mickpatterson.com.au/blog/how-to-use-environment-variables-in-nodejs-with-express-and-dotenv> - Used as a reference for using dotenv to use custom environment variables

-   <https://js.minizinc.dev/docs/stable/modules.html> - Used as a reference for the MiniZinc Javascript module for nodejs

-   <https://github.com/MiniZinc/minizinc-js/blob/develop/types/index.d.ts> - Used as a reference for the MiniZinc Javascript module for nodejs

-   <https://www.tutorialspoint.com/how-to-allow-only-positive-numbers-in-the-input-number-type#:~:text=To%20sum%20it%20up%2C%20the,numbers%20in%20the%20input%20field>. - Only positive numbers allowed in a form, used for virtual garden planner 

-   <https://stackoverflow.com/questions/48808077/staying-logged-in-after-logging-out-with-express-and-mongodb>  - passport and sessions

-   <https://stackoverflow.com/questions/43492717/how-to-keep-user-logged-in-even-after-reloading-the-main-file-index-js> - also passport and sessions

-   <https://www.passportjs.org/concepts/authentication/sessions/> - helpful guide for passport sessions

-   <https://medium.com/geekculture/web-based-multi-screen-apps-including-drag-drop-5e161da6507b>  - Reference for drag and drop functionalities in virtual garden

-   <https://www.mongodb.com/docs/drivers/node/v4.1/>  - step by step guide how to use mongodb with nodejs

-   <https://www.mindbowser.com/login-form-using-node-js-and-mongodb/>  - login form sample

-   <https://www.bezkoder.com/node-js-express-login-mongodb/>  - node with mongo db sample guide

-   <https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/>  - using mongo with passport for form registation

## 8. Appendices

### Code for plantuml diagrams

Use case Diagram

@startuml
left to right direction
actor User as user
actor MongoDB as db
actor PlantID as api

package GardenLab {
usecase "Log into account" as login
usecase "Create Garden" as creategard
usecase "Modify Garden" as modgard
usecase "Save Garden" as savegard
usecase "Retrieve Garden" as retrievegard

usecase "Identify plant" as idplant
usecase "Check Plant Wellbeing" as checkplant
usecase "authenticate" as authenticate
usecase "Return result" as returnresults

}

user --> login
user --> creategard
user --> idplant
user --> checkplant
modgard <. creategard : <<precedes>>
creategard .> retrievegard : <<precedes>>
authenticate <-- db
login -- authenticate
savegard <-- db
modgard -- savegard
returnresults <-- api
idplant -- returnresults
checkplant -- returnresults


@enduml


----------------------------------------------


Login sequence diagram

@startuml

actor User as user
participant GardenLab as gl
database Server as server

user -> gl : Login Request
activate gl
gl -> server : Send user login info
activate server
server -> server : Authenticate user info


alt if successful login
   server --> gl: Login successful
   gl -> user : Display homepage
else
   server --> gl : Login unsuccessful
   deactivate server
   gl -> user : Redirect to log in page
   deactivate gl
   end

@enduml
----------------------------------------------
For plant identification tool

@startuml
actor User as user
participant GardenLab as gl
participant "PlantID API" as api
user ->> gl : Upload locally saved image\nto the plant identication form
user -> gl : Submit form
activate gl
gl ->> gl : Saves the image file in\na temporary uploads/ folder
gl ->> gl : Creates readable data\nstream to send to API
gl -> api : Posts image to API
activate api
api --> gl : Returns Json data
deactivate api
gl --> user : Renders data on a webpage
gl -> gl : Delete image file in temporary folder
deactivate gl
@enduml

-----------------------------------------------

For plant welfare assessment tool

@startuml
actor User as user
participant GardenLab as gl
participant "PlantID API" as api
user ->> gl : Upload locally saved image\nto the plant welfare assessment form
user -> gl : Submit form
activate gl
gl ->> gl : Saves the image file in\na temporary uploads/ folder
gl ->> gl : Creates readable data\nstream to send to API
gl -> api : Posts image to API
activate api
api --> gl : Returns Json data
deactivate api
gl --> user : Renders data on a webpage
gl -> gl : Delete image file in temporary folder
deactivate gl
@enduml

-----------------------------------------------

Sequence diagram for creating virtual garden

@startuml

actor User as user
participant GardenLab as gl
database MongoDB as db

ref over user, gl, db : Log in

user -> gl : Navigate to Virtual Garden page
activate gl
gl --> user : Display form
user -> gl : Input form info
gl ->> gl : Save form info to .dzn file
gl --> user : Display empty virtual garden
user -> gl : Input desired width and length of garden
gl --> user : Update page to display new garden size
loop until user satisfied with layout
user -> gl : Drag and drop image of plant\non desired location in garden
gl -->user : Update page to display changes
end
user -> gl : Press save garden button
gl -> db : Save garden to user's database
activate db
db --> gl : Confirm save
deactivate db
gl --> user : Confirm save
deactivate gl



@enduml

