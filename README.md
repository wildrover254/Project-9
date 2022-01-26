# project-9
Treehouse Techdegree Project 9 - REST API

This is a simple REST API built using Express.

There are two models in the database, a User model and a Course model.

The User model denotes a firstName, lastName, a unique emailAddress and a hashed password.
The Course model requires a title and description with optional estimatedTime and materialsNeeded.
The models are associated, the User one-to-many and the Course one-to-one.

A seperate middleware function is imported to authenticate any current user. 

The API uses multiple routes to: 
  -Retrieve the current autheticated user
  -Add a new user
  -Retrieve a list of all courses and their associated user
  -Create a new course listing
  -Update a course listing
  -Delete a course listing
