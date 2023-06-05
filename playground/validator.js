const router = require("express").Router();
const { check, validationResult } = require("express-validator");

router.get("/validator", (req, res, next) => {
  res.render("playground/signup", { title: "validator playground" });
});

router.post(
  "/validator",
  [
    check("username")
      .not()
      .isEmpty().withMessage('Username Can not empty')
      .isLength({ max: 15 })
      .withMessage(`Username can not be greater than 15 Character`),

    check("email").isEmail().withMessage("Please Provide A Valid Email"),
  ],

  (req, res, next) => {
    let errors = validationResult(req);
    console.log(errors);
    res.render("playground/signup", { title: "validator playground" });
  }
);

module.exports = router;
