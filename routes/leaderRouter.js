const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((request,response,next)=> {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((request,response,next)=> {
        response.end('Will send all leaders to you!');
    })
    .post((request,response,next)=> {
        response.end('Adding the leader with name '+request.body.name+' and details: '+request.body.description);
    })
    .put((req,res,next)=>{
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req,res,next)=>{
        res.end('Deleting all the leaders');
    });

leaderRouter.route('/:leaderId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leader/'+ req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write('Updating the leader: ' + req.params.leaderId);
        res.end('\nWill update the leader: '+req.body.name+' with details: '+ req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader with ID: '+req.params.leaderId);
    });

module.exports = leaderRouter;