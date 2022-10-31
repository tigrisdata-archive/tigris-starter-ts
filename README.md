# RESTful Web App with Typescript and Tigris

[![ts-ci](https://github.com/tigrisdata/tigris-starter-ts/actions/workflows/ts-ci.yml/badge.svg?branch=main)](https://github.com/tigrisdata/tigris-starter-ts/actions/workflows/ts-ci.yml)

This is a TypeScript web application that demonstrates a basic version of an
ecommerce application that handles user, products and orders. The application
demonstrates CRUD, search and event streaming functionality of Tigris.
The application uses express framework.

For more information please refer to:
[Tigris documentation](https://docs.tigrisdata.com)

## Clone the repo

```shell
git clone https://github.com/tigrisdata/tigris-starter-ts.git
cd tigris-starter-ts
```

## Tigris Local Development Environment

Startup local Tigris development environment listening on port 8081:

```shell
docker run -d -p 8081:8081 tigrisdata/tigris-local:latest
```

## Tigris Cloud Environment

Create a `.env` file in the root of the application and add [Tigris Data application client ID and client secret](https://docs.tigrisdata.com/auth/) configuration.

```
TIGRIS_CLIENT_ID='your-tigris-data-app-client-id`
TIGRIS_CLIENT_SECRET='your-tigris-data-app-client-secret`
```

Compile and start the application:

```shell
npm run build && npm run start
```

## Test the application

### Event Streaming

Run the following command in a new terminal window to watch user events stream in
real-time:

```shell
curl -N -X POST localhost:8080/users/subscribe
```

Run the following command in a new terminal window to watch social message events stream in
real-time:

```shell
curl -N -X POST localhost:8080/social-messages/subscribe
```

Run the following command in a new terminal to publish social message events:

```shell
curl localhost:8080/social-messages/publish \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"nickName":"John","message":"Real-time event streams with Tigris Data!"}'
```

You can also try out the publish and subscribe functionality in the browser by visiting http://localhost:8080.

### CRUD operations

#### Insert users

Run following commands to create two users: John and Jane

```shell
curl localhost:8080/users/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"John","balance":100}'
```

```shell
curl localhost:8080/users/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Jane","balance":200}'
```

#### Insert products

Run the following commands to insert products

```shell
curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Avocado","price":10,"quantity":5}'
```

```shell
curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Avocado Oil","price":80,"quantity":15}'
```

```shell
curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Gold","price":3000,"quantity":1}'
```

#### Read all users and products

Now go ahead and confirm that the records have been persisted

```shell
curl http://localhost:8080/users
```

```shell
curl http://localhost:8080/products
```

### Search

Now, search for users

```shell
curl http://localhost:8080/users/search \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"q":"john"}'
```

Or search for products named "avocado" and price less than 50

```shell
curl localhost:8080/products/search \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{
        "q": "avocado",
        "searchFields": ["name"],
        "filter": {"price": {"$lt": 50}}
      }'
```

# Contributing

## Code Quality

### 1. Linting

The coding style rules are defined by [Prettier](https://prettier.io/) and
enforced by [Eslint](https://eslint.org)

### 2. Git Hooks

We use [pre-commit](https://pre-commit.com/index.html) to automatically
setup and run git hooks.

Install the pre-commit hooks as follows:

```shell
pre-commit install
```

On every `git commit` we check the code quality using prettier and eslint.

# License

This software is licensed under the [Apache 2.0](LICENSE).
