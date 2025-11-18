<template>
  <div>
    <Toast ref="toast" />
    
    <div class="min-h-screen bg-gray-50 p-2 lg:p-6 ">
      <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">User Management</h1>
      </div>
      <div class=" bg-white  rounded-xl overflow-hidden border border-gray-200">
        <div class="border-b border-gray-200">
          <nav
            class="flex overflow-x-auto no-scrollbar px-3 space-x-6"
            aria-label="Tabs"
          >
            <button
              @click="activeTab = 'allUsers'"
              class="
                py-3 px-1 font-medium text-sm text-gray-600 transition duration-300 relative 
                hover:text-green-700 hover:bg-gray-50
              "
              :class="{ 
                'text-green-600': activeTab === 'allUsers',
                'border-b-2 border-green-500': activeTab === 'allUsers' // Directly applying the border for the underline
              }"
            >
              All Users
            </button>

            <button
              @click="activeTab = 'promoterBuyer'"
              class="
                py-3 px-1 font-medium text-sm text-gray-600 transition duration-300 relative 
                hover:text-green-700 hover:bg-gray-50
              "
              :class="{ 
                'text-green-600': activeTab === 'promoterBuyer',
                'border-b-2 border-green-500': activeTab === 'promoterBuyer' // Directly applying the border for the underline
              }"
            >
              Promotors/Buyers
            </button>
          </nav>
        </div>

        <div class="p-3 lg:p-6">
          <component :is="activeTabComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import allUsers from "./allUsers.vue";
import promoterBuyer from "../promotorBuyer/view.vue";

export default {
  components: {
    allUsers,
    promoterBuyer,
  },
  data() {
    const is_superuser = localStorage.getItem("is_superuser") === "true";

    // Set default tab based on role/permissions
    let defaultTab = is_superuser ? "allUsers" : "promoterBuyer";

    return {
      is_superuser,
      activeTab: defaultTab,
      showAddUser: false,
    };
  },
  computed: {
    activeTabComponent() {
      return this.activeTab;
    },
  },
};
</script>