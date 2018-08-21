module.exports = {
    "username": {
        hashName: "",/* username */
        hashCode: "",/* password */
        targetUser: "",/* account to target when source of target is set to followers */
        sourceOfTarget: "",/* followers,hashtag,location */
        methodOfTarget: "",/* like,likeandfollow,follow */
        hashTag: "",/* hashtag to target when source of target is set to hashtag */
        location: "",/* location to target when source of target is set to location */
        isUnfollow: false,/* when true, will start unfollowing people and vice versa when false */
        isRunBot: true /* when true, bot will start running and vice versa when false */
    }
}
