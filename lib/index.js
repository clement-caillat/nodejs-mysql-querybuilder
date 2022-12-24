const MySQL = require('sync-mysql');
const error = require('../lib/error');
require('dotenv').config();

class QueryBuilder
{
    constructor(json)
    {
        // DB Credentials
        if (json == undefined
            || json.host == undefined
            || json.user == undefined
            || json.password == undefined
            || json.database == undefined)
        {
            throw error("MISSING_DATABASE_INFOS");
        }

        this.host = json.host;
        this.user = json.user;
        this.password = json.password;
        this.db_name = json.database;

        // Instanciate attributes
        this.connection = null;
        this.table = '';
        this.query = '';
        this.data = [];
    }

    // Connection to MySQL
    connect()
    {
        try
        {
            this.connection = new MySQL({
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.db_name
            });
            this.data = [];
        }
        catch (err)
        {
            throw err
        }
    }

    // Declare concerned table
    setTable(table)
    {
        this.table = table;
    }

    // Execute a full query
    execute(row = this.query)
    {
        try {
            if (this.connection == null)
            {
                throw error('CONN_NULL');
            }
            if (this.table == '')
            {
                throw error('TABLE_NULL');
            }
            if (row == null || row == '')
            {
                throw error('QUERY_NULL');
            }

            this.data = this.connection.query(row);

            return this.data;
        }
        catch(error) {
            throw error;
        }
    }

    // CRUD Methods

    select(query = '*') // HTTP GET
    {
        this.query = `SELECT ${query} FROM ${this.table} `;
        return this;
    }

    // Select fetch
    fetch()
    {
        return this.data[0];
    }

    fetchAll()
    {
        return this.data;
    }

    insert(data) // HTTP POST
    {
        // Data as json format
        let k = [];
        let v = [];

        for (let i in data)
        {
            k.push(i);
            v.push(`'${data[i]}'`);
        }

        this.query = `INSERT INTO ${this.table} (${k.join(',')}) VALUES (${v.join(',')})`;
        return this;
    }

    update(id, data) // HTTP PUT
    {
        let v = [];

        for (let i in data)
        {
            v.push(`${i}='${data[i]}'`);
        }

        this.query = `UPDATE ${this.table} SET ${v.join(',')} WHERE id='${id}' `;
        return this;
    }

    delete(f, v) // HTTP DELETE
    {
        this.query = `DELETE FROM ${this.table} WHERE ${f} = '${v}' `
        return this;
    }

}



module.exports = QueryBuilder;