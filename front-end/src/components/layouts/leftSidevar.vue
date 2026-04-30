<template>
  <div>
    <aside
      class="w-64 flex flex-col z-40 md:fixed md:top-16 md:left-0 md:h-[calc(100vh-4rem)] md:overflow-y-auto transition-all duration-300 bg-white mt-0 lg:mt-1 shadow-md"
    >
      <!-- Logo / Brand (mobile only) -->
      <div
        v-if="showTitle"
        class="flex flex-row items-center space-x-3 p-4 font-bold text-lg text-white bg-orange-500 sticky top-0 z-10"
      >
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
          <img src="../../assets/img/logo1.jpg" alt="Logo" class="h-9 w-9 rounded-full object-cover" />
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
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
            :class="{ 'bg-orange-50 text-orange-600 font-semibold': $route.name === item.route }"
          >
            <i
              :class="[item.icon, 'w-4 text-center text-sm shrink-0']"
              :style="{ color: $route.name === item.route ? '#f97316' : item.color }"
            ></i>
            <span>{{ item.name }}</span>
          </router-link>

          <!-- Parent with submenu -->
          <div v-else>
            <button
              @click="toggleSubmenu(item.name)"
              class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
              :class="{ 'bg-orange-50 text-orange-600 font-semibold': isActiveParent(item) }"
            >
              <div class="flex items-center gap-2.5">
                <i
                  :class="[item.icon, 'w-4 text-center text-sm shrink-0']"
                  :style="{ color: isActiveParent(item) ? '#f97316' : item.color }"
                ></i>
                <span>{{ item.name }}</span>
              </div>
              <i
                class="fas text-[10px] text-gray-400 transition-transform duration-200"
                :class="isSubmenuOpen(item.name) ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>

            <!-- Submenu -->
            <transition name="submenu">
              <ul v-if="isSubmenuOpen(item.name)" class="mt-1 ml-4 pl-3 border-l-2 border-orange-100 space-y-0.5">
                <li v-for="sub in item.children" :key="sub.name">
                  <router-link
                    :to="{ name: sub.route }"
                    class="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
                    :class="{ 'text-orange-600 font-semibold bg-orange-50': $route.name === sub.route }"
                  >
                    <i
                      :class="[sub.icon, 'w-3.5 text-center text-xs shrink-0']"
                      :style="{ color: $route.name === sub.route ? '#f97316' : sub.color }"
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
          color: "#f97316",
        },
        {
          name: "Chat",
          route: "chat",
          icon: "fas fa-comments",
          color: "#8b5cf6",
        },

        // ── ADMINISTRATION ────────────────────────────────────────
        {
          name: "Company",
          route: "Company-view",
          icon: "fas fa-building",
          color: "#0ea5e9",
        },
        {
          name: "User Management",
          icon: "fas fa-users-cog",
          color: "#6366f1",
          children: [
            {
              name: "Users",
              route: "Users-view",
              icon: "fas fa-user",
              color: "#6366f1",
            },
            {
              name: "Roles",
              route: "Roles-view",
              icon: "fas fa-shield-halved",
              color: "#6366f1",
            },
            {
              name: "Permissions",
              route: "Permissions-view",
              icon: "fas fa-key",
              color: "#6366f1",
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
          color: "#14b8a6",
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
          color: "#f59e0b",
        },
        {
          name: "Rentals",
          route: "Rent-view",
          icon: "fas fa-house-user",
          color: "#ec4899",
        },

        // ── FINANCE & INVENTORY ───────────────────────────────────
        {
          name: "Expenses",
          route: "Expense-view",
          icon: "fas fa-receipt",
          color: "#ef4444",
        },
        {
          name: "Maintenance",
          route: "Maintenance-view",
          icon: "fas fa-wrench",
          color: "#f97316",
        },
        {
          name: "Inventory",
          icon: "fas fa-boxes-stacked",
          color: "#f97316",
          children: [
            {
              name: "Items",
              route: "Inventoryitem-view",
              icon: "fas fa-box",
              color: "#f97316",
            },
            {
              name: "Transactions",
              route: "Inventorytransaction-view",
              icon: "fas fa-arrow-right-arrow-left",
              color: "#f97316",
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
