const mongoose = require("mongoose");

const Thought = require("./thoughtModel");
const { DEFAULT_PAGE_LIMIT } = require("../../../utils/config");

//method to add a thought
exports.addThought = async (text, isAnonymous, userId) => {
  try {
    const newThought = new Thought({
      _id: new mongoose.Types.ObjectId(),
      text,
      isAnonymous,
      userId,
    });
    const result = await newThought.save();

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

//method to get all thoughts
exports.getAllThoughts = async (limit, offset) => {
  try {
    const thoughts = await Thought.find()
      .select("-__v")
      .skip(offset)
      .limit(limit || DEFAULT_PAGE_LIMIT)
      .populate("userId", "username isAnonymous");

    return thoughts;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

//method to get thought by thoughtid
exports.findThoughtById = async (thoughtId) => {
  try {
    const thought = await Thought.findOne({ _id: thoughtId });

    return thought;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

//method to get thoughts by userid
exports.getThoughtsByUserId = async (userid, limit, offset) => {
  try {
    const thoughts  = await Thought.find({userId:userid})
      .select("-__v")
      .skip(offset)
      .limit(limit || DEFAULT_PAGE_LIMIT)
    return thoughts;
    } catch (err) {
      return {
        success: false,
        error: err.toString(),
      };
    }
    
}

exports.getRemainingThoughts = async(userid, limit, offset) => {
  try{
    const thoughts = await Thought.find()
      .select("-__v")
      .skip(offset)
      .limit(limit || DEFAULT_PAGE_LIMIT)

    const remainingthoughts = thoughts.filter((thought) => thought.userId != userid && thought.isAnonymous == false)
    return remainingthoughts;
    } catch (err) {
      return {
        success: false,
        error: err.toString(),
      };
    }



}



//method to delete thought by thoughtid
exports.deleteThought = async (thoughtId) => {
  try {
    const deleted = await Thought.deleteOne({ _id: thoughtId });

    return { success: deleted };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
