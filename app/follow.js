module.exports = function (userInstaInfo, userInfo) {
    let getAccountFollowers = require("./getAccountFollowers"),
        getLocationMedia = require("./getLocationMedia"),
        getHashTagMedia = require("./getHashTagMedia"),
        unfollow = require("./unfollow"),
        names = require("humannames"),
        surnames = userInfo.fs.readFileSync("./data/surname.csv").toString().split(","),
        firstNameOfFemale = require("../data/firstNameOfFemale").firstNames,
        firstNameOfMale = require("../data/firstNameOfMale").firstNames,
        fs = require("fs"),
        a = "",
        aS = [],
        gender = require("gender");

    checkUserRequirements();

    function checkUserRequirements() {

        let matchUserFullName, getUserFullName, userFirstName, userLastName;

        new userInfo.Client.Relationship.get(userInfo.session, userInstaInfo.userId).then(function (r) {

            if (r.params.following === false) {

                if (userInstaInfo.userFollowing > userInstaInfo.userFollowers && userInstaInfo.userIsPrivate === false) {
                    follow();
                } else {
                    userInfo.index++;
                    if (userInfo.sourceOfTarget === "followers") {
                        getAccountFollowers(userInfo);
                    } else if (userInfo.sourceOfTarget === "hashtag") {
                        getHashTagMedia(userInfo);
                    } else if (userInfo.sourceOfTarget === "location") {
                        getLocationMedia(userInfo);
                    }
                }

            } else {
                userInfo.index++;
                if (userInfo.sourceOfTarget === "followers") {
                    getAccountFollowers(userInfo);
                } else if (userInfo.sourceOfTarget === "hashtag") {
                    getHashTagMedia(userInfo);
                } else if (userInfo.sourceOfTarget === "location") {
                    getLocationMedia(userInfo);
                }
            }
        }).catch(function (err) {
            console.log("Error here");
            console.log(err.message);
            if (userInfo.sourceOfTarget === "followers") {
                getAccountFollowers(userInfo);
            } else if (userInfo.sourceOfTarget === "hashtag") {
                getHashTagMedia(userInfo);
            } else if (userInfo.sourceOfTarget === "location") {
                getLocationMedia(userInfo);
            }
        });
    }

    function follow() {

        new userInfo.Client.Relationship.get(userInfo.session, userInstaInfo.userId).then(function (r) {

            if (r.params.following === false) {

                new userInfo.Client.Relationship.create(userInfo.session, userInstaInfo.userId).then(function (u) {

                    userInfo.count++;
                    userInfo.index++;
                    console.log(`${userInfo.userName} - Total Users follow ${userInfo.count} - ${userInstaInfo.username}`);

                    if (userInfo.count <= 501) {

                        setTimeout(function () {
                            if (userInfo.sourceOfTarget === "followers") {
                                getAccountFollowers(userInfo);
                            } else if (userInfo.sourceOfTarget === "hashtag") {
                                getHashTagMedia(userInfo);
                            } else if (userInfo.sourceOfTarget === "location") {
                                getLocationMedia(userInfo);
                            }
                        }, 300000)
                    } else {
                        console.log("Stop Follow Task");
                        setTimeout(function () {
                            userInfo.index = 0;
                            userInfo.count = 0;
                            console.log("Start Unfollow Task");
                            unfollow(userInfo);
                        }, 7200000)
                    }
                }).catch(function (err) {
                    console.log(err.message);
                    userInfo.index++;
                    if (userInfo.sourceOfTarget === "followers") {
                        getAccountFollowers(userInfo);
                    } else if (userInfo.sourceOfTarget === "hashtag") {
                        getHashTagMedia(userInfo);
                    } else if (userInfo.sourceOfTarget === "location") {
                        getLocationMedia(userInfo);
                    }
                });

            } else {
                userInfo.index++;
                if (userInfo.sourceOfTarget === "followers") {
                    getAccountFollowers(userInfo);
                } else if (userInfo.sourceOfTarget === "hashtag") {
                    getHashTagMedia(userInfo);
                } else if (userInfo.sourceOfTarget === "location") {
                    getLocationMedia(userInfo);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
            userInfo.index++;
            if (userInfo.sourceOfTarget === "followers") {
                getAccountFollowers(userInfo);
            } else if (userInfo.sourceOfTarget === "hashtag") {
                getHashTagMedia(userInfo);
            } else if (userInfo.sourceOfTarget === "location") {
                getLocationMedia(userInfo);
            }
        });

    }
}
