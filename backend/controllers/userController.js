const { User, Role, Permission} = require("../models");
const { Op } = require("sequelize");
module.exports = {
async getAll(req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    let search = req.query.search || "";
    let ordering = req.query.ordering || "id";

    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    const where = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { middle_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const order = ordering.startsWith("-")
      ? [[ordering.slice(1), "DESC"]]
      : [[ordering, "ASC"]];

    const offset = (page - 1) * page_size;

    const { rows, count } = await User.findAndCountAll({
      where,
      order,
      offset,
      limit: page_size,
      include: [
        {
          model: Role,
          include: [Permission] // include role permissions
        },
        Permission // include user-specific permissions
      ]
    });

    // Map users to include effective permissions
    const usersWithEffective = rows.map(user => {
      const rolePermissions = user.Roles.flatMap(r => r.Permissions.map(p => ({ id: p.id, code: p.code, name: p.name })));
      const userPermissions = user.Permissions.map(p => ({ id: p.id, code: p.code, name: p.name }));

      // Combine unique permissions
      const effectivePermissionsMap = {};
      [...rolePermissions, ...userPermissions].forEach(p => {
        effectivePermissionsMap[p.id] = p; // use ID as key to avoid duplicates
      });

      return {
        ...user.toJSON(),
        effectivePermissions: Object.values(effectivePermissionsMap)
      };
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
    const total_pages = Math.ceil(count / page_size);

    res.json({
      count,
      total_pages,
      current_page: page,
      next:
        page < total_pages
          ? `${baseUrl}?page=${page + 1}&page_size=${page_size}`
          : null,
      previous:
        page > 1
          ? `${baseUrl}?page=${page - 1}&page_size=${page_size}`
          : null,
      page_size,
      data: usersWithEffective
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

,

  async getOne(req, res) { try { const user = await User.findByPk(req.params.id, { include: [Role, Permission] }); if (!user) return res.status(404).json({ error: "Not found" }); res.json(user); } catch (e) { res.status(500).json({ error: e.message }); } },

async patch(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Role, Permission]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Extract roleIds and permissionIds from request body
    const { roleIds, permissionIds, ...userData } = req.body;

    // Update user fields
    Object.assign(user, userData);
    await user.save();

    // Update roles if provided
    if (Array.isArray(roleIds)) {
      const roles = await Role.findAll({ where: { id: roleIds } });
      await user.setRoles(roles);
    }

    // Update permissions if provided
    if (Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({ where: { id: permissionIds } });
      await user.setPermissions(permissions);
    }

    // Fetch updated user with roles and permissions
    const updatedUser = await User.findByPk(user.id, {
      include: [Role, Permission]
    });

    // Flatten effective permissions (role permissions + user direct permissions)
    const effectivePermissions = [
      ...new Set([
        ...updatedUser.Roles.flatMap(r => r.Permissions?.map(p => p.code) || []),
        ...updatedUser.Permissions.map(p => p.code)
      ])
    ];

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      middle_name: updatedUser.middle_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      roles: updatedUser.Roles,
      permissions: effectivePermissions
    });

  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ error: e.message });
  }
}
,
  async update(req, res) { try { const [affected] = await User.update(req.body, { where: { id: req.params.id } }); if (!affected) return res.status(404).json({ error: "Not found" }); const updated = await User.findByPk(req.params.id, { include: [Role, Permission] }); res.json(updated); } catch (e) { res.status(500).json({ error: e.message }); } },

  async delete(req, res) { try { const deleted = await User.destroy({ where: { id: req.params.id } }); if (!deleted) return res.status(404).json({ error: "Not found" }); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } },

  async assignRoles(req, res) { try { const user = await User.findByPk(req.params.id); const roles = await Role.findAll({ where: { id: req.body.roleIds } }); await user.setRoles(roles); res.send("Roles assigned"); } catch (e) { res.status(500).json({ error: e.message }); } },

  async assignPermissions(req, res) { try { const user = await User.findByPk(req.params.id); const permissions = await Permission.findAll({ where: { id: req.body.permissionIds } }); await user.setPermissions(permissions); res.send("Permissions assigned"); } catch (e) { res.status(500).json({ error: e.message }); } },

async  getEffectivePermissions(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Role,
          include: [Permission]  // permissions for each role
        },
        Permission  // user-specific permissions
      ]
    });

    if (!user) return res.status(404).json({ error: "Not found" });

    // collect permissions from roles
    const rolePermissions = user.Roles.flatMap(r => r.Permissions);

    // collect user-specific permissions
    const userPermissions = user.Permissions;

    // merge all permissions
    const allPermissions = [...rolePermissions, ...userPermissions];

    // remove duplicates by code
    const permissionMap = new Map();
    allPermissions.forEach(p => {
      if (!permissionMap.has(p.code)) {
        permissionMap.set(p.code, { code: p.code, name: p.name, id: p.id });
      }
    });

    const effectivePermissions = Array.from(permissionMap.values());

    res.json({
      permissions: effectivePermissions,
      roles: user.Roles,
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


,
  async checkPermission(req, res) {
    try {
      const userId = req.params.id;
      const permissionCode = req.query.permission;

      if (!permissionCode) {
        return res.status(400).json({ status: false, message: "Permission code is required" });
      }

      const user = await User.findByPk(userId, {
        include: [
          { model: Role, include: [Permission] }, // role permissions
          Permission // user-specific permissions
        ]
      });

      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      const rolePermissions = user.Roles.flatMap(r => r.Permissions.map(p => p.code));
      const userPermissions = user.Permissions.map(p => p.code);
      const effectivePermissions = new Set([...rolePermissions, ...userPermissions]);

      if (effectivePermissions.has(permissionCode)) {
        return res.json({ status: true, message: `User has permission: ${permissionCode}` });
      } else {
        return res.json({ status: false, message: `User does NOT have permission: ${permissionCode}` });
      }

    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Error checking permissions" });
    }
  }
};



