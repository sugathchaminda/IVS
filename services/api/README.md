# IVS USER INFO  API

## Create config
- create dev.json inside /config

## Install dependency
- docker-compose run --service-ports --rm sc_node yarn install

## Seeds
- docker-compose run --service-ports --rm sc_node yarn seed:dev

## How run on local
- docker-compose run --service-ports --rm sc_node yarn server:dev

## How run unit tests
- docker-compose run --service-ports --rm sc_node yarn test
