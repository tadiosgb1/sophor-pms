<template>
  <div class="p-6 bg-gray-50 min-h-screen text-base text-gray-800">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">System Settings</h1>
      </div>
      
      <div class="mb-6">
        <nav class="flex flex-wrap gap-1 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-6 py-3 text-sm font-medium transition-all duration-300 relative',
              activeTab === tab.key
                ? 'text-green-600' // Active text color
                : 'text-gray-600 hover:text-green-700 hover:bg-gray-100', // Inactive styles
            ]"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-100"
            ></span>
          </button>
        </nav>
      </div>
      
      <transition name="fade-slide" mode="out-in">
        <div :key="activeTab" class="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <component :is="activeComponent" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import TreeLevelSetting from "../treeSetting/view.vue";
import MlmSetting from "../MlmSettings/view.vue";

export default {
  name: "SettingsPage",
  components: {
    TreeLevelSetting,
    MlmSetting,
  },
  data() {
    return {
      activeTab: "tree-level",
      tabs: [
        { key: "tree-level", label: "Tree Level Setting" },
        { key: "mlm", label: "MLM Setting" },
      ],
    };
  },
  computed: {
    activeComponent() {
      switch (this.activeTab) {
        case "mlm":
          return "MlmSetting";
        default:
          return "TreeLevelSetting";
      }
    },
  },
};
</script>

