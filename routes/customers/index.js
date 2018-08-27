
const express = require('express')
const r = require( 'rethinkdb' );
const router = express.Router();
const connect = require( '../../lib/connect' );
// GET
router.get('/api/customers/:customerId', function(req, res) {
    var p=req.params.customerId
    if (req.query.filter && req.query.filter.hasOwnProperty('id')) {

        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('VasProducts').table('Customers').get(p).run(req._rdb, function(err, retData){
            if(err) throw err
            res.send(retData)
        })
    } else {
        //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
        r.db('VasProducts').table('Customers').get(p).run(req._rdb, function(err, retData){
            if(err) throw err
            res.send(retData)
        })
    }
})
// PUT
router.put('/api/customers/:customerId', function(req, res) {
    var p = req.params.customerId;
    var updateInfo = req.body;
    //{ filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
    r.db('VasProducts').table('Customers').get(p).update(updateInfo).run(req._rdb, function(err, retData){
        if(err) throw err
        res.send(retData)
    })
})
// POST
router.post('/api/landlord', function(req, res) {

    var landlord = req.body;
    
    r.db('VasProducts').table('Landlords').insert(landlord).run(req._rdb, function(err, landlordKey) {
        if (err) throw err
        res.send(landlordKey)
    })
})

module.exports = router;