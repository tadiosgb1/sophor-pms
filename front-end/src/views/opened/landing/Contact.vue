<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Page Hero -->
    <section class="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden" 
      v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest" 
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">Get In Touch</span>
        <h1 class="text-4xl lg:text-5xl font-black text-white mt-3 mb-4" 
          v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }">Contact Us</h1>
        <p class="text-gray-300 max-w-xl mx-auto" 
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
          Have a question or ready to start your property journey? Our team is here to help.
        </p>
        <div class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400" 
          v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 600, delay: 300 } }">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">Contact</span>
        </div>
      </div>
    </section>

  

    <!-- Contact Form + Info Sidebar -->
    <section class="py-16 bg-white" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Contact Form -->
          <div class="lg:col-span-2" v-motion :initial="{ opacity: 0, x: -50 }" :visible="{ opacity: 1, x: 0, transition: { duration: 700 } }">
            <div class="text-center lg:text-left mb-8">
              <span class="text-primary font-semibold text-sm uppercase tracking-widest">Send a Message</span>
              <h2 class="text-3xl font-black text-gray-900 mt-2 mb-4">We'd Love to Hear From You</h2>
              <p class="text-gray-500">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                <input v-model="form.name" type="text" required placeholder="Enter your full name"
                  class="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input v-model="form.email" type="email" required placeholder="your.email@example.com"
                  class="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input v-model="form.phone" type="tel" required placeholder="+251 900 000 000"
                  class="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <input v-model="form.subject" type="text" required placeholder="What is this regarding?"
                  class="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all" />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                <textarea v-model="form.message" required rows="6" placeholder="Tell us how we can help you..."
                  class="w-full px-5 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all resize-none"></textarea>
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

          <!-- Contact Info Sidebar -->
          <div class="lg:col-span-1" v-motion :initial="{ opacity: 0, x: 50 }" :visible="{ opacity: 1, x: 0, transition: { duration: 700, delay: 200 } }">
            <div class="sticky top-24 space-y-6">
              <!-- Contact Details -->
              <div class="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                <h3 class="text-xl font-black mb-6">Contact Information</h3>
                <div class="space-y-5">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-sm mb-1">Address</p>
                      <p class="text-white/80 text-sm">Addis Ababa & Mekelle, Ethiopia</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-phone"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-sm mb-1">Phone</p>
                      <a href="tel:+251998890220" class="text-white/80 text-sm hover:text-white">+251 998 890 220</a>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-sm mb-1">Email</p>
                      <a href="mailto:sophortechnologies@gmail.com" class="text-white/80 text-sm hover:text-white break-all">sophortechnologies@gmail.com</a>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-clock"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-sm mb-1">Working Hours</p>
                      <p class="text-white/80 text-sm">Mon–Fri: 8AM – 6PM</p>
                      <p class="text-white/80 text-sm">Sat: 9AM – 3PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Social Media -->
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 class="font-bold text-gray-900 mb-4">Follow Us</h4>
                <div class="flex flex-wrap gap-3">
                  <a v-for="social in socials" :key="social.icon" :href="social.url" target="_blank" rel="noopener noreferrer"
                    class="w-12 h-12 rounded-xl bg-gray-100 hover:bg-primary flex items-center justify-center transition-all group"
                    :aria-label="social.label">
                    <i :class="social.icon + ' text-gray-500 group-hover:text-white transition-colors'"></i>
                  </a>
                </div>
              </div>

              <!-- Emergency Contact -->
              <div class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div class="flex items-start gap-3">
                
                  <div>
                  
                  
                    <p class="">Available 24/7 for urgent property matters</p>
                    <a href="tel:+251998890220" class="text-primary font-bold text-sm hover:underline">+251 998 890 220</a>
                  </div>
                </div>
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
      form: { name: '', email: '', phone: '', subject: '', message: '' },
      contactCards: [
        { icon: 'fas fa-map-marker-alt', label: 'Our Address', value: 'Addis Ababa & Mekelle, Ethiopia', sub: 'Near Axum Hotel' },
        { icon: 'fas fa-phone', label: 'Phone Number', value: '+251 998 890 220', sub: 'Mon–Fri 8AM–6PM' },
        { icon: 'fas fa-envelope', label: 'Email Address', value: 'Email:sophortechnologies@gmail.com', sub: 'We reply within 24hrs' },
        { icon: 'fas fa-headset', label: 'Live Support', value: '24/7 Available', sub: 'For urgent matters' },
      ],
      officeHours: [
        { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM', open: true },
        { day: 'Saturday', time: '9:00 AM – 3:00 PM', open: true },
        { day: 'Sunday', time: 'Closed', open: false },
        { day: 'Public Holidays', time: 'Closed', open: false },
      ],
      socials: [
        { icon: 'fab fa-facebook-f', label: 'Facebook', url: 'https://facebook.com/sophortechnology' },
        { icon: 'fab fa-youtube', label: 'YouTube', url: 'https://youtube.com/@sophortechnologies' },
        { icon: 'fab fa-x-twitter', label: 'X (Twitter)', url: 'https://x.com/sophortechnologies' },
        { icon: 'fab fa-tiktok', label: 'TikTok', url: 'https://tiktok.com/@sophortechnologies' },
        { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: 'https://wa.me/251998890220' },
        { icon: 'fab fa-telegram', label: 'Telegram', url: 'https://t.me/sophortechnologies' },
      ],
    };
  },
  methods: {
    async submitForm() {
      this.submitting = true;
      await new Promise(r => setTimeout(r, 1500));
      this.submitting = false;
      this.submitted = true;
      this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      setTimeout(() => { this.submitted = false; }, 5000);
    },
  },
};
</script>
