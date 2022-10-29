const express = require('express');
const cors  = require('cors');
const { comment, appEvents } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils')

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    app.use(express.urlencoded({
    extended: true
}));

    //api
    // appEvents(app);

    const channel = await CreateChannel()

    
    comment(app, channel); 
    
    // error handling
    
}
