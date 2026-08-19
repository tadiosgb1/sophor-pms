<template>
  <section class="py-20 bg-gray-900 relative overflow-hidden" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <h2 class="text-3xl lg:text-4xl font-black text-white mb-3">Our Numbers Speak</h2>
        <p class="text-gray-400">A decade of excellence in real estate management</p>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(stat, index) in bigStats" :key="stat.label" 
          v-motion
          :initial="{ opacity: 0, scale: 0.8 }"
          :visible="{ opacity: 1, scale: 1, transition: { duration: 500, delay: index * 150 } }"
          class="text-center">
          <div class="text-4xl lg:text-5xl font-black text-primary mb-2">{{ stat.value }}</div>
          <div class="text-white font-semibold mb-1">{{ stat.label }}</div>
          <div class="text-gray-500 text-sm">{{ stat.sub }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StatsSection',
  data() {
    return {
      bigStats: [
        { value: '500+', label: 'Properties Managed', sub: 'Across Tigray region' },
        { value: '1,200+', label: 'Happy Clients', sub: 'Buyers, renters & investors' },
        { value: '98%', label: 'Client Satisfaction', sub: 'Based on client surveys' },
        { value: 'ETB 2B+', label: 'Property Value', sub: 'Total portfolio value' },
      ],
    };
  },
};
</script>
