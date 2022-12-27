const QueryBuilder = require('../lib/index');


const db = new QueryBuilder({
    host: '127.0.0.1',
    user: 'local',
    password: 'local',
    database: 'apiplatform'
});

db.connect();

describe("CRUD Tests", function(){

    // INSERTING TESTS
    describe("Inserting tests", function() {
    
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
                username: 'test',
                password: 'test1',
                mail: 'test@test.test'
            }).execute()).not.toThrowError();
        });
    });

    // CRUD TEST
    describe("CRUD on an user", function() {
        db.setTable('users');
        it('Should create an user named John Doe', () => {
            expect(() => db.insert({
                username: 'johndoe',
                password: 'johntheripper',
                mail: 'john-doe@proton.me'
            }).execute()).not.toThrowError();
        });

        it('Should select the id of John Doe', () => {
            let res = db.select('id').where('username', 'johndoe').execute().fetch();
            expect(Object.keys(res).length).toBe(1)
        });

        it('Should update user information', () => {
            let res = db.select('id').where('username', 'johndoe').execute().fetch();
            let id = res.id;
            
            db.update({username: 'johnupdated'}).where('id', id).execute();

            res = db.select('id').where('username', 'johnupdated').execute().fetch();

            expect(Object.keys(res).length).toBe(1);
        });

        it('Should delete user', () => {
            let res = db.select('id').where('username', 'johnupdated').execute().fetch();
            let id = res.id;
            db.delete('id', id).execute();

            res = db.select('id').where('username', 'johnupdated').execute().fetch();

            expect(Object.keys(res).length).toBe(0);
        });
    });

    describe('Filter tests', function() {
        it("Should throw error using two 'where' filter", () => {
            expect(() => db.select('id').where('username', 'johndoe').where('id', 21).execute()).toThrow('WHERE_TWICE');
            db.contains_where = false;
        });

        it("Should find an user with 'where' and 'and' filter", () => {
            let res1 = db.select('id').where('username', 'test').and('password', 'test1').execute().fetch();
            expect(Object.keys(res1).length).toBe(1);
        });
    });
})