const QueryBuilder = require('../lib/index');


const db = new QueryBuilder({
    host: '127.0.0.1',
    user: 'local',
    password: 'local',
    database: 'apiplatform'
});

db.connect();

describe("CRUD Tests", function(){

    describe("Setting table test", function() {
        it('Should throw No table set', () => {
            expect(() => db.execute("SELECT * FROM users")).toThrow("TABLE_NULL");
        });
    });

    // INSERTING TESTS
    describe("Inserting tests", function() {
        it('Should throw No table was set error', () => {
            expect(() => db.insert({
                username: 'test',
                password: 'test',
                mail: 'test@test.test'
            }).execute()).toThrow('TABLE_NULL');
        })

    
        it('Should throw a bad field error', () => {
            db.setTable('users');
            expect(() => db.insert({
                username: 'test',
                password: 'test',
                mai: 'test@test.test' // Bad field
            }).execute()).toThrow('ER_BAD_FIELD_ERROR');
        });
    
        it('Should not throw an error', () => {
            expect(() => db.insert({
                username: 'toselect',
                password: 'test',
                mail: 'test@test.test'
            }).execute()).not.toThrowError();
        });
    });

    // SELECT TESTS
    describe("Select tests", function() {
        it('Should throw No table was set error', () => {
            db.table = '';
            expect(() => db.select().execute()).toThrow('TABLE_NULL');
        });

        it('Should throw a bad field error', () => {
            db.setTable('users');
            expect(() => db.select('foo, bar').execute()).toThrow('ER_BAD_FIELD_ERROR');
        });
    
        // To be continued
    });
})