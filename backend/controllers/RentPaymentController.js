const { Op } = require("sequelize");
const db = require("../models");
const RentPayment = db.RentPayment;

const include = [
  { model: db.Rent, attributes: ["id", "rent_amount", "rent_period", "next_due_date", "status"] },
  { model: db.User, as: "payer",     attributes: ["id", "first_name", "last_name", "email", "phone"] },
  { model: db.User, as: "verifier",  attributes: ["id", "first_name", "last_name"] },
  { model: db.User, as: "createdBy", attributes: ["id", "first_name", "last_name"] },
];

/* ── Helper: advance next_due_date on the Rent after verification ── */
async function advanceNextDueDate(rentId) {
  const rent = await db.Rent.findByPk(rentId);
  if (!rent) return;

  // Find the latest verified payment's cycle_to
  const latest = await RentPayment.findOne({
    where: { rent_id: rentId, status: "verified" },
    order: [["cycle_to", "DESC"]],
  });

  if (!latest) return;

  // next_due_date = day after cycle_to
  const cycleToDate = new Date(latest.cycle_to);
  cycleToDate.setDate(cycleToDate.getDate() + 1);
  await rent.update({ next_due_date: cycleToDate });
}

/* ── Helper: build cycle_label from period + dates ── */
function buildCycleLabel(period, cycleFrom, cycleTo, cyclesCount) {
  const from = new Date(cycleFrom);
  const to   = new Date(cycleTo);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (period === "monthly") {
    if (cyclesCount === 1) {
      return `${monthNames[from.getMonth()]} ${from.getFullYear()}`;
    }
    return `${monthNames[from.getMonth()]}–${monthNames[to.getMonth()]} ${from.getFullYear()}`;
  }
  if (period === "quarterly") {
    const q = Math.floor(from.getMonth() / 3) + 1;
    return `Q${q} ${from.getFullYear()}`;
  }
  if (period === "yearly") {
    return `${from.getFullYear()}`;
  }
  return `${from.toLocaleDateString()} – ${to.toLocaleDateString()}`;
}

module.exports = {
  /* ── List payments (filterable by rent_id, status) ── */
  async getAll(req, res) {
    try {
      let page      = Math.max(parseInt(req.query.page)      || 1, 1);
      let page_size = Math.max(parseInt(req.query.page_size) || 10, 1);
      let ordering  = req.query.ordering || "-createdAt";

      const where = {};
      if (req.query.rent_id)        where.rent_id        = req.query.rent_id;
      if (req.query.status)         where.status         = req.query.status;
      if (req.query.payment_method) where.payment_method = req.query.payment_method;

      const order  = ordering.startsWith("-") ? [[ordering.slice(1), "DESC"]] : [[ordering, "ASC"]];
      const offset = (page - 1) * page_size;

      const { rows, count } = await RentPayment.findAndCountAll({
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

  /* ── All payments for a specific rent ── */
  async getByRentId(req, res) {
    try {
      const payments = await RentPayment.findAll({
        where: { rent_id: req.params.rent_id },
        order: [["cycle_from", "ASC"]],
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

  /* ── Get one ── */
  async getOne(req, res) {
    try {
      const payment = await RentPayment.findByPk(req.params.id, { include });
      if (!payment) return res.status(404).json({ error: "Not found" });

      const obj  = payment.toJSON();
      const host = `${req.protocol}://${req.get("host")}`;
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Create payment ── */
  async create(req, res) {
    try {
      const body = { ...req.body };

      if (req.files && req.files["screenshot_url"]) {
        body.screenshot_url = req.files["screenshot_url"][0].path;
      }

      // Parse numbers
      if (body.amount)       body.amount       = parseFloat(body.amount);
      if (body.rent_id)      body.rent_id      = parseInt(body.rent_id);
      if (body.payer_id)     body.payer_id     = parseInt(body.payer_id) || null;
      if (body.cycles_count) body.cycles_count = parseInt(body.cycles_count) || 1;
      if (body.created_by)   body.created_by   = parseInt(body.created_by) || null;

      // Auto-build cycle_label if not provided
      if (!body.cycle_label && body.cycle_from && body.cycle_to) {
        const rent = await db.Rent.findByPk(body.rent_id);
        if (rent) {
          body.cycle_label = buildCycleLabel(
            rent.rent_period, body.cycle_from, body.cycle_to, body.cycles_count || 1
          );
        }
      }

      const payment = await RentPayment.create(body);
      const full    = await RentPayment.findByPk(payment.id, { include });

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

      await RentPayment.update(body, { where: { id: req.params.id } });
      const updated = await RentPayment.findByPk(req.params.id, { include });

      const host = `${req.protocol}://${req.get("host")}`;
      const obj  = updated.toJSON();
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Verify a payment → auto-advance next_due_date ── */
  async verify(req, res) {
    try {
      const { verified_by, notes } = req.body;
      const payment = await RentPayment.findByPk(req.params.id);
      if (!payment) return res.status(404).json({ error: "Not found" });

      await payment.update({
        status:      "verified",
        verified_by: parseInt(verified_by) || null,
        verified_at: new Date(),
        notes:       notes || payment.notes,
      });

      // Advance the rent's next_due_date
      await advanceNextDueDate(payment.rent_id);

      const updated = await RentPayment.findByPk(req.params.id, { include });
      const host    = `${req.protocol}://${req.get("host")}`;
      const obj     = updated.toJSON();
      if (obj.screenshot_url) obj.screenshot_url = host + "/" + obj.screenshot_url.replace(/\\/g, "/");

      res.json(obj);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Reject a payment ── */
  async reject(req, res) {
    try {
      const { verified_by, rejection_reason } = req.body;
      await RentPayment.update(
        {
          status:           "rejected",
          verified_by:      parseInt(verified_by) || null,
          verified_at:      new Date(),
          rejection_reason,
        },
        { where: { id: req.params.id } }
      );
      const updated = await RentPayment.findByPk(req.params.id, { include });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Delete ── */
  async delete(req, res) {
    try {
      await RentPayment.destroy({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /* ── Preview: what cycles would a payment cover? ── */
  async previewCycles(req, res) {
    try {
      const { rent_id, cycles_count, start_from } = req.query;
      const rent = await db.Rent.findByPk(rent_id);
      if (!rent) return res.status(404).json({ error: "Rent not found" });

      const count  = parseInt(cycles_count) || 1;
      const from   = start_from ? new Date(start_from) : new Date(rent.next_due_date);
      const period = rent.rent_period;

      const cycles = [];
      let cursor = new Date(from);

      for (let i = 0; i < count; i++) {
        const cycleFrom = new Date(cursor);
        let cycleTo;

        if (period === "monthly") {
          cycleTo = new Date(cursor);
          cycleTo.setMonth(cycleTo.getMonth() + 1);
          cycleTo.setDate(cycleTo.getDate() - 1);
        } else if (period === "quarterly") {
          cycleTo = new Date(cursor);
          cycleTo.setMonth(cycleTo.getMonth() + 3);
          cycleTo.setDate(cycleTo.getDate() - 1);
        } else if (period === "yearly") {
          cycleTo = new Date(cursor);
          cycleTo.setFullYear(cycleTo.getFullYear() + 1);
          cycleTo.setDate(cycleTo.getDate() - 1);
        } else {
          cycleTo = new Date(cursor);
          cycleTo.setMonth(cycleTo.getMonth() + 1);
          cycleTo.setDate(cycleTo.getDate() - 1);
        }

        cycles.push({
          index:      i + 1,
          cycle_from: cycleFrom.toISOString().split("T")[0],
          cycle_to:   cycleTo.toISOString().split("T")[0],
          label:      buildCycleLabel(period, cycleFrom, cycleTo, 1),
          amount:     parseFloat(rent.rent_amount),
        });

        // Move cursor to next cycle start
        if (period === "monthly") {
          cursor.setMonth(cursor.getMonth() + 1);
        } else if (period === "quarterly") {
          cursor.setMonth(cursor.getMonth() + 3);
        } else if (period === "yearly") {
          cursor.setFullYear(cursor.getFullYear() + 1);
        } else {
          cursor.setMonth(cursor.getMonth() + 1);
        }
      }

      res.json({
        rent_id:      parseInt(rent_id),
        rent_period:  period,
        rent_amount:  parseFloat(rent.rent_amount),
        cycles_count: count,
        total_amount: parseFloat(rent.rent_amount) * count,
        cycles,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
