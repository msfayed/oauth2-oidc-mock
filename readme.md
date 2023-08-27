based on https://github.com/axa-group/oauth2-mock-server

```
npm install -g oauth2-mock-server

oauth2-mock-server --help
```

# use as a library in custome app

```
npm init
npm install --save-dev oauth2-mock-server
```

# Docker

Build Docker image

```
docker build . -t fayed/oauth2-oidc-mock
```

Run the container, setting the GROUPS variable to 3 groups: ["Everyone","Human User (BY OU)","sparrow-constructor"]

```
docker run -p 8090:8090 -e "GROUPS=Everyone,Human User (BY OU),sparrow-constructor" fayed/oauth2-oidc-mock
```

the decoded payload part of the JWT [inside **id_token** response] will be similar to this:

```json
{
    "iss": "http://localhost:8090",
    "iat": 1693159190,
    "exp": 1693219190,
    "nbf": 1693159180,
    "sub": "johndoe",
    "aud": "0oasfb4kks5voQuhX0h7",
    "emailAddress": "john.doe@localhost.com",
    "groups": [
        "Everyone",
        "Human User (BY OU)",
        "sparrow-constructor"
    ]
}
```

# Read server configuration

```
http://localhost:8090/.well-known/openid-configuration
```

sample response:

```json
{
    "issuer": "http://localhost:8090",
    "token_endpoint": "http://localhost:8090/token",
    "authorization_endpoint": "http://localhost:8090/authorize",
    "userinfo_endpoint": "http://localhost:8090/userinfo",
    "token_endpoint_auth_methods_supported": [
        "none"
    ],
    "jwks_uri": "http://localhost:8090/jwks",
    "response_types_supported": [
        "code"
    ],
    "grant_types_supported": [
        "client_credentials",
        "authorization_code",
        "password"
    ],
    "token_endpoint_auth_signing_alg_values_supported": [
        "RS256"
    ],
    "response_modes_supported": [
        "query"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "revocation_endpoint": "http://localhost:8090/revoke",
    "subject_types_supported": [
        "public"
    ],
    "end_session_endpoint": "http://localhost:8090/endsession",
    "introspection_endpoint": "http://localhost:8090/introspect"
}
```