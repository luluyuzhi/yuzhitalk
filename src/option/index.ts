import * as fs from 'fs'
export const options = {
    key: fs.readFileSync('./tlsCa/ryans-key.pem'),
    cert: fs.readFileSync('./tlsCa/ryans-cert.pem'),
    // This is necessary only if using the client certificate authentication.
    requestCert: false,
    // This is necessary only if the client uses the self-signed certificate.
    ca: [fs.readFileSync('./tlsCa/ryans-csr.pem')]
};