# Using the Identity Service from React via the Shim

This guide explains how a React developer should connect to the Identity
Backend Service using the **demo-client shim** rather than calling raw
HTTP endpoints directly.

## What the shim is

The shim is a thin TypeScript client that wraps the backend HTTP API and
gives React code a cleaner typed interface.

Instead of:

``` ts
await fetch("/.netlify/functions/auth-login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ username, password })
});
```

Use:

``` ts
await client.login({ username, password });
```

The shim:

-   calls the backend
-   unwraps envelopes
-   normalizes errors
-   stores session tokens
-   retries once after refresh if needed

------------------------------------------------------------------------

## Why use the shim

Benefits:

-   typed calls
-   less repetitive fetch code
-   centralized token handling
-   consistent error objects
-   easier API evolution
-   foundation for OAuth support

------------------------------------------------------------------------

## Creating a client

``` ts
import {
  createBrowserTokenStore,
  createIdentityClient
} from "../lib/identity-client";

const client = createIdentityClient({
  tokenStore: createBrowserTokenStore("auth.user")
});
```

------------------------------------------------------------------------

## Login example

``` ts
const result = await client.login({
  username: "admin",
  password: "196900"
});

console.log(result.user);
console.log(result.session);
```

------------------------------------------------------------------------

## Session example

``` ts
const sessionState = client.getSession();

if (sessionState?.session?.accessToken) {
  console.log("Logged in");
}
```

------------------------------------------------------------------------

## Logout

``` ts
await client.logout();
```

------------------------------------------------------------------------

## Fetch current user

``` ts
const me = await client.getMe();
console.log(me.user);
```

------------------------------------------------------------------------

## Admin example

``` ts
const users = await client.listUsers();
```

Create user:

``` ts
await client.createUser({
  email: "new.user@example.com",
  password: "secret123",
  displayName: "New User",
  roles: ["user"]
});
```

------------------------------------------------------------------------

## Error handling

``` ts
import { IdentityClientError } from "../lib/identity-client";

try {
  await client.login({ username, password });
} catch (err) {
  if (err instanceof IdentityClientError) {
    console.error(err.status);
    console.error(err.code);
    console.error(err.message);
    console.error(err.requestId);
  }
}
```

------------------------------------------------------------------------

## Recommended React structure

    src/
      auth/
        AuthContext.tsx
      hooks/
        useIdentityClient.ts
        useIdentitySession.ts
      lib/
        identity-client/
      components/
      pages/

------------------------------------------------------------------------

## Minimal working example

``` ts
import { createBrowserTokenStore, createIdentityClient } from "./lib/identity-client";

const client = createIdentityClient({
  tokenStore: createBrowserTokenStore("auth.main")
});

await client.login({
  username: "admin",
  password: "196900"
});

const me = await client.getMe();
console.log(me.user);
```

------------------------------------------------------------------------

## Final guidance

For React apps:

-   use the shim
-   avoid raw fetch calls
-   centralize client creation
-   keep UI logic separate from transport logic

The API is the product; the shim is the convenience layer.
