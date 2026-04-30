const { Op } = require("sequelize");
const db = require("../models");
const UnitImage = db.UnitImage;

module.exports = {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const searchableFields = [];
      const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: "%" + search + "%" } }));
      const where = search ? { [Op.or]: searchConditions } : {};
      const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const include = [db.Unit, db.User, db.User, db.User].filter(Boolean);
      const findOptions = { where, order, offset, limit: page_size };
      if (include.length) findOptions.include = include;

      const { rows, count } = await UnitImage.findAndCountAll(findOptions);

      const host = `${req.protocol}://${req.get("host")}`;
      const dataWithFiles = rows.map(item => {
        const obj = item.toJSON();
        if (obj.image_url) obj.image_url = host + "/" + obj.image_url.replace(/\\/g, "/");
        return obj;
      });

      const total_pages = Math.ceil(count / page_size);
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      res.json({
        count,
        total_pages,
        current_page: page,
        next: page < total_pages ? `${baseUrl}?page=${page + 1}&page_size=${page_size}` : null,
        previous: page > 1 ? `${baseUrl}?page=${page - 1}&page_size=${page_size}` : null,
        page_size,
        data: dataWithFiles
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getOne(req, res) {
    try {
      const include = [db.Unit, db.User, db.User, db.User].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await UnitImage.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      const obj = data.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      if (obj.image_url) obj.image_url = host + "/" + obj.image_url.replace(/\\/g, "/");
      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getByUnitId(req, res) {
    try {
      const images = await UnitImage.findAll({ where: { unit_id: req.params.unit_id } });
      const host = `${req.protocol}://${req.get("host")}`;
      const result = images.map(img => {
        const obj = img.toJSON();
        if (obj.image_url) obj.image_url = host + "/" + obj.image_url.replace(/\\/g, "/");
        return obj;
      });
      res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['image_url']) body.image_url = req.files['image_url'][0].path;
      const data = await UnitImage.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['image_url']) body.image_url = req.files['image_url'][0].path;
      await UnitImage.update(body, { where: { id: req.params.id } });
      const updated = await UnitImage.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await UnitImage.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
