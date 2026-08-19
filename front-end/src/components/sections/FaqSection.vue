<template>
  <section class="py-20 bg-white" id="faq" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">FAQ</span>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
        <p class="text-gray-500">Everything you need to know about our services and properties.</p>
      </div>
      <div class="space-y-4">
        <div v-for="(faq, i) in faqs" :key="i"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 80 } }"
          :class="['border rounded-2xl overflow-hidden transition-all', openFaq === i ? 'border-primary bg-primary/5' : 'border-gray-200']">
          <button
            @click="openFaq = openFaq === i ? null : i"
            :class="['w-full flex items-center justify-between px-6 py-5 text-left transition-colors', openFaq === i ? 'bg-primary/10' : 'hover:bg-gray-50']">
            <span :class="['font-semibold text-sm pr-4', openFaq === i ? 'text-primary' : 'text-gray-900']">{{ faq.q }}</span>
            <i :class="['fas transition-transform duration-300 flex-shrink-0', openFaq === i ? 'fa-minus text-primary' : 'fa-plus text-primary']"></i>
          </button>
          <transition name="accordion">
            <div v-if="openFaq === i" class="px-6 pb-5">
              <p class="text-gray-600 text-sm leading-relaxed">{{ faq.a }}</p>
            </div>
          </transition>
        </div>
      </div>
      <!-- <div class="text-center mt-8" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 500, delay: 400 } }">
        <router-link to="/faq"
          class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
          See All FAQs <i class="fas fa-arrow-right"></i>
        </router-link>
      </div> -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'FaqSection',
  data() {
    return {
      openFaq: null,
      faqs: [
        { q: 'How do I list my property with Sophor?', a: 'Simply contact our team through the Contact page or call us directly. Our property consultants will assess your property, provide a valuation, and list it on our platform within 48 hours.' },
        { q: 'What types of properties do you manage?', a: 'We manage a wide range of properties including residential apartments, villas, commercial offices, retail spaces, and land plots across Tigray.' },
        { q: 'How does the rental payment process work?', a: 'Tenants can pay rent through our secure online portal, bank transfer, or in person at our office. All payments are tracked and receipts are issued automatically through our system.' },
        { q: 'What is included in your property management service?', a: 'Our comprehensive service includes tenant screening, lease management, rent collection, maintenance coordination, financial reporting, and 24/7 emergency support.' },
        { q: 'Can I view properties before making a decision?', a: 'Absolutely. We offer both in-person tours and virtual property tours. Contact us to schedule a viewing at your convenience.' },
      ],
    };
  },
};
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 200px;
  opacity: 1;
}
</style>
