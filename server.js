require('dotenv').config();

var http = require('http');
var parser = require('body-parser');
var cors = require('cors');
var path = require('path');
var express = require('express');
// var ngrok = require('ngrok');
var cache = require('./model');
var axios = require('axios');
axios.defaults.headers.common['Authorization'] = process.env.ACCESSTOK;
axios.defaults.headers.common['X-Streetcred-Subscription-Key'] =
  process.env.SUBKEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const {
  AgencyServiceClient,
  Credentials
} = require('@streetcred.id/service-clients');
const client = new AgencyServiceClient(
  new Credentials(process.env.ACCESSTOK, process.env.SUBKEY)
);

var app = express();
app.use(cors());
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', function(req, res) {
//   // res.sendFile(path.join(__dirname, '/build/index.html'));
//   console.log(req);
//   console.log(res);
// });

app.get('/connections', cors(), async function() {
  // const attribs = JSON.stringify(req.query);
  // console.log(attribs);
  // console.log('req.query', req.query);
  // res.status(200).send(await client.listConnections());

  axios({
    baseURL: 'https://api.streetcred.id/agency/v1',
    url: '/connections',
    method: 'GET',
    withCredentials: true,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.data);
      // return response.data;
    })
    .catch(function(error) {
      console.log('******************** START CATCH ********************');
      if (error.response) {
        console.log('Start error.response results\n');
        console.log(
          '\nThe request was made and the server responded with a status code that falls out of the range of 2xx'
        );
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log('End error.response results\n');
      } else if (error.request) {
        console.log('Start error.request results\n');

        console.log('\nThe request was made but no response was received');
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        console.log('End error.request results\n');
      }
      console.log(
        '\nSomething happened in setting up the request that triggered an Error'
      );

      console.log('Error Config:\n', error.config);
      console.log('\nError Message:', error.message, '\n');
      console.log('******************** END CATCH ********************');
    });
});

app.post('/credentials/axios', cors(), async function(req, res) {
  console.time('start');
  const payload = req.body;
  console.log('\ncredential req.body:\n', payload, '\n');
  console.log('Request body when testing with swagger:');
  console.log(JSON.stringify(payload));
  console.log();

  axios({
    baseURL: 'https://api.streetcred.id/agency/v1',
    url: '/credentials',
    method: 'POST',
    data: payload,
    withCredentials: true, // key parameter to get to the Streetcred server with my dev creds
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      const url = response.data.offerUrl;
      console.log('offerUrl:', url);
      res.status(200).send({ offerUrl: url });
      console.timeEnd('start');
    })
    .catch(function(error) {
      console.log('******************** START CATCH ********************');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);

      console.log('Error Config:\n', error.config);
      console.log('\nError Message:', error.message, '\n');
      console.log('******************** END CATCH ********************');
      console.timeEnd('start');
      res.send({ offerUrl: '' });
    });
});

app.post('/credentialsX', cors(), async function(req) {
  const payload = req.body;
  console.log('\nUsing service client:\n', payload);
  // payload better look like this:
  //   export interface CredentialOfferParameters {
  //     /**
  //      * Gets or sets the credential definition identifier.
  //      */
  //     definitionId: string;
  //     /**
  //      * Connection identifier to send this credential to.
  //      * If ommited, the request will be treated as connectionless
  //      * issuance and will generate a URL.
  //      */
  //     connectionId?: string;
  //     /**
  //      * If true, the credential will automatically be issued once the individual accepts the offer. If
  //      * false, when an individual accepts the offer the credential will be in state 'Requested' and
  //      * must be manually issued using the
  //      * PUT /credentials/{credentialId} endpoint. This is set to false by default
  //      */
  //     automaticIssuance?: boolean;
  //     credentialValues?: {
  //         [propertyName: string]: string;
  //     };
  // }

  // { definitionId: 'N4dqaFJG3qu2P5A7xKEKrB:3:CL:102081:default',
  // automaticIssuance: true,
  // credentialValues:
  //  { firstName: 'Michael',
  //    lastName: 'Corning',
  //    email: 'michael@secours.io',
  //    gender: 'Male',
  //    age: '54+' } }
  client
    .createCredential(payload)
    .then(response => {
      console.log(response);
    })
    .catch(function(error) {
      console.log('******************** START CATCH ********************');
      if (error.response) {
        console.log('Start error.response results\n');
        console.log(
          '\nThe request was made and the server responded with a status code that falls out of the range of 2xx'
        );
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log('End error.response results\n');
      } else if (error.request) {
        console.log('Start error.request results\n');

        console.log('\nThe request was made but no response was received');
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        console.log('End error.request results\n');
      }
      console.log(
        '\nSomething happened in setting up the request that triggered an Error'
      );

      console.log('Error Config:\n', error.config);
      console.log('\nError Message:', error.message, '\n');
      console.log('******************** END CATCH ********************');
    });
});

// WEBHOOK ENDPOINT
app.post('/webhook', async function(req) {
  try {
    console.log('got webhook of type: ' + req.body.message_type);
    if (req.body.message_type === 'new_connection') {
      console.log('new connection notified');

      var params = {
        credentialOfferParameters: {
          definitionId: process.env.CRED_DEF_ID,
          connectionId: req.body.object_id
        }
      };
      await client.createCredential(params);
    } else if (req.body.message_type === 'credential_request') {
      console.log('cred request notified');

      const attribs = cache.get(req.body.data.ConnectionId);
      if (attribs) {
        var param_obj = JSON.parse(attribs);
        const params = {
          values: {
            'Full Name': param_obj['name'],
            Title: param_obj['title'],
            'Company Name': param_obj['org'],
            'Phone Number': param_obj['phone'],
            Email: param_obj['email']
          }
        };
        console.log('attribs', attribs);
        console.log('params', params);
        await client.issueCredential(req.body.object_id, params);
      }
    }
  } catch (e) {
    console.log('Catched:');
    console.log(e.message || e.toString());
  }
});

//FRONTEND ENDPOINT
app.post('/api/issue', cors(), async function(req, res) {
  const invite = await getInvite();
  const attribs = JSON.stringify(req.body);

  cache.add(invite.connectionId, attribs);
  res.status(200).send({ invite_url: invite.invitation });
});

const getInvite = async () => {
  try {
    var result = await client.createConnection({
      connectionInvitationParameters: {}
    });
    return result;
  } catch (e) {
    console.log(e.message || e.toString());
  }
};

// for graceful closing
var server = http.createServer(app);

// async function onSignal() {
//   var webhookId = cache.get('webhookId');
//   const p1 = await client.removeWebhook(webhookId);
//   return Promise.all([p1]);
// }
// createTerminus(server, {
//   signals: ['SIGINT', 'SIGTERM'],
//   healthChecks: {},
//   onSignal
// });

const PORT = process.env.PORT || 3002;
server.listen(PORT, async function() {
  // const url_val = await ngrok.connect(PORT);
  // console.log('============= \n\n' + url_val + '\n\n =========');
  // var response = await client.createWebhook({
  //   webhookParameters: {
  //     url: url_val + '/webhook', // process.env.NGROK_URL
  //     type: 'Notification'
  //   }
  // });

  // cache.add('webhookId', response.id);
  console.log('Listening on port %d\n', server.address().port);
});
