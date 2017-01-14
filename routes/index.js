var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all details of all restaurants. */
router.get('/restaurants', function(req, res, next) {
	var db = req.db;
    var collection = db.get('restaurants');
	collection.find({},{},function(e,docs) {
        res.json(docs);
    });
});

/* GET details of restaurant by name  */
router.get('/restaurant/:name', function(req, res, next) {
    var db = req.db;
    var collection = db.get('restaurants');
    var name = req.params.name;
    collection.find({
        "name": name
    },{},function(e,docs) {
        res.json(docs);
    });
});

/* GET details of all items. */
router.get('/items', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    collection.find({},{},function(e,docs) {
        res.json(docs);
    });
});

/* GET details of all items from specific restaurant. */
router.get('/items/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    var id = req.params.id;
    collection.find({
        "restaurant_id": id
    },{},function(e,docs) {
        res.json(docs);
    });
});

/* GET details of all items from specific restaurant for specific mealtype. */
router.get('/items/:name/:meal_type', function(req, res, next) {
    var db = req.db;
    var collectionRestaurant = db.get('restaurants');
    var collectionItem = db.get('items');
    var name = req.params.name;
    var meal_type = req.params.meal_type;
    collectionRestaurant.find({
        "name": name
    },{},function(e,docs) {
        collectionItem.find({
            "restaurant_id": docs[0]._id.toString(),
            "meal_type": meal_type    
        },{},function(e,docs1) {
            res.json(docs1);
        });
    });
});

module.exports = router;
