# Healthy Club

## Requirements

-   node ~ v18.19.0
-   npm ~ v10.2.3
#Installation documentation MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools
-   MongoDB Database Tools ~ v100.9.4

## Usage

1. Clone project
2. Create `.env` file, copy content from [.env.example](./.env.example) to `.env` file and config in `.env`:

-   Config Runtime Environment

```bash
# development or production
NODE_ENV=development
HOST=localhost
PORT=3456
```

-   Config Project

```bash
APP_NAME=ExpressJS
APP_DEBUG=true
# server domain name
APP_URL_API=http://localhost:3456
# primary client domain name
APP_URL_CLIENT=http://localhost:3000
# other client domain name
# Eg: ["http://localhost:3001", "http://localhost:3002"]
OTHER_URLS_CLIENT=
# order management admin page url
URL_ADMIN_ORDER_MANAGEMENT=
# primary secret key
SECRET_KEY=
# expressed in seconds or a string describing a time span
# Eg: 60, 2 days, 10h, 7d
JWT_EXPIRES_IN=7d
# maximum number of requests per minute
REQUESTS_LIMIT_PER_MINUTE=100
```

-   Config MongoDb Database

```bash
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_AUTH_SOURCE=
```

-   Config Email

-   Config Vietqr Api
```bash
# api get qrcode
VIETQR_IMAGE_API=
```

3. Install package & setup

```bash
npm install
```

4. Initialize data (Required for new database)

```bash
npm run seed
```

5. Runs the app

```bash
npm run start
```

6. Builds the app for production to the `build` folder

```bash
npm run build
```

7. Setup PM2

```bash
pm2 start npm --name "your-app-name" -- start
#This will start your app and give it the name "your-app-name".
#PM2 will automatically restart your app if it crashes.
```

8. Runs the app on `production` mode

```bash
node build/main.js
```

9. Backup database

```bash
#Instructions for backing up the database
npm run backup-db
```
```bash
#Instructions for importing the database
#Eg: mongorestore --db "thansohoc_backup" "C:\Users\vuduy\Downloads\thansohoc_13-05-2024_19_07_29"
mongorestore --host <HOST> --port <PORT> --username <USERNAME> --password <PASSWORD> --authenticationDatabase <AUTH_DB> --db <DATABASE> <PATH_TO_BACKUP>
```

> Note: remember set `NODE_ENV=production` in `.env` file

##### Default account

```yaml
Email: admin@gmail.com
Password: Admin@123
```
