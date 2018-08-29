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

module.exports = router;