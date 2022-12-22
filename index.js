const MySQL = require('sync-mysql');
require('dotenv').config();

class QueryBuilder
{
    constructor(json)
    {
        // DB Credentials
        this.host = json.host;
        this.user = json.user;
        this.password = json.password;
        this.db_name = json.db_name;

        // Instanciate attributes
        this.connection = null;
        this.table = '';
        this.query = '';
        this.data = [];
    }

    // Connection to MySQL
    connect()
    {
        this.connection = new MySQL({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.db_name
        });
    }

    // Declare concerned table
    setTable()
    {
        this.table = table;
    }

    // Execute a query
    query(query)
    {
        this.data = this.connection.query(query);
    }



}



module.exports = QueryBuilder;