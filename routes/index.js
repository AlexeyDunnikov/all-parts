const Application = require("../core/app");
const app = Application.getInstance();

const test = require('./test');

app.express.use(test);