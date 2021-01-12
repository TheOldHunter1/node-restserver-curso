var request = require('request');

var options;
for (let index = 0; index < 15; index++) {


    options = {
        'method': 'POST',
        'url': 'http://localhost:3000/usuario/',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'nombre': `test${index}`,
            'email': `test${index}@gmail.com`,
            'password': '1234',
            'role': 'ADMIN_ROLE',
            'google': 'false'
        }
    };
    request(options, function(error, response) {
        if (error) console.log(error);
        // console.log(response.body);
    });

}