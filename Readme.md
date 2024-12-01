
# Todo Application

## how to run it?

- prod db
you will need to have access to the environment variables for production database.
for this, go see @Aymen for this.

- developement

- for the front end

1. please take a look at each env-example file and copy them in the same directory
under the following name: `.env`. change the values in
them to reflect the values you want.
2. run `docker compose up --build` in the root directory and you will
have a mongodb running along with the backend.
3. run `node index.js` to run the backend.

-- for the backend

1. comment out the backend container in compose and simply run the mongodb container while keep the `.env` variables
accurate for access to the DB and develop end points with postman.
