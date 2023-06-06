import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    /* when there are multiple related asynchronous tasks that the overall code relies on to work successfully*/
    const friends = await Promise.all(
      // retrieving each friend's information using their respective id with the User.findById method
      user.friends.map((id) => User.findById(id))
    );

    //extracting specific properties from each friend object.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* update*/

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    //see if the friend id is include in the user obj
    if (user.friends.include(friendId)) {
      //if true we want to remove the friend
      user.friends = user.friends.filter((id) => id !== friendId);
      //remove the user from there friends list
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      //if friend not in list then we add the friend
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    //we use this to format it for the frontend
    const friends = await Promise.all(
      // retrieving each friend's information using their respective id with the User.findById method
      user.friends.map((id) => User.findById(id))
    );

    //extracting specific properties from each friend object.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
