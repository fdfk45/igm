module.exports = function (userInfo) {

    let locationUsers = [],
        getUserData = require("./getUserData");

    getLocationMedias();

    function getLocationMedias() {

        new userInfo.Client.Location.search(userInfo.session, userInfo.location).then(function (location) {

            new userInfo.Client.Feed.LocationMedia(userInfo.session, location[0].params.id, 7000).all().then(function (locationMedia) {

                locationMedia.forEach(function (user) {

                    locationUsers.push(user.params.account.username);

                })

                loopThroughLocationUsers();

            }).catch(function (err) {
                console.log(err.message);
                getLocationMedias();
            });

        }).catch(function (err) {
            console.log(err.message);
            getLocationMedias();
        });
    }

    function loopThroughLocationUsers() {

        if (userInfo.index < locationUsers.length) {

            getUserData(userInfo, locationUsers[userInfo.index]);

        } else {

            userInfo.index = 0;
            locationUsers = [];

            new userInfo.Client.Location.search(userInfo.session, userInfo.location).then(function (location) {

                new userInfo.Client.Feed.LocationMedia(userInfo.session, location[0].params.id, 7000).all().then(function (locationMedia) {

                    locationMedia.forEach(function (user) {

                        locationUsers.push(user.params.account.username);

                    })

                    loopThroughLocationUsers();

                }).catch(function (err) {
                    console.log(err.message);
                    getLocationMedias();
                });

            }).catch(function (err) {
                console.log(err.message);
                getLocationMedias();
            });

        }
    }

}
