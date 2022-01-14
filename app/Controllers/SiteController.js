const Application = require("../../core/app");
const app = Application.getInstance();

class SiteController {
    index(req, res) {
        try {
            // TODO: Not calling Exception
            app.db._connection.query("SELECT * FROM `users`");
            return res.send('Hello my World');
        } catch (e) {
            return res.send(e.message);
        }
    }
}

module.exports = SiteController;