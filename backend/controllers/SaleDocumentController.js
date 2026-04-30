const { Op } = require("sequelize");
const db = require("../models");
const SaleDocument = db.SaleDocument;

module.exports = {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const searchableFields = ["document_name"];
      const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: "%" + search + "%" } }));
      const where = search ? { [Op.or]: searchConditions } : {};
      if (req.query.sale_id) where.sale_id = req.query.sale_id;

      const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const include = [
        { model: db.Sale },
        { model: db.User, foreignKey: "owner_id", as: "owner" },
        { model: db.User, foreignKey: "created_by", as: "createdBy" },
      ];
      const { rows, count } = await SaleDocument.findAndCountAll({ where, order, offset, limit: page_size, include });

      const host = `${req.protocol}://${req.get("host")}`;
      const dataWithFiles = rows.map(item => {
        const obj = item.toJSON();
        if (obj.document_url) obj.document_url = host + "/" + obj.document_url.replace(/\\/g, "/");
        return obj;
      });

      const total_pages = Math.ceil(count / page_size);
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      res.json({ count, total_pages, current_page: page,
        next: page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
        previous: page > 1 ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
        page_size, data: dataWithFiles });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async getBySaleId(req, res) {
    try {
      const docs = await SaleDocument.findAll({ where: { sale_id: req.params.sale_id } });
      const host = `${req.protocol}://${req.get("host")}`;
      const result = docs.map(d => {
        const obj = d.toJSON();
        if (obj.document_url) obj.document_url = host + "/" + obj.document_url.replace(/\\/g, "/");
        return obj;
      });
      res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async getOne(req, res) {
    try {
      const include = [db.Sale, db.User, db.User].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await SaleDocument.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      const obj = data.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      if (obj.document_url) obj.document_url = host + "/" + obj.document_url.replace(/\\/g, "/");
      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['document_url']) body.document_url = req.files['document_url'][0].path;
      const data = await SaleDocument.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['document_url']) body.document_url = req.files['document_url'][0].path;
      await SaleDocument.update(body, { where: { id: req.params.id } });
      const updated = await SaleDocument.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await SaleDocument.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
