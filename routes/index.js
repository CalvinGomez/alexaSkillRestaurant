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
	collection.find({},{},function(e,restaurants) {
        res.json(restaurants);
    });
});

/* GET details of restaurant by name  */
router.get('/restaurant/:name', function(req, res, next) {
    var db = req.db;
    var collection = db.get('restaurants');
    var name = req.params.name;
    collection.find({
        "name": name
    },{},function(e,restaurant) {
        res.json(restaurant);
    });
});

/* GET details of all items. */
router.get('/items', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    collection.find({},{},function(e,items) {
        res.json(items);
    });
});

/* GET details of all items from specific restaurant. */
router.get('/items/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('items');
    var id = req.params.id;
    collection.find({
        "restaurant_id": id
    },{},function(e,items) {
        res.json(items);
    });
});

/* GET details of all items from specific restaurant for specific mealtype. */
router.get('/items/:name/:meal_type', function(req, res, next) {
    var db = req.db;
    var collectionRestaurant = db.get('restaurants');
    var collectionItem = db.get('items');
    var name = req.params.name;
    var meal_type = req.params.meal_type;
    var resp = []
    collectionRestaurant.find({
        "name": name
    },{},function(e,restaurant) {
        if (isEmptyObject(restaurant)) {
            resp.push({
                status: "failure", 
                err: "Could not find restaurant!"
            })
            res.json(resp);
        }
        else {
            collectionItem.find({
                "restaurant_id": restaurant[0]._id.toString(),
                "meal_type": meal_type    
            },{},function(e,items) {
                if (isEmptyObject(items)) {       
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
                        resp: items})
                    res.json(resp);
                }
            });  
        }        
    });
});

/* GET details of all items from specific restaurant for specific mealtype. */
router.get('/items/:name/:meal_type/:diet_type', function(req, res, next) {
    var db = req.db;
    var collectionRestaurant = db.get('restaurants');
    var collectionItem = db.get('items');
    var name = req.params.name;
    var meal_type = req.params.meal_type;
    var diet_type = req.params.diet_type;
    var resp = []
    collectionRestaurant.find({
        "name": name
    },{},function(e,restaurant) {
        if (isEmptyObject(restaurant)) {
            resp.push({
                status: "failure", 
                err: "Could not find restaurant!"
            })
            res.json(resp);
        }
        else {
            collectionItem.find({
                "restaurant_id": restaurant[0]._id.toString(),
                "meal_type": meal_type    
            },{},function(e,items) {
                if (isEmptyObject(items)) {       
                    resp.push({
                        status: "failure", 
                        err: "There is no such meal type!"
                    })
                    res.json(resp); 
                }
                else {
                    var itemsWithDietType = []
                    for (var i = 0; i < items.length; i++) {
                        if (isDietTypePresent(items[i].diet_type, diet_type)) {
                            itemsWithDietType.push(items[i])
                        }
                    }
                    if (isEmptyObject(itemsWithDietType)) {       
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
            });  
        }        
    });
});

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function isDietTypePresent(types, diet_type) {
    var flag = 0
    for (var i = 0; i < types.length; i++) {
        if (diet_type == types[i].type) {
            flag = 1
            break
        }
    }
    if (flag == 1) {
        return true
    }
    else {
        return false
    }
}

module.exports = router;
