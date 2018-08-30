//LANDLORDS
const express = require('express')
const r = require('rethinkdb');
const router = express.Router();
const connect = require('../../lib/connect');
//GET
router.get('/:landlordId', function (req, res) {
    var p = req.params.landlordId
    if (req.query.filter && req.query.filter.hasOwnProperty('id')) {

        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('Landlords').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    } else {
        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('Landlords').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    }
})

router.get('/', function (req, res) {
    var p = req.params.landlordId
    if (req.query.filter && req.query.filter.hasOwnProperty('id')) {

        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('Landlords').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    } else {
        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('accommodo').table('Landlords').get(p).run(req._rdb, function (err, retData) {
            if (err) throw err
            res.send(retData)
        })
    }
})

// PUT
router.put('/:landlordId', function (req, res) {
    var p = req.params.landlordId;
    var updateInfo = req.body;
    //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
    r.db('accommodo').table('Landlords').get(p).update(updateInfo).run(req._rdb, function (err, retData) {
        if (err) throw err
        res.send(retData)
    })
})
// POST
router.post('/', function (req, res) {
    console.log('landlord')
    var landlord = req.body;

    r.db('accommodo').table('Landlords').insert(landlord).run(req._rdb, function (err, landlordKey) {
        if (err) throw err
        res.send(landlordKey)
    })
})

module.exports = router;