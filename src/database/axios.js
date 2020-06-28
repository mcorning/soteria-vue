const axios = require('axios');
const data = '';
let path = 'connections/2f828862-fd13-411c-aaa7-073e174e16ea';

const config = {
  method: 'get',
  url: `https://api.streetcred.id/agency/v1/${path}`,
  headers: {
    'X-Streetcred-Subscription-Key': '',
    Authorization: 't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg'
  },
  data: data
};

axios(config)
  .then(function(response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function(error) {
    console.log(error);
  });

module.exports = axios(path, data);
