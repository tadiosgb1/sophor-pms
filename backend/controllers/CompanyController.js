const { Op } = require("sequelize");
const db = require("../models");
const Company = db.Company;
const  User=db.User;

module.exports = {
  async getAll(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let page_size = parseInt(req.query.page_size) || 10;
      let search = req.query.search || "";
      let ordering = req.query.ordering || "id";

      if (page < 1) page = 1;
      if (page_size < 1) page_size = 10;

      const searchableFields = ['name',"address", "phone", "official_email", "website", "facebook", "instagram", "linkedin", "twitter", "telegram"];
      const searchConditions = searchableFields.map(field => ({ [field]: { [Op.like]: "%" + search + "%" } }));
      const where = search ? { [Op.or]: searchConditions } : {};
      const order = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const include = [db.User].filter(Boolean);
      const findOptions = { where, order, offset, limit: page_size };
      if (include.length) findOptions.include = include;

      const { rows, count } = await Company.findAndCountAll(findOptions);

      const host = `${req.protocol}://${req.get("host")}`;
      const dataWithFiles = rows.map(item => {
        const obj = item.toJSON();
        if (obj.logo) obj.logo = host + "/" + obj.logo.replace(/\\/g, "/");
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
      const include = [db.User].filter(Boolean);
      const opts = include.length ? { include } : {};
      const data = await Company.findByPk(req.params.id, opts);
      if (!data) return res.status(404).json({ error: "Not found" });

      const obj = data.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      if (obj.logo) obj.logo = host + "/" + obj.logo.replace(/\\/g, "/");
      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['logo']) body.logo = req.files['logo'][0].path;
      const data = await Company.create(body);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (req.files && req.files['logo']) body.logo = req.files['logo'][0].path;
      await Company.update(body, { where: { id: req.params.id } });
      const updated = await Company.findByPk(req.params.id);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await Company.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

    async getByOwner(req, res) {
    try {
      const ownerId = req.params.owner_id;

      console.log("ownerid",ownerId);

      if (!ownerId) {
        return res.status(400).json({ status: false, message: "Owner ID is required" });
      }

      const company = await Company.findOne({
        where: { owner_id: ownerId },
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "middle_name", "last_name", "email", "phone"]
          }
        ]
      });

     console.log("fetched",company);

      if (!company) {
        return res.status(404).json({ status: false, message: "Company not found" });
      }

      return res.json({ status: true, data: company });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Error fetching company info" });
    }
  }

}

