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

## Compile and start the application

```shell
npm run build && npm run start
```

## Test the application

### Event Streaming

Run the following command in a new terminal window to watch the events stream in
real-time:

```shell
curl -N -X POST localhost:8080/users/subscribe
```

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

Now go ahead and confirm that data has been persisted in DB

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

# License

This software is licensed under the [Apache 2.0](LICENSE).
