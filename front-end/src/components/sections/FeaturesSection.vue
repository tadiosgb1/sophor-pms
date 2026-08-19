<template>
  <section class="py-20 bg-gray-50" id="features" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Powerful Features for<br />Modern Real Estate</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Our integrated property management system gives you complete control over every aspect of your real estate portfolio.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="feature.title"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
          class="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-primary/20">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-5 transition-all duration-300">
            <i :class="feature.icon + ' text-2xl text-primary group-hover:text-white transition-colors duration-300'"></i>
          </div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection',
  data() {
    return {
      features: [
        { icon: 'fas fa-building', title: 'Property Management', desc: 'Complete lifecycle management of all your properties — from listing to lease and beyond.' },
        { icon: 'fas fa-tools', title: 'Maintenance Tracking', desc: 'Submit, track, and resolve maintenance requests with real-time status updates.' },
        { icon: 'fas fa-boxes', title: 'Inventory Control', desc: 'Manage property inventory, track items, and monitor transactions with ease.' },
        { icon: 'fas fa-file-invoice-dollar', title: 'Financial Management', desc: 'Track expenses, rent payments, sale transactions, and generate detailed reports.' },
        { icon: 'fas fa-user-shield', title: 'Role-Based Access', desc: 'Granular permissions and role management to keep your data secure and organized.' },
        { icon: 'fas fa-chart-bar', title: 'Analytics Dashboard', desc: 'Powerful dashboards with real-time insights into your entire real estate portfolio.' },
      ],
    };
  },
};
</script>
