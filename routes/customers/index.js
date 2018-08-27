
const express = require('express')
const r = require( 'rethinkdb' );
const router = express.Router();
const connect = require( '../../lib/connect' );
// GET
router.get('/api/customers', function(req, res) {
    var p = req.params.productId;
    var filter = JSON.parse(req.query.filter);
    var no = true;
    // { filter: '{}', range: '[0,9]', sort: '["name","ASC"]' }
    // filter: {"id":["749"]}


        var callbek = function(err, data) {
            if(err) throw err

            data.toArray(function(err, rt) {
                res.send(rt);
            })
        }
        var callbekkie = function(err, data) {
            if(err) throw rr
            res.send([data]);
        }
        if (filter && filter.hasOwnProperty('id')) {
            no = false;
            var depth  = filter.id

            if (!_.isArray(depth)) {
                depth = [depth]
            }
            // returns a customer associated with an order
            r.db('VasProducts').table('Customers').getAll(r.args(depth)).run(req._rdb, callbek)
        }

        if (filter && filter.hasOwnProperty('q')) {
            no = false;
            console.log(filter,'q')
            var fdoc = "(?i)^" +filter.q+"$"
            r.db('VasProducts').table('Customers').filter(function (doc) {
                return doc.pluck("accountholdername", "identitynumber", "employer_contactperson", "employername").values().contains(function(v) {
                  return v.match(fdoc);
                });
              }).run(req._rdb, callbek)
        }
        if (no) {
            r.db('VasProducts').table('Customers').run(req._rdb, callbek)
        }


})
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
router.post('/api/customers', function(req, res) {

    const { id, ...customer} = req.body;
    var product_id = req.body.id
    customer.loggedInUser = customer.loggedInUser||customer.username;
    customer.agentID= 0;
    customer.avatar= "https://robohash.org/"+customer.loggedInUser+".png";
    customer.bankDetailsVerified= false;
    customer.branchCode=  "";
    customer.campaign=  "" ;
    customer.date_created= new Date();
    customer.debtorNumber=  "" ;
    customer.email=  customer.email || "";
    customer.groups= [];
    customer.products_ordered = _.isArray(product_id)?product_id.length:1;


    


    // verify bank details

   var  verificationResult = {
        "guid": "CCFE5146313947FE9E94A1DFE10E2891",
        "org_cd": "0178",
        "branch_cd": 9045,
        "client_no": "TEST",
        "id_no":customer.identitynumber,
        "first_name":customer.first_name,
        "surname":customer.last_name,
        "account_type":parseInt(customer.accounttype,10),
        "bank_acc_no":customer.accountnumber,
        "bank_branch_cd": "005009",
        "mode": "Batch"
    }

    r.db('VasProducts').table('Customers').insert(customer).run(req._rdb, function(err, customerKey) {
        if(err) throw err
        // get the product data;
        console.log(customerKey,'customerKey')
        const custKey = customerKey['generated_keys'][0]
        r.db('VasProducts').table('ProductItems').getAll(r.args(product_id)).run(req._rdb, function(erred, productdata) {
            let arProducts = [];
            let total = 0;
            if(erred) throw erred

            productdata.toArray(function(e, data) {
                if (e) throw e
                data.forEach((x)=>{
                    arProducts.push({ product_id: x.id, quantity: 1 })
                    total +=x.price
                })
                
                var orderObject = {
                    "reference": "airtime-discount",
                    "date": customer.date_created,
                    "customer_id": custKey,
                    "basket": arProducts,
                    "total_ex_vat": total,
                    "delivery_fees": 0.00,
                    "vat_rate": 0.00,
                    "vat": 0.00,
                    "total": total,
                    "status": "ordered",
                    "returned": false
                }

                r.db('VasProducts').table('Orders').insert(orderObject).run(req._rdb, function(reserrd, resulted) {
                    if(reserrd) throw reserrd
                    r.db('VasProducts').table('Credentials').insert({username:customer.username, password:customer.password, customer_id:custKey}).run(req._rdb, function(reserr, result) {
                        if(err) throw err

                        r.db('VasProducts').table('VerifiedDetails').insert(r.http('http://c92cc3e9.ngrok.io/soap/RequestAccountVerification', {method: 'POST', data:verificationResult})).run(req._rdb, function(x, y) {
                          if(x) throw x
                            res.send(y)
                        })
                    })
                })
            })
        })
        r.db('VasProducts').table('Customers').update({customer_id:custKey}).run(req._rdb, function(err, updated) {
            if(err) throw err
        })

    })
})
router.post('/api/bankDetailsCheck', function(req, res) {
    var customer = req.body;
    var  verificationResult = {
        "guid": "CCFE5146313947FE9E94A1DFE10E2891",
        "org_cd": "0178",
        "branch_cd": 9045,
        "client_no": "TEST",
        "id_no":customer.id_no,
        "first_name":customer.first_name,
        "surname":customer.last_name,
        "account_type":parseInt(customer.account_type,10),
        "bank_acc_no":customer.bank_acc_no,
        "bank_branch_cd": "005009",
        "mode": "Batch"
    }
    // make sure the Intekon Soap server is running 8192
r.http(`http://c92cc3e9.ngrok.io/soap/RequestAccountVerification`,
    { method: "POST",
      data: r.expr({"guid": "CCFE5146313947FE9E94A1DFE10E2891",
        "org_cd": "0178",
        "branch_cd": 9045,}).coerceTo('string'),
         header: { 'Content-Type': 'application/json' } }).run(req._rdb, function(err, retData){

             if(err) throw err
             res.send({data:retData})
         })
})
module.exports = router;