const { Op } = require("sequelize");
const db = require("../models");
const Unit = db.Unit;

module.exports = {
async getAll(req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    let search = req.query.search || "";
    let ordering = req.query.ordering || "id";

    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    const searchableFields = ["name", "house_number", "block_number", "status"];
    const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: "%" + search + "%" } }));
    const where = search ? { [Op.or]: searchConditions } : {};
    const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
    const offset = (page - 1) * page_size;

    const include = [
      { model: db.Type },
      { model: db.Site },
      { model: db.UnitImage, as: "images" },

      { model: db.User, as: "owner" },
      { model: db.User, as: "manager" },
      { model: db.User, as: "staff" },
      { model: db.User, as: "createdBy" },
      { model: db.User, as: "updatedBy" }
    ];

    const { rows, count } = await Unit.findAndCountAll({
      where,
      order,
      offset,
      limit: page_size,
      include
    });

    const host = `${req.protocol}://${req.get("host")}`;
    const dataWithFiles = rows.map(item => {
      const obj = item.toJSON();

      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(img => ({
          ...img,
          image_url: img.image_url ? host + "/" + img.image_url.replace(/\\/g, "/") : null
        }));
      }

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
    console.error(e);
    res.status(500).json({ error: e.message });
  }
},

async getOne(req, res) {
  try {
    const unit = await Unit.findByPk(req.params.id, {
      include: [
        { model: db.Type },
        { model: db.Site },
        { model: db.UnitImage, as: "images" }, // Unit images

        { model: db.User, as: "owner" },
        { model: db.User, as: "manager" },
        { model: db.User, as: "staff" },
        { model: db.User, as: "createdBy" },
        { model: db.User, as: "updatedBy" }
      ]
    });

    if (!unit) return res.status(404).json({ error: "Not found" });

    const obj = unit.toJSON();
    const host = `${req.protocol}://${req.get("host")}`;

    // Fix image URLs
    if (obj.images && obj.images.length > 0) {
      obj.images = obj.images.map(img => ({
        ...img,
        image_url: img.image_url ? host + "/" + img.image_url.replace(/\\/g, "/") : null
      }));
    }

    res.json(obj);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
},

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      const data = await Unit.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      await Unit.update(body, { where: { id: req.params.id } });
      const updated = await Unit.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Unit.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
