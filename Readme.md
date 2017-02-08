A MERN stack template

react-router-redux template for quick development

_________________________________________________________________
|
Steps:
    |
    |  ---->
            |
            at the root directory, create a config.js file with the following....

                  module.exports = {
                    secret: 'secretKeyGoesHere'
                  }
    _________________________________________________________________
    |
    |  ---->
            | run the following commands at root
            -->
              |in one terminal, start up a mongodb server
               > mongod

              | in another terminal
               > npm install
               > webpack -d --watch       -|- bundles/transpiles the src files  
               > npm start or nodemon

               by default, port is set to 3000

   _________________________________________________________________
   |
   |  ---->
           |
           Edit javscript files in the public/src directory
           Edit css in the public/stylesheets directory
           Do not edit directly in dist

   |
   _________________________________________________________________
