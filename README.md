# Hackathon

## The Pitch
Coming into CSUMB or the community at large, it can be hard finding out services/operations that help the community.
It can be hard finding local centers that accept donations, or what places accept specific goods.
This web app tries to simplifiy this by givin the user to tag-based search to find what places they can donate to.

This app also aims to give helpful services more recognition by providing all relevant details to those who want to help.

## Coding Languages and Libraries
* Javascript (Node js)
  * Basically backend web development javascript
  * mjs files are just js files that are marked as "modules"
    * TLDR, they just make it clear that the js file is a module (js modules and nodejs projects different than classic js)
* HTML + EJS(Package)
  * ejs is a templating language, its just html with javascript inserts to dynamically create html content
* Express JS(Package)
  * Express is a node package that simplifies the server related aspects to backend js development
  * Responsible for the ___app.get___ and ___app.render___ aspects of our mjs file
  * Allows the easy use of partials too
* Dotenv (Package)
  * Allows process variables to be easily passed into server
  * Typically static and constant information is stored in here, good for security related reasons too

## Core Functions
* Home page displays stats or example search results
* Search page that allows user to select product/item to donate
  * Products are preset and static for our purposes
* Once searched, should include all contact info + Location
  * Location could be provided through google link/embed
* (Optional) Provide Page that gives info on where to get resources
  * Inverse of donation search function but has similar amount of info
