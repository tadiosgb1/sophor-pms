<template>
  <div>
    <aside
      class="w-64 flex flex-col z-40 md:fixed md:top-16 md:left-0 md:h-[calc(100vh-4rem)] md:overflow-y-auto transition-all duration-300 bg-white mt-0 lg:mt-1 shadow-md"
    >
      <!-- Logo / Brand (mobile only) -->
      <div
        v-if="showTitle"
        class="flex flex-row items-center space-x-3 p-4 font-bold text-lg text-white bg-primary sticky top-0 z-10"
      >
        <div class="w-10 h-10  flex items-center justify-center shrink-0">
          <img
    src="../../assets/img/transparent-logo1.png"
    alt="Sophor Logo"
    class="h-12 w-auto"
  />
        </div>
        <span>Sophor</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-3 space-y-1">
        <template v-for="item in menuItems" :key="item.name">

          <!-- Plain link -->
          <router-link
            v-if="!item.children"
            :to="{ name: item.route }"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary transition-colors duration-150"
            :class="{ 'bg-green-50 text-primary font-semibold': $route.name === item.route }"
          >
            <i
              :class="[item.icon, 'w-4 text-center text-sm shrink-0']"
              :style="{ color: $route.name === item.route ? '#10b981' : '#10b981' }"
            ></i>
            <span>{{ item.name }}</span>
          </router-link>

          <!-- Parent with submenu -->
          <div v-else>
            <button
              @click="toggleSubmenu(item.name)"
              class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary transition-colors duration-150"
              :class="{ 'bg-green-50 text-primary font-semibold': isActiveParent(item) }"
            >
              <div class="flex items-center gap-2.5">
                <i
                  :class="[item.icon, 'w-4 text-center text-sm shrink-0']"
                  :style="{ color: isActiveParent(item) ? '#10b981' : '#10b981' }"
                ></i>
                <span>{{ item.name }}</span>
              </div>
              <i
                class="fas text-[10px] transition-transform duration-200 text-primary"
                :class="isSubmenuOpen(item.name) ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>

            <!-- Submenu -->
            <transition name="submenu">
              <ul v-if="isSubmenuOpen(item.name)" class="mt-1 ml-4 pl-3 border-l-2 border-green-200 space-y-0.5">
                <li v-for="sub in item.children" :key="sub.name">
                  <router-link
                    :to="{ name: sub.route }"
                    class="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-green-50 hover:text-primary transition-colors duration-150"
                    :class="{ 'text-primary font-semibold bg-green-50': $route.name === sub.route }"
                  >
                    <i
                      :class="[sub.icon, 'w-3.5 text-center text-xs shrink-0 text-primary']"
                    ></i>
                    <span>{{ sub.name }}</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>

        </template>
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTitle: false,
      openSubmenus: [],

      menuItems: [
        {
          name: "Dashboard",
          route: "first-dash",
          icon: "fas fa-gauge",
          color: "#10b981",
        },
        {
          name: "Chat",
          route: "chat",
          icon: "fas fa-comments",
          color: "#10b981",
        },

        // ── ADMINISTRATION ────────────────────────────────────────
        {
          name: "Company",
          route: "Company-view",
          icon: "fas fa-building",
          color: "#10b981",
        },
        {
          name: "User Management",
          icon: "fas fa-users-cog",
          color: "#10b981",
          children: [
            {
              name: "Users",
              route: "Users-view",
              icon: "fas fa-user",
              color: "#10b981",
            },
            {
              name: "Roles",
              route: "Roles-view",
              icon: "fas fa-shield-halved",
              color: "#10b981",
            },
            {
              name: "Permissions",
              route: "Permissions-view",
              icon: "fas fa-key",
              color: "#10b981",
            },
          ],
        },

        // ── PROPERTY ──────────────────────────────────────────────
        {
          name: "Sites",
          route: "Site-view",
          icon: "fas fa-map-location-dot",
          color: "#10b981",
        },
        {
          name: "Units",
          route: "Unit-view",
          icon: "fas fa-door-open",
          color: "#10b981",
        },
        {
          name: "Amenities",
          route: "Amenity-view",
          icon: "fas fa-star",
          color: "#10b981",
        },
        // ── TRANSACTIONS ──────────────────────────────────────────
        {
          name: "Sales",
          route: "Sale-view",
          icon: "fas fa-handshake",
          color: "#10b981",
        },
        {
          name: "Rentals",
          route: "Rent-view",
          icon: "fas fa-house-user",
          color: "#10b981",
        },

        // ── FINANCE & INVENTORY ───────────────────────────────────
        {
          name: "Payments",
          route: "Payments-view",
          icon: "fas fa-money-bill-wave",
          color: "#10b981",
        },
        {
          name: "Expenses",
          route: "Expense-view",
          icon: "fas fa-receipt",
          color: "#10b981",
        },
        {
          name: "Maintenance",
          route: "Maintenance-view",
          icon: "fas fa-wrench",
          color: "#10b981",
        },
        {
          name: "Inventory",
          icon: "fas fa-boxes-stacked",
          color: "#10b981",
          children: [
            {
              name: "Items",
              route: "Inventoryitem-view",
              icon: "fas fa-box",
              color: "#10b981",
            },
            {
              name: "Transactions",
              route: "Inventorytransaction-view",
              icon: "fas fa-arrow-right-arrow-left",
              color: "#10b981",
            },
          ],
        },
      ],
    };
  },

  computed: {
  },

  methods: {
    toggleSubmenu(name) {
      if (this.openSubmenus.includes(name)) {
        this.openSubmenus = this.openSubmenus.filter(n => n !== name);
      } else {
        this.openSubmenus.push(name);
      }
    },

    isSubmenuOpen(name) {
      return this.openSubmenus.includes(name);
    },

    // Highlight parent if any child route is active
    isActiveParent(item) {
      if (!item.children) return false;
      return item.children.some(child => this.$route.name === child.route);
    },

    // Auto-open submenu if a child is the current route
    autoOpenActiveSubmenus() {
      this.menuItems.forEach(item => {
        if (item.children && this.isActiveParent(item)) {
          if (!this.openSubmenus.includes(item.name)) {
            this.openSubmenus.push(item.name);
          }
        }
      });
    },
  },

  mounted() {
    this.showTitle = window.innerWidth < 1024;
    this.autoOpenActiveSubmenus();
  },

  watch: {
    $route() {
      this.autoOpenActiveSubmenus();
    },
  },
};
</script>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
