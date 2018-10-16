const express = require('express');
const path = require('path');
const requestPromise = require('request-promise');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;


const API_KEY = 'u0xeyvnwh6-+af/unzTeOHfVs1Ds5azlXxjFXqRflILCiQqbtvEEzo=';

function getConsortium(req,res){
        requestPromise({
            uri : 'https://console.kaleido.io/api/v1/consortia',
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

app.get('/consortia',bodyParser.json(), getConsortium);
// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
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
