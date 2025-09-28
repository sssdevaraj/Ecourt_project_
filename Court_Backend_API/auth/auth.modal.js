const connection = require("../sqlDb/sqlDb.js");

const AuthModel = {
  // MARK: - Register User
  async registerUser(user) {
   
    const sql = `INSERT INTO users 
            (first_name, last_name, country, state, district, address, email, category, password, username, pincode, profession, role, mobile_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    try {
      const [result] = await connection.query(sql, [
        user.firstName,
        user.lastName,
        user.country,
        user.state,
        user.district,
        user.address,
        user.email,
        user.category,
        user.password,
        user.username,
        user.pincode,
        user.profession,
        "USER",
        user.mobile_number
      ]);

      return result;
    } catch (error) {
      console.error("🔥 Error in registerUser:", error.message);
      throw new Error("Database error while registering user");
    }
  },

  // MARK: - Check if Email Already Exists
  async isEmailExists(email) {
    const sql = "SELECT id FROM users WHERE email = ?";
    try {
      const [rows] = await connection.query(sql, [email]);
      return rows.length > 0;
    } catch (error) {
      console.error("🔥 Error in isEmailExists:", error.message);
      throw new Error("Database error while checking email existence");
    }
  },

  // MARK: - Get User By Email
  async getUserByEmail(username) {
    const sql = "SELECT * FROM users WHERE username = ?";
    try {
      const [rows] = await connection.query(sql, [username]);
      return rows[0];
    } catch (error) {
      console.error("🔥 Error in getUserByEmail:", error.message);
      throw new Error("Database error while fetching user by email");
    }
  },
  async getForgotPassword(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    try {
      const [rows] = await connection.query(sql, [email]);
      return rows[0];
    } catch (error) {
      console.error("🔥 Error in getForgotPassword:", error.message);
      throw new Error("Database error while fetching user by email");
    }
  },

  // MARK: - Get User By Id
  async getUserById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    try {
      const [rows] = await connection.query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error("🔥 Error in getUserById:", error.message);
      throw new Error("Database error while fetching user by id");
    }
  },

  // MARK: - Update Password
  // MARK: - Update Password and Username
  async updatePassword(userId, hashedPassword) {
    const sql = "UPDATE users SET password = ?  WHERE id = ?";
    try {
      const [result] = await connection.query(sql, [
        hashedPassword,
        userId,
      ]);
      return result;
    } catch (error) {
      console.error("🔥 Error in updatePassword:", error.message);
      throw new Error("Database error while updating password and username");
    }
  },

  async findOne(user_id) {
    // const sql = `SELECT * FROM users WHERE id = ?`;
    const sql= `SELECT id, first_name, last_name, state, district, address, pincode, email,
    mobile_number, category, profession FROM users WHERE id = ?`
    const [result] = await connection.query(sql, [user_id]);
   
    return result;
  },

  async updateOne(user_id, data) {
    console.log("data", data)
    
    const sql = `UPDATE users SET first_name = ?, last_name = ?, state = ?, district = ?, address = ?, pincode = ?, mobile_number = ?, profession = ? , category = ?, email = ? WHERE id = ?`;
    try {
      const [result] = await connection.query(sql, [
        data.first_name,
        data.last_name,
        data.state,
        data.district,
        data.address,
        data.pincode,
        data.mobile_number,
        data.profession,
        data.category,
        data.email,
        user_id,

      ]);
      return result;
    } catch (error) {
      console.error("🔥 Error in updateProfile:", error.message);
      throw new Error("Database error while updating profile");
    }
  },
  
};

module.exports = AuthModel;
