import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'twitter_clone_db',
    user: 'postgres',
    password: '1234',
});

async function test() {
    try {
        await client.connect();
        console.log('✅ PostgreSQL connection successful!');
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    } finally {
        await client.end();
    }
}

test();
