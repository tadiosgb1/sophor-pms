<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- ===== HERO SECTION ===== -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <!-- Background Slider -->
      <div class="absolute inset-0 z-0">
        <transition-group name="fade-hero">
          <div
            v-for="(img, i) in heroImages"
            :key="i"
            v-show="heroIndex === i"
            class="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            :style="{ backgroundImage: `url(${img})` }"
          ></div>
        </transition-group>
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <i class="fas fa-star text-xs"></i>
            Trusted Real Estate Partner in Tigray
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Find Your
            <span class="text-primary"> Dream</span>
            <br />Property Today
          </h1>
          <p class="text-lg text-gray-200 leading-relaxed mb-8 max-w-xl">
            Sophor offers premium properties for sale and rent, backed by a world-class property management system. Your investment, our expertise.
          </p>

          <!-- Search Bar -->
          <div class="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 mb-8">
            <select class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
              <option>Land</option>
            </select>
            <select class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">For Sale / Rent</option>
              <option>For Sale</option>
              <option>For Rent</option>
            </select>
            <input type="text" placeholder="Location or keyword..."
              class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary" />
            <router-link to="/properties"
              class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
              <i class="fas fa-search"></i> Search
            </router-link>
          </div>

          <!-- Stats Row -->
          <div class="flex flex-wrap gap-6">
            <div v-for="stat in heroStats" :key="stat.label" class="text-center">
              <div class="text-2xl font-black text-white">{{ stat.value }}</div>
              <div class="text-xs text-gray-300 uppercase tracking-wide">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slider Dots -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button v-for="(_, i) in heroImages" :key="i" @click="heroIndex = i"
          :class="['w-2.5 h-2.5 rounded-full transition-all', heroIndex === i ? 'bg-primary w-8' : 'bg-white/50']">
        </button>
      </div>
    </section>

    <!-- ===== FEATURES STRIP ===== -->
    <section class="bg-primary py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="feat in featureStrip" :key="feat.label" class="flex items-center gap-3 text-white">
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

    <!-- ===== FEATURED PROPERTIES ===== -->
    <section class="py-20 bg-gray-50" id="properties">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Portfolio</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Featured Properties</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Explore our handpicked selection of premium properties available for sale and rent across Tigray.</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center gap-2 mb-10">
          <button v-for="tab in propertyTabs" :key="tab"
            @click="activeTab = tab"
            :class="['px-5 py-2 rounded-full text-sm font-semibold transition-all', activeTab === tab ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
            {{ tab }}
          </button>
        </div>

        <!-- Property Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="prop in filteredProperties" :key="prop.id"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <!-- Image -->
            <div class="relative overflow-hidden h-52">
              <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <i class="fas fa-building text-5xl text-gray-400"></i>
              </div>
              <div class="absolute top-3 left-3 flex gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', prop.type === 'For Sale' ? 'bg-secondary text-white' : 'bg-primary text-white']">
                  {{ prop.type }}
                </span>
                <span v-if="prop.featured" class="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                  Featured
                </span>
              </div>
              <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all">
                <i class="far fa-heart text-gray-500 text-sm"></i>
              </button>
            </div>
            <!-- Content -->
            <div class="p-5">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-bold text-gray-900 text-base leading-tight">{{ prop.name }}</h3>
                <span class="text-primary font-black text-lg whitespace-nowrap ml-2">{{ prop.price }}</span>
              </div>
              <p class="text-gray-500 text-sm flex items-center gap-1 mb-3">
                <i class="fas fa-map-marker-alt text-primary text-xs"></i>
                {{ prop.location }}
              </p>
              <div class="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span class="flex items-center gap-1"><i class="fas fa-bed text-primary"></i> {{ prop.beds }} Beds</span>
                <span class="flex items-center gap-1"><i class="fas fa-bath text-primary"></i> {{ prop.baths }} Baths</span>
                <span class="flex items-center gap-1"><i class="fas fa-ruler-combined text-primary"></i> {{ prop.area }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-10">
          <router-link to="/properties"
            class="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all">
            View All Properties <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===== ABOUT SNIPPET ===== -->
    <section class="py-20 bg-white" id="about">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left: Image Grid -->
          <div class="relative grid grid-cols-2 gap-4">
            <div class="col-span-2 rounded-2xl overflow-hidden h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <i class="fas fa-city text-7xl text-primary/40"></i>
            </div>
            <div class="rounded-2xl overflow-hidden h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <i class="fas fa-home text-4xl text-gray-400"></i>
            </div>
            <div class="rounded-2xl overflow-hidden h-36 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
              <i class="fas fa-key text-4xl text-primary/60"></i>
            </div>
            <!-- Badge -->
            <div class="absolute -bottom-4 -right-4 bg-primary text-white rounded-2xl p-5 shadow-xl text-center">
              <div class="text-3xl font-black">10+</div>
              <div class="text-xs font-medium">Years of Excellence</div>
            </div>
          </div>

          <!-- Right: Content -->
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-5 leading-tight">
              Building Trust Through<br />
              <span class="text-primary">Premium Real Estate</span>
            </h2>
            <p class="text-gray-500 leading-relaxed mb-6">
              Sophor is a leading real estate company dedicated to providing exceptional property solutions. From residential apartments to commercial spaces, we manage every aspect of your real estate journey with professionalism and care.
            </p>
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div v-for="val in coreValues" :key="val.title" class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <i :class="val.icon + ' text-primary'"></i>
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-sm">{{ val.title }}</div>
                  <div class="text-xs text-gray-500">{{ val.desc }}</div>
                </div>
              </div>
            </div>
            <router-link to="/about"
              class="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md">
              Learn More About Us <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES SECTION ===== -->
    <section class="py-20 bg-gray-50" id="features">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Powerful Features for<br />Modern Real Estate</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Our integrated property management system gives you complete control over every aspect of your real estate portfolio.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title"
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

    <!-- ===== STATS SECTION ===== -->
    <section class="py-20 bg-gray-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-black text-white mb-3">Our Numbers Speak</h2>
          <p class="text-gray-400">A decade of excellence in real estate management</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in bigStats" :key="stat.label" class="text-center">
            <div class="text-4xl lg:text-5xl font-black text-primary mb-2">{{ stat.value }}</div>
            <div class="text-white font-semibold mb-1">{{ stat.label }}</div>
            <div class="text-gray-500 text-sm">{{ stat.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="py-20 bg-white" id="testimonials">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">What Our Clients Say</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Real stories from real clients who trusted Sophor with their property needs.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative">
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
      </div>
    </section>

    <!-- ===== NEWS & EVENTS SNIPPET ===== -->
    <section class="py-20 bg-gray-50" id="news">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Latest Updates</span>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2">News & Events</h2>
          </div>
          <router-link to="/news"
            class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View All <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="news in newsItems" :key="news.title"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div class="h-44 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
              <i :class="news.icon + ' text-5xl text-primary/30 group-hover:scale-110 transition-transform duration-500'"></i>
              <span class="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{{ news.category }}</span>
            </div>
            <div class="p-6">
              <p class="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <i class="fas fa-calendar-alt text-primary"></i> {{ news.date }}
              </p>
              <h3 class="font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">{{ news.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ news.excerpt }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ SNIPPET ===== -->
    <section class="py-20 bg-white" id="faq">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">FAQ</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
          <p class="text-gray-500">Everything you need to know about our services and properties.</p>
        </div>
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i"
            class="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
              <span class="font-semibold text-gray-900 text-sm pr-4">{{ faq.q }}</span>
              <i :class="['fas transition-transform duration-300 text-primary flex-shrink-0', openFaq === i ? 'fa-minus rotate-0' : 'fa-plus']"></i>
            </button>
            <transition name="accordion">
              <div v-if="openFaq === i" class="px-6 pb-5">
                <p class="text-gray-500 text-sm leading-relaxed">{{ faq.a }}</p>
              </div>
            </transition>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link to="/faq"
            class="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            See All FAQs <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT CTA ===== -->
    <section class="py-20 bg-gradient-to-br from-primary via-green-500 to-secondary relative overflow-hidden" id="contact">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
          Ready to Find Your<br />Perfect Property?
        </h2>
        <p class="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Contact our expert team today and let us guide you through every step of your real estate journey.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/contact"
            class="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl text-sm">
            <i class="fas fa-envelope mr-2"></i> Contact Us Now
          </router-link>
          <router-link to="/properties"
            class="px-8 py-4 bg-white/20 border-2 border-white text-white font-bold rounded-xl hover:bg-white/30 transition-all text-sm backdrop-blur-sm">
            <i class="fas fa-building mr-2"></i> Browse Properties
          </router-link>
        </div>
        <div class="mt-10 flex flex-wrap justify-center gap-8">
          <div v-for="c in contactHighlights" :key="c.label" class="flex items-center gap-2 text-white/90">
            <i :class="c.icon + ' text-white/70'"></i>
            <span class="text-sm font-medium">{{ c.label }}</span>
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

import bg1 from '../../../assets/img/hero/bg1.jpg';
import bg2 from '../../../assets/img/hero/bg2.jpg';
import bg3 from '../../../assets/img/hero/bg3.jpg';
import bg4 from '../../../assets/img/hero/bg4.jpg';

export default {
  name: 'LandingHome',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      heroIndex: 0,
      heroImages: [bg1, bg2, bg3, bg4],
      heroInterval: null,
      activeTab: 'All',
      openFaq: null,
      propertyTabs: ['All', 'For Sale', 'For Rent'],
      heroStats: [
        { value: '500+', label: 'Properties' },
        { value: '1,200+', label: 'Happy Clients' },
        { value: '10+', label: 'Years Experience' },
        { value: '98%', label: 'Satisfaction Rate' },
      ],
      featureStrip: [
        { icon: 'fas fa-shield-alt', label: 'Verified Properties', sub: 'All listings verified' },
        { icon: 'fas fa-headset', label: '24/7 Support', sub: 'Always here for you' },
        { icon: 'fas fa-file-contract', label: 'Easy Documentation', sub: 'Hassle-free process' },
        { icon: 'fas fa-chart-line', label: 'Best Investment', sub: 'Maximize your returns' },
      ],
      properties: [
        { id: 1, name: 'Luxury Villa in Mekelle', type: 'For Sale', price: 'ETB 4.5M', location: 'Mekelle, Tigray', beds: 4, baths: 3, area: '320 m²', featured: true },
        { id: 2, name: 'Modern Apartment Complex', type: 'For Rent', price: 'ETB 15K/mo', location: 'Ayder, Mekelle', beds: 2, baths: 1, area: '95 m²', featured: false },
        { id: 3, name: 'Commercial Office Space', type: 'For Sale', price: 'ETB 8.2M', location: 'Hawelti, Mekelle', beds: 0, baths: 2, area: '450 m²', featured: true },
        { id: 4, name: 'Family Residence', type: 'For Rent', price: 'ETB 22K/mo', location: 'Adi Haki, Mekelle', beds: 3, baths: 2, area: '180 m²', featured: false },
        { id: 5, name: 'Studio Apartment', type: 'For Rent', price: 'ETB 8K/mo', location: 'Semien, Mekelle', beds: 1, baths: 1, area: '55 m²', featured: false },
        { id: 6, name: 'Prime Land Plot', type: 'For Sale', price: 'ETB 2.1M', location: 'Quiha, Tigray', beds: 0, baths: 0, area: '600 m²', featured: false },
      ],
      coreValues: [
        { icon: 'fas fa-handshake', title: 'Integrity', desc: 'Honest & transparent' },
        { icon: 'fas fa-award', title: 'Excellence', desc: 'Premium quality always' },
        { icon: 'fas fa-users', title: 'Client First', desc: 'Your needs matter most' },
        { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Modern solutions' },
      ],
      features: [
        { icon: 'fas fa-building', title: 'Property Management', desc: 'Complete lifecycle management of all your properties — from listing to lease and beyond.' },
        { icon: 'fas fa-tools', title: 'Maintenance Tracking', desc: 'Submit, track, and resolve maintenance requests with real-time status updates.' },
        { icon: 'fas fa-boxes', title: 'Inventory Control', desc: 'Manage property inventory, track items, and monitor transactions with ease.' },
        { icon: 'fas fa-file-invoice-dollar', title: 'Financial Management', desc: 'Track expenses, rent payments, sale transactions, and generate detailed reports.' },
        { icon: 'fas fa-user-shield', title: 'Role-Based Access', desc: 'Granular permissions and role management to keep your data secure and organized.' },
        { icon: 'fas fa-chart-bar', title: 'Analytics Dashboard', desc: 'Powerful dashboards with real-time insights into your entire real estate portfolio.' },
      ],
      bigStats: [
        { value: '500+', label: 'Properties Managed', sub: 'Across Tigray region' },
        { value: '1,200+', label: 'Happy Clients', sub: 'Buyers, renters & investors' },
        { value: '98%', label: 'Client Satisfaction', sub: 'Based on client surveys' },
        { value: 'ETB 2B+', label: 'Property Value', sub: 'Total portfolio value' },
      ],
      testimonials: [
        { name: 'Amanuel Tesfaye', role: 'Property Buyer', quote: 'Sophor made buying my first home an absolute breeze. Their team was professional, transparent, and guided me every step of the way. Highly recommended!' },
        { name: 'Tigist Hailu', role: 'Tenant', quote: 'I have been renting through Sophor for 3 years now. The maintenance response is fast, the management is professional, and I feel truly at home.' },
        { name: 'Berhe Gebremichael', role: 'Property Investor', quote: 'The property management system is outstanding. I can track all my properties, payments, and maintenance from one dashboard. It is a game changer.' },
        { name: 'Meron Kidane', role: 'Business Owner', quote: 'Found the perfect commercial space for my business through Sophor. The process was smooth and the team was incredibly helpful throughout.' },
        { name: 'Yohannes Desta', role: 'Landlord', quote: 'Managing multiple rental units used to be stressful. With Sophor\'s system, everything is organized and I can focus on growing my portfolio.' },
        { name: 'Selam Abraha', role: 'First-time Buyer', quote: 'The team at Sophor went above and beyond to help me find a property within my budget. Their expertise and patience made all the difference.' },
      ],
      newsItems: [
        { icon: 'fas fa-city', category: 'News', date: 'May 20, 2026', title: 'Sophor Launches New Premium Residential Complex in Mekelle', excerpt: 'Our latest development features 120 modern units with state-of-the-art amenities and smart home technology.' },
        { icon: 'fas fa-calendar-check', category: 'Event', date: 'June 5, 2026', title: 'Annual Real Estate Investment Forum 2026', excerpt: 'Join us for our flagship event bringing together investors, developers, and property experts from across Ethiopia.' },
        { icon: 'fas fa-chart-line', category: 'Market', date: 'May 15, 2026', title: 'Tigray Real Estate Market Shows Strong Growth in Q1 2026', excerpt: 'Property values in Mekelle have increased by 18% year-over-year, signaling a robust recovery and investment opportunity.' },
      ],
      faqs: [
        { q: 'How do I list my property with Sophor?', a: 'Simply contact our team through the Contact page or call us directly. Our property consultants will assess your property, provide a valuation, and list it on our platform within 48 hours.' },
        { q: 'What types of properties do you manage?', a: 'We manage a wide range of properties including residential apartments, villas, commercial offices, retail spaces, and land plots across Tigray.' },
        { q: 'How does the rental payment process work?', a: 'Tenants can pay rent through our secure online portal, bank transfer, or in person at our office. All payments are tracked and receipts are issued automatically through our system.' },
        { q: 'What is included in your property management service?', a: 'Our comprehensive service includes tenant screening, lease management, rent collection, maintenance coordination, financial reporting, and 24/7 emergency support.' },
        { q: 'Can I view properties before making a decision?', a: 'Absolutely. We offer both in-person tours and virtual property tours. Contact us to schedule a viewing at your convenience.' },
      ],
      contactHighlights: [
        { icon: 'fas fa-phone', label: '+251 900 000 000' },
        { icon: 'fas fa-envelope', label: 'info@sophor.com' },
        { icon: 'fas fa-map-marker-alt', label: 'Mekelle, Tigray' },
        { icon: 'fas fa-clock', label: 'Mon–Fri 8AM–6PM' },
      ],
    };
  },
  computed: {
    filteredProperties() {
      if (this.activeTab === 'All') return this.properties;
      return this.properties.filter(p => p.type === this.activeTab);
    },
  },
  mounted() {
    this.heroInterval = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.heroInterval);
  },
};
</script>

<style scoped>
.fade-hero-enter-active,
.fade-hero-leave-active {
  transition: opacity 1s ease;
}
.fade-hero-enter-from,
.fade-hero-leave-to {
  opacity: 0;
}

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
