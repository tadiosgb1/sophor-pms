<template>
  <section class="py-20 bg-gradient-to-br from-primary via-green-500 to-secondary relative overflow-hidden" id="contact" 
    v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
    </div>
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight" 
        v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        Ready to Find Your<br />Perfect Property?
      </h2>
   
      <div class="flex flex-col sm:flex-row gap-4 justify-center" 
        v-motion :initial="{ opacity: 0, scale: 0.9 }" :visible="{ opacity: 1, scale: 1, transition: { duration: 500, delay: 300 } }">
        <router-link to="/contact"
          class="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl text-sm">
          <i class="fas fa-envelope mr-2"></i> Contact Us Now
        </router-link>
    
      </div>
   
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactCta',
  data() {
    return {
      contactHighlights: [
        { icon: 'fas fa-phone', label: '+251 998 890 220' },
        { icon: 'fas fa-envelope', label: 'sophortechnologies@gmail.com' },
        { icon: 'fas fa-map-marker-alt', label: 'Addis Ababa & Mekelle, Ethiopia' },
        { icon: 'fas fa-clock', label: 'Mon–Fri 8AM–6PM' },
      ],
    };
  },
};
</script>
