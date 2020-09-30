const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id})
    .then((favorites) => {
        if(favorites === null){
            Favorites.create({ user: req.user._id,dishes: req.body})
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites);
                
            },(err) => next(err))
            .catch((err) => next(err));
        }else{
            var data = req.body;

            data.forEach(function (item) {
                if(favorites.dishes.indexOf(item._id) === -1){
                    favorites.dishes.push(item._id);
                }
            });
            favorites.save()
            .then((favorites) => {
                Favorites.findById(favorites._id)
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                })
            },(err) => next(err));  

        }
    },(err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id})
    .then((favorites) => {
        if(favorites.dishes.indexOf(req.params.dishId) === -1){
            favorites.dishes.push(req.params.dishId);
        }else{
            err = new Error('Dish ' + req.params.dishId + ' is already in your favorites list');
            err.status = 404;
            return next(err);
        }   
        favorites.save()
        .then((favorites) => {
            Favorites.findById(favorites._id)
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites);
            })
        },(err) => next(err)); 
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id})
    .then((favorites) => {
        if(favorites.dishes.indexOf(req.params.dishId) !== -1){
            favorites.dishes.remove(req.params.dishId);
        }else{
            err = new Error('Dish ' + req.params.dishId + ' is not in your favorites list');
            err.status = 404;
            return next(err);
        } 
        favorites.save()
        .then((favorites) => {
            Favorites.findById(favorites._id)
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites);
            })
        },(err) => next(err)); 
    },(err) => next(err))
    .catch((err) => next(err));
})
module.exports = favoriteRouter;
/* "_id": "5f73eaf2f72d9316648f6447", "_id": "5f73eb21f72d9316648f6448", "_id": "5f73ead7f72d9316648f6446"
"_id": "5f73ea9ef72d9316648f6445" */