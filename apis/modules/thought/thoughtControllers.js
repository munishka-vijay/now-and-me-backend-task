const thoughtRepository = require("./thoughtRepository");
const replyRepository = require("../reply/replyRepository");
const errorStrings = require("../../../utils/errors");

exports.addThought = async (text, isAnonymous, userId) => {
  try {
    // Save the thought to the database
    const thoughtAdded = await thoughtRepository.addThought(
      text,
      isAnonymous,
      userId
    );

    if (thoughtAdded.success) return { ...thoughtAdded };

    throw Error(thoughtAdded.error);
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.getAllThoughts = async (limit, offset) => {
  try {
    let thoughts = await thoughtRepository.getAllThoughts(limit, offset);

    // Handle error
    if (thoughts.error) throw Error(thoughts.error);

    // Remove userId field if the thought was posted anonymously
    for (let thought of thoughts) {
      if (thought.isAnonymous) {
        thought.userId = null;
      }
    }

    return { thoughts };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.getThoughtsByUserId = async(userid, limit, offset, requestUserId) => {
  try {
    const thoughts = await thoughtRepository.getThoughtsByUserId(userid, limit, offset); //Gets all thoughts of the given user id

    if (thoughts.error) throw Error(thoughts.error);

    if (userid === requestUserId) return { thoughts }; //If token matches with user id, then all thoughts of user are displayed
    //If token doesn't match with user id, then only non anonymous thoughts are displayed
    else {
      const filteredThoughts = thoughts.filter((thought) => thought.isAnonymous === false); //filtering non-anonymous thoughts
      return { filteredThoughts };
    }

    // Handle error
    
    
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }

}



exports.deleteThought = async (thoughtId, requestUserId) => {
  try {
    // Find the thought using ID to verify that it was posted by the user
    const thought = await thoughtRepository.findThoughtById(thoughtId);

    // Handle error
    if (thought.error){
      throw Error(thought.error);
    }

    // Check if the user making the request is the
    // same as the user who posted the thought
    if (thought.userId != requestUserId) {
      throw Error(errorStrings.UNAUTHORIZED);
    }

    const deleted = await thoughtRepository.deleteThought(thoughtId);

    // Handle error
    if (deleted.error) {
      throw Error(deleted.error);
    }

    // Delete all replies with the given thought ID
    await replyRepository.deleteRepliesByThoughtId(thoughtId);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};






// exports.getRemainingThoughts = async(userid, limit, offset) => {
//   try {
//     const remainingthoughts = await thoughtRepository.getRemainingThoughts(userid, limit, offset);
//     // Handle error
//     if (remainingthoughts.error) throw Error(remainingthoughts.error);
//     return { remainingthoughts };
//   } catch (err) {
//     return {
//       success: false,
//       error: err.toString(),
//     };
//   }

// }