// third part imports
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../sqlDb/sqlDb.js");
// project imports
const AuthModel = require("./auth.modal");
const { sendResetEmail, sendEmailOtp } = require("../utils/email-utility.js");
const  sendWhatsappOtp = require("../utils/whatsapp-otp.js");

const AuthController = {
 
  async registerUser(req, res) {
    try {
      const {
        firstName,
        lastName,
        country,
        state,
        district,
        address,
        email,
        category,
        password,
        username,
        pincode,
        profession,
        otp,
        mobile_number,
      } = req.body;
  
      if (
        !firstName ||
        !lastName ||
        !country ||
        !state ||
        !district ||
        !address ||
        !email ||
        !category ||
        !password ||
        !username ||
        !pincode ||
        !profession ||
        !otp,
        !mobile_number
      ) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
          data: null,
        });
      }

  
      // Check if email already exists
      const isEmailExists = await AuthModel.isEmailExists(email);
      if (isEmailExists) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
          data: null,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await AuthModel.registerUser({
        firstName,
        lastName,
        country,
        state,
        district,
        address,
        email,
        category,
        password: hashedPassword,
        username,
        pincode,
        profession,
        otp,
        mobile_number
      });
  
      const token = jwt.sign(
        { id: user.insertId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
  
      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: { token },
      });
  
    } catch (error) {
      console.error("Error in registerUser:", error);
      res.status(500).json({
        status: false,
        message: "Something went wrong. Please try again.",
        error: error.message,
      });
    }
  },


  //MARK:- Login User
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!password || !username) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
          data: null,
        });
      }

      const user = await AuthModel.getUserByEmail(username);

      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found", data: null });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(200)
          .json({ status: false, message: "Invalid credentials", data: null });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Login successful",
        user_id: user.id,
        role: user.role,
        name: user.first_name,
        email: user.email,
        token,
        free_trial: user.free_trial,
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", data: null });
    }
  },

  

  // async sendOtp(req, res) {
  //   const generateOTP = () =>
  //     Math.floor(100000 + Math.random() * 900000).toString();

  //   const { email } = req.body;
   
  //   const otp = generateOTP();

  //   try {
  //     const [existingUser] = await db.execute(
  //       "SELECT * FROM otp_verification WHERE email = ?",
  //       [email]
  //     );

  //     if (existingUser.length > 0) {
  //       // Update OTP if email already exists
  //       await db.execute(
  //         "UPDATE otp_verification SET otp = ? WHERE email = ?",
  //         [otp, email]
  //       );
  //     } else {
  //       // Insert new record if email does not exist
  //       await db.execute(
  //         "INSERT INTO otp_verification (email, otp) VALUES (?, ?)",
  //         [email, otp]
  //       );
  //     }

  //     await sendEmailOtp(email, otp);

  //     res.json({status: true,  message: "OTP sent successfully." });
  //   } catch (error) {
  //     res.status(500).json({ status: false, error: "Failed to send OTP." });
  //   }
  // },



  async sendOtp(req, res) {
   
    const generateOTP = () =>
      Math.floor(100000 + Math.random() * 900000).toString();

    const { phone_number } = req.body;
   
    const otp = generateOTP();

    try {
      const [existingUser] = await db.execute(
        "SELECT * FROM otp_verification WHERE phone_number = ?",
        [phone_number]
      );

      if (existingUser.length > 0) {
        // Update OTP if email already exists
        await db.execute(
          "UPDATE otp_verification SET otp = ? WHERE email = ?",
          [otp, phone_number]
        );
      } else {
        // Insert new record if email does not exist
        await db.execute(
          "INSERT INTO otp_verification (phone_number, otp) VALUES (?, ?)",
          [phone_number, otp]
        );
      }

      await sendWhatsappOtp(phone_number, otp);

      res.json({status: true,  message: "OTP sent successfully." });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },
  async verifyOtp(req, res) {
    const { phone_number, otp } = req.body;

    const [result] = await db.execute(
      "SELECT * FROM otp_verification  WHERE phone_number = ? AND otp = ?",
      [phone_number, otp]
    );

    if (result.length === 0) {
      return res.status(400).json({status: false, error: "Invalid OTP or expired code." });
    }

    await db.execute(
      "UPDATE otp_verification SET email_verified = 1 WHERE phone_number = ?",
      [phone_number]
    );

    await db.execute(
      "DELETE FROM otp_verification WHERE phone_number = ?",
      [phone_number]
    )
    res.json({ status: true, message: "Otp verified!" });
  },

  //MARK:- forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        return res
          .status(200)
          .json({ status: false, message: "Email is required", data: null });

      const user = await AuthModel.getForgotPassword(email);
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "User not found", data: null });

      // if user is there then send reset password link
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5m",
      });
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendResetEmail(email, resetLink);

      return res.status(200).json({
        status: true,
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res
        .status(200)
        .json({ status: false, message: "Internal Server Error", data: null });
    }
  },

  //MARK:- reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(200).json({
          status: false,
          message: "All fields are required",
          data: null,
        });
      }
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      } catch (error) {
        return res.status(200).json({
          status: false,
          message: "Invalid or expired token",
          data: null,
        });
      }

      const user = await AuthModel.getUserById(decodedToken.id);
      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found", data: null });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await AuthModel.updatePassword(user.id, hashedPassword);

      return res
        .status(200)
        .json({ status: true, message: "Password reset successful" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return res
        .status(200)
        .json({ status: false, message: "Internal Server Error", data: null });
    }
  },

  async getUserById(req ,res){
    try {
      const {user_id} = req.params;
      const user = await AuthModel.findOne(user_id);
      if(!user) return res.status(200).json({status: false, message: "User not found", data: null});

      return res.status(200).json({status: true, message: "User fetched successfully", data: user});
      
    } catch (error) {
      console.error("Error in getUserById:", error);
      return res.status(200).json({status: false, message: "Internal Server Error", data: null});
      
    }
  },
  async updateUser(req ,res){
    try {
      const {user_id} = req.params;
      const {first_name, last_name, state, district, address, pincode, email,
        mobile_number, category, profession} = req.body;

      const user = await AuthModel.findOne(user_id);
      if(!user) return res.status(200).json({status: false, message: "User not found", data: null});
      const data = {
        first_name,
        last_name,
        state,
        district,
        address,
        pincode,
        email,
        mobile_number,
        category,
        profession
      }

      const updatedUser = await AuthModel.updateOne(user_id, data);
      return res.status(200).json({status: true, message: "User updated successfully", data: updatedUser});
      
    } catch (error) {
      console.error("Error in updateUser:", error);
      return res.status(200).json({status: false, message: "Internal Server Error", data: null});
      
    }
  }
};

module.exports = AuthController;