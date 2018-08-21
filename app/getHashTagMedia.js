module.exports = function (userInfo) {

    let getUserData = require("./getUserData");

    loopThroughHashTagUsers();

    function loopThroughHashTagUsers() {

        if (userInfo.index < userInfo.hashTagUsers.length) {

            getUserData(userInfo, userInfo.hashTagUsers[userInfo.index]);

        } else {

            userInfo.index = 0;
            userInfo.hashTagUsers = [];

            new userInfo.Client.Feed.TaggedMedia(userInfo.session, userInfo.hashTag, 1000).all().then(function (hashTagMedia) {

                hashTagMedia.forEach(function (user) {

                    userInfo.hashTagUsers.push(user.params.account.username);

                })
                loopThroughHashTagUsers();

            }).catch(function (err) {
                console.log(err.message);
                loopThroughHashTagUsers();
            });
        }
    }

}
