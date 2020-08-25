const express = require("express")
const db = require("../data/config")
const userModel = require("./user-model")
const { validateUserId } = require("./user-middleware")

const router = express.Router()

router.get("/users", async (req, res, next) => {
	try {
		res.json(await db("users"))
	} catch(err) {
		next(err)
	}
})

router.get("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		res.json(req.user)
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const [id] = await db("users").insert(req.body)
		const user = await db("users").where({ id }).first()

		res.status(201).json(user)
	} catch(err) {
		next(err)
	}
})

router.put("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).update(req.body)
		const user = await db("users").where({ id }).first()
		
		res.json(user)
	} catch(err) {
		next(err)
	}
})

router.delete("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).del()

		res.status(204).end()
	} catch(err) {
		next(err)
	}
})

// using SQL in JS 

// get posts from a user id
router.get("/users/:id/posts", validateUserId(), async (req, res, next) => {
	try {
		const posts = await userModel.findPostByUserId(req.params.id)

		// move to helper function file
		// const posts = await db("posts as p")
		// 	.innerJoin("users as u", "u.id", "posts.user_id")
		// 	.where("p.user_id", req.params.id)
		// 	.select("p.id", "p.contents", "u.username") 

		res.json(posts)
	} catch(err) { 
		next(err)
	}
})

// // get info from single post?
// router.get("/users/:id/posts/:id", validateUserId(), async (req, res, next) => {
// 	try {
// 		const posts = await db("post as p")
// 			.innerJoin("users as u", "u.id", "posts.user_id")
// 			.where("p.user_id", req.params.id)
// 			.select("p.id", "p.contents", "u.username") 

// 		res.json(posts)
// 	} catch(err) { 
// 		next(err)
// 	}
// })

// delete post

// router.delete("/users/:id/posts/:id", validateUserId(), async (req, res, next) => {
// 	try {
// 		const { id } = req.params
// 		await db("users").where({ id }).del()

// 		res.status(204).end()
// 	} catch(err) {
// 		next(err)
// 	}
// })

module.exports = router
