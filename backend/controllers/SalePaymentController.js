const { Op } = require("sequelize");
const db = require("../models");
const SalePayment = db.SalePayment;

const include = [
  {
    model: db.Sale,
    attributes: ["id", "sale_price", "status"],
    include: [
      { model: db.Unit, attributes: ["id", "name", "house_number", "floor"] },
      { model: db.Site, attributes: ["id", "name", "city"] },
      { model: db.User, as: "buyer", attributes: ["id", "first_name", "last_name", "phone"] },
    ]
  },
  { model: db.User, as: "payer",     attributes: ["id", "first_name", "last_name", "email", "phone"] },
  { model: db.User, as: "verifier",  attributes: ["id", "first_name", "last_name"] },
  { model: db.User, as: "createdBy", attributes: ["id", "first_name", "last_name"] },
];

module.exports = {
  /* ── List all payments (optionally filtered by sale_id) ── */
  async getAll(req, res) {
    try {
      let page      = Math.max(parseInt(req.query.page)      || 1, 1);
      let page_size = Math.max(parseInt(req.query.page_size) || 10, 1);
      let ordering  = req.query.ordering || "-createdAt";

      const where = {};
      if (req.query.sale_id)        where.sale_id        = req.query.sale_id;
      if (req.query.status)         where.status         = req.query.status;
      if (req.query.payment_method) where.payment_method = req.query.payment_method;

      const order  = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const { rows, count } = await SalePayment.findAndCountAll({
        where, order, offset, limit: page_size, include
      });

      const host = `${req.protocol}://${req.get("host")}`;
      const data = rows.map(p => {
        const obj = p.toJSON();
        if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");
        return obj;
      });

      const total_pages = Math.ceil(count / page_size);
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      res.json({
        count, total_pages, current_page: page,
        next:     page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
        previous: page > 1           ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
        page_size, data
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Get all payments for a specific sale ── */
  async getBySaleId(req, res) {
    try {
      const payments = await SalePayment.findAll({
        where: { sale_id: req.params.sale_id },
        order: [["createdAt", "DESC"]],
        include
      });

      const host = `${req.protocol}://${req.get("host")}`;
      const data = payments.map(p => {
        const obj = p.toJSON();
        if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");
        return obj;
      });

      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Get one payment ── */
  async getOne(req, res) {
    try {
      const payment = await SalePayment.findByPk(req.params.id, { include });
      if (!payment) return res.status(404).json({ error: "Not found" });

      const obj = payment.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Create payment (handles screenshot upload) ── */
  async create(req, res) {
    try {
      const body = { ...req.body };

      // Handle screenshot file upload
      if (req.files && req.files["screenshot_url"]) {
        body.screenshot_url = req.files["screenshot_url"][0].path;
      }

      // Parse numeric fields
      if (body.amount) body.amount = parseFloat(body.amount);
      if (body.sale_id) body.sale_id = parseInt(body.sale_id);
      if (body.payer_id) body.payer_id = parseInt(body.payer_id) || null;
      if (body.created_by) body.created_by = parseInt(body.created_by) || null;

      const payment = await SalePayment.create(body);
      const full    = await SalePayment.findByPk(payment.id, { include });

      const host = `${req.protocol}://${req.get("host")}`;
      const obj  = full.toJSON();
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Update payment ── */
  async update(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files["screenshot_url"]) {
        body.screenshot_url = req.files["screenshot_url"][0].path;
      }
      if (body.amount) body.amount = parseFloat(body.amount);

      await SalePayment.update(body, { where: { id: req.params.id } });
      const updated = await SalePayment.findByPk(req.params.id, { include });

      const host = `${req.protocol}://${req.get("host")}`;
      const obj  = updated.toJSON();
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Verify a payment ── */
  async verify(req, res) {
    try {
      const { verified_by, notes } = req.body;
      await SalePayment.update(
        { status: "verified", verified_by, verified_at: new Date(), notes: notes || null },
        { where: { id: req.params.id } }
      );
      const updated = await SalePayment.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Reject a payment ── */
  async reject(req, res) {
    try {
      const { verified_by, rejection_reason } = req.body;
      await SalePayment.update(
        { status: "rejected", verified_by, verified_at: new Date(), rejection_reason },
        { where: { id: req.params.id } }
      );
      const updated = await SalePayment.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Delete payment ── */
  async delete(req, res) {
    try {
      await SalePayment.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
