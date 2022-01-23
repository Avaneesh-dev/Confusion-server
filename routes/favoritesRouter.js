const express = require('express');
const bodyParser = require('body-parser');
const favoritesRouter = express.Router();
const mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');

favoritesRouter.use(bodyParser.json());
favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
    .get(cors.cors, authenticate.verifyUser, (req,res,next)=> {
        Favorites.find({user: {_id:req.user._id}})
            .populate('user')
            .populate('dishes')
            .then((favorites)=> {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
            }, (err)=> next(err))
            .catch((err)=> next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
         Favorites.find({user: {_id:req.user._id}})
             .then((favorite) => {
                 if(favorite.length === 0) {
                     Favorites.create({user:req.user._id, dishes: req.body})
                         .then((favorites)=> {
                             res.statusCode = 200;
                             res.setHeader('Content-Type', 'application/json');
                             res.json(favorites);
                         }, (err)=> next(err))
                         .catch((err)=> next(err));
                 }
                 else {/* dot to access inside object and [] to access
                 inside array, the number is index of element */
                     for(let i=0; i<req.body.length; i++){
                         if (favorite.dishes.indexOf(req.body[i]._id)<0){
                         favorite[0].dishes.push(req.body[i]._id);}
                     }
                     favorite[0].save()
                         .then((favorite) => {
                             Favorites.find({user: req.user._id})
                                 .then((favorites) => {
                                     res.statusCode = 200;
                                     res.setHeader('Content-Type', 'application/json');
                                     res.json(favorites);
                                 });
                         }, (err) => next(err));
                 }
             }, (err) => next(err))
             .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
        Favorites.find({user: {_id:req.user._id}})
            .then((favorites) => {
                favorites.remove({})
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            })
    });

favoritesRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
        Favorites.find({user: {_id:req.user._id}})
            .then((favorite) => {
                if(favorite.length === 0) {
                    Favorites.create({user:req.user._id, dishes: req.body})
                        .then((favorites)=> {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        }, (err)=> next(err))
                        .catch((err)=> next(err));
                }
                else {/* dot to access inside object and [] to access
                 inside array, the number is index of element */
                    if (favorite[0].dishes.indexOf(req.params.dishId)<0){
                        favorite[0].dishes.push(req.params.dishId);}
                    favorite[0].save()
                        .then((favorite) => {
                            Favorites.find({user: req.user._id})
                                .then((favorites) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorites);
                                });
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({user: {_id:req.user._id}})
            .then((favorite) => {
                const index = favorite[0].dishes.indexOf(req.params.dishId);
                if (index>-1) {
                    favorite[0].dishes.splice(index,1);
                }
                favorite[0].save()
                    .then((favorite) => {
                        Favorites.find({user: req.user._id})
                            .then((favorites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            });
                    }, (err) => next(err));
            })
    });

module.exports = favoritesRouter;