// utils/seed.js
const bcrypt = require("bcrypt");
const db = require("../models");
const { User, Role, Permission, Company } = db;

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    // 1️⃣ Create Permissions
    const permissionList = [
      { name: "Create User", code: "create_user" },
      { name: "Edit User", code: "edit_user" },
      { name: "Delete User", code: "delete_user" },
      { name: "View User", code: "view_user" },

      { name: "Create Role", code: "create_role" },
      { name: "Edit Role", code: "edit_role" },
      { name: "Delete Role", code: "delete_role" },
      { name: "View Role", code: "view_role" },

      { name: "Create Permission", code: "create_permission" },
      { name: "Edit Permission", code: "edit_permission" },
      { name: "Delete Permission", code: "delete_permission" },
      { name: "View Permission", code: "view_permission" },

      { name: "Create Company", code: "create_company" },
      { name: "Edit Company", code: "edit_company" },
      { name: "Delete Company", code: "delete_company" },
      { name: "View Company", code: "view_company" },
      {name:"Assign Permission",code:"assign_permission"},
      {name:"Assign Role",code:"assign_role"},
      
    ];

    const permissions = [];
    for (const p of permissionList) {
      const [perm] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: { name: p.name, description: p.name }
      });
      permissions.push(perm);
      console.log(`✅ Permission: ${perm.code}`);
    }

    // 2️⃣ Create Roles
    const roleList = ["Super", "Owner"];
    const roles = [];

    for (const roleName of roleList) {
      const [role] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: { description: `${roleName} role` }
      });

      // give all permissions
      await role.setPermissions(permissions);

      roles.push(role);
      console.log(`✅ Role: ${role.name}`);
    }

    // 3️⃣ Create Users WITH roleName
    const userList = [
      {
        first_name: "Super",
        middle_name: "Admin",
        last_name: "Admin",
        email: "tadiosgb27@gmail.com",
        password: "1234",
        address:"Mekelle",
        roleName: "Super",
        phone:"0963275521",
      },
      {
        first_name: "Owner",
        middle_name: "User",
        last_name: "User",
        email: "tadiosgb26@gmail.com",
        password: "1234",
        phone:"0967740501",
        roleName: "Owner",
        address:"Mekelle",
      },

       {
        first_name: "Manager",
        middle_name: "Manager",
        last_name: "Manager",
        email: "tadiosgb28@gmail.com",
        password: "1234",
        phone:"0967740501",
        roleName: "Manager",
        address:"Mekelle",
      },
        
      {
        first_name: "Staff",
        middle_name: "Staff",
        last_name: "Staff",
        email: "tadiosgb29@gmail.com",
        password: "1234",
        phone:"0967740501",
        roleName: "Staff",
        address:"Mekelle",
      },

       {
        first_name: "Tenant",
        middle_name: "Tenant",
        last_name: "tenant",
        email: "tadiosgb30@gmail.com",
        password: "1234",
        phone:"0967740501",
        roleName: "Tenant",
        address:"Mekelle",
      }

    ];

    const users = [];

    for (const u of userList) {
      const hashedPassword = await bcrypt.hash(u.password, 10);

      const [user] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          first_name: u.first_name,
          middle_name: u.middle_name,
          last_name: u.last_name,
          phone:u.phone,
          email:u.email,
          password: hashedPassword,
          address:u.address,
        }
      });

      // assign correct role
      const role = roles.find(r => r.name === u.roleName);
      if (role) {
        await user.setRoles([role]);
        console.log(`✅ User: ${user.email} → Role: ${role.name}`);
      }

      users.push(user);
    }

    // 4️⃣ Create Company for Owner
    const ownerUser = users.find(u => u.email === "owner@gmail.com");

    if (ownerUser) {
      const [company] = await Company.findOrCreate({
        where: { owner_id: ownerUser.id },
        defaults: {
          name: "Wahs Real Estate",
          address: "Mekelle",
          latitude: "23.5",
          longitude: "56.8",
          phone: "0967740501",
          official_email: ownerUser.email,
          website: "https://wahs.com",
          logo: "uploads/default-logo.jpg",
          facebook: "https://facebook.com/wahs",
          instagram: "https://instagram.com/wahs",
          linkedin: "https://linkedin.com/wahs",
          twitter: "https://twitter.com/wahs",
          telegram: "https://telegram.com/wahs",
          description: "This is Wahs Real Estate"
        }
      });

      console.log(`✅ Company: ${company.name} (Owner ID: ${ownerUser.id})`);
    }

    console.log("🎉 Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

module.exports = seed;
