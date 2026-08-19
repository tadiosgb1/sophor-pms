<template>
  <section class="py-20 bg-white" id="testimonials" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Testimonials</span>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">What Our Clients Say</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Real stories from real clients who trusted Sophor with their property needs.</p>
      </div>

      <!-- Desktop: 3 cards with carousel -->
      <div class="hidden lg:block relative">
        <div class="grid grid-cols-3 gap-8">
          <div v-for="t in visibleTestimonials" :key="t.name"
            class="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div class="text-primary text-4xl font-serif leading-none mb-4">"</div>
            <p class="text-gray-600 text-sm leading-relaxed mb-6 italic">{{ t.quote }}</p>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                {{ t.name[0] }}
              </div>
              <div>
                <div class="font-bold text-gray-900 text-sm">{{ t.name }}</div>
                <div class="text-xs text-gray-500">{{ t.role }}</div>
              </div>
              <div class="ml-auto flex gap-0.5">
                <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button @click="prevTestimonials" 
          class="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="nextTestimonials" 
          class="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Mobile: 1 card with carousel -->
      <div class="lg:hidden relative">
        <div class="bg-gray-50 rounded-2xl p-7 border border-gray-100">
          <div class="text-primary text-4xl font-serif leading-none mb-4">"</div>
          <p class="text-gray-600 text-sm leading-relaxed mb-6 italic">{{ currentTestimonial.quote }}</p>
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
              {{ currentTestimonial.name[0] }}
            </div>
            <div>
              <div class="font-bold text-gray-900 text-sm">{{ currentTestimonial.name }}</div>
              <div class="text-xs text-gray-500">{{ currentTestimonial.role }}</div>
            </div>
            <div class="ml-auto flex gap-0.5">
              <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-xs"></i>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows for Mobile -->
        <div class="flex justify-center gap-4 mt-6">
          <button @click="prevTestimonials" 
            class="w-10 h-10 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-all flex items-center justify-center">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="nextTestimonials" 
            class="w-10 h-10 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-all flex items-center justify-center">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      currentIndex: 0,
      testimonials: [
        { name: 'Amanuel Tesfaye', role: 'Property Buyer', quote: 'Sophor made buying my first home an absolute breeze. Their team was professional, transparent, and guided me every step of the way. Highly recommended!' },
        { name: 'Tigist Hailu', role: 'Tenant', quote: 'I have been renting through Sophor for 3 years now. The maintenance response is fast, the management is professional, and I feel truly at home.' },
        { name: 'Berhe Gebremichael', role: 'Property Investor', quote: 'The property management system is outstanding. I can track all my properties, payments, and maintenance from one dashboard. It is a game changer.' },
        { name: 'Meron Kidane', role: 'Business Owner', quote: 'Found the perfect commercial space for my business through Sophor. The process was smooth and the team was incredibly helpful throughout.' },
        { name: 'Yohannes Desta', role: 'Landlord', quote: 'Managing multiple rental units used to be stressful. With Sophor\'s system, everything is organized and I can focus on growing my portfolio.' },
        { name: 'Selam Abraha', role: 'First-time Buyer', quote: 'The team at Sophor went above and beyond to help me find a property within my budget. Their expertise and patience made all the difference.' },
      ],
    };
  },
  computed: {
    visibleTestimonials() {
      // For desktop: show 3 testimonials at a time
      const start = this.currentIndex;
      const testimonials = [];
      for (let i = 0; i < 3; i++) {
        testimonials.push(this.testimonials[(start + i) % this.testimonials.length]);
      }
      return testimonials;
    },
    currentTestimonial() {
      // For mobile: show 1 testimonial at a time
      return this.testimonials[this.currentIndex];
    },
  },
  methods: {
    nextTestimonials() {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    },
    prevTestimonials() {
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    },
  },
};
</script>
