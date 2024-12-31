const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api', (req, res) => {
  const url = 'https://www.planalto.gov.br/ccivil_03/Constituicao/ConstituicaoCompilado.htm';
  request(url, { encoding: null }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(response.statusCode).send(error);
    }
  });
});

app.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});
