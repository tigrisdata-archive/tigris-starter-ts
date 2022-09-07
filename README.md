# RESTful Web App with Typescript and Tigris

[![ts-ci](https://github.com/tigrisdata/tigris-starter-ts/actions/workflows/ts-ci.yml/badge.svg?branch=main)](https://github.com/tigrisdata/tigris-starter-ts/actions/workflows/ts-ci.yml)

This is a Typescript web application that accepts HTTP requests to store and
retrieve data in the Tigris backend. The application uses express framework.

For more information please refer to: [Tigris documentation](https://docs.tigrisdata.com)

## Clone the repo

```shell
git clone https://github.com/tigrisdata/tigris-starter-ts.git
cd tigris-starter-ts
```

## Install Tigris CLI

### macOS
```shell
curl -sSL https://tigris.dev/cli-macos | sudo tar -xz -C /usr/local/bin
```

### Linux
```shell
curl -sSL https://tigris.dev/cli-linux | sudo tar -xz -C /usr/local/bin
```

## Start local Tigris instance
```shell
tigris local up
```

## Compile and start the application
```shell
npm run build && npm run start
```

## Test the application in new terminal window

### Insert users

Run following commands to create two users: John and Jane

```shell
curl localhost:8080/users/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"John","balance":100}'
    
curl localhost:8080/users/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Jane","balance":200}'
```

### Insert products

Run the following commands to insert products

```shell
curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Avocado","price":10,"quantity":5}'

curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Avocado Oil","price":80,"quantity":15}'
    
curl localhost:8080/products/create \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"name":"Gold","price":3000,"quantity":1}'
```

### Check the balances and stock

Now go ahead and confirm that data has been persisted in DB

```shell
curl http://localhost:8080/users/1
curl http://localhost:8080/products/1
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

## Publish
```shell
curl localhost:8080/product_updates/publish \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{
        "productId": 1,
        "price": 34
    }'
```

## Subscribe
```shell
curl -N -X POST localhost:8080/product_updates/subscribe
```

# License

This software is licensed under the [Apache 2.0](LICENSE).