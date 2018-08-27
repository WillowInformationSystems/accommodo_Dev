
const r = require( 'rethinkdb' );
const router = require( 'express' ).Router();
const connect = require( '../../lib/connect' );


router.post('/api/signin', function(req, res) {
    var a = req.body.phone;
    var b = req.body.password
    r.db('VasProducts').table('Customers').filter({phone:a,password:b}).run(req._rdb, function(err, retData){
        if(err) throw err
        retData.toArray((er, result) => {
          if (result.length > 0) {
            res.send(result[0])
          }
          else {
            res.send({message: 'Sign in Failed: You have entered an invalid username or password'})
          }
        });
    })
})
module.exports = router;