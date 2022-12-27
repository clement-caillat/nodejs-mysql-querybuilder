
#  QueryBuilder

## Installation

```bash
npm install nodejs-mysql-querybuilder --save
```

## Documentation
### Initialisation
```js
const QueryBuilder = require('nodejs-mysql-querybuilder');

const db = new QueryBuilder({
	host: 'localhost',
	user: 'user',
	password: 'password',
	database: 'database'
});

db.setTable('table');
db.connect();
```

### Select
The select method take one string parameter

```js
db.setTable('users');
db.select('username, password')
	.where('id', 12)
	.and('mail', 'test@test.com');
db.execute();
const res = db.fetch();
```
### Insert
The select method take an **object** as parameter

```js
db.setTable('users');
db.insert({
	username: 'johndoe',
	password: 'foobar',
	mail: 'johndoe@test.com'
});

db.execute();
```

### Update
The Update method take an object as parameter and need a **where** filter

```js
db.setTable('users');
db.update({
	username: 'johndoe',
	password: 'foobar',
	mail: 'johndoe@test.com'
});

db.where('id', 12);
db.execute();
```

### Delete
The Delete method take two parameters

```js
db.setTable('users');
db.delete('id', 12);
db.execute();
```

## Filters

### Where
**where** filter is unique, you need to use **and** if you need another filter 
```js
db.setTable('users');
db.select('username, password').where('id', 12).execute();
let res = db.fetchAll();
```

### And 
```js
db.setTable('users');
db.select('username, password').where('id', 12).and('mail', 'test@test.com').execute();
let res = db.fetchAll();
```

### Or
```js
db.setTable('users');
db.select().where('id', 12).or('mail', 'test@test.com').execute();
let res = db.fetchAll();
```

## Join
```js
db.setTable('users');
db.select('users.username, messages.message')
	.join('INNER', 'messages')
	.on('messages.iduser', 'users.id');
```