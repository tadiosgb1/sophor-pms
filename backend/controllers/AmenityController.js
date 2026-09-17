const { Op } = require("sequelize");
const db = require("../models");
const Amenity = db.Amenity;

module.exports = {
async getAll(req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    let search = req.query.search || "";
    let ordering = req.query.ordering || "id";

    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    const searchableFields = ["name"];
    const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: "%" + search + "%" } }));
    const where = search ? { [Op.or]: searchConditions } : {};
    const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
    const offset = (page - 1) * page_size;

    // Standard attributes to select for populated User objects
    const userAttributes = ['id', 'first_name', 'middle_name', 'last_name', 'email'];

    // Define unique aliases for owner, created_by, and updated_by
    const include = [
      { 
        model: db.User, 
        as: 'owner', 
        attributes: userAttributes 
      },
      { 
        model: db.User, 
        as: 'creator', 
        attributes: userAttributes 
      },
      { 
        model: db.User, 
        as: 'updater', 
        attributes: userAttributes 
      }
    ].filter(Boolean);

    const findOptions = { 
      where, 
      order, 
      offset, 
      limit: page_size,
      include,
      distinct: true // Keeps total count accurate when joining tables
    };

    const { rows, count } = await Amenity.findAndCountAll(findOptions);

    const dataWithFiles = rows.map(item => item.toJSON());

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
      const include = [db.User, db.User, db.User].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await Amenity.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      const obj = data.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      
      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      const data = await Amenity.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      await Amenity.update(body, { where: { id: req.params.id } });
      const updated = await Amenity.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Amenity.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
