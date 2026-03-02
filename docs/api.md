---
title: Identity Backend Service API v0.1.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="identity-backend-service-api">Identity Backend Service API v0.1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Backend-first identity API implemented with Netlify Functions.

Notes:
- This spec is the source of truth for the REST contract.
- Some endpoints are planned and may not be implemented yet.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="identity-backend-service-api-auth">auth</h1>

Authentication and session management

## authLogin

<a id="opIdauthLogin"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-login HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "username": "demo",
  "password": "letmein"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-login`

*Login and create a session*

> Body parameter

```json
{
  "username": "demo",
  "password": "letmein"
}
```

<h3 id="authlogin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthLoginRequest](#schemaauthloginrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authlogin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Authenticated session and user profile.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid credentials.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authRegister

<a id="opIdauthRegister"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-register HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-register',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-register', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-register', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-register");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-register", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-register`

*Register a new user and create a session*

Planned endpoint. When implemented, should create a new user and return an authenticated session.

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}
```

<h3 id="authregister-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthRegisterRequest](#schemaauthregisterrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authregister-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User created and session issued.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Email already exists.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authRefresh

<a id="opIdauthRefresh"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-refresh \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-refresh HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-refresh',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-refresh',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-refresh', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-refresh', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-refresh");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-refresh", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-refresh`

*Refresh an access token*

Planned endpoint. When implemented, should validate the refresh token and return a new session payload.

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="authrefresh-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthRefreshRequest](#schemaauthrefreshrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authrefresh-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|New session issued.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid or expired refresh token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authLogout

<a id="opIdauthLogout"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-logout \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST /auth-logout HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth-logout',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post '/auth-logout',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('/auth-logout', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-logout', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-logout");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-logout", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-logout`

*Logout / revoke session tokens*

Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="authlogout-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthLogoutRequest](#schemaauthlogoutrequest)|false|none|

> Example responses

> 400 Response

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "string",
    "details": null
  }
}
```

<h3 id="authlogout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Logged out.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Missing or invalid access token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="identity-backend-service-api-users">users</h1>

User registration and profile

## getMe

<a id="opIdgetMe"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /me \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET /me HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get '/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /me`

*Get current user profile*

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="getme-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Current user profile.|[MeResponse](#schemameresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Missing or invalid access token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_ErrorResponse">ErrorResponse</h2>
<!-- backwards compatibility -->
<a id="schemaerrorresponse"></a>
<a id="schema_ErrorResponse"></a>
<a id="tocSerrorresponse"></a>
<a id="tocserrorresponse"></a>

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "string",
    "details": null
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|error|object|true|none|none|
|» code|string|true|none|Stable, machine-readable error code.|
|» message|string|true|none|Human-readable error message.|
|» details|any|false|none|Optional error details.|

<h2 id="tocS_AuthProvider">AuthProvider</h2>
<!-- backwards compatibility -->
<a id="schemaauthprovider"></a>
<a id="schema_AuthProvider"></a>
<a id="tocSauthprovider"></a>
<a id="tocsauthprovider"></a>

```json
"fake"

```

Authentication provider identifier.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|Authentication provider identifier.|

<h2 id="tocS_Session">Session</h2>
<!-- backwards compatibility -->
<a id="schemasession"></a>
<a id="schema_Session"></a>
<a id="tocSsession"></a>
<a id="tocssession"></a>

```json
{
  "accessToken": "string",
  "tokenType": "Bearer",
  "expiresAt": "2026-03-02T12:34:56.000Z",
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string|true|none|none|
|tokenType|string|true|none|Token type, usually "Bearer".|
|expiresAt|string|false|none|Optional expiry time in ISO 8601 format.|
|refreshToken|string|false|none|Optional refresh token (if issued).|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "string",
  "email": "user@example.com",
  "displayName": "string",
  "roles": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Provider-unique user id.|
|email|string(email)|false|none|none|
|displayName|string|false|none|none|
|roles|[string]|false|none|none|

<h2 id="tocS_AuthResult">AuthResult</h2>
<!-- backwards compatibility -->
<a id="schemaauthresult"></a>
<a id="schema_AuthResult"></a>
<a id="tocSauthresult"></a>
<a id="tocsauthresult"></a>

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|provider|[AuthProvider](#schemaauthprovider)|true|none|Authentication provider identifier.|
|session|[Session](#schemasession)|true|none|none|
|user|[User](#schemauser)|true|none|none|

<h2 id="tocS_AuthLoginRequest">AuthLoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthloginrequest"></a>
<a id="schema_AuthLoginRequest"></a>
<a id="tocSauthloginrequest"></a>
<a id="tocsauthloginrequest"></a>

```json
{
  "username": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|true|none|Username/email used to authenticate.|
|password|string|true|none|Password used to authenticate.|

<h2 id="tocS_AuthRegisterRequest">AuthRegisterRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthregisterrequest"></a>
<a id="schema_AuthRegisterRequest"></a>
<a id="tocSauthregisterrequest"></a>
<a id="tocsauthregisterrequest"></a>

```json
{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string(email)|true|none|none|
|password|string|true|none|none|
|displayName|string|false|none|none|

<h2 id="tocS_AuthRefreshRequest">AuthRefreshRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthrefreshrequest"></a>
<a id="schema_AuthRefreshRequest"></a>
<a id="tocSauthrefreshrequest"></a>
<a id="tocsauthrefreshrequest"></a>

```json
{
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|true|none|none|

<h2 id="tocS_AuthLogoutRequest">AuthLogoutRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthlogoutrequest"></a>
<a id="schema_AuthLogoutRequest"></a>
<a id="tocSauthlogoutrequest"></a>
<a id="tocsauthlogoutrequest"></a>

```json
{
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|false|none|Optional refresh token to revoke, if applicable.|

<h2 id="tocS_MeResponse">MeResponse</h2>
<!-- backwards compatibility -->
<a id="schemameresponse"></a>
<a id="schema_MeResponse"></a>
<a id="tocSmeresponse"></a>
<a id="tocsmeresponse"></a>

```json
{
  "provider": "fake",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|provider|[AuthProvider](#schemaauthprovider)|true|none|Authentication provider identifier.|
|user|[User](#schemauser)|true|none|none|

