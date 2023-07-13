import Pool from "pg";

const pool = new Pool.Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "ermtest"
});

export default pool;