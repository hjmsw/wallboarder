'use strict';

const appHost = process.env.appHost || 'localhost';
const appPort = process.env.appPort || 8081;
const db      = process.env.db      || 'mongodb://localhost/node-mongo-wallboarder';

module.exports = {
    app: {
        host: appHost,
        port: appPort
    },
    db: db
};