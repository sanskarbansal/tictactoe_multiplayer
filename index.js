const express = require('express');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 5500;
const server = express()
    .set('view engine', 'ejs')
    .set('views', './views')
    .use(expressLayout)
    .set('layout extractStyles', true)
    .set('layout extractScripts', true)


    .use(express.static('./assets'))
    .use('/', require('./routes/index.js'))

    // socketServer.listen(3000); 
    .listen(PORT, (err) => {
        if (err) {
            console.log("Error occured while starting the server(index.js)......... ");
            return;
        }
        console.log("Server started successfully on port : ", PORT);
    });

const wss = require('./config/socket_config')(server); 