// When the server restarts without error we sohuld celebrate
console.log("looks like we made it")

//Fastly API and service configuration
const fastly = require('fastly-promises');
const fastly_service = fastly(process.env.FASTLY_PURGER_KEY,process.env.FASTLY_SERVICE_ID)

// Generic node.js express init:
const express = require('express');
const app = express();
app.use(express.static('public'));

//Instantiate and init the cache controller
const cacheControl = require('express-cache-controller');
app.use(cacheControl());


// These next lines allow us to use "response.render" with handlebars files!
// https://www.npmjs.com/package/express-handlebars
const hbs = require('hbs');
  

// The partials directory hold additional files that we're allowed to use inside of 
// our other templates using the partials syntax, e.g.: {{< head}}
// see http://handlebarsjs.com/partials.html
hbs.registerPartials(__dirname + '/views/partials');

 
// This next pair of lines teaches Express that if I ask to render a file, say "index",
// it's allowed to use any file named "index" that ends with 'hbs' and is contained in 
// the "views" folder
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//Set a default values to use if the server resets 
let bodyMsg = `${"♥︎ drl luvs u ".repeat(1000)}`
 
//Route that handles showing MOTD
//If a request comes in with a "path" it will overwrite the existing MOTD
app.get("/:msg?", (request, response) => {
  response.set('Cache-Control', 'no-store, must-revalidate')
  response.set('Surrogate-Control','max-age=31536000')
  let data = {
    serverTime: new Date(),
    bodyMsg,
    ip: request.headers["fastly-client-ip"],
    city: request.headers["fastly-geoip-city"],
    country: request.headers["fastly-geoip-countryname"],
    device: request.headers["x-ua-device"],
    vendor: request.headers["x-ua-vendor"],
    family: request.headers["ua_family"]
  };
  // This is a hack and frankly I don't know why I need this but things break without it
  if (!request.params.msg || request.params.msg === undefined || request.params.msg === "favicon.ico") {
    // console.log(request.headers)
    response.render('index', data);
  } else {
    // console.log(request.headers)
    fastly_service.purgeIndividual(`${process.env.FASTLY_DOMAIN}/`)
      .then((purge_resp) => {
        console.log(`Purge sent  ${purge_resp.status} response`)
        let raw_msg = `${request.params.msg} `
        bodyMsg = raw_msg.repeat(1000)
        response.redirect(301,`https://${process.env.FASTLY_DOMAIN}`)
    })
      .catch((err)=> { //kind of boned if this happens since there is no fallback
        console.log(err)
    })
  }
});
 
//Healthcheck endpoint, used in Fastly config to 1) check server health, 2) keep glitch from sleeping
app.get('/healthcheck/check' , (req,res) => {
  // console.log("HEALTHCHECK")
  res.sendStatus(200) 
});


// And we end with some more generic node stuff -- listening for requests :-)
let listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
   