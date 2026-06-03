<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Page Hero -->
    <section class="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
        <h1 class="text-4xl lg:text-5xl font-black text-white mt-3 mb-4">Contact Us</h1>
        <p class="text-gray-300 max-w-xl mx-auto">Have a question or ready to start your property journey? Our team is here to help.</p>
        <div class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">Contact</span>
        </div>
      </div>
    </section>

    <!-- Contact Info Cards -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="info in contactCards" :key="info.label"
            class="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-primary/30 group">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mx-auto mb-4 transition-all duration-300">
              <i :class="info.icon + ' text-2xl text-primary group-hover:text-white transition-colors duration-300'"></i>
            </div>
            <h4 class="font-bold text-gray-900 mb-1">{{ info.label }}</h4>
            <p class="text-gray-500 text-sm">{{ info.value }}</p>
            <p v-if="info.sub" class="text-gray-400 text-xs mt-1">{{ info.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form + Map -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Form -->
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Send a Message</span>
            <h2 class="text-3xl font-black text-gray-900 mt-2 mb-8">We'd Love to Hear From You</h2>

            <form @submit.prevent="submitForm" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                  <input v-model="form.firstName" type="text" required placeholder="Amanuel"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                  <input v-model="form.lastName" type="text" required placeholder="Tesfaye"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                <input v-model="form.email" type="email" required placeholder="amanuel@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input v-model="form.phone" type="tel" placeholder="+251 900 000 000"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject *</label>
                <select v-model="form.subject" required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all">
                  <option value="">Select a subject</option>
                  <option>Property Inquiry</option>
                  <option>Rental Information</option>
                  <option>Property Management</option>
                  <option>Investment Consultation</option>
                  <option>Maintenance Request</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message *</label>
                <textarea v-model="form.message" required rows="5" placeholder="Tell us how we can help you..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all resize-none"></textarea>
              </div>
              <button type="submit"
                :disabled="submitting"
                class="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60">
                <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane"></i>
                {{ submitting ? 'Sending...' : 'Send Message' }}
              </button>
              <div v-if="submitted" class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <i class="fas fa-check-circle text-primary text-xl"></i>
                <div>
                  <p class="font-semibold text-green-800 text-sm">Message sent successfully!</p>
                  <p class="text-green-600 text-xs">Our team will get back to you within 24 hours.</p>
                </div>
              </div>
            </form>
          </div>

          <!-- Info Panel -->
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Visit Us</span>
            <h2 class="text-3xl font-black text-gray-900 mt-2 mb-8">Our Office</h2>

            <!-- Map Placeholder -->
            <div class="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-8 border border-gray-200">
              <div class="text-center">
                <i class="fas fa-map-marked-alt text-5xl text-primary/40 mb-3"></i>
                <p class="text-gray-500 text-sm font-medium">Mekelle, Tigray, Ethiopia</p>
                <p class="text-gray-400 text-xs">Interactive map coming soon</p>
              </div>
            </div>

            <!-- Office Hours -->
            <div class="bg-gray-50 rounded-2xl p-6 mb-6">
              <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-clock text-primary"></i> Office Hours
              </h4>
              <div class="space-y-2">
                <div v-for="hours in officeHours" :key="hours.day" class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ hours.day }}</span>
                  <span :class="hours.open ? 'text-primary font-semibold' : 'text-gray-400'">{{ hours.time }}</span>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div>
              <h4 class="font-bold text-gray-900 mb-4">Follow Us</h4>
              <div class="flex gap-3">
                <a v-for="social in socials" :key="social.icon" href="#"
                  class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary flex items-center justify-center transition-all group"
                  :aria-label="social.label">
                  <i :class="social.icon + ' text-gray-500 group-hover:text-white transition-colors'"></i>
                </a>
              </div>
            </div>
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
  name: 'ContactPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      submitting: false,
      submitted: false,
      form: { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' },
      contactCards: [
        { icon: 'fas fa-map-marker-alt', label: 'Our Address', value: 'Mekelle, Tigray, Ethiopia', sub: 'Near Axum Hotel' },
        { icon: 'fas fa-phone', label: 'Phone Number', value: '+251 900 000 000', sub: 'Mon–Fri 8AM–6PM' },
        { icon: 'fas fa-envelope', label: 'Email Address', value: 'info@sophor.com', sub: 'We reply within 24hrs' },
        { icon: 'fas fa-headset', label: 'Live Support', value: '24/7 Available', sub: 'For urgent matters' },
      ],
      officeHours: [
        { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM', open: true },
        { day: 'Saturday', time: '9:00 AM – 3:00 PM', open: true },
        { day: 'Sunday', time: 'Closed', open: false },
        { day: 'Public Holidays', time: 'Closed', open: false },
      ],
      socials: [
        { icon: 'fab fa-facebook-f', label: 'Facebook' },
        { icon: 'fab fa-twitter', label: 'Twitter' },
        { icon: 'fab fa-instagram', label: 'Instagram' },
        { icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
        { icon: 'fab fa-youtube', label: 'YouTube' },
      ],
    };
  },
  methods: {
    async submitForm() {
      this.submitting = true;
      await new Promise(r => setTimeout(r, 1500));
      this.submitting = false;
      this.submitted = true;
      this.form = { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' };
      setTimeout(() => { this.submitted = false; }, 5000);
    },
  },
};
</script>
