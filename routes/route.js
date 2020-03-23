const router = require("express").Router();
const blog = require("../models/model");

router
  .route("/")
  .post(async (req, res) => {
    const post = await blog.create({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      color: req.body.color,
      weight: req.body.weight
    });
    console.log(post);
    res.send(`blog post ${post.name} created with id: ${post._id}`);
  })
  .get(async (req, res) => {
    console.log("empty")
    res.send(await blog.find({ age: { $gte: Number.parseInt(req.params.age) }}));
  });

router.route("/asd").get(async (req, res) => {
  console.log(req.query.age)
  res.send(await blog.find({ age: { $gte: req.query.age }, weight: { $gte: req.query.weight }, gender: { $eq: req.query.gender } }));
});

module.exports = router;
