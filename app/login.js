let Client = require('../instagram-private-api').V1,
    fs = require("fs"),
    _ = require("underscore"),
    getAccountFollowers = require("./getAccountFollowers"),
    getLocationMedia = require("./getLocationMedia"),
    getHashTagMedia = require("./getHashTagMedia"),
    unfollow = require("./unfollow");

module.exports = function (users) {
    let loginUsers = Object.keys(users),
        userSession = {},
        userConfig = {};
    loginUsers.forEach((user) => {
        let device = new Client.Device(user),
            storage;
        if (fs.existsSync('./cookies/' + user.split(".")[0] + ".json") !== true) {
            fs.writeFile('./cookies/' + user.split(".")[0] + ".json", "", function (err) {
                if (err) {
                    console.log(err);
                } else {
                    storage = new Client.CookieFileStorage('./cookies/' + user.split(".")[0] + ".json");
                    // storage = new Client.CookieMemoryStorage();
                    userSession[user] = Client.Session.create(device, storage, users[user].hashName, users[user].hashCode);
                    userConfig[user] = {
                        targetUser: users[user].targetUser,
                        hashTag: users[user].hashTag,
                        location: users[user].location,
                        userName: users[user].hashName,
                        userPass: users[user].hashCode,
                        sourceOfTarget: users[user].sourceOfTarget,
                        methodOfTarget: users[user].methodOfTarget,
                        hashTag: users[user].hashTag,
                        isUnfollow: users[user].isUnfollow,
                        isRunBot: users[user].isRunBot
                    }
                    startTask(user);
                }
            })
        } else {
            storage = new Client.CookieFileStorage('./cookies/' + user.split(".")[0] + ".json");
            //storage = new Client.CookieMemoryStorage();
            userSession[user] = Client.Session.create(device, storage, users[user].hashName, users[user].hashCode)
            userConfig[user] = {
                targetUser: users[user].targetUser,
                hashTag: users[user].hashTag,
                location: users[user].location,
                userName: users[user].hashName,
                userPass: users[user].hashCode,
                sourceOfTarget: users[user].sourceOfTarget,
                methodOfTarget: users[user].methodOfTarget,
                hashTag: users[user].hashTag,
                isUnfollow: users[user].isUnfollow,
                isRunBot: users[user].isRunBot
            }
            startTask(user);
        }
    })

    function startTask(user) {

        if (userConfig[user].isRunBot === true) {

            userSession[user].then(function (session) {
                let args = {
                    session,
                    fs,
                    Client,
                    _,
                    targetUser: userConfig[user].targetUser,
                    hashTag: users[user].hashTag,
                    location: users[user].location,
                    userName: userConfig[user].userName,
                    sourceOfTarget: users[user].sourceOfTarget,
                    methodOfTarget: users[user].methodOfTarget,
                    userPassword: userConfig[user].userPass,
                    isUnfollow: userConfig[user].isUnfollow,
                    index: 0,
                    followersOfAccount: [],
                    hashTagUsers: [],
                    count: 0
                }

                if (userConfig[user].isUnfollow === true) {

                    console.log(`Unfollow task - ${args.userName}`)

                    unfollow(args);

                } else {

                    if (userConfig[user].sourceOfTarget === "followers") {

                        console.log("Followers " + args.userName + " [ " + args.targetUser + " ]");

                        getAccountFollowers(args);

                    } else if (userConfig[user].sourceOfTarget === "hashtag") {

                        console.log("Hashtag " + args.userName + " [ " + args.hashTag + " ]");

                        getHashTagMedia(args);

                    } else if (userConfig[user].sourceOfTarget === "location") {

                        console.log("Location " + args.userName + " [ " + args.location + " ]");

                        getLocationMedia(args);

                    }

                }
            })

        } else {
            console.log(`Stopped bot running for - ${userConfig[user].userName}`);
        }

    }

}
