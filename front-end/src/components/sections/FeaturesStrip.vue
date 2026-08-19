<template>
  <section class="bg-primary py-10" v-motion :initial="{ opacity: 0, y: 50 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="(feat, index) in featureStrip" :key="feat.label" 
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: index * 100 } }"
          class="flex items-center gap-3 text-white">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <i :class="feat.icon + ' text-lg'"></i>
          </div>
          <div>
            <div class="font-bold text-sm">{{ feat.label }}</div>
            <div class="text-xs text-white/70">{{ feat.sub }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesStrip',
  data() {
    return {
      featureStrip: [
        { icon: 'fas fa-shield-alt', label: 'Verified Properties', sub: 'All listings verified' },
        { icon: 'fas fa-headset', label: '24/7 Support', sub: 'Always here for you' },
        { icon: 'fas fa-file-contract', label: 'Easy Documentation', sub: 'Hassle-free process' },
        { icon: 'fas fa-chart-line', label: 'Best Investment', sub: 'Maximize your returns' },
      ],
    };
  },
};
</script>
