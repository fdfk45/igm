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

            if (r.params.following === false) { //check if I'm not following the user

                if (userInstaInfo.userIsPrivate === false && userInstaInfo.userMediaCount >= 3) {
                    followAndLike();
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

    function followAndLike() {

        let i = 1;

        function likeLastThreePictures(m) {

            if (i <= 3) {

                new userInfo.Client.Like.create(userInfo.session, m[m.length - i].params.id).then(function (d) {

                    if (i === 3) {

                        userInfo.count++;
                        userInfo.index++;
                        console.log(`${userInfo.userName} - Total Users Like ${userInfo.count} - ${userInstaInfo.username}`);

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
                            console.log("Stop Like Task");
                            setTimeout(function () {
                                userInfo.index = 0;
                                userInfo.count = 0;
                                console.log("Start like Task");
                                if (userInfo.sourceOfTarget === "followers") {
                                    getAccountFollowers(userInfo);
                                } else if (userInfo.sourceOfTarget === "hashtag") {
                                    getHashTagMedia(userInfo);
                                } else if (userInfo.sourceOfTarget === "location") {
                                    getLocationMedia(userInfo);
                                }
                            }, 7200000)
                        }
                    } else {
                        i++;
                        setTimeout(() => {
                            likeLastThreePictures(m);
                        }, 30000)
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
                })

            }

        }

        function likeLastThreePicturesAndFollow(m) {

            if (i <= 3) {

                new userInfo.Client.Like.create(userInfo.session, m[m.length - i].params.id).then(function (d) {

                    if (i === 3) {

                        new userInfo.Client.Relationship.create(userInfo.session, userInstaInfo.userId).then(function (u) {

                            userInfo.count++;
                            userInfo.index++;
                            console.log(`${userInfo.userName} - Total Users Like And Follow ${userInfo.count} - ${userInstaInfo.username}`);

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
                                console.log("Stop Like Task");
                                setTimeout(function () {
                                    userInfo.index = 0;
                                    userInfo.count = 0;
                                    console.log("Start like Task");
                                    if (userInfo.sourceOfTarget === "followers") {
                                        getAccountFollowers(userInfo);
                                    } else if (userInfo.sourceOfTarget === "hashtag") {
                                        getHashTagMedia(userInfo);
                                    } else if (userInfo.sourceOfTarget === "location") {
                                        getLocationMedia(userInfo);
                                    }
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
                        i++;
                        setTimeout(() => {
                            likeLastThreePicturesAndFollow(m);
                        }, 30000)
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
                })

            }

        }

        new userInfo.Client.Relationship.get(userInfo.session, userInstaInfo.userId).then(function (r) {

            if (r.params.following === false) {

                new userInfo.Client.Feed.UserMedia(userInfo.session, userInstaInfo.userId).all().then(function (m) {

                    if (userInstaInfo.userFollowing > userInstaInfo.userFollowers) {
                        likeLastThreePicturesAndFollow(m);
                    } else {
                        likeLastThreePictures(m);
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
                })

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
