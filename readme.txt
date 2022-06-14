
<h1 align="center">Axis - Chatbot Microservice</h1>
<h3 align="center">Chatbot - Client - Customer</h3>


Getting Started
--
* This is the microservice of **Axis-CRM application**.
* Axis-chatbot! 0.1 [version history](#).

What is Axis-chatbot?
--
* Axis-chatbot is a microservice of **Axis Content Management System** (CMS) which enables you to powerful online chat application or chatbot.
* It is a simple and powerful web server application which requires a server with nodejs and MySQL to run on backend.
* It require two application on frontend
    - Client
    - Customer
    
Libraries uses on frontend are (auth0, socket.IO, material-ui, redux, redux-saga)



**Steps to setup the local project:**
- Clone the repository:
```bash
git clone "link"
```
- Go to the axis-chatbot folder:
```bash
cd axis-chatbot
```
- Go to the dev branch:
```bash
git checkout dev
```


Database
--

* Import Updated DataBase in MySQL

Backend: **Axis-chatbot**
--


To use the bot backend, install the packages 
```
npm i
```

add .env file, sample is given below.

```
PORT=4000
API_URL=""
SECRET_KEY=""
AUTH0_USER_METADATA=""
DB_DIALECT="mysql"
DB_HOST=""
DB_PORT=""
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
DB_max=5
DB_min=0
DB_idle=30000
DB_acquire=10000

```

To test the bot backend `npm start`

Server start running at http://localhost:4000

Frontend: Client
--

Go to the client directory:
```bash
cd client
```


To use the bot frontend: client, install the packages
```
npm i
```
add .env file, sample is given below.
```

REACT_APP_EMAIL=
REACT_APP_NODE_API=
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=

```

To test the bot frontend `npm start`

Server start running at http://localhost:3003

Frontend: Customer
--


Go to the customer directory:
```bash
cd customer
```

To use the bot frontend: customer, install the packages

```
npm i
```

add .env file, sample is given below.
```
REACT_APP_NODE_API=

```

To test the bot frontend `npm start`

Server start running at http://localhost:3002


Working on project
--
> Run concurrently all applications for development
```
npm run dev
```

After starting customer project in the browser. Just add the tenant_id as the query parameter in the url of the customer side.
Url for the customer side: {{url}}/index.html?tenant_id=7. Then start messages over client and customer.

_**Note:**_ make sure tenant_id/user must exist in database.

 



Languages and Tools
--
 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> 
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> 
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> 
<a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> 




Copyright
--
* Copyright (C) 2022. All rights reserved. [Axis](#)

