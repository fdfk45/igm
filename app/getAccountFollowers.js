module.exports = function (userInfo) {

    let getUserData = require("./getUserData");

    loopThroughFollowers();

    function loopThroughFollowers() {

        if (userInfo.index < userInfo.followersOfAccount.length) {

            getUserData(userInfo, userInfo.followersOfAccount[userInfo.index]);

        } else {

            userInfo.index = 0;
            userInfo.followersOfAccount = [];

            new userInfo.Client.Account.searchForUser(userInfo.session, userInfo.targetUser).then(function (a) {

                new userInfo.Client.Feed.AccountFollowers(userInfo.session, a.params.id, 10000).all().then(function (f) {

                    f.forEach(function (user) {

                        userInfo.followersOfAccount.push(user.params.username);
                    })

                    loopThroughFollowers();

                }).catch(function (err) {
                    console.log(err.message);
                    loopThroughFollowers();
                });

            }).catch(function (err) {
                console.log(err.message);
                loopThroughFollowers();
            });

        }
    }

}
