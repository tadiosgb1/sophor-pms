const { Op } = require("sequelize");
const db = require("../models");
const Expense = db.Expense;

const include = [
  { model: db.Site, as: "site", attributes: ["id", "name", "city"] },
  { model: db.User, as: "creator", attributes: ["id", "first_name", "last_name"] },
  { model: db.User, as: "updater", attributes: ["id", "first_name", "last_name"] },
];

module.exports = {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const where = {};
      if (search) {
        where[Op.or] = [
          { category:    { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }
      if (req.query.site_id)  where.site_id  = req.query.site_id;
      if (req.query.category) where.category = req.query.category;

      const order = ordering.startsWith("-")
        ? [[ordering.slice(1), "DESC"]]
        : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const { rows, count } = await Expense.findAndCountAll({
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
      const data = await Expense.findByPk(req.params.id, { include });
      if (!data) return res.status(404).json({ error: "Not found" });
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async create(req, res) {
    try {
      const data = await Expense.create(req.body);
      res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async update(req, res) {
    try {
      await Expense.update(req.body, { where: { id: req.params.id } });
      const updated = await Expense.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async patch(req, res) {
    try {
      await Expense.update(req.body, { where: { id: req.params.id } });
      const updated = await Expense.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async delete(req, res) {
    try {
      await Expense.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};
