const QueryBuilder = require('../lib/index');

describe('Connection testing', function() {
    it('Should throw missing database field error', () => {
        expect(() => {
            const db = new QueryBuilder({
                host: '127.0.0.1',
                user: 'local',
                password: 'local',
                db_name: 'apiplatform' // Wrong field
            });
        }).toThrow("MISSING_DATABASE_INFOS");
    });
});