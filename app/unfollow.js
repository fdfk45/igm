module.exports = function (userInfo) {

    let stopUnfollow,
        following = [],
        unfollowers = [],
        index = 0,
        getLocationMedia = require("./getLocationMedia"),
        getHashTagMedia = require("./getHashTagMedia"),
        getAccountFollowers = require("./getAccountFollowers");

    unFollow();

    function unFollow() {

        userInfo.session.getAccount().then(function (a) {

            new userInfo.Client.Feed.AccountFollowing(userInfo.session, a.params.id).all().then(function (f) {

                f.forEach(function (i) {
                    following.push(i.params.id);
                })

                console.log("Id collected - " + following.length);

                checkUnfollowers();

                function checkUnfollowers() {

                    if (index < following.length) {

                        new userInfo.Client.Relationship.get(userInfo.session, following[index]).then(function (r) {

                            if (r.params.followed_by === false) {

                                unfollowers.push(following[index]);

                                index++
                                checkUnfollowers();

                            } else {
                                index++
                                checkUnfollowers();
                            }

                        }).catch(function (err) {
                            console.log(err.message);
                            checkUnfollowers()
                        })

                    } else {

                        console.log("Task begin " + userInfo.userName);

                        console.log("Unfollowers " + unfollowers.length);

                        startUnfollowing();

                        function startUnfollowing() {

                            let targetUserId;

                            if (unfollowers.length !== 0) {

                                targetUserId = unfollowers.pop();

                                new userInfo.Client.Relationship.get(userInfo.session, targetUserId).then(function (r) {

                                    if (r.params.followed_by === false) {

                                        new userInfo.Client.Relationship.destroy(userInfo.session, targetUserId).then(function (u) {

                                            console.log(userInfo.userName + " - Unfollowers left " + unfollowers.length);

                                            setTimeout(function () {
                                                startUnfollowing()
                                            }, 120000)


                                        }).catch(function (err) {
                                            console.log(err.message);
                                            startUnfollowing();

                                        });
                                    }

                                }).catch(function (err) {
                                    console.log(err.message);
                                    startUnfollowing();

                                });

                            } else {
                                console.log("Done unfollowing");
                                setTimeout(function () {
                                    console.log("Start Like And Follow Task");
                                    if (userInfo.sourceOfTarget === "followers") {
                                        getAccountFollowers(userInfo);
                                    } else if (userInfo.sourceOfTarget === "hashtag") {
                                        getHashTagMedia(userInfo);
                                    } else if (userInfo.sourceOfTarget === "location") {
                                        getLocationMedia(userInfo);
                                    }
                                }, 3600000)
                            }


                        }

                    }

                }

            }).catch(function (err) {
                console.log(err.message);
                unFollow();

            })

        }).catch(function (err) {
            console.log(err.message);
            unFollow();
        })

    }

}
