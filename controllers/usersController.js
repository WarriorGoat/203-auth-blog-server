const User = require("../models/Users");

const {
  generatePasswordHash,
  validatePassword,
  generateUserToken,
  verifyToken,
} = require("../auth");

//Request and display all users
async function getAllUsers(req, res) {
  //query blogs
  try {
    const allUsers = await User.find({});
    res.json({
      success: true,
      blogs: allUsers,
    });
  } catch (e) {
    console.log(`Error Point 1` + e);
  }
}

//register a new user
const registration = async (req, res, next) => {
  try {
    //parse out fields from POST request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10.  Higher number is more secure, but requires more processing time.

    const passwordHash = await generatePasswordHash(password, saltRounds);

    //pass fields to new Blog model
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
    });

    //save our new entry to the database
    const savedData = await newUser.save();

    //return the successful request to the user
    res.json({
      success: true,
      blogs: savedData,
    });
  } catch (e) {
    console.log(typeof e);
    console.log(e);
    res.json({
      error: e.toString(),
    });
  }
};

// This section will allow a registered user to log in.
const logIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "Could not find user." }).status(204);
      return;
    }

    const isPWValid = await validatePassword(password, user.password);
    if (!isPWValid) {
      res
        .json({ success: false, message: "Password was incorrect." })
        .status(204);
      return;
    }

    const userType = email.includes("admin.com") ? "admin" : "user";
    const data = {
      date: new Date(),
      userId: user.id,
      scope: userType,
      email: email,
    };

    const token = generateUserToken(data);
    res.json({ success: true, token, email });
    return;
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.toString() });
  }
};

//display message depending on validity and status of login credentials
const message = (req, res, next) => {
  try {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const token = req.header(tokenHeaderKey);
    console.log("token ", token);
    const verifiedTokenPayload = verifyToken(token);

    if (!verifiedTokenPayload) {
      return res.json({
        success: false,
        message: "ID Token could not be verified",
      });
    }

    console.log(verifiedTokenPayload);
    const userData = verifiedTokenPayload.userData;

    if (userData && userData.scope === "user") {
      return res.json({
        success: true,
        message: `I am a normal user with the email: ${userData.email}`,
      });
    }

    if (userData && userData.scope === "admin") {
      return res.json({
        success: true,
        message: `I am an admin user with the email ${userData.email}`,
      });
    }
    throw Error("Access Denied");
  } catch (error) {
    // Access Denied
    return res.status(401).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getAllUsers,
  registration,
  logIn,
  message,
};
