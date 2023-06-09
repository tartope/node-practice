const mysql = require('mysql2')

exports.pool = mysql
    .createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'blue',
        database: 'node-practice'
    })
    .promise();