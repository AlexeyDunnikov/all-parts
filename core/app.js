const express = require('express');
const db = require('../database');

class Application {
    constructor() {
        Application.instance = this;

        this.express = new express();
        this.db = new db({
            host: "localhost",
            user: "root",
            password: "root",
            database: "allparts",
        }).connect();
    }

    static getInstance() {
        if(Application.instance === null) {
            return new Application();
        }

        return Application.instance;
    }
}

module.exports = Application;