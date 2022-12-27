const MySQL = require('sync-mysql');
const error = require(__dirname + '/error');

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
        this.contains_where = false;
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

    #reset()
    {
        this.query = '';
        this.contains_where = '';
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
            this.#reset();
            return this;
        }
        catch(error) {
            this.#reset();
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
        if (this.data.length == 0) return 0;
        return this.data[0];
    }

    fetchAll()
    {
        if (this.data.length == 0) return 0;
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

    update(data) // HTTP PUT
    {
        let v = [];

        for (let i in data)
        {
            v.push(`${i}='${data[i]}'`);
        }

        this.query = `UPDATE ${this.table} SET ${v.join(',')} `;
        return this;
    }

    delete(f, v) // HTTP DELETE
    {
        this.query = `DELETE FROM ${this.table} WHERE ${f}='${v}' `
        return this;
    }


    // Filter methods
    where(k, v)
    {
        if (this.contains_where) throw error('WHERE_TWICE');

        this.query += `WHERE ${k}='${v}' `;

        this.contains_where = true;
        return this;
    }

    on(k, v)
    {
        this.query += `ON ${k}=${v} `;
        return this;
    }

    and(k, v)
    {
        this.query += `AND ${k}='${v}' `;
        return this;
    }

    or(k, v)
    {
        this.query += `OR ${k}='${v}'`;
        return this;
    }

    join(joint, table)
    {
        this.query += `${joint} JOIN ${table} `
        return this;
    }


}



module.exports = QueryBuilder;