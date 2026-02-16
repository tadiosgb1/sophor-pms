import { createRouter, createWebHistory } from "vue-router";

import Login from '../views/opened/auth/login.vue';
import ContactUs from '../views/opened/landing/contactUs.vue';
import Services from '../views/opened/landing/services.vue';
import About from '../views/opened/landing/about.vue';
import ResetPassword from '../views/opened/auth/ResetPassword.vue';
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue';
import Registration from '../views/opened/auth/login.vue'; // note: same file as login
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import first_dash from '../views/closed/first_dash.vue';
import dashboard from '../views/closed/dashboard.vue';


import Roles from '../views/closed/groups/view.vue';
import Notifications from '../views/closed/notifications/view.vue';
import notificationDetail from '../views/closed/notifications/notificationDeatil.vue';
import Commissions from '../views/closed/commissions/view.vue';
import Messages  from '../views/closed/Messages/message.vue';
import Inbox  from '../views/closed/inbox/view.vue';
const routes = [

  // Public routes
  { path: "/", name: "home", component: Login, meta: { requiresGuest: true } },
  { path: "/login", name: "login", component: Login, meta: { requiresGuest: true } },
  { path: "/register", name: "register", component: Registration, meta: { requiresGuest: true } },
  { path: "/contact-us", name: "contact-us", component: ContactUs, meta: { requiresGuest: true } },
  { path: "/about", name: "about", component: About, meta: { requiresGuest: true } },
  { path: "/services", name: "services", component: Services, meta: { requiresGuest: true } },
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
