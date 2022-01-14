const Application = require('../core/app');
const app = new Application();

require('../routes');

app.express.listen(3000, () => {});