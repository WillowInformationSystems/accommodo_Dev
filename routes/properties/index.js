//PROPERTIES

const express = require('express')
const r = require('rethinkdb');
const router = express.Router();
const connect = require('../../lib/connect');

//Post
router.post('/', function (req, res) {
    console.log('properties')
    var property = req.body;

    r.db('accommodo').table('listings').insert(property).run(req._rdb, function (err, listingKey) {
        if (err) throw err
        res.send(listingKey)
    })
})

// PUT
router.put('/:propertyId', function (req, res) {
    var p = req.params.propertyId;
    var updateInfo = req.body;
    //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
    r.db('accommodo').table('listings').get(p).update(updateInfo).run(req._rdb, function (err, retData) {
        if (err) throw err
        res.send(retData)
    })
})

router.get('/:propertyId', function (req, res) {
    var p = req.params.propertyId
    if (req.query.filter && req.query.filter.hasOwnProperty('id')) {

        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('listings').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    } else {
        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('listings').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    }
})


module.exports = router;