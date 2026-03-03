
const { Op } = require("sequelize");
const db = require("../models");
const InventoryTransaction = db.InventoryTransaction;

module.exports = {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const searchFields = [
        { action: { [Op.like]: '%' + search + '%' } },{ note: { [Op.like]: '%' + search + '%' } }
      ];

      const where = search ? { [Op.or]: searchFields } : {};

      let order = [];
      if (ordering.startsWith("-")) order.push([ordering.substring(1), "DESC"]);
      else order.push([ordering, "ASC"]);

      const offset = (page - 1) * page_size;

      const { rows, count } = await InventoryTransaction.findAndCountAll({
        where,
        order,
        offset,
        limit: page_size
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
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async getOne(req, res) {
    try {
      const data = await InventoryTransaction.findByPk(req.params.id);
      if (!data) return res.status(404).json({ error: "Not found" });
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async create(req, res) {
    try {
      const data = await InventoryTransaction.create(req.body);
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async update(req, res) {
    try {
      const data = await InventoryTransaction.update(req.body, { where: { id: req.params.id }});
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async patch(req, res) {
    try {
      const data = await InventoryTransaction.update(req.body, { where: { id: req.params.id }});
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async delete(req, res) {
    try {
      await InventoryTransaction.destroy({ where: { id: req.params.id }});
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};
