# Photo Carousel - SDC

> Photo Carousel component of Qsty by Team 6 Geese Witherspoon

## Table of Contents

1. [API](#API)
1. [Requirements](#requirements)
1. [Development](#development)

## API

GET /api/listing/:productId
- Get the images associated to product id
POST /api/listing
- Create a new image entry in the database
PUT /api/listing/:productId
- Update the image entity associated to product id
DELETE
- Delete the image entity associated to product id

app.post('/api/listing', (req, res) => {
  res.send('create an entry in the database');
})

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
