let express = require("express"),
    users = require("./users/users"),
    login = require("./app/login"),
    app = express();

app.set("port", (process.env.PORT || 9280));

app.listen(app.get("port"), function () {

    console.log("Server Started");

    login(users);

})
