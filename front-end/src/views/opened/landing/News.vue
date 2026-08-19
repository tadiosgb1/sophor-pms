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
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">Stay Informed</span>
        <h1 class="text-4xl lg:text-5xl font-black text-white mt-3 mb-4" 
          v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }">News & Events</h1>
        <p class="text-gray-300 max-w-xl mx-auto" 
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
          Stay up to date with the latest real estate news, market insights, and upcoming events from Sophor.
        </p>
        <div class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400" 
          v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 600, delay: 300 } }">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">News & Events</span>
        </div>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
        <button v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="['px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all', activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-12 bg-gray-50" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="h-64 lg:h-auto overflow-hidden min-h-64">
              <img :src="newsImage" alt="Featured News" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-8 lg:p-12 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4">
                <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">News</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                Sophor Launches New Premium Residential Complex in Mekelle
              </h2>
              <p class="text-gray-500 leading-relaxed mb-6">
                Our latest development features 120 modern units with state-of-the-art amenities, smart home technology, and sustainable design principles. The complex is set to redefine urban living in Tigray.
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <span class="flex items-center gap-1"><i class="fas fa-calendar-alt text-primary"></i> May 20, 2026</span>
                <span class="flex items-center gap-1"><i class="fas fa-user text-primary"></i> Sophor Team</span>
                <span class="flex items-center gap-1"><i class="fas fa-clock text-primary"></i> 5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="py-12 bg-gray-50" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(item, index) in filteredNews" :key="item.title"
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div class="h-48 relative overflow-hidden">
              <img :src="newsImage" alt="News" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', item.category === 'Event' ? 'bg-secondary text-white' : item.category === 'Market' ? 'bg-yellow-500 text-white' : 'bg-primary text-white']">
                  {{ item.category }}
                </span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span class="flex items-center gap-1"><i class="fas fa-calendar-alt text-primary"></i> {{ item.date }}</span>
                <span class="flex items-center gap-1"><i class="fas fa-clock text-primary"></i> {{ item.readTime }}</span>
              </div>
              <h3 class="font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors">{{ item.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ item.excerpt }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 flex items-center gap-1">
                  <i class="fas fa-user text-primary"></i> {{ item.author }}
                </span>
                <button class="text-primary text-sm font-semibold hover:gap-2 flex items-center gap-1 transition-all">
                  Read More <i class="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="py-16 bg-white" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Calendar</span>
          <h2 class="text-3xl font-black text-gray-900 mt-2">Upcoming Events</h2>
        </div>
        <div class="space-y-4">
          <div v-for="(event, index) in upcomingEvents" :key="event.title"
            v-motion
            :initial="{ opacity: 0, x: -40 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: index * 100 } }"
            class="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gray-50 rounded-2xl p-6 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all">
            <div class="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex flex-col items-center justify-center text-white">
              <span class="text-xl font-black leading-none">{{ event.day }}</span>
              <span class="text-xs font-medium">{{ event.month }}</span>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-gray-900 mb-1">{{ event.title }}</h4>
              <p class="text-gray-500 text-sm">{{ event.desc }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-xs text-gray-400 flex items-center gap-1 mb-1">
                <i class="fas fa-map-marker-alt text-primary"></i> {{ event.location }}
              </div>
              <div class="text-xs text-gray-400 flex items-center gap-1">
                <i class="fas fa-clock text-primary"></i> {{ event.time }}
              </div>
            </div>
            <button class="flex-shrink-0 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
              Register
            </button>
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
import newsImg from '../../../assets/img/News/news1.JPG';

export default {
  name: 'NewsPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      newsImage: newsImg,
      activeCategory: 'All',
      categories: ['All', 'News', 'Events', 'Market', 'Company'],
      newsItems: [
        { title: 'Tigray Real Estate Market Shows Strong Growth in Q1 2026', category: 'Market', date: 'May 15, 2026', readTime: '4 min read', author: 'Market Team', icon: 'fas fa-chart-line', gradient: 'from-yellow-100 to-orange-100', excerpt: 'Property values in Mekelle have increased by 18% year-over-year, signaling a robust recovery and strong investment opportunity for buyers and investors.' },
        { title: 'Annual Real Estate Investment Forum 2026 — Registration Open', category: 'Event', date: 'May 10, 2026', readTime: '2 min read', author: 'Events Team', icon: 'fas fa-calendar-check', gradient: 'from-secondary/10 to-secondary/20', excerpt: 'Join us for our flagship event bringing together investors, developers, and property experts from across Ethiopia for a day of insights and networking.' },
        { title: 'Sophor Introduces Smart Maintenance Request System', category: 'Company', date: 'May 5, 2026', readTime: '3 min read', author: 'Tech Team', icon: 'fas fa-tools', gradient: 'from-primary/10 to-primary/20', excerpt: 'Our new digital maintenance portal allows tenants to submit, track, and receive updates on maintenance requests in real time through our mobile-friendly platform.' },
        { title: 'New Zoning Regulations Impact Commercial Property Development', category: 'Market', date: 'April 28, 2026', readTime: '5 min read', author: 'Legal Team', icon: 'fas fa-gavel', gradient: 'from-red-50 to-red-100', excerpt: 'Recent changes to Mekelle\'s urban development plan create new opportunities for mixed-use developments in previously restricted zones.' },
        { title: 'Sophor Wins Best Property Management Company Award 2026', category: 'Company', date: 'April 20, 2026', readTime: '2 min read', author: 'PR Team', icon: 'fas fa-trophy', gradient: 'from-yellow-50 to-yellow-100', excerpt: 'We are proud to announce that Sophor has been recognized as the Best Property Management Company in Tigray for the third consecutive year.' },
        { title: 'Property Expo Mekelle 2026 — Sophor to Showcase New Listings', category: 'Event', date: 'April 15, 2026', readTime: '3 min read', author: 'Sales Team', icon: 'fas fa-store', gradient: 'from-blue-50 to-blue-100', excerpt: 'Visit our booth at the annual Property Expo to explore our latest listings, meet our team, and learn about exclusive pre-launch offers.' },
      ],
      upcomingEvents: [
        { day: '05', month: 'JUN', title: 'Annual Real Estate Investment Forum 2026', desc: 'A full-day conference featuring keynote speakers, panel discussions, and networking sessions.', location: 'Axum Hotel, Mekelle', time: '9:00 AM – 6:00 PM' },
        { day: '18', month: 'JUN', title: 'Property Expo Mekelle 2026', desc: 'Explore hundreds of property listings and meet developers, agents, and investors.', location: 'Mekelle Exhibition Center', time: '10:00 AM – 5:00 PM' },
        { day: '02', month: 'JUL', title: 'First-Time Homebuyer Workshop', desc: 'Free workshop covering everything you need to know about buying your first property.', location: 'Sophor Office, Mekelle', time: '2:00 PM – 5:00 PM' },
        { day: '15', month: 'JUL', title: 'Property Investment Masterclass', desc: 'Advanced session on real estate investment strategies, ROI analysis, and portfolio building.', location: 'Online (Zoom)', time: '6:00 PM – 8:00 PM' },
      ],
    };
  },
  computed: {
    filteredNews() {
      if (this.activeCategory === 'All') return this.newsItems;
      return this.newsItems.filter(n => n.category === this.activeCategory);
    },
  },
};
</script>
