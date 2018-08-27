var app = require("express")();
var server = require('http').createServer(app)
var bodyParser = require("body-parser");
const logger = require( 'morgan' );
const helmet = require( 'helmet' );

var cors = require('cors')

var _ = require('lodash')

require( 'dotenv' ).config();
// create config object for this
// better abstraction

// this is a thing for docker
const HOST = '0.0.0.0';

app.use( bodyParser.urlencoded( {
    extended: false
} ) );
app.use(bodyParser.json());
var corsOptions =  {
'Access-Control-Expose-Headers':'Content-Range',
}
// CORS for node server
app.use(cors(corsOptions));

app.use( logger( 'dev' ) );

app.use( helmet() )

const connect = require( './lib/connect' );
const orders = require( './routes/orders' );
const customers = require( './routes/customers' );
const products = require( './routes/products' );
const employers = require( './routes/employers' );
const signin = require( './routes/signin' );
const categories = require( './routes/categories' );


app.use( connect.connect );
app.use( '/orders', orders );
app.use( '/customers', customers );
app.use( '/products', products );
app.use( '/categories', categories );
app.use( '/employers', employers );
app.use( '/signin', signin );

app.use( connect.close );


app.use( ( error, request, response, next ) => {
    response.status( error.status || 500 );
    response.json( {
        error: error.message
    } );
} );


var io = require('socket.io').listen(server);


io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('voetsek', function (data) {
      console.log(data);
    });
  });

server.listen(process.env.PORT || 8888, HOST,function () {
    var obj = server.address(),
      host = obj.address + ':' + obj.port;
    console.log("App now running on ", host);
});

//WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

