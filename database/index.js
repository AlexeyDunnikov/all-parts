const mysql = require('mysql2');

class Database {
    constructor(props) {
        this.host = props.host;
        this.user = props.user;
        this.password = props.password;
        this.database = props.database;

        this._connection = null;
    }

    connect() {
        this._connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        });

        return this;
    }
}

module.exports = Database;