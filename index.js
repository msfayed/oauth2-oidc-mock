const { OAuth2Server } = require('oauth2-mock-server');

async function startServer() {

    if (process.env.GROUPS == undefined ||  process.env.GROUPS == "") {
        console.log("env:GROUPS was not set, setting it to:  Everyone,Human User (BY OU)");
        process.env.GROUPS = "Everyone,Human User (BY OU)";
    }
    console.log("env:GROUPS values: " + JSON.stringify(process.env.GROUPS.split(',')));

    const server = new OAuth2Server();

    // Generate a new RSA key and add it to the keystore
    const jwk = await server.issuer.keys.generate('RS256');
    console.log(`Generated new RSA key with kid "${jwk.kid}"`);

    server.service.on('beforeTokenSigning', (token, req) => {
        console.log("\n[[ beforeTokenSigning ]]\n");

        console.log("\nRequest url  ==> \n" + req.protocol + '://' + req.get('host') + req.originalUrl);
        console.log("\nRequest body ==> \n" + JSON.stringify(req.body));

        console.log("\ntoken before ==> \n" + JSON.stringify(token));

        // Modify the expiration time
        const timestamp = Math.floor(Date.now() / 1000);
        token.payload.exp = timestamp + 60000;

        token.payload.emailAddress = "john.doe@localhost.com";
        delete token.payload.scope;

        token.payload.groups = process.env.GROUPS.split(',');

        console.log("\nToken afater ==> \n" + JSON.stringify(token));

    });

    server.service.on('beforeResponse', (tokenEndpointResponse, req) => {
        console.log("\n[[ beforeResponse ]]\n");
        console.log("\nRequest url ==> \n" + req.protocol + '://' + req.get('host') + req.originalUrl);
        console.log("\nRequest body ==> \n" + JSON.stringify(req.body));

        delete tokenEndpointResponse.body.scope;

        console.log("\n\nResponse body ==> \n" + JSON.stringify(tokenEndpointResponse.body));
    });

    server.service.on('beforeAuthorizeRedirect', (authorizeRedirectUri, req) => {
        console.log("\n[[ beforeAuthorizeRedirect ]]");
        console.log("\nRequest url ==> \n" + req.protocol + '://' + req.get('host') + req.originalUrl);
        console.log("\nRequest body ==> \n" + JSON.stringify(req.body));

        console.log("\nauthorizeRedirectUri ==> \n" + JSON.stringify(authorizeRedirectUri));
    });

    // Simulate a custom token introspection response body
    server.service.on('beforeIntrospect', (introspectResponse, req) => {
        console.log("\n[[ beforeAuthorizeRedirect ]]\n");

        console.log("\nRequest url ==> \n" + req.protocol + '://' + req.get('host') + req.originalUrl);
        console.log("\nRequest body ==> \n" + JSON.stringify(req.body));

        console.log("\nintrospectResponse ==> \n" + JSON.stringify(introspectResponse));
    });

    // Start the server
    await server.start(8090, '0.0.0.0');

    const addr = server.address();
    const hostname = addr.family === 'IPv6' ? `[${addr.address}]` : addr.address;

    console.log(`OAuth 2 server listening on http://${hostname}:${addr.port}`);
    console.log(`OAuth 2 issuer is ${server.issuer.url}`);

    // Stop the server
    process.on('SIGINT', () => {
        console.log('OAuth 2 server is stopping...');

        const handler = async () => {
            await server.stop();
        };

        handler().catch((e) => {
            throw e;
        });

        console.log('OAuth 2 server has been stopped.');
    });

    return server;
}

exports.default = startServer();