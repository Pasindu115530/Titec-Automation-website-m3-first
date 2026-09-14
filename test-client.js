const axios = require('axios');
axios.post('http://127.0.0.1:8000/api/clients', {
  contact_person: 'Test Person',
  phone: '1234567890',
  client_type: 'business'
}).then(console.log).catch(e => console.error(e.message));
