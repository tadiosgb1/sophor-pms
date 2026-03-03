const { Op } = require("sequelize");
const db = require("../models");
const Site = db.Site;

module.exports = {
async getAll(req, res) {
  try {
    // Pagination
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    // Search
    let search = req.query.search || "";
    const searchableFields = ["name", "status", "country", "state", "city", "sub_city", "street", "postal_code", "contact_phone", "contact_email"];
    const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } }));
    const where = search ? { [Op.or]: searchConditions } : {};

    // Ordering
    let ordering = req.query.ordering || "id";
    const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];

    // Offset
    const offset = (page - 1) * page_size;

    // Include associations with aliases
    const include = [
      { model: db.Type },
      { model: db.SiteImage, as: "images" }, // include site images
      { model: db.User, as: "manager" },
      { model: db.User, as: "staff" },
      { model: db.User, as: "owner" },
      { model: db.User, as: "createdBy" },
      { model: db.User, as: "updatedBy" }
    ];

    // Fetch data
    const { rows, count } = await Site.findAndCountAll({
      where,
      order,
      offset,
      limit: page_size,
      include
    });

    const host = `${req.protocol}://${req.get("host")}`;

    // Fix image URLs
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

    // Pagination info
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
    const include = [
      { model: db.Type },

      { model: db.User, as: "manager" },
      { model: db.User, as: "staff" },
      { model: db.User, as: "owner" },
      { model: db.User, as: "createdBy" },
      { model: db.User, as: "updatedBy" },

      { model: db.SiteImage, as: "images" }
    ];

    const data = await Site.findByPk(req.params.id, { include });

    if (!data) return res.status(404).json({ error: "Not found" });

    const obj = data.toJSON();
    const host = `${req.protocol}://${req.get("host")}`;

    if (obj.images) {
      obj.images = obj.images.map(i => ({
        ...i,
        image_url: i.image_url ? host + "/" + i.image_url.replace(/\\/g, "/") : null
      }));
    }

    res.json(obj);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
},

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      const data = await Site.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      await Site.update(body, { where: { id: req.params.id } });
      const updated = await Site.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Site.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
