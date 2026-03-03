const { Op } = require("sequelize");
const db = require("../models");
const Sale = db.Sale;

module.exports = {
 async getAll(req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 10;

    let search = req.query.search || "";
    const searchableFields = ["status"];
    const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } }));
    const where = search ? { [Op.or]: searchConditions } : {};

    let ordering = req.query.ordering || "id";
    const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
    const offset = (page - 1) * page_size;

    // Include associations with aliases
    const include = [
      { model: db.Unit },
      { model: db.Site },
      { model: db.User, as: "buyer" },
      { model: db.User, as: "owner" },
      { model: db.User, as: "createdBy" },
      { model: db.User, as: "updatedBy" },
      { model: db.SaleDocument, as: "documents" } // Include SaleDocuments
    ];

    const { rows, count } = await db.Sale.findAndCountAll({
      where,
      order,
      offset,
      limit: page_size,
      include
    });

    const host = `${req.protocol}://${req.get("host")}`;

    const dataWithFiles = rows.map(item => {
      const obj = item.toJSON();

      // Fix document URLs
      if (obj.documents && obj.documents.length > 0) {
        obj.documents = obj.documents.map(doc => ({
          ...doc,
          document_url: doc.document_url ? host + "/" + doc.document_url.replace(/\\/g, "/") : null
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
    const sale = await db.Sale.findByPk(req.params.id, {
      include: [
        { model: db.Unit },
        { model: db.Site },
        { model: db.User, as: "buyer" },
        { model: db.User, as: "owner" },
        { model: db.User, as: "createdBy" },
        { model: db.User, as: "updatedBy" },
        { model: db.SaleDocument, as: "documents" }
      ]
    });

    if (!sale) return res.status(404).json({ error: "Not found" });

    const obj = sale.toJSON();
    const host = `${req.protocol}://${req.get("host")}`;

    // Fix document URLs
    if (obj.documents && obj.documents.length > 0) {
      obj.documents = obj.documents.map(doc => ({
        ...doc,
        document_url: doc.document_url ? host + "/" + doc.document_url.replace(/\\/g, "/") : null
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
      
      const data = await Sale.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      await Sale.update(body, { where: { id: req.params.id } });
      const updated = await Sale.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Sale.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
