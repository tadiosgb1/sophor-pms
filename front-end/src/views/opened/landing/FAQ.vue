<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Page Hero -->
    <section class="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Help Center</span>
        <h1 class="text-4xl lg:text-5xl font-black text-white mt-3 mb-4">Frequently Asked Questions</h1>
        <p class="text-gray-300 max-w-xl mx-auto">Find answers to the most common questions about our properties, services, and processes.</p>
        <div class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">FAQ</span>
        </div>
      </div>
    </section>

    <!-- Search -->
    <section class="bg-white border-b border-gray-100 py-6">
      <div class="max-w-2xl mx-auto px-4">
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input v-model="search" type="text" placeholder="Search questions..."
            class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 transition-all" />
        </div>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 justify-center mb-12">
          <button v-for="cat in categories" :key="cat.id"
            @click="activeCategory = cat.id"
            :class="['px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2', activeCategory === cat.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
            <i :class="cat.icon + ' text-xs'"></i>
            {{ cat.label }}
          </button>
        </div>

        <!-- FAQ Groups -->
        <div v-for="group in filteredGroups" :key="group.category" class="mb-10">
          <h3 class="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <i :class="group.icon + ' text-primary text-sm'"></i>
            </span>
            {{ group.category }}
          </h3>
          <div class="space-y-3">
            <div v-for="(faq, i) in group.faqs" :key="i"
              class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 transition-all shadow-sm">
              <button
                @click="toggleFaq(group.category + i)"
                class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
                <span class="font-semibold text-gray-900 text-sm pr-4">{{ faq.q }}</span>
                <i :class="['fas transition-transform duration-300 text-primary flex-shrink-0', openFaq === group.category + i ? 'fa-minus' : 'fa-plus']"></i>
              </button>
              <transition name="accordion">
                <div v-if="openFaq === group.category + i" class="px-6 pb-5 border-t border-gray-50">
                  <p class="text-gray-500 text-sm leading-relaxed pt-4">{{ faq.a }}</p>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div v-if="filteredGroups.length === 0" class="text-center py-16">
          <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-500">No results found</h3>
          <p class="text-gray-400 mt-2">Try a different search term</p>
        </div>
      </div>
    </section>

    <!-- Still Have Questions CTA -->
    <section class="py-16 bg-white">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <div class="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 border border-primary/20">
          <div class="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
            <i class="fas fa-headset text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-black text-gray-900 mb-3">Still Have Questions?</h2>
          <p class="text-gray-500 mb-8">Our team is ready to help. Reach out and we'll get back to you within 24 hours.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact"
              class="px-7 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2">
              <i class="fas fa-envelope"></i> Send Us a Message
            </router-link>
            <a href="tel:+251900000000"
              class="px-7 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
              <i class="fas fa-phone"></i> Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>

    <LandingFooter />
  </div>
</template>

<script>
import LandingNavbar from '../../../components/LandingNavbar.vue';
import LandingFooter from '../../../components/LandingFooter.vue';

export default {
  name: 'FAQPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      search: '',
      activeCategory: 'all',
      openFaq: null,
      categories: [
        { id: 'all', label: 'All Questions', icon: 'fas fa-list' },
        { id: 'buying', label: 'Buying', icon: 'fas fa-home' },
        { id: 'renting', label: 'Renting', icon: 'fas fa-key' },
        { id: 'management', label: 'Management', icon: 'fas fa-cogs' },
        { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
      ],
      faqGroups: [
        {
          category: 'Buying a Property',
          id: 'buying',
          icon: 'fas fa-home',
          faqs: [
            { q: 'How do I start the property buying process with Sophor?', a: 'Begin by browsing our property listings or contacting our sales team. We will schedule a consultation to understand your needs, budget, and preferences, then match you with suitable properties and guide you through the entire purchase process.' },
            { q: 'What documents do I need to buy a property?', a: 'You will need a valid national ID or passport, proof of income or financial capacity, and any relevant business registration documents if purchasing as a company. Our team will provide a complete checklist during your consultation.' },
            { q: 'How long does the property purchase process take?', a: 'Typically 4–8 weeks from offer acceptance to completion, depending on the complexity of the transaction, financing arrangements, and legal documentation requirements.' },
            { q: 'Do you offer financing or mortgage assistance?', a: 'While we do not directly provide financing, we have strong relationships with major Ethiopian banks and can connect you with mortgage advisors who specialize in real estate financing.' },
          ],
        },
        {
          category: 'Renting a Property',
          id: 'renting',
          icon: 'fas fa-key',
          faqs: [
            { q: 'What is included in the monthly rent?', a: 'Rent typically covers the property itself. Utilities (water, electricity, internet) are usually the tenant\'s responsibility unless otherwise specified in the lease agreement. Some properties include certain utilities — this is clearly stated in each listing.' },
            { q: 'How do I apply for a rental property?', a: 'Browse our rental listings, select a property you like, and submit an inquiry. Our team will contact you to arrange a viewing, after which you can submit a rental application with the required documents.' },
            { q: 'What is the minimum lease term?', a: 'Most of our rental properties have a minimum lease term of 6 months. Some properties offer shorter-term arrangements — please inquire with our team for specific availability.' },
            { q: 'Can I renew my lease?', a: 'Yes, lease renewals are handled through our property management system. You will receive a renewal notice 60 days before your lease expires, giving you ample time to decide and negotiate terms.' },
          ],
        },
        {
          category: 'Property Management',
          id: 'management',
          icon: 'fas fa-cogs',
          faqs: [
            { q: 'What does your property management service include?', a: 'Our comprehensive service covers tenant screening and placement, lease management, rent collection, maintenance coordination, financial reporting, property inspections, and 24/7 emergency support.' },
            { q: 'How do I submit a maintenance request?', a: 'Tenants can submit maintenance requests through our online portal, mobile app, or by calling our support line. All requests are tracked in real time and you will receive status updates throughout the process.' },
            { q: 'How quickly are maintenance issues resolved?', a: 'Emergency issues (no water, electrical hazards, security) are addressed within 24 hours. Standard maintenance requests are typically resolved within 3–5 business days depending on the nature of the work.' },
            { q: 'Can I access reports on my property performance?', a: 'Yes, property owners have access to our management dashboard where they can view occupancy rates, rental income, expense reports, maintenance history, and more in real time.' },
          ],
        },
        {
          category: 'Payments & Finances',
          id: 'payments',
          icon: 'fas fa-credit-card',
          faqs: [
            { q: 'What payment methods do you accept?', a: 'We accept bank transfers, mobile money (Telebirr, CBE Birr), and in-person cash payments at our office. All transactions are documented and receipts are issued through our system.' },
            { q: 'When is rent due each month?', a: 'Rent is due on the 1st of each month. A grace period of 5 days is provided. Late payments beyond the grace period may incur a late fee as specified in your lease agreement.' },
            { q: 'Is a security deposit required?', a: 'Yes, a security deposit equivalent to 1–2 months\' rent is required for all rental properties. This is held in trust and returned within 30 days of lease end, minus any deductions for damages beyond normal wear and tear.' },
            { q: 'How do I get a receipt for my payment?', a: 'Receipts are automatically generated and sent to your registered email address after each payment. You can also access your full payment history through our tenant portal.' },
          ],
        },
      ],
    };
  },
  computed: {
    filteredGroups() {
      let groups = this.activeCategory === 'all'
        ? this.faqGroups
        : this.faqGroups.filter(g => g.id === this.activeCategory);

      if (this.search.trim()) {
        const q = this.search.toLowerCase();
        groups = groups.map(g => ({
          ...g,
          faqs: g.faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
        })).filter(g => g.faqs.length > 0);
      }
      return groups;
    },
  },
  methods: {
    toggleFaq(key) {
      this.openFaq = this.openFaq === key ? null : key;
    },
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
  max-height: 300px;
  opacity: 1;
}
</style>
