const errors = {
    'CONN_NULL': 'No connection found',
    'QUERY_NULL': 'No query to execute',
    'TABLE_NULL': 'No table was set',
    'MISSING_DATABASE_INFOS': 'Missing database connection information(s)',
};


function error(code){
    const error = new Error(`${code}: ${errors[code]}`);
    error.code = code;
    return error;
}

module.exports = error;