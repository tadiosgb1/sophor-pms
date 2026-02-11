const { Role, Permission } = require("../models");
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
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const order = ordering.startsWith("-")
      ? [[ordering.slice(1), "DESC"]]
      : [[ordering, "ASC"]];

    const offset = (page - 1) * page_size;

    const { rows, count } = await Role.findAndCountAll({
      where,
      order,
      offset,
      limit: page_size,
      include: [Permission],
      distinct: true   // ← THE ONLY REQUIRED FIX
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
    const total_pages = Math.ceil(count / page_size);

    res.json({
      count,
      total_pages,
      current_page: page,
      next: page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
      previous: page > 1 ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
      page_size,
      data: rows
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
,
  async getOne(req, res) { try { const role = await Role.findByPk(req.params.id, { include: [Permission] }); if (!role) return res.status(404).json({ error: "Not found" }); res.json(role); } catch (e) { res.status(500).json({ error: e.message }); } },
  
  
async create(req, res) { 
  try { 
    
    console.log("Incoming Role Data:", req.body);

    const { permissionIds, ...roleData } = req.body;   // extract permissions

    // 1. Create Role
    const role = await Role.create(roleData);

    // 2. Assign Permissions (if provided)
    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });

      await role.setPermissions(permissions);
    }

    // 3. Return role with assigned permissions
    const fullRole = await Role.findByPk(role.id, {
      include: [Permission]
    });

    res.json(fullRole);

  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
}
,
  
      async assignPermissions(req, res) { try { const role = await Role.findByPk(req.params.id); const permissions = await Permission.findAll({ where: { id: req.body.permissionIds } }); await role.setPermissions(permissions); res.send("Permissions assigned"); } catch (e) { res.status(500).json({ error: e.message }); } }

, 
async patch(req, res) {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [Permission]
    });

    if (!role) {
      return res.status(404).json({ error: "Not found" });
    }

    // Extract permissionIds from body
    const { permissionIds, ...roleData } = req.body;

    // 1️⃣ Update role fields
    await role.update(roleData);

    // 2️⃣ Replace permissions if permissionIds provided
    if (Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });

      await role.setPermissions(permissions);
    }

    // 3️⃣ Fetch updated role (with relations)
    const updatedRole = await Role.findByPk(req.params.id, {
      include: [Permission]
    });

    res.json(updatedRole);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
,
  async update(req, res) { try { const [affected] = await Role.update(req.body, { where: { id: req.params.id } }); if (!affected) return res.status(404).json({ error: "Not found" }); const updated = await Role.findByPk(req.params.id, { include: [Permission] }); res.json(updated); } catch (e) { res.status(500).json({ error: e.message }); } },
  async delete(req, res) { try { const deleted = await Role.destroy({ where: { id: req.params.id } }); if (!deleted) return res.status(404).json({ error: "Not found" }); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } },
  
 async getPermissionsByRoleId(req, res) {
  try {
    const roleId = req.params.id;

    const role = await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          attributes: ["id", "name","code" ,"description"]
        }
      ]
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json({
      role_id: roleId,
      permissions: role.Permissions
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

};