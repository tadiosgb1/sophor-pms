import { createRouter, createWebHistory } from "vue-router";

import Login from '../views/opened/auth/login.vue';
import LandingHome from '../views/opened/landing/Home.vue';


import ResetPassword from '../views/opened/auth/ResetPassword.vue';
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue';
import Registration from '../views/opened/auth/login.vue'; // note: same file as login
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import first_dash from '../views/closed/first_dash.vue';
import dashboard from '../views/closed/dashboard.vue';
import Chat from '../views/closed/Chat/view.vue';

import Roles from '../views/closed/groups/view.vue';
import Notifications from '../views/closed/notifications/view.vue';
import notificationDetail from '../views/closed/notifications/notificationDeatil.vue';
import Commissions from '../views/closed/commissions/view.vue';
import Messages  from '../views/closed/Messages/message.vue';
import Inbox  from '../views/closed/inbox/view.vue';
const routes = [

  // Landing / Public routes
  { path: "/", name: "landing", component: LandingHome },
  { path: "/about", name: "about", component: () => import('../views/opened/landing/About.vue') },
  { path: "/properties", name: "properties", component: () => import('../views/opened/landing/Properties.vue') },
  { path: "/news", name: "news", component: () => import('../views/opened/landing/News.vue') },
  { path: "/contact", name: "contact", component: () => import('../views/opened/landing/Contact.vue') },
  { path: "/faq", name: "faq", component: () => import('../views/opened/landing/FAQ.vue') },

  { path: "/login", name: "login", component: Login, meta: { requiresGuest: true } },

  { path: "/register", name: "register", component: Registration, meta: { requiresGuest: true } },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasssword, props: true },
  { path: "/:lang/reset-password", name: "ResetPassword", component: ResetPassword, props: true },
  { path: "/reset/:token", name: "reset", component: Reset, meta: { requiresGuest: true } },

  // Dashboard (protected area)
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
    meta: { requiresGuest: true },
    children: [
      {
        path: "inventorytransactions",
        name: "Inventorytransaction-view",
        component: () => import('../views/closed/inventorytransactions/InventorytransactionView.vue'),
      },
      {
        path: "inventorytransactions/add",
        name: "Inventorytransaction-add",
        component: () => import('../views/closed/inventorytransactions/AddInventorytransaction.vue'),
      },
      {
        path: "inventorytransactions/edit/:id",
        name: "Inventorytransaction-edit",
        component: () => import('../views/closed/inventorytransactions/EditInventorytransaction.vue'),
        props: true,
      },
      {
        path: "inventorytransactions/detail/:id",
        name: "Inventorytransaction-detail",
        component: () => import('../views/closed/inventorytransactions/InventorytransactionDetail.vue'),
        props: true,
      },

      {
        path: "inventoryitems",
        name: "Inventoryitem-view",
        component: () => import('../views/closed/inventoryitems/InventoryitemView.vue'),
      },
      {
        path: "inventoryitems/add",
        name: "Inventoryitem-add",
        component: () => import('../views/closed/inventoryitems/AddInventoryitem.vue'),
      },
      {
        path: "inventoryitems/edit/:id",
        name: "Inventoryitem-edit",
        component: () => import('../views/closed/inventoryitems/EditInventoryitem.vue'),
        props: true,
      },
      {
        path: "inventoryitems/detail/:id",
        name: "Inventoryitem-detail",
        component: () => import('../views/closed/inventoryitems/InventoryitemDetail.vue'),
        props: true,
      },

 

      {
        path: "expenses",
        name: "Expense-view",
        component: () => import('../views/closed/Expenses/ExpenseView.vue'),
      },
      {
        path: "expenses/add",
        name: "Expense-add",
        component: () => import('../views/closed/Expenses/AddExpense.vue'),
      },
      {
        path: "expenses/edit/:id",
        name: "Expense-edit",
        component: () => import('../views/closed/Expenses/EditExpense.vue'),
        props: true,
      },
      {
        path: "expenses/detail/:id",
        name: "Expense-detail",
        component: () => import('../views/closed/Expenses/ExpenseDetail.vue'),
        props: true,
      },

     
      {
        path: "chat",
        name: "chat",
        component: Chat,
      },
      {
        path: "rentdocuments",
        name: "RentDocument-view",
        component: () => import('../views/closed/Rentdocuments/RentDocumentView.vue'),
      },
      {
        path: "rentdocuments/add",
        name: "RentDocument-add",
        component: () => import('../views/closed/Rentdocuments/AddRentDocument.vue'),
      },
      {
        path: "rentdocuments/edit/:id",
        name: "RentDocument-edit",
        component: () => import('../views/closed/Rentdocuments/EditRentDocument.vue'),
        props: true,
      },
      {
        path: "rentdocuments/detail/:id",
        name: "RentDocument-detail",
        component: () => import('../views/closed/Rentdocuments/RentDocumentDetail.vue'),
        props: true,
      },

      {
        path: "saledocuments",
        name: "SaleDocument-view",
        component: () => import('../views/closed/Saledocuments/SaleDocumentView.vue'),
      },
      {
        path: "saledocuments/add",
        name: "SaleDocument-add",
        component: () => import('../views/closed/Saledocuments/AddSaleDocument.vue'),
      },
      {
        path: "saledocuments/edit/:id",
        name: "SaleDocument-edit",
        component: () => import('../views/closed/Saledocuments/EditSaleDocument.vue'),
        props: true,
      },
      {
        path: "saledocuments/detail/:id",
        name: "SaleDocument-detail",
        component: () => import('../views/closed/Saledocuments/SaleDocumentDetail.vue'),
        props: true,
      },

      {
        path: "unitimages",
        name: "UnitImage-view",
        component: () => import('../views/closed/UnitImages/UnitImageView.vue'),
      },
      {
        path: "unitimages/add",
        name: "UnitImage-add",
        component: () => import('../views/closed/UnitImages/AddUnitImage.vue'),
      },
      {
        path: "unitimages/edit/:id",
        name: "UnitImage-edit",
        component: () => import('../views/closed/UnitImages/EditUnitImage.vue'),
        props: true,
      },
      {
        path: "unitimages/detail/:id",
        name: "UnitImage-detail",
        component: () => import('../views/closed/UnitImages/UnitImageDetail.vue'),
        props: true,
      },

      {
        path: "siteimages",
        name: "SiteImage-view",
        component: () => import('../views/closed/SiteImages/SiteImageView.vue'),
      },
      {
        path: "siteimages/add",
        name: "SiteImage-add",
        component: () => import('../views/closed/SiteImages/AddSiteImage.vue'),
      },
      {
        path: "siteimages/edit/:id",
        name: "SiteImage-edit",
        component: () => import('../views/closed/SiteImages/EditSiteImage.vue'),
        props: true,
      },
      {
        path: "siteimages/detail/:id",
        name: "SiteImage-detail",
        component: () => import('../views/closed/SiteImages/SiteImageDetail.vue'),
        props: true,
      },

      {
        path: "rents",
        name: "Rent-view",
        component: () => import('../views/closed/Rents/RentView.vue'),
      },
      {
        path: "rents/add",
        name: "Rent-add",
        component: () => import('../views/closed/Rents/AddRent.vue'),
      },
      {
        path: "rents/edit/:id",
        name: "Rent-edit",
        component: () => import('../views/closed/Rents/EditRent.vue'),
        props: true,
      },
      {
        path: "rents/detail/:id",
        name: "Rent-detail",
        component: () => import('../views/closed/Rents/RentDetail.vue'),
        props: true,
      },

      {
        path: "sales",
        name: "Sale-view",
        component: () => import('../views/closed/Sales/SaleView.vue'),
      },
      {
        path: "sales/add",
        name: "Sale-add",
        component: () => import('../views/closed/Sales/AddSale.vue'),
      },
      {
        path: "sales/edit/:id",
        name: "Sale-edit",
        component: () => import('../views/closed/Sales/EditSale.vue'),
        props: true,
      },
      {
        path: "sales/detail/:id",
        name: "Sale-detail",
        component: () => import('../views/closed/Sales/SaleDetail.vue'),
        props: true,
      },

      {
        path: "units",
        name: "Unit-view",
        component: () => import('../views/closed/Units/UnitView.vue'),
      },
      {
        path: "units/add",
        name: "Unit-add",
        component: () => import('../views/closed/Units/AddUnit.vue'),
      },
      {
        path: "units/edit/:id",
        name: "Unit-edit",
        component: () => import('../views/closed/Units/EditUnit.vue'),
        props: true,
      },
      {
        path: "units/detail/:id",
        name: "Unit-detail",
        component: () => import('../views/closed/Units/UnitDetail.vue'),
        props: true,
      },

      {
        path: "types",
        name: "Type-view",
        component: () => import('../views/closed/Types/TypeView.vue'),
      },
      {
        path: "types/add",
        name: "Type-add",
        component: () => import('../views/closed/Types/AddType.vue'),
      },
      {
        path: "types/edit/:id",
        name: "Type-edit",
        component: () => import('../views/closed/Types/EditType.vue'),
        props: true,
      },
      {
        path: "types/detail/:id",
        name: "Type-detail",
        component: () => import('../views/closed/Types/TypeDetail.vue'),
        props: true,
      },

      {
        path: "amenity",
        name: "Amenity-view",
        component: () => import('../views/closed/Amenity/AmenityView.vue'),
      },
      {
        path: "amenity/add",
        name: "Amenity-add",
        component: () => import('../views/closed/Amenity/AddAmenity.vue'),
      },
      {
        path: "amenity/edit/:id",
        name: "Amenity-edit",
        component: () => import('../views/closed/Amenity/EditAmenity.vue'),
        props: true,
      },
      {
        path: "amenity/detail/:id",
        name: "Amenity-detail",
        component: () => import('../views/closed/Amenity/AmenityDetail.vue'),
        props: true,
      },

      {
        path: "site",
        name: "Site-view",
        component: () => import('../views/closed/Site/SiteView.vue'),
      },
      {
        path: "site/add",
        name: "Site-add",
        component: () => import('../views/closed/Site/AddSite.vue'),
      },
      {
        path: "site/edit/:id",
        name: "Site-edit",
        component: () => import('../views/closed/Site/EditSite.vue'),
        props: true,
      },
      {
        path: "site/detail/:id",
        name: "Site-detail",
        component: () => import('../views/closed/Site/SiteDetail.vue'),
        props: true,
      },

   
      {
        path: "admin",
        name: "Company-view",
        component: () => import('../views/closed/Company/CompanyView.vue'),
      },
      {
        path: "admin/add",
        name: "Company-add",
        component: () => import('../views/closed/Company/AddCompany.vue'),
      },
      {
        path: "admin/edit/:id",
        name: "Company-edit",
        component: () => import('../views/closed/Company/EditCompany.vue'),
        props: true,
      },
      {
        path: "admin/detail/:id",
        name: "Company-detail",
        component: () => import('../views/closed/Company/CompanyDetail.vue'),
        props: true,
      },


        {
          path: "/roles/:id/permissions",
          name: "RolePermissions",
          component: () => import("../views/closed/roles/permissionByrole.vue"),
        },

      {
        path: "roles",
        name: "Roles-view",
        component: () => import('../views/closed/roles/RolesView.vue'),
      },
      {
        path: "roles/add",
        name: "Roles-add",
        component: () => import('../views/closed/roles/AddRoles.vue'),
      },
      {
        path: "roles/edit/:id",
        name: "Roles-edit",
        component: () => import('../views/closed/roles/EditRoles.vue'),
        props: true,
      },
      {
        path: "roles/detail/:id",
        name: "Roles-detail",
        component: () => import('../views/closed/roles/RolesDetail.vue'),
        props: true,
      },

      {
        path: "users",
        name: "Users-view",
        component: () => import('../views/closed/Users/UsersView.vue'),
      },
      {
        path: "users/add",
        name: "Users-add",
        component: () => import('../views/closed/Users/AddUsers.vue'),
      },
      {
        path: "users/edit/:id",
        name: "Users-edit",
        component: () => import('../views/closed/Users/EditUsers.vue'),
        props: true,
      },
      {
        path: "users/detail/:id",
        name: "Users-detail",
        component: () => import('../views/closed/Users/UsersDetail.vue'),
        props: true,
      },

      {
        path: "permissions",
        name: "Permissions-view",
        component: () => import('../views/closed/Permissions/PermissionsView.vue'),
      },
      {
        path: "permissions/add",
        name: "Permissions-add",
        component: () => import('../views/closed/Permissions/AddPermissions.vue'),
      },
      {
        path: "permissions/edit/:id",
        name: "Permissions-edit",
        component: () => import('../views/closed/Permissions/EditPermissions.vue'),
        props: true,
      },
      {
        path: "permissions/detail/:id",
        name: "Permissions-detail",
        component: () => import('../views/closed/Permissions/PermissionsDetail.vue'),
        props: true,
      },

  

     

    
    

      {
        path: "sites",
        name: "Sites-view",
        component: () => import('../views/closed/sites/SitesView.vue'),
      },
      {
        path: "sites/add",
        name: "Sites-add",
        component: () => import('../views/closed/sites/AddSites.vue'),
      },
      {
        path: "sites/edit/:id",
        name: "Sites-edit",
        component: () => import('../views/closed/sites/EditSites.vue'),
        props: true,
      },
      {
        path: "sites/detail/:id",
        name: "Sites-detail",
        component: () => import('../views/closed/sites/SitesDetail.vue'),
        props: true,
      },

      {
        path: "proporties",
        name: "Property-view",
        component: () => import('../views/closed/Proporties/PropertyView.vue'),
      },
      {
        path: "proporties/add",
        name: "Property-add",
        component: () => import('../views/closed/Proporties/AddProperty.vue'),
      },
      {
        path: "proporties/edit/:id",
        name: "Property-edit",
        component: () => import('../views/closed/Proporties/EditProperty.vue'),
        props: true,
      },
      {
        path: "proporties/detail/:id",
        name: "Property-detail",
        component: () => import('../views/closed/Proporties/PropertyDetail.vue'),
        props: true,
      },

     

      
       
      
      { path: "roles", name: "roles", component: Roles },
 
      {
        path: "maintenance",
        name: "Maintenance-view",
        component: () => import('../views/closed/Maintenance/MaintenanceView.vue'),
      },
      {
        path: "maintenance/detail/:id",
        name: "Maintenance-detail",
        component: () => import('../views/closed/Maintenance/MaintenanceDetail.vue'),
        props: true,
      },

      {
        path: "payments",
        name: "Payments-view",
        component: () => import('../views/closed/Payments/PaymentsView.vue'),
      },

      { path: "first-dash", name: "first-dash", component: first_dash },
      { path: "messages", name: "messages", component: Messages},
      { path: "inbox", name: "inbox", component: Inbox},
      { path: "notifications", name: "notifications", component: Notifications},
      { path: "notification/:id", name: "notificationDetail", component: notificationDetail },
      { path: "commissions", name: "commissions", component: Commissions},
    ],
  },

  // Catch-all
  { path: "/:pathMatch(.*)*", name: "accessDenied", component: AccessDenied, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiredRole = to.meta.role;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next("/login");
    } else if (requiredRole && userRole !== requiredRole) {
      localStorage.clear();
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
