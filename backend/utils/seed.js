// utils/seed.js
const bcrypt = require("bcrypt");
const db = require("../models");
const {
  User, Role, Permission, Company,
  Site, SiteImage, Amenity, SiteAmenity,
  Type, Unit, UnitImage,
  Sale, SaleDocument,
  Rent, RentDocument,
  Expense, InventoryItem, InventoryTransaction,
  MaintenanceRequest,
  ChatRoom, ChatMessage, UserRoom
} = db;

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    /* ------------------------------------------------------------------ */
    /* 1. PERMISSIONS                                                       */
    /* ------------------------------------------------------------------ */
    const permissionList = [
      // User
      { name: "Create User",       code: "create_user" },
      { name: "Edit User",         code: "edit_user" },
      { name: "Delete User",       code: "delete_user" },
      { name: "View User",         code: "view_user" },
      // Role
      { name: "Create Role",       code: "create_role" },
      { name: "Edit Role",         code: "edit_role" },
      { name: "Delete Role",       code: "delete_role" },
      { name: "View Role",         code: "view_role" },
      // Permission
      { name: "Create Permission", code: "create_permission" },
      { name: "Edit Permission",   code: "edit_permission" },
      { name: "Delete Permission", code: "delete_permission" },
      { name: "View Permission",   code: "view_permission" },
      // Company
      { name: "Create Company",    code: "create_company" },
      { name: "Edit Company",      code: "edit_company" },
      { name: "Delete Company",    code: "delete_company" },
      { name: "View Company",      code: "view_company" },
      // Site
      { name: "Create Site",       code: "create_site" },
      { name: "Edit Site",         code: "edit_site" },
      { name: "Delete Site",       code: "delete_site" },
      { name: "View Site",         code: "view_site" },
      // Unit
      { name: "Create Unit",       code: "create_unit" },
      { name: "Edit Unit",         code: "edit_unit" },
      { name: "Delete Unit",       code: "delete_unit" },
      { name: "View Unit",         code: "view_unit" },
      // Sale
      { name: "Create Sale",       code: "create_sale" },
      { name: "Edit Sale",         code: "edit_sale" },
      { name: "Delete Sale",       code: "delete_sale" },
      { name: "View Sale",         code: "view_sale" },
      // Rent
      { name: "Create Rent",       code: "create_rent" },
      { name: "Edit Rent",         code: "edit_rent" },
      { name: "Delete Rent",       code: "delete_rent" },
      { name: "View Rent",         code: "view_rent" },
      // Expense
      { name: "Create Expense",    code: "create_expense" },
      { name: "Edit Expense",      code: "edit_expense" },
      { name: "Delete Expense",    code: "delete_expense" },
      { name: "View Expense",      code: "view_expense" },
      // Inventory
      { name: "Create Inventory",  code: "create_inventory" },
      { name: "Edit Inventory",    code: "edit_inventory" },
      { name: "Delete Inventory",  code: "delete_inventory" },
      { name: "View Inventory",    code: "view_inventory" },
      // Amenity
      { name: "Create Amenity",    code: "create_amenity" },
      { name: "Edit Amenity",      code: "edit_amenity" },
      { name: "Delete Amenity",    code: "delete_amenity" },
      { name: "View Amenity",      code: "view_amenity" },
      // Misc
      { name: "Assign Permission", code: "assign_permission" },
      { name: "Assign Role",       code: "assign_role" },
    ];

    const permissions = [];
    for (const p of permissionList) {
      const [perm] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: { name: p.name, description: p.name }
      });
      permissions.push(perm);
    }
    console.log(`✅ ${permissions.length} permissions seeded`);

    /* ------------------------------------------------------------------ */
    /* 2. ROLES                                                             */
    /* ------------------------------------------------------------------ */
    const roleDefinitions = [
      {
        name: "Super",
        description: "Super administrator with all permissions",
        permCodes: permissionList.map(p => p.code) // all
      },
      {
        name: "Owner",
        description: "Property owner",
        permCodes: permissionList.map(p => p.code) // all
      },
      {
        name: "Manager",
        description: "Site manager",
        permCodes: [
          "view_user", "view_role", "view_permission",
          "view_company",
          "create_site", "edit_site", "view_site",
          "create_unit", "edit_unit", "view_unit",
          "create_sale", "edit_sale", "view_sale",
          "create_rent", "edit_rent", "view_rent",
          "create_expense", "edit_expense", "view_expense",
          "create_inventory", "edit_inventory", "view_inventory",
          "create_amenity", "edit_amenity", "view_amenity",
        ]
      },
      {
        name: "Staff",
        description: "Staff member",
        permCodes: [
          "view_site", "view_unit",
          "view_sale", "view_rent",
          "view_expense", "view_inventory", "view_amenity",
        ]
      },
      {
        name: "Tenant",
        description: "Tenant / buyer",
        permCodes: [
          "view_site", "view_unit",
          "view_sale", "view_rent",
        ]
      },
    ];

    const rolesMap = {};
    for (const rd of roleDefinitions) {
      const [role] = await Role.findOrCreate({
        where: { name: rd.name },
        defaults: { description: rd.description }
      });
      const rolePerms = permissions.filter(p => rd.permCodes.includes(p.code));
      await role.setPermissions(rolePerms);
      rolesMap[rd.name] = role;
    }
    console.log(`✅ ${Object.keys(rolesMap).length} roles seeded`);

    /* ------------------------------------------------------------------ */
    /* 3. USERS                                                             */
    /* ------------------------------------------------------------------ */
    const userList = [
      {
        first_name: "Super", middle_name: "Admin", last_name: "Admin",
        email: "tadiosgb27@gmail.com", password: "1234",
        phone: "0963275521", address: "Mekelle", roleName: "Super"
      },
      {
        first_name: "Owner", middle_name: "User", last_name: "User",
        email: "tadiosgb26@gmail.com", password: "1234",
        phone: "0967740501", address: "Mekelle", roleName: "Owner"
      },
      {
        first_name: "Manager", middle_name: "Manager", last_name: "Manager",
        email: "tadiosgb28@gmail.com", password: "1234",
        phone: "0967740502", address: "Mekelle", roleName: "Manager"
      },
      {
        first_name: "Staff", middle_name: "Staff", last_name: "Staff",
        email: "tadiosgb29@gmail.com", password: "1234",
        phone: "0967740503", address: "Mekelle", roleName: "Staff"
      },
      {
        first_name: "Tenant", middle_name: "Tenant", last_name: "Tenant",
        email: "tadiosgb30@gmail.com", password: "1234",
        phone: "0967740504", address: "Mekelle", roleName: "Tenant"
      },
    ];

    const usersMap = {};
    for (const u of userList) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          first_name: u.first_name,
          middle_name: u.middle_name,
          last_name: u.last_name,
          phone: u.phone,
          email: u.email,
          password: hashedPassword,
          address: u.address,
        }
      });
      const role = rolesMap[u.roleName];
      if (role) await user.setRoles([role]);
      usersMap[u.roleName] = user;
      console.log(`✅ User: ${user.email} → Role: ${u.roleName} ${created ? "(created)" : "(exists)"}`);
    }

    const superUser   = usersMap["Super"];
    const ownerUser   = usersMap["Owner"];
    const managerUser = usersMap["Manager"];
    const staffUser   = usersMap["Staff"];
    const tenantUser  = usersMap["Tenant"];

    /* ------------------------------------------------------------------ */
    /* 4. COMPANY                                                           */
    /* ------------------------------------------------------------------ */
    const [company] = await Company.findOrCreate({
      where: { owner_id: ownerUser.id },
      defaults: {
        name: "Wahs Real Estate",
        address: "Mekelle, Tigray",
        latitude: "13.4967",
        longitude: "39.4753",
        phone: "0967740501",
        official_email: ownerUser.email,
        website: "https://wahs.com",
        logo: "uploads/default-logo.jpg",
        facebook: "https://facebook.com/wahs",
        instagram: "https://instagram.com/wahs",
        linkedin: "https://linkedin.com/wahs",
        twitter: "https://twitter.com/wahs",
        telegram: "https://t.me/wahs",
        description: "Wahs Real Estate — premium property management"
      }
    });
    console.log(`✅ Company: ${company.name}`);

    /* ------------------------------------------------------------------ */
    /* 5. TYPES                                                             */
    /* ------------------------------------------------------------------ */
    const typeList = [
      { name: "Apartment",    category: "Residential" },
      { name: "Villa",        category: "Residential" },
      { name: "Office",       category: "Commercial" },
      { name: "Shop",         category: "Commercial" },
      { name: "Warehouse",    category: "Industrial" },
      { name: "Land",         category: "Land" },
    ];

    const typesMap = {};
    for (const t of typeList) {
      const [type] = await Type.findOrCreate({
        where: { name: t.name },
        defaults: { category: t.category, owner_id: ownerUser.id, created_by: superUser.id }
      });
      typesMap[t.name] = type;
    }
    console.log(`✅ ${Object.keys(typesMap).length} types seeded`);

    /* ------------------------------------------------------------------ */
    /* 6. AMENITIES                                                         */
    /* ------------------------------------------------------------------ */
    const amenityList = [
      { name: "Swimming Pool",   description: "Outdoor swimming pool" },
      { name: "Gym",             description: "Fully equipped fitness center" },
      { name: "Parking",         description: "Underground parking garage" },
      { name: "Security",        description: "24/7 security service" },
      { name: "Elevator",        description: "High-speed elevator" },
      { name: "Garden",          description: "Landscaped garden area" },
      { name: "Playground",      description: "Children's playground" },
      { name: "CCTV",            description: "CCTV surveillance system" },
    ];

    const amenitiesMap = {};
    for (const a of amenityList) {
      const [amenity] = await Amenity.findOrCreate({
        where: { name: a.name },
        defaults: { description: a.description, owner_id: ownerUser.id, created_by: superUser.id }
      });
      amenitiesMap[a.name] = amenity;
    }
    console.log(`✅ ${Object.keys(amenitiesMap).length} amenities seeded`);

    /* ------------------------------------------------------------------ */
    /* 7. SITES                                                             */
    /* ------------------------------------------------------------------ */
    const siteList = [
      {
        name: "Wahs Residence A",
        description: "Luxury residential complex in the heart of Mekelle",
        type_id: typesMap["Apartment"].id,
        status: "active",
        latitude: "13.4967", longitude: "39.4753",
        country: "Ethiopia", state: "Tigray", city: "Mekelle",
        sub_city: "Ayder", street: "Alula Street",
        postal_code: "23100", area_size: "5000 sqm", capacity: "50",
        contact_phone: "0967740501", contact_email: "siteA@wahs.com",
      },
      {
        name: "Wahs Commercial Hub",
        description: "Modern commercial complex for offices and shops",
        type_id: typesMap["Office"].id,
        status: "active",
        latitude: "13.5010", longitude: "39.4800",
        country: "Ethiopia", state: "Tigray", city: "Mekelle",
        sub_city: "Kedamay Weyane", street: "Commercial Road",
        postal_code: "23101", area_size: "8000 sqm", capacity: "30",
        contact_phone: "0967740502", contact_email: "siteB@wahs.com",
      },
    ];

    const sitesMap = {};
    for (const s of siteList) {
      const [site] = await Site.findOrCreate({
        where: { name: s.name },
        defaults: {
          ...s,
          owner_id: ownerUser.id,
          manager_id: managerUser.id,
          staff_id: staffUser.id,
          created_by: superUser.id,
        }
      });
      sitesMap[s.name] = site;
    }
    console.log(`✅ ${Object.keys(sitesMap).length} sites seeded`);

    /* ------------------------------------------------------------------ */
    /* 8. SITE IMAGES                                                       */
    /* ------------------------------------------------------------------ */
    const siteA = sitesMap["Wahs Residence A"];
    const siteB = sitesMap["Wahs Commercial Hub"];

    const siteImageList = [
      { site_id: siteA.id, image_url: "uploads/site_a_1.jpg" },
      { site_id: siteA.id, image_url: "uploads/site_a_2.jpg" },
      { site_id: siteB.id, image_url: "uploads/site_b_1.jpg" },
    ];

    for (const img of siteImageList) {
      await SiteImage.findOrCreate({
        where: { site_id: img.site_id, image_url: img.image_url },
        defaults: { ...img, owner_id: ownerUser.id, created_by: superUser.id }
      });
    }
    console.log(`✅ ${siteImageList.length} site images seeded`);

    /* ------------------------------------------------------------------ */
    /* 9. SITE AMENITIES                                                    */
    /* ------------------------------------------------------------------ */
    const siteAmenityList = [
      { site_id: siteA.id, amenity_id: amenitiesMap["Swimming Pool"].id },
      { site_id: siteA.id, amenity_id: amenitiesMap["Gym"].id },
      { site_id: siteA.id, amenity_id: amenitiesMap["Parking"].id },
      { site_id: siteA.id, amenity_id: amenitiesMap["Security"].id },
      { site_id: siteA.id, amenity_id: amenitiesMap["Elevator"].id },
      { site_id: siteB.id, amenity_id: amenitiesMap["Parking"].id },
      { site_id: siteB.id, amenity_id: amenitiesMap["Security"].id },
      { site_id: siteB.id, amenity_id: amenitiesMap["CCTV"].id },
    ];

    for (const sa of siteAmenityList) {
      await SiteAmenity.findOrCreate({
        where: { site_id: sa.site_id, amenity_id: sa.amenity_id },
        defaults: { ...sa, owner_id: ownerUser.id, created_by: superUser.id }
      });
    }
    console.log(`✅ ${siteAmenityList.length} site amenities seeded`);

    /* ------------------------------------------------------------------ */
    /* 10. UNITS                                                            */
    /* ------------------------------------------------------------------ */
    const unitList = [
      // Site A — Apartments
      {
        name: "Unit A-101", type_id: typesMap["Apartment"].id, site_id: siteA.id,
        floor: "1", house_number: "101", block_number: "A",
        bedrooms: "2", bathrooms: "1", size: "85 sqm", price: "2500000",
        status: "available", description: "Cozy 2-bedroom apartment"
      },
      {
        name: "Unit A-102", type_id: typesMap["Apartment"].id, site_id: siteA.id,
        floor: "1", house_number: "102", block_number: "A",
        bedrooms: "3", bathrooms: "2", size: "110 sqm", price: "3500000",
        status: "available", description: "Spacious 3-bedroom apartment"
      },
      {
        name: "Unit A-201", type_id: typesMap["Apartment"].id, site_id: siteA.id,
        floor: "2", house_number: "201", block_number: "A",
        bedrooms: "1", bathrooms: "1", size: "60 sqm", price: "1800000",
        status: "rented", description: "Studio apartment"
      },
      {
        name: "Unit A-202", type_id: typesMap["Apartment"].id, site_id: siteA.id,
        floor: "2", house_number: "202", block_number: "A",
        bedrooms: "2", bathrooms: "2", size: "95 sqm", price: "2800000",
        status: "sold", description: "Premium 2-bedroom apartment"
      },
      // Site B — Offices
      {
        name: "Office B-01", type_id: typesMap["Office"].id, site_id: siteB.id,
        floor: "1", house_number: "01", block_number: "B",
        bedrooms: "0", bathrooms: "1", size: "120 sqm", price: "5000000",
        status: "available", description: "Ground floor office space"
      },
      {
        name: "Shop B-S1", type_id: typesMap["Shop"].id, site_id: siteB.id,
        floor: "G", house_number: "S1", block_number: "B",
        bedrooms: "0", bathrooms: "1", size: "45 sqm", price: "1500000",
        status: "rented", description: "Retail shop unit"
      },
    ];

    const unitsMap = {};
    for (const u of unitList) {
      const [unit] = await Unit.findOrCreate({
        where: { name: u.name, site_id: u.site_id },
        defaults: {
          ...u,
          owner_id: ownerUser.id,
          manager_id: managerUser.id,
          staff_id: staffUser.id,
          created_by: superUser.id,
        }
      });
      unitsMap[u.name] = unit;
    }
    console.log(`✅ ${Object.keys(unitsMap).length} units seeded`);

    /* ------------------------------------------------------------------ */
    /* 11. UNIT IMAGES                                                      */
    /* ------------------------------------------------------------------ */
    const unitImageList = [
      { unit_id: unitsMap["Unit A-101"].id, image_url: "uploads/unit_a101_1.jpg" },
      { unit_id: unitsMap["Unit A-101"].id, image_url: "uploads/unit_a101_2.jpg" },
      { unit_id: unitsMap["Unit A-102"].id, image_url: "uploads/unit_a102_1.jpg" },
      { unit_id: unitsMap["Office B-01"].id, image_url: "uploads/office_b01_1.jpg" },
    ];

    for (const img of unitImageList) {
      await UnitImage.findOrCreate({
        where: { unit_id: img.unit_id, image_url: img.image_url },
        defaults: { ...img, owner_id: ownerUser.id, created_by: superUser.id }
      });
    }
    console.log(`✅ ${unitImageList.length} unit images seeded`);

    /* ------------------------------------------------------------------ */
    /* 12. SALES                                                            */
    /* ------------------------------------------------------------------ */
    const soldUnit = unitsMap["Unit A-202"];
    const [sale] = await Sale.findOrCreate({
      where: { unit_id: soldUnit.id, buyer_id: tenantUser.id },
      defaults: {
        unit_id: soldUnit.id,
        site_id: siteA.id,
        buyer_id: tenantUser.id,
        sale_price: "2800000",
        sale_date: new Date("2025-01-15"),
        status: "completed",
        notes: "Full payment received",
        owner_id: ownerUser.id,
        created_by: superUser.id,
      }
    });
    console.log(`✅ Sale seeded: Unit ${soldUnit.name}`);

    /* ------------------------------------------------------------------ */
    /* 13. SALE DOCUMENTS                                                   */
    /* ------------------------------------------------------------------ */
    await SaleDocument.findOrCreate({
      where: { sale_id: sale.id, document_name: "Sale Agreement" },
      defaults: {
        sale_id: sale.id,
        document_name: "Sale Agreement",
        document_url: "uploads/sale_agreement_001.pdf",
        owner_id: ownerUser.id,
        created_by: superUser.id,
      }
    });
    console.log(`✅ Sale document seeded`);

    /* ------------------------------------------------------------------ */
    /* 14. RENTS                                                            */
    /* ------------------------------------------------------------------ */
    const rentedUnits = [
      { unit: unitsMap["Unit A-201"], amount: "8000",  deposit: "16000", period: "monthly" },
      { unit: unitsMap["Shop B-S1"],  amount: "12000", deposit: "24000", period: "monthly" },
    ];

    const rentsMap = {};
    for (const r of rentedUnits) {
      const [rent] = await Rent.findOrCreate({
        where: { unit_id: r.unit.id, renter_id: tenantUser.id },
        defaults: {
          unit_id: r.unit.id,
          site_id: r.unit.site_id,
          renter_id: tenantUser.id,
          rent_amount: r.amount,
          deposit_amount: r.deposit,
          rent_period: r.period,
          start_date: new Date("2025-02-01"),
          next_due_date: new Date("2025-03-01"),
          status: "active",
          notes: "Lease signed and deposit paid",
          owner_id: ownerUser.id,
          created_by: superUser.id,
        }
      });
      rentsMap[r.unit.name] = rent;
    }
    console.log(`✅ ${Object.keys(rentsMap).length} rents seeded`);

    /* ------------------------------------------------------------------ */
    /* 15. RENT DOCUMENTS                                                   */
    /* ------------------------------------------------------------------ */
    for (const [unitName, rent] of Object.entries(rentsMap)) {
      await RentDocument.findOrCreate({
        where: { rent_id: rent.id, document_name: "Lease Agreement" },
        defaults: {
          rent_id: rent.id,
          document_name: "Lease Agreement",
          document_url: `uploads/lease_${rent.id}.pdf`,
          owner_id: ownerUser.id,
          created_by: superUser.id,
        }
      });
    }
    console.log(`✅ Rent documents seeded`);

    /* ------------------------------------------------------------------ */
    /* 16. EXPENSES                                                         */
    /* ------------------------------------------------------------------ */
    const expenseList = [
      { category: "Maintenance",  amount: 5000,  expense_date: new Date("2025-01-10"), description: "Plumbing repair Site A",       site_id: siteA.id },
      { category: "Utilities",    amount: 3200,  expense_date: new Date("2025-01-15"), description: "Electricity bill Site A",       site_id: siteA.id },
      { category: "Cleaning",     amount: 1500,  expense_date: new Date("2025-01-20"), description: "Monthly cleaning service",      site_id: siteA.id },
      { category: "Security",     amount: 8000,  expense_date: new Date("2025-01-05"), description: "Security personnel salary",     site_id: siteB.id },
      { category: "Maintenance",  amount: 4500,  expense_date: new Date("2025-02-01"), description: "Elevator maintenance Site B",   site_id: siteB.id },
      { category: "Utilities",    amount: 2800,  expense_date: new Date("2025-02-10"), description: "Water bill Site B",             site_id: siteB.id },
    ];

    for (const e of expenseList) {
      await Expense.findOrCreate({
        where: { category: e.category, expense_date: e.expense_date, site_id: e.site_id },
        defaults: { ...e, created_by: managerUser.id }
      });
    }
    console.log(`✅ ${expenseList.length} expenses seeded`);

    /* ------------------------------------------------------------------ */
    /* 17. INVENTORY ITEMS                                                  */
    /* ------------------------------------------------------------------ */
    const inventoryList = [
      { description: "Paint (White)",       quantity: 50,  unit: "liters",  price_per_unit: 120,  site_id: siteA.id },
      { description: "Cement Bags",         quantity: 200, unit: "bags",    price_per_unit: 350,  site_id: siteA.id },
      { description: "Ceramic Tiles",       quantity: 500, unit: "pieces",  price_per_unit: 85,   site_id: siteA.id },
      { description: "Light Bulbs (LED)",   quantity: 100, unit: "pieces",  price_per_unit: 45,   site_id: siteB.id },
      { description: "PVC Pipes",           quantity: 80,  unit: "meters",  price_per_unit: 60,   site_id: siteB.id },
      { description: "Cleaning Supplies",   quantity: 30,  unit: "sets",    price_per_unit: 200,  site_id: siteB.id },
    ];

    const inventoryMap = {};
    for (const item of inventoryList) {
      const [inv] = await InventoryItem.findOrCreate({
        where: { description: item.description, site_id: item.site_id },
        defaults: { ...item, created_by: managerUser.id }
      });
      inventoryMap[item.description] = inv;
    }
    console.log(`✅ ${Object.keys(inventoryMap).length} inventory items seeded`);

    /* ------------------------------------------------------------------ */
    /* 18. INVENTORY TRANSACTIONS                                           */
    /* ------------------------------------------------------------------ */
    const txList = [
      { action: "stock_in",  quantity: 50,  note: "Initial stock",         transaction_date: new Date("2025-01-01") },
      { action: "stock_out", quantity: 10,  note: "Used for unit painting", transaction_date: new Date("2025-01-20") },
      { action: "stock_in",  quantity: 200, note: "Bulk purchase",          transaction_date: new Date("2025-01-05") },
      { action: "stock_out", quantity: 30,  note: "Used for repairs",       transaction_date: new Date("2025-02-10") },
    ];

    for (const tx of txList) {
      await InventoryTransaction.findOrCreate({
        where: { action: tx.action, transaction_date: tx.transaction_date, note: tx.note },
        defaults: { ...tx, created_by: managerUser.id }
      });
    }
    console.log(`✅ ${txList.length} inventory transactions seeded`);

    /* ------------------------------------------------------------------ */
    /* 19. CHAT ROOMS & MESSAGES                                            */
    /* ------------------------------------------------------------------ */
    // Room between Super and Manager
    const [chatRoom] = await ChatRoom.findOrCreate({
      where: { isGroup: false, name: null },
      defaults: { isGroup: false }
    });

    await UserRoom.findOrCreate({ where: { userId: superUser.id,   roomId: chatRoom.id } });
    await UserRoom.findOrCreate({ where: { userId: managerUser.id, roomId: chatRoom.id } });

    const messages = [
      { senderId: superUser.id,   receiverId: managerUser.id, message: "Hello Manager, please review the new units." },
      { senderId: managerUser.id, receiverId: superUser.id,   message: "Sure, I will check them today." },
      { senderId: superUser.id,   receiverId: managerUser.id, message: "Great, let me know if anything needs updating." },
    ];

    for (const msg of messages) {
      await ChatMessage.findOrCreate({
        where: { roomId: chatRoom.id, senderId: msg.senderId, message: msg.message },
        defaults: { ...msg, roomId: chatRoom.id }
      });
    }
    console.log(`✅ Chat room and ${messages.length} messages seeded`);

    /* ------------------------------------------------------------------ */
    /* 20. MAINTENANCE REQUESTS                                             */
    /* ------------------------------------------------------------------ */
    const maintenanceList = [
      // Pending requests (recently submitted by tenant)
      {
        title: "Leaking pipe in bathroom",
        description: "The pipe under the bathroom sink is leaking and causing water damage to the cabinet.",
        priority: "high",
        status: "pending",
        category: "Plumbing",
        unit_id: unitsMap["Unit A-201"].id,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: null,
      },
      {
        title: "Air conditioner not cooling",
        description: "The AC unit in the living room stopped cooling. It turns on but blows warm air.",
        priority: "medium",
        status: "pending",
        category: "HVAC",
        unit_id: unitsMap["Unit A-201"].id,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: null,
      },
      {
        title: "Broken window latch",
        description: "The latch on the bedroom window is broken and the window cannot be secured.",
        priority: "low",
        status: "pending",
        category: "Structural",
        unit_id: unitsMap["Unit A-102"].id,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: null,
      },
      // In-progress requests (assigned to staff)
      {
        title: "Elevator malfunction on floor 2",
        description: "The elevator stops abruptly between floors 1 and 2. Residents are using stairs.",
        priority: "urgent",
        status: "in_progress",
        category: "Electrical",
        unit_id: null,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        assigned_to: staffUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: "Technician scheduled for tomorrow morning.",
      },
      {
        title: "Shop shutter door jammed",
        description: "The rolling shutter door of the shop cannot be opened from outside.",
        priority: "high",
        status: "in_progress",
        category: "Structural",
        unit_id: unitsMap["Shop B-S1"].id,
        site_id: siteB.id,
        requested_by: tenantUser.id,
        assigned_to: staffUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: "Locksmith contacted, parts ordered.",
      },
      // Resolved requests
      {
        title: "Flickering lights in hallway",
        description: "The hallway lights on floor 1 flicker intermittently, especially at night.",
        priority: "medium",
        status: "resolved",
        category: "Electrical",
        unit_id: null,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        assigned_to: staffUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: new Date("2025-02-15"),
        notes: "Replaced faulty ballast and two fluorescent tubes.",
      },
      {
        title: "Water heater not working",
        description: "Hot water is not available in the unit. The water heater shows an error code E3.",
        priority: "high",
        status: "resolved",
        category: "Plumbing",
        unit_id: unitsMap["Unit A-201"].id,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        assigned_to: managerUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: new Date("2025-01-28"),
        notes: "Replaced heating element. Unit tested and working.",
      },
      // Rejected request
      {
        title: "Request to repaint entire apartment",
        description: "Tenant requesting full interior repaint of the apartment.",
        priority: "low",
        status: "rejected",
        category: "Cosmetic",
        unit_id: unitsMap["Unit A-102"].id,
        site_id: siteA.id,
        requested_by: tenantUser.id,
        owner_id: ownerUser.id,
        created_by: tenantUser.id,
        resolved_at: null,
        notes: "Rejected — cosmetic requests not covered under lease agreement.",
      },
    ];

    for (const m of maintenanceList) {
      await MaintenanceRequest.findOrCreate({
        where: { title: m.title, site_id: m.site_id },
        defaults: m
      });
    }
    console.log(`✅ ${maintenanceList.length} maintenance requests seeded`);

    /* ------------------------------------------------------------------ */
    /* 21. ADDITIONAL SALES WITH VARIED PAYMENT METHODS                    */
    /* ------------------------------------------------------------------ */
    const { SalePayment } = db;

    // Sale 2 — Unit A-101 — paid via Telebirr (full, verified)
    const [sale2] = await Sale.findOrCreate({
      where: { unit_id: unitsMap["Unit A-101"].id, buyer_id: tenantUser.id },
      defaults: {
        unit_id:    unitsMap["Unit A-101"].id,
        site_id:    siteA.id,
        buyer_id:   tenantUser.id,
        sale_price: "2500000",
        sale_date:  new Date("2025-02-10"),
        status:     "completed",
        notes:      "Paid in full via Telebirr",
        owner_id:   ownerUser.id,
        created_by: superUser.id,
      }
    });

    await SalePayment.findOrCreate({
      where: { sale_id: sale2.id, transaction_ref: "TXN-TELE-20250210-001" },
      defaults: {
        sale_id:         sale2.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          2500000,
        payment_date:    new Date("2025-02-10"),
        payment_method:  "telebirr",
        payment_type:    "full",
        status:          "verified",
        transaction_ref: "TXN-TELE-20250210-001",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-02-11"),
        notes:           "Telebirr full payment confirmed",
        created_by:      tenantUser.id,
      }
    });

    // Sale 3 — Unit A-102 — installment plan via CBE Birr + Bank Transfer
    const [sale3] = await Sale.findOrCreate({
      where: { unit_id: unitsMap["Unit A-102"].id, buyer_id: tenantUser.id },
      defaults: {
        unit_id:    unitsMap["Unit A-102"].id,
        site_id:    siteA.id,
        buyer_id:   tenantUser.id,
        sale_price: "3500000",
        sale_date:  new Date("2025-03-01"),
        status:     "pending",
        notes:      "Installment plan — 3 payments",
        owner_id:   ownerUser.id,
        created_by: superUser.id,
      }
    });

    // Installment 1 — CBE Birr — verified
    await SalePayment.findOrCreate({
      where: { sale_id: sale3.id, transaction_ref: "CBE-20250301-001" },
      defaults: {
        sale_id:         sale3.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          1200000,
        payment_date:    new Date("2025-03-01"),
        payment_method:  "cbebirr",
        payment_type:    "installment",
        status:          "verified",
        transaction_ref: "CBE-20250301-001",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-03-02"),
        notes:           "First installment — CBE Birr",
        created_by:      tenantUser.id,
      }
    });

    // Installment 2 — Bank Transfer — verified
    await SalePayment.findOrCreate({
      where: { sale_id: sale3.id, transaction_ref: "TRF-20250401-002" },
      defaults: {
        sale_id:         sale3.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          1200000,
        payment_date:    new Date("2025-04-01"),
        payment_method:  "bank_transfer",
        payment_type:    "installment",
        status:          "verified",
        transaction_ref: "TRF-20250401-002",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-04-02"),
        notes:           "Second installment — Bank Transfer (Commercial Bank of Ethiopia)",
        created_by:      tenantUser.id,
      }
    });

    // Installment 3 — Screenshot — pending (awaiting verification)
    await SalePayment.findOrCreate({
      where: { sale_id: sale3.id, payment_date: new Date("2025-05-01"), payment_method: "screenshot" },
      defaults: {
        sale_id:        sale3.id,
        payer_id:       tenantUser.id,
        payer_name:     `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:    tenantUser.phone,
        amount:         1100000,
        payment_date:   new Date("2025-05-01"),
        payment_method: "screenshot",
        payment_type:   "installment",
        status:         "pending",
        screenshot_url: "uploads/receipt_sample.jpg",
        notes:          "Third installment — receipt screenshot attached",
        created_by:     tenantUser.id,
      }
    });

    // Sale 4 — Office B-01 — Cash deposit + screenshot partial (one rejected)
    const [sale4] = await Sale.findOrCreate({
      where: { unit_id: unitsMap["Office B-01"].id, buyer_id: tenantUser.id },
      defaults: {
        unit_id:    unitsMap["Office B-01"].id,
        site_id:    siteB.id,
        buyer_id:   tenantUser.id,
        sale_price: "5000000",
        sale_date:  new Date("2025-04-15"),
        status:     "pending",
        notes:      "Commercial office — partial payments",
        owner_id:   ownerUser.id,
        created_by: superUser.id,
      }
    });

    // Cash deposit — verified
    await SalePayment.findOrCreate({
      where: { sale_id: sale4.id, payment_method: "cash", payment_type: "deposit" },
      defaults: {
        sale_id:        sale4.id,
        payer_id:       tenantUser.id,
        payer_name:     `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:    tenantUser.phone,
        amount:         500000,
        payment_date:   new Date("2025-04-15"),
        payment_method: "cash",
        payment_type:   "deposit",
        status:         "verified",
        verified_by:    managerUser.id,
        verified_at:    new Date("2025-04-15"),
        notes:          "Cash deposit received at office",
        created_by:     managerUser.id,
      }
    });

    // Screenshot partial — rejected (blurry image)
    await SalePayment.findOrCreate({
      where: { sale_id: sale4.id, payment_method: "screenshot", payment_type: "partial" },
      defaults: {
        sale_id:          sale4.id,
        payer_id:         tenantUser.id,
        payer_name:       `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:      tenantUser.phone,
        amount:           1000000,
        payment_date:     new Date("2025-05-10"),
        payment_method:   "screenshot",
        payment_type:     "partial",
        status:           "rejected",
        screenshot_url:   "uploads/receipt_sample.jpg",
        verified_by:      managerUser.id,
        verified_at:      new Date("2025-05-11"),
        rejection_reason: "Screenshot is blurry and transaction details are not readable. Please resubmit a clear image.",
        notes:            "Rejected — unreadable receipt",
        created_by:       tenantUser.id,
      }
    });

    // Telebirr partial — pending
    await SalePayment.findOrCreate({
      where: { sale_id: sale4.id, transaction_ref: "TXN-TELE-20250520-003" },
      defaults: {
        sale_id:         sale4.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          1500000,
        payment_date:    new Date("2025-05-20"),
        payment_method:  "telebirr",
        payment_type:    "partial",
        status:          "pending",
        transaction_ref: "TXN-TELE-20250520-003",
        notes:           "Awaiting manager verification",
        created_by:      tenantUser.id,
      }
    });

    console.log(`✅ Additional sales and payments seeded`);

    /* ------------------------------------------------------------------ */
    /* 22. RENT PAYMENTS WITH CYCLES                                        */
    /* ------------------------------------------------------------------ */
    const { RentPayment } = db;

    const rent1 = rentsMap["Unit A-201"]; // monthly, ETB 8000
    const rent2 = rentsMap["Shop B-S1"];  // monthly, ETB 12000

    // ── Rent 1 (Unit A-201) ─────────────────────────────────────────────
    // Feb 2025 — Cash — verified
    await RentPayment.findOrCreate({
      where: { rent_id: rent1.id, cycle_from: "2025-02-01" },
      defaults: {
        rent_id:        rent1.id,
        payer_id:       tenantUser.id,
        payer_name:     `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:    tenantUser.phone,
        amount:         8000,
        payment_date:   new Date("2025-02-01"),
        payment_method: "cash",
        cycle_from:     "2025-02-01",
        cycle_to:       "2025-02-28",
        cycles_count:   1,
        cycle_label:    "Feb 2025",
        status:         "verified",
        verified_by:    managerUser.id,
        verified_at:    new Date("2025-02-01"),
        notes:          "Cash payment at office",
        created_by:     tenantUser.id,
      }
    });

    // Mar 2025 — Telebirr — verified
    await RentPayment.findOrCreate({
      where: { rent_id: rent1.id, cycle_from: "2025-03-01" },
      defaults: {
        rent_id:         rent1.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          8000,
        payment_date:    new Date("2025-03-01"),
        payment_method:  "telebirr",
        cycle_from:      "2025-03-01",
        cycle_to:        "2025-03-31",
        cycles_count:    1,
        cycle_label:     "Mar 2025",
        status:          "verified",
        transaction_ref: "TXN-TELE-20250301-R1",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-03-02"),
        notes:           "Telebirr payment confirmed",
        created_by:      tenantUser.id,
      }
    });

    // Apr + May 2025 — advance payment (2 months) — CBE Birr — verified
    await RentPayment.findOrCreate({
      where: { rent_id: rent1.id, cycle_from: "2025-04-01" },
      defaults: {
        rent_id:         rent1.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          16000,  // 2 × 8000
        payment_date:    new Date("2025-04-01"),
        payment_method:  "cbebirr",
        cycle_from:      "2025-04-01",
        cycle_to:        "2025-05-31",
        cycles_count:    2,
        cycle_label:     "Apr–May 2025",
        status:          "verified",
        transaction_ref: "CBE-20250401-R1-ADV",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-04-02"),
        notes:           "Advance payment for April and May",
        created_by:      tenantUser.id,
      }
    });

    // Jun 2025 — Screenshot — pending (awaiting verification)
    await RentPayment.findOrCreate({
      where: { rent_id: rent1.id, cycle_from: "2025-06-01" },
      defaults: {
        rent_id:        rent1.id,
        payer_id:       tenantUser.id,
        payer_name:     `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:    tenantUser.phone,
        amount:         8000,
        payment_date:   new Date("2025-06-01"),
        payment_method: "screenshot",
        cycle_from:     "2025-06-01",
        cycle_to:       "2025-06-30",
        cycles_count:   1,
        cycle_label:    "Jun 2025",
        status:         "pending",
        screenshot_url: "uploads/receipt_sample.jpg",
        notes:          "Bank transfer receipt attached",
        created_by:     tenantUser.id,
      }
    });

    // Jul 2025 — Screenshot — rejected (wrong amount)
    await RentPayment.findOrCreate({
      where: { rent_id: rent1.id, cycle_from: "2025-07-01" },
      defaults: {
        rent_id:          rent1.id,
        payer_id:         tenantUser.id,
        payer_name:       `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:      tenantUser.phone,
        amount:           7500,  // wrong amount
        payment_date:     new Date("2025-07-01"),
        payment_method:   "screenshot",
        cycle_from:       "2025-07-01",
        cycle_to:         "2025-07-31",
        cycles_count:     1,
        cycle_label:      "Jul 2025",
        status:           "rejected",
        screenshot_url:   "uploads/receipt_sample.jpg",
        verified_by:      managerUser.id,
        verified_at:      new Date("2025-07-02"),
        rejection_reason: "Amount paid (ETB 7,500) does not match the required rent amount (ETB 8,000). Please pay the remaining ETB 500 and resubmit.",
        notes:            "Rejected — amount mismatch",
        created_by:       tenantUser.id,
      }
    });

    // ── Rent 2 (Shop B-S1) ───────────────────────────────────────────────
    // Feb 2025 — Bank Transfer — verified
    await RentPayment.findOrCreate({
      where: { rent_id: rent2.id, cycle_from: "2025-02-01" },
      defaults: {
        rent_id:         rent2.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          12000,
        payment_date:    new Date("2025-02-01"),
        payment_method:  "bank_transfer",
        cycle_from:      "2025-02-01",
        cycle_to:        "2025-02-28",
        cycles_count:    1,
        cycle_label:     "Feb 2025",
        status:          "verified",
        transaction_ref: "TRF-20250201-R2",
        verified_by:     managerUser.id,
        verified_at:     new Date("2025-02-02"),
        notes:           "Bank transfer — Commercial Bank of Ethiopia",
        created_by:      tenantUser.id,
      }
    });

    // Mar + Apr + May 2025 — 3-month advance — Telebirr — pending
    await RentPayment.findOrCreate({
      where: { rent_id: rent2.id, cycle_from: "2025-03-01" },
      defaults: {
        rent_id:         rent2.id,
        payer_id:        tenantUser.id,
        payer_name:      `${tenantUser.first_name} ${tenantUser.last_name}`,
        payer_phone:     tenantUser.phone,
        amount:          36000,  // 3 × 12000
        payment_date:    new Date("2025-03-01"),
        payment_method:  "telebirr",
        cycle_from:      "2025-03-01",
        cycle_to:        "2025-05-31",
        cycles_count:    3,
        cycle_label:     "Mar–May 2025",
        status:          "pending",
        transaction_ref: "TXN-TELE-20250301-R2-ADV",
        notes:           "3-month advance payment via Telebirr",
        created_by:      tenantUser.id,
      }
    });

    console.log(`✅ Rent payments with cycles seeded`);

    /* ------------------------------------------------------------------ */
    console.log("🎉 Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

module.exports = seed;
