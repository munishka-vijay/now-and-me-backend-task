const express = require("express");
const router = express.Router({ mergeParams: true });

const replyControllers = require("./replyControllers");
const replyValidators = require("./replyValidators");
const checkAuth = require("../../middleware/userAuth");
const errorStrings = require("../../../utils/errors");

//post reply to a thought
router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Validating request body and params
    const validatedBody = await replyValidators.addReplyBody(req);
    const validatedParams = await replyValidators.addReplyParams(req);
    if (validatedBody.error || validatedParams.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Following business logic for posting thought
    const replyInfo = req.body;
    const { thoughtId } = req.params;
    const { userId } = req.user;
    const replyData = await replyControllers.addReply(
      replyInfo.text,
      replyInfo.isAnonymous,
      userId,
      thoughtId
    );

    if (replyData.error) throw Error(errorStrings.SOMETHING_WENT_WRONG);

    return res.status(201).json(replyData.data);
  } catch (err) {
    next(err);
  }
});

//get all replies to a thought
router.get("/", async (req, res, next) => {
  try {
    // Validating request query and parsm
    const validatedQuery = await replyValidators.getAllRepliesOnAThoughtQuery(
      req
    );
    const validatedParams = await replyValidators.getAllRepliesOnAThoughtParams(
      req
    );
    if (validatedQuery.error || validatedParams.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { limit, offset } = req.query;
    const { thoughtId } = req.params;
    const thoughts = await replyControllers.getAllRepliesOnAThought(
      thoughtId,
      limit,
      offset
    );

    if (thoughts.error) throw Error(errorStrings.SOMETHING_WENT_WRONG);

    return res.status(200).json(thoughts);
  } catch (err) {
    next(err);
  }
});

//delete replies to thought when thought is deleted
router.delete("/:replyId", checkAuth, async (req, res, next) => {
  try {
    // Validate request body
    const validated = await replyValidators.deleteReply(req);
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { replyId, thoughtId } = req.params;
    const { userId } = req.user;
    const deleted = await replyControllers.deleteReply(
      replyId,
      thoughtId,
      userId
    );

    if (deleted.error) throw Error(deleted.error);

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;