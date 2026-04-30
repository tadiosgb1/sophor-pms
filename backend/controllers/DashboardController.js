const { Op } = require("sequelize");
const db = require("../models");

// Helper: date range for current month
function currentMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { from, to };
}

// Helper: get user's role names from localStorage-style roles array
function getRoleNames(rolesHeader) {
  try {
    if (!rolesHeader) return [];
    const parsed = JSON.parse(rolesHeader);
    if (Array.isArray(parsed)) return parsed.map(r => (typeof r === 'string' ? r : r.name)).filter(Boolean);
    return [];
  } catch { return []; }
}

module.exports = {
  // ── ADMIN / OWNER / MANAGER DASHBOARD ────────────────────────────────
  async getAdminStats(req, res) {
    try {
      const { from, to } = currentMonthRange();

      // Sites
      const totalSites    = await db.Site.count();
      const activeSites   = await db.Site.count({ where: { status: "active" } });

      // Units
      const totalUnits     = await db.Unit.count();
      const availableUnits = await db.Unit.count({ where: { status: "available" } });
      const rentedUnits    = await db.Unit.count({ where: { status: "rented" } });
      const soldUnits      = await db.Unit.count({ where: { status: "sold" } });

      // Rents
      const activeRents  = await db.Rent.count({ where: { status: "active" } });
      const overdueRents = await db.Rent.count({
        where: { status: "active", next_due_date: { [Op.lt]: new Date() } }
      });

      // Sales
      const totalSales     = await db.Sale.count();
      const completedSales = await db.Sale.count({ where: { status: "completed" } });
      const pendingSales   = await db.Sale.count({ where: { status: "pending" } });

      // Revenue this month — verified rent payments
      const rentRevenueResult = await db.RentPayment.findAll({
        where: { status: "verified", payment_date: { [Op.between]: [from, to] } },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const rentRevenue = parseFloat(rentRevenueResult[0]?.dataValues?.total || 0);

      // Revenue this month — verified sale payments
      const saleRevenueResult = await db.SalePayment.findAll({
        where: { status: "verified", payment_date: { [Op.between]: [from, to] } },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const saleRevenue = parseFloat(saleRevenueResult[0]?.dataValues?.total || 0);

      // Total revenue all time
      const totalRentRevResult = await db.RentPayment.findAll({
        where: { status: "verified" },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const totalRentRevenue = parseFloat(totalRentRevResult[0]?.dataValues?.total || 0);

      const totalSaleRevResult = await db.SalePayment.findAll({
        where: { status: "verified" },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const totalSaleRevenue = parseFloat(totalSaleRevResult[0]?.dataValues?.total || 0);

      // Expenses this month
      const expenseResult = await db.Expense.findAll({
        where: { expense_date: { [Op.between]: [from, to] } },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const monthlyExpenses = parseFloat(expenseResult[0]?.dataValues?.total || 0);

      // Maintenance
      const pendingMaintenance    = await db.MaintenanceRequest.count({ where: { status: "pending" } });
      const inProgressMaintenance = await db.MaintenanceRequest.count({ where: { status: "in_progress" } });
      const resolvedMaintenance   = await db.MaintenanceRequest.count({ where: { status: "resolved" } });
      const urgentMaintenance     = await db.MaintenanceRequest.count({ where: { priority: "urgent", status: { [Op.in]: ["pending", "in_progress"] } } });

      // Pending payments (rent)
      const pendingRentPayments = await db.RentPayment.count({ where: { status: "pending" } });
      const pendingSalePayments = await db.SalePayment.count({ where: { status: "pending" } });

      // Recent rents (last 5)
      const recentRents = await db.Rent.findAll({
        limit: 5, order: [["createdAt", "DESC"]],
        include: [
          { model: db.Unit, attributes: ["id", "name"] },
          { model: db.Site, attributes: ["id", "name"] },
          { model: db.User, as: "renter", attributes: ["id", "first_name", "last_name", "phone"] },
        ]
      });

      // Recent sales (last 5)
      const recentSales = await db.Sale.findAll({
        limit: 5, order: [["createdAt", "DESC"]],
        include: [
          { model: db.Unit, attributes: ["id", "name"] },
          { model: db.Site, attributes: ["id", "name"] },
          { model: db.User, as: "buyer", attributes: ["id", "first_name", "last_name"] },
        ]
      });

      // Sites with unit counts
      const sitesWithStats = await db.Site.findAll({
        attributes: ["id", "name", "status", "city"],
        include: [
          { model: db.User, as: "manager", attributes: ["id", "first_name", "last_name"] },
        ]
      });

      // Unit counts per site
      const unitCountsBySite = await db.Unit.findAll({
        attributes: ["site_id", [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"]],
        group: ["site_id"]
      });
      const unitMap = {};
      unitCountsBySite.forEach(u => { unitMap[u.site_id] = parseInt(u.dataValues.count); });

      const rentedCountsBySite = await db.Unit.findAll({
        where: { status: "rented" },
        attributes: ["site_id", [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"]],
        group: ["site_id"]
      });
      const rentedMap = {};
      rentedCountsBySite.forEach(u => { rentedMap[u.site_id] = parseInt(u.dataValues.count); });

      const siteStats = sitesWithStats.map(s => ({
        id:          s.id,
        name:        s.name,
        status:      s.status,
        city:        s.city,
        manager:     s.manager ? `${s.manager.first_name} ${s.manager.last_name}` : '—',
        totalUnits:  unitMap[s.id] || 0,
        rentedUnits: rentedMap[s.id] || 0,
        occupancy:   unitMap[s.id] ? Math.round((rentedMap[s.id] || 0) / unitMap[s.id] * 100) : 0,
      }));

      // Expense breakdown by category this month
      const expenseByCategory = await db.Expense.findAll({
        where: { expense_date: { [Op.between]: [from, to] } },
        attributes: ["category", [db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]],
        group: ["category"]
      });

      // Inventory low stock
      const lowStockItems = await db.InventoryItem.findAll({
        where: { quantity: { [Op.lte]: 10 } },
        include: [{ model: db.Site, attributes: ["id", "name"] }],
        limit: 5
      });

      res.json({
        // KPIs
        sites:           { total: totalSites, active: activeSites },
        units:           { total: totalUnits, available: availableUnits, rented: rentedUnits, sold: soldUnits },
        rents:           { active: activeRents, overdue: overdueRents },
        sales:           { total: totalSales, completed: completedSales, pending: pendingSales },
        revenue: {
          thisMonth:     { rent: rentRevenue, sale: saleRevenue, total: rentRevenue + saleRevenue },
          allTime:       { rent: totalRentRevenue, sale: totalSaleRevenue, total: totalRentRevenue + totalSaleRevenue },
        },
        expenses:        { thisMonth: monthlyExpenses, byCategory: expenseByCategory.map(e => ({ category: e.category, total: parseFloat(e.dataValues.total) })) },
        maintenance:     { pending: pendingMaintenance, inProgress: inProgressMaintenance, resolved: resolvedMaintenance, urgent: urgentMaintenance },
        pendingPayments: { rent: pendingRentPayments, sale: pendingSalePayments },
        // Lists
        recentRents:     recentRents.map(r => r.toJSON()),
        recentSales:     recentSales.map(s => s.toJSON()),
        siteStats,
        lowStockItems:   lowStockItems.map(i => i.toJSON()),
      });
    } catch (e) {
      console.error("Dashboard admin error:", e);
      res.status(500).json({ error: e.message });
    }
  },

  // ── TENANT / RENTER / BUYER DASHBOARD ────────────────────────────────
  async getTenantStats(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) return res.status(400).json({ error: "userId required" });

      // Active rents for this user
      const myRents = await db.Rent.findAll({
        where: { renter_id: userId, status: "active" },
        include: [
          { model: db.Unit, attributes: ["id", "name", "floor", "house_number", "bedrooms", "bathrooms", "size"] },
          { model: db.Site, attributes: ["id", "name", "city", "contact_phone"] },
          { model: db.RentPayment, as: "payments", order: [["cycle_from", "DESC"]], limit: 10,
            include: [{ model: db.User, as: "verifier", attributes: ["id", "first_name", "last_name"] }]
          },
        ]
      });

      // Purchases for this user
      const mySales = await db.Sale.findAll({
        where: { buyer_id: userId },
        include: [
          { model: db.Unit, attributes: ["id", "name", "floor", "house_number", "bedrooms", "bathrooms", "size"] },
          { model: db.Site, attributes: ["id", "name", "city"] },
          { model: db.SalePayment, as: "payments", order: [["createdAt", "DESC"]], limit: 10,
            include: [{ model: db.User, as: "verifier", attributes: ["id", "first_name", "last_name"] }]
          },
        ]
      });

      // Maintenance requests submitted by this user
      const myMaintenance = await db.MaintenanceRequest.findAll({
        where: { requested_by: userId },
        order: [["createdAt", "DESC"]],
        limit: 10,
        include: [
          { model: db.Unit, as: "unit", attributes: ["id", "name"] },
          { model: db.Site, as: "site", attributes: ["id", "name"] },
          { model: db.User, as: "assignee", attributes: ["id", "first_name", "last_name"] },
        ]
      });

      // Pending rent payments
      const pendingRentPayments = await db.RentPayment.findAll({
        where: { status: "pending", payer_id: userId },
        include: [{ model: db.Rent, attributes: ["id", "rent_amount", "rent_period"] }]
      });

      // Pending sale payments
      const pendingSalePayments = await db.SalePayment.findAll({
        where: { status: "pending", payer_id: userId },
        include: [{ model: db.Sale, attributes: ["id", "sale_price"] }]
      });

      // Total paid rent
      const totalPaidRentResult = await db.RentPayment.findAll({
        where: { payer_id: userId, status: "verified" },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const totalPaidRent = parseFloat(totalPaidRentResult[0]?.dataValues?.total || 0);

      // Total paid sale
      const totalPaidSaleResult = await db.SalePayment.findAll({
        where: { payer_id: userId, status: "verified" },
        attributes: [[db.sequelize.fn("SUM", db.sequelize.col("amount")), "total"]]
      });
      const totalPaidSale = parseFloat(totalPaidSaleResult[0]?.dataValues?.total || 0);

      const host = `${req.protocol}://${req.get("host")}`;

      // Fix screenshot URLs
      const fixPayments = (payments) => payments.map(p => ({
        ...p,
        screenshot_url: p.screenshot_url ? host + "/" + p.screenshot_url.replace(/\\/g, "/") : null
      }));

      res.json({
        myRents: myRents.map(r => {
          const obj = r.toJSON();
          if (obj.payments) obj.payments = fixPayments(obj.payments);
          return obj;
        }),
        mySales: mySales.map(s => {
          const obj = s.toJSON();
          if (obj.payments) obj.payments = fixPayments(obj.payments);
          return obj;
        }),
        myMaintenance: myMaintenance.map(m => m.toJSON()),
        pendingPayments: {
          rent: pendingRentPayments.map(p => p.toJSON()),
          sale: pendingSalePayments.map(p => p.toJSON()),
        },
        summary: {
          activeRents:      myRents.length,
          totalPurchases:   mySales.length,
          totalPaidRent,
          totalPaidSale,
          pendingRentCount: pendingRentPayments.length,
          pendingSaleCount: pendingSalePayments.length,
          maintenanceOpen:  myMaintenance.filter(m => m.status !== 'resolved' && m.status !== 'rejected').length,
        }
      });
    } catch (e) {
      console.error("Dashboard tenant error:", e);
      res.status(500).json({ error: e.message });
    }
  }
};
