const { Op } = require("sequelize");
const db = require("../models");
const MaintenanceRequest = db.MaintenanceRequest;

const include = [
  { model: db.Unit, as: "unit", attributes: ["id", "name", "house_number", "floor"] },
  { model: db.Site, as: "site", attributes: ["id", "name", "city"] },
  { model: db.User, as: "requester",  attributes: ["id", "first_name", "last_name", "email", "phone"] },
  { model: db.User, as: "assignee",   attributes: ["id", "first_name", "last_name", "email", "phone"] },
  { model: db.User, as: "owner",      attributes: ["id", "first_name", "last_name"] },
  { model: db.User, as: "createdBy",  attributes: ["id", "first_name", "last_name"] },
  { model: db.User, as: "updatedBy",  attributes: ["id", "first_name", "last_name"] },
];

module.exports = {
  async getAll(req, res) {
    try {
      let page      = Math.max(parseInt(req.query.page)      || 1, 1);
      let page_size = Math.max(parseInt(req.query.page_size) || 10, 1);
      let search    = req.query.search   || "";
      let ordering  = req.query.ordering || "-createdAt";

      const where = {};

      // Text search
      if (search) {
        where[Op.or] = [
          { title:    { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
        ];
      }

      // Exact filters
      if (req.query.site_id)  where.site_id  = req.query.site_id;
      if (req.query.unit_id)  where.unit_id  = req.query.unit_id;
      if (req.query.status)   where.status   = req.query.status;
      if (req.query.priority) where.priority = req.query.priority;
      if (req.query.category) where.category = req.query.category;

      // Date range for "requested" (createdAt) — pending/in_progress requests
      if (req.query.requested_from || req.query.requested_to) {
        where.createdAt = {};
        if (req.query.requested_from) where.createdAt[Op.gte] = new Date(req.query.requested_from);
        if (req.query.requested_to)   where.createdAt[Op.lte] = new Date(req.query.requested_to + "T23:59:59");
      }

      // Date range for "resolved" (resolved_at)
      if (req.query.resolved_from || req.query.resolved_to) {
        where.resolved_at = {};
        if (req.query.resolved_from) where.resolved_at[Op.gte] = new Date(req.query.resolved_from);
        if (req.query.resolved_to)   where.resolved_at[Op.lte] = new Date(req.query.resolved_to + "T23:59:59");
      }

      const order  = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const { rows, count } = await MaintenanceRequest.findAndCountAll({
        where, order, offset, limit: page_size, include
      });

      const total_pages = Math.ceil(count / page_size);
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      res.json({
        count, total_pages, current_page: page,
        next:     page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
        previous: page > 1           ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
        page_size, data: rows
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  },

  async getOne(req, res) {
    try {
      const data = await MaintenanceRequest.findByPk(req.params.id, { include });
      if (!data) return res.status(404).json({ error: "Not found" });
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const data = await MaintenanceRequest.create(req.body);
      const full  = await MaintenanceRequest.findByPk(data.id, { include });
      res.json(full);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      // Auto-set resolved_at when status flips to resolved
      if (body.status === "resolved" && !body.resolved_at) {
        body.resolved_at = new Date();
      }
      // Clear resolved_at if status moves away from resolved
      if (body.status && body.status !== "resolved") {
        body.resolved_at = null;
      }
      await MaintenanceRequest.update(body, { where: { id: req.params.id } });
      const updated = await MaintenanceRequest.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // PATCH — quick status/assign update
  async patch(req, res) {
    try {
      const body = { ...req.body };
      if (body.status === "resolved" && !body.resolved_at) {
        body.resolved_at = new Date();
      }
      if (body.status && body.status !== "resolved") {
        body.resolved_at = null;
      }
      await MaintenanceRequest.update(body, { where: { id: req.params.id } });
      const updated = await MaintenanceRequest.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await MaintenanceRequest.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
