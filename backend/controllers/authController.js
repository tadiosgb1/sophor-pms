const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, Role, Permission } = require("../models");
const generateAccessToken = user => jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
const generateRefreshToken = user => jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
const sendEmail = require("../utils/sendEmail");
module.exports = {
 register: async (req, res) => {
    console.log("req.body", req.body);

    try {
      const { first_name, middle_name, last_name, phone, address,email, password,owner_id,created_by, roleIds, permissionIds } = req.body;

      // Basic validation
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        first_name,
        middle_name,
        last_name,
        phone,
        email,
        address,
        owner_id,
        created_by,
        password: hashedPassword
      });

      // Assign roles if provided
      if (Array.isArray(roleIds) && roleIds.length > 0) {
        const roles = await Role.findAll({ where: { id: roleIds } });
        await user.setRoles(roles);
      }

      // Assign permissions if provided
      if (Array.isArray(permissionIds) && permissionIds.length > 0) {
        const permissions = await Permission.findAll({ where: { id: permissionIds } });
        await user.setPermissions(permissions);
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Fetch user with roles & permissions
      const userData = await User.findByPk(user.id, {
        include: [Role, Permission]
      });

      // Flatten effective permissions
      const effectivePermissions = [
        ...new Set([
          ...userData.Roles.flatMap(r => r.Permissions?.map(p => p.code) || []),
          ...userData.Permissions.map(p => p.code)
        ])
      ];

      // Respond
      res.json({
        id: user.id,
        email: user.email,
        roles: userData.Roles,
        permissions: effectivePermissions,
        accessToken,
        refreshToken
      });

    } catch (e) {
      console.error("Registration error:", e);
      res.status(500).json({ error: e.message });
    }
  },



 login: async (req, res) => {
  console.log("the login please");
  try {
    const { email, password } = req.body;

    // Load roles + permissions inside roles + direct user permissions
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          include: [Permission] // include role permissions
        },
        Permission // include direct user permissions
      ]
    });

    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Safely extract role permissions
    const rolePermissions =
      user.Roles?.flatMap(role =>
        role.Permissions?.map(perm => perm.code) || []
      ) || [];

    // Safely extract direct user permissions
    const userPermissions =
      user.Permissions?.map(perm => perm.code) || [];

    // Merge + dedupe
    const effectivePermissions = [...new Set([
      ...rolePermissions,
      ...userPermissions
    ])];

    res.json({
      id: user.id,
      email: user.email,
      name:user.first_name,
      owner_id:user.owner_id,
      created_by:user.created_by,
      accessToken,
      refreshToken,
      roles: user.Roles || [],
      permissions: effectivePermissions,
     
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
,

  refreshToken: (req, res) => {
    const { token } = req.body;

    console.log("token",token);

    if (!token) return res.sendStatus(401);
    try {
      const payload = jwt.verify(token, process.env.REFRESH_SECRET);
      res.json({ accessToken: generateAccessToken({ id: payload.id }) });
    } catch (e) { res.status(403).send("Invalid token"); }
  },

 forgotPassword: async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1h
    await user.save();

    // URL to frontend reset page
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email content
    const html = `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, ignore this email.</p>
    `;

    await sendEmail(user.email, "Password Reset", html);

    res.send("Reset link sent to your email");

  } catch (e) {
    console.log("Email error:", e);
    res.status(500).json({ error: e.message });
  }
},

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const { Op } = require("sequelize");
      const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } } });
      if (!user) return res.status(400).send("Invalid or expired token");
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      res.send("Password reset successful");
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};