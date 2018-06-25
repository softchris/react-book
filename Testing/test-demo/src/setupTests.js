import nock from 'nock';
nock.disableNetConnect();
global.fetch = require('node-fetch');
