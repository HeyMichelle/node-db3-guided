const db = require("../data/config")

function findPostsByUserId(userID) {
    return db("posts as p")
        .innerJoin("users as u", "u.id", "p.user_id")
        .where("p.user_id", userID)
        .select("p.id", "p.contents", "u.username")
}

module.exports = {
    findPostsByUserId
}