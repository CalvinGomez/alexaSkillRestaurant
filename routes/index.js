var express = require('express');
var router = express.Router();
var helpers = require('../helpers/utilities');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all details of all restaurants. */
router.get('/restaurants', function(req, res, next) {
	var db = req.db;
    var collection = db.get('restaurant_test');
    var resp = []
	collection.find({},{},simpleCallback);

    function simpleCallback (e,docs) {
        if (helpers.isEmptyObject(docs)) {       
            resp.push({
                status: "failure", 
                err: "There is no such restaurant!"
            })
            res.json(resp); 
        }
        else {
            resp.push({
                status: "success", 
                err: "", 
                resp: docs
            })
            res.json(resp);
        }
    }
});

/* GET details of restaurant by name  */
router.get('/restaurant/:name', function(req, res, next) {
    var db = req.db;
    var collection = db.get('restaurant_test');
    var name = req.params.name;
    var resp = []
    collection.find({
        "name": name
    },{},simpleCallback);

    function simpleCallback (e,docs) {
        if (helpers.isEmptyObject(docs)) {       
            resp.push({
                status: "failure", 
                err: "There is no such restaurant!"
            })
            res.json(resp); 
        }
        else {
            resp.push({
                status: "success", 
                err: "", 
                resp: docs
            })
            res.json(resp);
        }
    }
});

/* GET details of all items. */
router.get('/items', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    var resp = []
    collection.find({},{},simpleCallback);

    function simpleCallback (e,docs) {
        if (helpers.isEmptyObject(docs)) {       
            resp.push({
                status: "failure", 
                err: "There is no such restaurant!"
            })
            res.json(resp); 
        }
        else {
            resp.push({
                status: "success", 
                err: "", 
                resp: docs
            })
            res.json(resp);
        }
    }
});

/* GET details of all items from specific restaurant. */
router.get('/items/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    var id = req.params.id;
    var resp = []
    collection.find({
        "restaurant_id": id
    },{},simpleCallback);

    function simpleCallback (e,docs) {
        if (helpers.isEmptyObject(docs)) {       
            resp.push({
                status: "failure", 
                err: "There is no such restaurant!"
            })
            res.json(resp); 
        }
        else {
            resp.push({
                status: "success", 
                err: "", 
                resp: docs
            })
            res.json(resp);
        }
    }
});

/* GET details of all items from specific restaurant for specific mealtype. */
router.get('/items/:name/:meal_type', function(req, res, next) {
    var db = req.db;
    var collectionRestaurant = db.get('restaurant_test');
    var collectionItem = db.get('items');
    var name = req.params.name;
    var meal_type = req.params.meal_type;
    var resp = []
    collectionRestaurant.find({
        "name": name
    },{},firstCallback);

    function firstCallback(e,docs) {
        if (helpers.isEmptyObject(docs)) {
            resp.push({
                status: "failure", 
                err: "Could not find restaurant!"
            })
            res.json(resp);
        }
        else {
            collectionItem.find({
                "restaurant_id": docs[0]._id.toString(),
                "meal_type": meal_type    
            },{},secondCallback);  
        }        
    }

    function secondCallback(e,docs) {
        if (helpers.isEmptyObject(docs)) {       
            resp.push({
                status: "failure", 
                err: "There is no such meal type!"
            })
            res.json(resp); 
        }
        else {
            resp.push({
                status: "success", 
                err: "", 
                resp: docs
            })
            res.json(resp);
        }
    }
});

/* GET details of all items from specific restaurant for specific mealtype. */
router.get('/items/:name/:meal_type/:diet_type', function(req, res, next) {
    var db = req.db;
    var collectionRestaurant = db.get('restaurant_test');
    var collectionItem = db.get('items');
    var name = req.params.name;
    var meal_type = req.params.meal_type;
    var diet_type = req.params.diet_type;
    var resp = []
    collectionRestaurant.find({
        "name": name
    },{},firstCallback);

    function firstCallback(e,docs) {
        if (helpers.isEmptyObject(docs)) {
            resp.push({
                status: "failure", 
                err: "Could not find restaurant!"
            })
            res.json(resp);
        }
        else {
            collectionItem.find({
                "restaurant_id": docs[0]._id.toString(),
                "meal_type": meal_type    
            },{},secondCallback);  
        }        
    }

    function secondCallback(e,items) {
        if (helpers.isEmptyObject(items)) {       
            resp.push({
                status: "failure", 
                err: "There is no such meal type!"
            })
            res.json(resp); 
        }
        else {
            var itemsWithDietType = []
            for (var i = 0; i < items.length; i++) {
                if (helpers.isDietTypePresent(items[i].diet_type, diet_type)) {
                    itemsWithDietType.push(items[i])
                }
            }
            if (helpers.isEmptyObject(itemsWithDietType)) {       
                resp.push({
                    status: "failure", 
                    err: "There is no such diet type!"
                })
                res.json(resp); 
            }
            else {
                resp.push({
                    status: "success", 
                    err: "", 
                    resp: itemsWithDietType
                })
                res.json(resp);
            }
        }
    }
});

module.exports = router;
