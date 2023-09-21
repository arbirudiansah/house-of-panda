# HouseOfPanda

House of Panda - Web3 Property

## Requirements

1. Mongodb
2. NodeJS
3. Redis
4. NPM/Yarn

## Running in Development

To run this project in development, follow these steps:

1. First, clone the project from Github.
```bash
$ git clone https://github.com/fatkhur1960/house-of-panda.git
```
2. Install dependencies.
```bash
$ yarn install
```
3. Copy the environment file and enter the required configuration.
```bash
$ cp .env-example .env
```
4. Encrypt the Admin/Owner private key by running the following command.
```bash
$ yarn cryptutil:encrypt --input=<private_key> --passwrord=<password>
```
5. Copy the encrypted private key and paste it into the `.env` file.
```env
...
ADMIN_KEY=encrypted_private_key
...
```
6. Check password validation
```bash
$ yarn cryptutil:validate --input=<encrypted_private_key> --passwrord=<password>
```
7. Finally, run the service by running the following command and enter the password used to encrypt the private key.
```bash
$ PASSWORD=testpasswd yarn dev
```

## Running in Production

To run this project in production, follow these steps:

1. First, clone the project from Github.
```bash
$ git clone https://github.com/fatkhur1960/house-of-panda.git
```
2. Install dependencies.
```bash
$ yarn install
```
3. Copy the environment file and enter the required configuration.
```bash
$ cp .env-example .env
```
4. Encrypt the Admin/Owner private key by running the following command.
```bash
$ yarn cryptutil:encrypt --input=<private_key> --password=<password>
```
5. Paste the encrypted private key into the `.env` file.
```env
...
ADMIN_KEY=encrypted_private_key
...
```
6. Build project
```bash
$ yarn build
```
7. Finally, run the service by running the following command and enter the password used to encrypt the private key.
```bash
$ ./start_service.sh
```