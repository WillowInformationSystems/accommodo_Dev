//OPTIONS
const express = require('express')
const r = require('rethinkdb');
const router = express.Router();
const connect = require('../../lib/connect');


//GET Room Types
router.get('/roomtypes', function (req, res) {    
    
    //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
    r.db('accommodo').table('roomTypes').run(req._rdb, function (err, retData) {
        if (err) throw err
        retData.toArray(function (x, returnData) {
            res.send(returnData);
        });
        

    })   
})

// POST
router.post('/roomtypes', function (req, res) {
    
    var roomTypes = req.body;

    r.db('accommodo').table('roomTypes').insert(roomTypes).run(req._rdb, function (err, roomTypesKey) {
        if (err) throw err
        res.send(roomTypesKey)
    })
})

module.exports = router;