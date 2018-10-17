const express = require('express');
const path = require('path');
const requestPromise = require('request-promise');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;


const API_KEY = 'u0xeyvnwh6-+af/unzTeOHfVs1Ds5azlXxjFXqRflILCiQqbtvEEzo=';

function getEndpoint(req,res, path){
        requestPromise({
            uri : 'https://console.kaleido.io/api/v1/' + path,
            headers : {
                'Authorization' : `Bearer ${API_KEY}`
            },
            json :true
        }).then((resp)=>{
          console.log(resp);
            res.send(resp);
        }).catch((error)=>{
            if(error.statusCode && error.message) res.status(error.statusCode).send(error.message);
            else res.status(500).send('Internal Error');
            throw(error);
        })
}

app.get('/consortia',bodyParser.json(), function(req, res, path){
  getEndpoint(req, res, "consortia");
});

app.get('/invitations',bodyParser.json(), function(req, res, path){
  getEndpoint(req, res, "consortia/u0f9prinmz/invitations");
});

app.get('/memberships',bodyParser.json(), function(req, res, path){
  getEndpoint(req, res, "consortia/u0f9prinmz/memberships");
});

app.get('/audits',bodyParser.json(), function(req, res, path){
  getEndpoint(req, res, "audit/u0f9prinmz");
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
