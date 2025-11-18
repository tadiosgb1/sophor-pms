<template>
  <section id="plans" class="relative bg-gradient-to-br from-white to-gray-100 py-20 px-6">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
        All-in-One <span class="text-orange-500">Subscription Platform</span>
      </h2>
      <p class="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
        Pick the plan that fits your growth. Powerful features. Transparent pricing. Flexible usage.
      </p>
      <h3 class="text-2xl md:text-3xl font-bold mb-10 text-orange-500 tracking-tight">
        Choose Your Plan
      </h3>

      <!-- Pricing Cards -->
      <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="bg-white rounded-3xl shadow-lg border border-transparent hover:shadow-2xl hover:border-orange-400 transition-all duration-300 relative overflow-hidden transform hover:scale-[1.03]"
          :class="{ 'ring-2 ring-orange-600': selectedPlan === plan.id }"
        >
          <div
            v-if="selectedPlan === plan.id"
            class="absolute top-0 right-0 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-xl"
          >
            Selected
          </div>

          <div class="p-6 flex flex-col h-full justify-between">
            <!-- Title -->
            <div>
              <h4 class="text-xl font-bold text-orange-800 mb-2">{{ plan.name }}</h4>
              <p class="text-gray-500 text-sm mb-4">
                {{ plan.billing_cycle.toUpperCase() }}
              </p>

              <!-- Pricing -->
              <div class="mb-4">
                <div class="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <span>{{ plan.price }} ETB</span>
                  <span
                    v-if="plan.original_price && plan.original_price > plan.price"
                    class="line-through text-sm text-gray-400"
                  >
                    {{ plan.original_price }} ETB
                  </span>
                </div>
             <div class="text-xs text-gray-500">
 
</div>

              </div>

              <!-- Features -->
              <ul class="text-sm text-gray-700 space-y-2 mb-6 text-left">
                <li>🏢 Max Locations: <strong>{{ plan.max_locations }}</strong></li>
                <li>👥 Max Staff: <strong>{{ plan.max_staff }}</strong></li>
                <li>🔐 Max Users: <strong>{{ plan.max_users }}</strong></li>
              </ul>
            </div>

            <!-- CTA Button -->
            <button
              @click="selectPlan(plan.id)"
              class="mt-auto w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition duration-300 ease-in-out"
            >
              {{ selectedPlan === plan.id ? '✓ Selected' : 'Select Plan' }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </section>

  <!-- Modal to Register User -->
  <RegisterUser
    :visible="showRegisterUserModal"
    @close="showRegisterUserModal = false"
    :selectedPlan="selectedPlan"
  />
</template>


<script>
import RegisterUser from './RegisterUser.vue';
import axios from 'axios';
export default {
  name: 'PlansSection',
  components: { RegisterUser },
  data() {
    return {
      showRegisterUserModal: false,
      selectedPlan: null,
      plans: [],
    };
  },
  mounted() {
    this.fetchPlans();
  },
  methods: {
    selectPlan(id) {
      this.selectedPlan = id;
      this.showRegisterUserModal = true;
    },
    async fetchPlans() {
      try {
        //const response = await this.$apiGet("/get_plans");
        const response = await axios.get("https://alphapms.sunriseworld.org/api/get_plans");
        if (Array.isArray(response.data.data)) {
          this.plans = response.data.data;
        } else {
          console.warn("Unexpected response format:", response);
          this.plans = [];
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
        this.plans = [];
      }
    },
  },
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
