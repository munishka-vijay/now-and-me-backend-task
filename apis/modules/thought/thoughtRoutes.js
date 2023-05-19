const express = require("express");
const router = express.Router();

const thoughtControllers = require("./thoughtControllers");
const thoughtValidators = require("./thoughtValidators");
const checkAuth = require("../../middleware/userAuth");
const errorStrings = require("../../../utils/errors");

//post the thought
router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Validate request body
    const validated = await thoughtValidators.validateThought(req);
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const thoughtInfo = req.body;
    const userId = req.user.userId;
    const thoughtData = await thoughtControllers.addThought(
      thoughtInfo.text,
      thoughtInfo.isAnonymous,
      userId
    );

    if (thoughtData.error) throw Error(errorStrings.SOMETHING_WENT_WRONG);

    return res.status(201).json(thoughtData.data);
  } catch (err) {
    next(err);
  }
});

//get all thoughts
router.get("/", checkAuth, async (req, res, next) => {
  try {
    // Validate request body
    const validated = await thoughtValidators.validateQuery(req); //to validate the values of limit and offset variables
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for getting all thoughts
    const { limit, offset } = req.query;
    const thoughts = await thoughtControllers.getAllThoughts(limit, offset);

    if (thoughts.error) throw Error(errorStrings.SOMETHING_WENT_WRONG);

    return res.status(200).json(thoughts);
  } catch (err) {
    next(err);
  }
});

//get thoughts by user id
router.get("/user/:userId", checkAuth, async (req, res, next) => {
  try{
    //validate request parameters
    const queryvalidated = await thoughtValidators.validateQuery(req);
    if (queryvalidated.error) {
    const error = new Error(errorStrings.INVALID_REQUEST);
    error.status = 400;
    return next(error);
  }

  //validate id given
  const idvalidated = await thoughtValidators.validateUserId(req);
  if (idvalidated.error) {
    const error = new Error(errorStrings.INVALID_ID);
    error.status = 400;
    return next(error);
  }

  // Following business logic for getting thoughts by userid
  const { userId } = req.params;
  const { limit, offset } = req.query;
  const thoughts = await thoughtControllers.getThoughtsByUserId(userId, limit, offset, req.user.userId);

  if (thoughts.error) throw Error(errorStrings.SOMETHING_WENT_WRONG);
  return res.status(200).json(thoughts);


  } catch (err) {
    next(err);
  }

    
});

// Delete thought by thought id
router.delete("/:thoughtId", checkAuth, async (req, res, next) => {
  try {
    // Validate request params
    const validated = await thoughtValidators.validateThoughtId(req);
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { thoughtId } = req.params;
    const deleted = await thoughtControllers.deleteThought(
      thoughtId,
      req.user.userId
    );

    if (deleted.error) throw Error(deleted.error);

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;