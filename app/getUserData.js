module.exports = function (userInfo, username) {

    let cheerio = require("cheerio"),
        request = require("request"),
        getAccountFollowers = require("./getAccountFollowers"),
        getLocationMedia = require("./getLocationMedia"),
        getHashTagMedia = require("./getHashTagMedia"),
        like = require("./like"),
        follow = require("./follow"),
        likeAndFollow = require("./likeAndFollow");

    request("https://www.instagram.com/" + username, function (err, res, body) {

        let $,
            $script,
            sharedData = null,
            sharedDataJson = null,
            shareData = null,
            userInstaInfo = {};


        if (err) {
            console.log("Error requesting page");
            userInfo.index++;
            if (userInfo.sourceOfTarget === "followers") {
                getAccountFollowers(userInfo);
            } else if (userInfo.sourceOfTarget === "hashtag") {
                getHashTagMedia(userInfo);
            } else if (userInfo.sourceOfTarget === "location") {
                getLocationMedia(userInfo);
            }
        } else {

            $ = cheerio.load(body);
            $script = $("script:not([src])");

            $script.each(function () {

                var text = $(this).html();

                if (text.includes('window._sharedData = {')) {
                    sharedData = text;
                }

            })

            if (sharedData === null) {
                console.log("window._sharedData not found");
                userInfo.index++;
                if (userInfo.sourceOfTarget === "followers") {
                    getAccountFollowers(userInfo);
                } else if (userInfo.sourceOfTarget === "hashtag") {
                    getHashTagMedia(userInfo);
                } else if (userInfo.sourceOfTarget === "location") {
                    getLocationMedia(userInfo);
                }
            } else {
                shareData = sharedData.replace('window._sharedData = ', '').replace('};', '}');
                try {
                    sharedDataJson = JSON.parse(shareData)
                } catch (err) {
                    console.log(err.message);
                    userInfo.index++;
                    if (userInfo.sourceOfTarget === "followers") {
                        getAccountFollowers(userInfo);
                    } else if (userInfo.sourceOfTarget === "hashtag") {
                        getHashTagMedia(userInfo);
                    } else if (userInfo.sourceOfTarget === "location") {
                        getLocationMedia(userInfo);
                    }
                }

                if (sharedDataJson !== null) {

                    if (!sharedDataJson.entry_data["ProfilePage"]) {
                        console.log("Key not found");
                        userInfo.index++;
                        if (userInfo.sourceOfTarget === "followers") {
                            getAccountFollowers(userInfo);
                        } else if (userInfo.sourceOfTarget === "hashtag") {
                            getHashTagMedia(userInfo);
                        } else if (userInfo.sourceOfTarget === "location") {
                            getLocationMedia(userInfo);
                        }
                    } else {

                        userInstaInfo.userInfo = sharedDataJson.entry_data["ProfilePage"][0].graphql.user;

                        userInstaInfo.userProfilePic = userInstaInfo.userInfo.profile_pic_url;
                        userInstaInfo.userExternalUrl = userInstaInfo.userInfo.external_url;
                        userInstaInfo.userExternalUrlIncludesFB = userInstaInfo.userExternalUrl !== null ? userInstaInfo.userInfo.external_url.toLowerCase().includes("facebook") : false;
                        userInstaInfo.userFollowing = userInstaInfo.userInfo.edge_follow.count;
                        userInstaInfo.userFollowers = userInstaInfo.userInfo.edge_followed_by.count;
                        userInstaInfo.userId = parseInt(userInstaInfo.userInfo.id);
                        userInstaInfo.userMediaCount = userInstaInfo.userInfo.edge_owner_to_timeline_media.count;
                        userInstaInfo.userIsPrivate = userInstaInfo.userInfo.is_private;
                        userInstaInfo.userBio = userInstaInfo.userInfo.biography;
                        userInstaInfo.username = userInstaInfo.userInfo.username;
                        userInstaInfo.userFullName = sharedDataJson.entry_data["ProfilePage"][0].graphql.user.full_name;
                        userInstaInfo.checkUserFullName = userInstaInfo.userFullName === null ? null : userInstaInfo.userFullName.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/) === null ? null : userInstaInfo.userFullName;
                        userInstaInfo.checkUserBio = userInstaInfo.userBio === null ? null : userInstaInfo.userBio.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/) === null ? null : userInstaInfo.userBio;


                        if (userInfo.methodOfTarget === "like") {
                            like(userInstaInfo, userInfo);
                        } else if (userInfo.methodOfTarget === "likeandfollow") {
                            likeAndFollow(userInstaInfo, userInfo);
                        } else if (userInfo.methodOfTarget === "follow") {
                            follow(userInstaInfo, userInfo);
                        }

                    }

                }

            }

        }

    })

}
