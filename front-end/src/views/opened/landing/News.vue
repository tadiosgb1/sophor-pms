<template>
  <div class="min-h-screen font-sans bg-gray-50">
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="['px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2', 
                   activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
          <i v-if="cat === 'All'" class="fas fa-list-ul text-xs"></i>
          <i v-else-if="cat === 'News'" class="fas fa-newspaper text-xs"></i>
          <i v-else-if="cat === 'Events'" class="fas fa-calendar-alt text-xs"></i>
          <i v-else-if="cat === 'Market'" class="fas fa-chart-line text-xs"></i>
          <i v-else-if="cat === 'Company'" class="fas fa-building text-xs"></i>
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-12 bg-gray-50" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="h-64 lg:h-auto overflow-hidden min-h-64 relative">
              <img :src="featuredArticle.image" :alt="featuredArticle.title" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
              <div class="absolute bottom-4 left-4 lg:hidden">
                 <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Featured Launch</span>
              </div>
            </div>
            <div class="p-8 lg:p-12 flex flex-col justify-center">
              <div class="hidden lg:flex items-center gap-3 mb-4">
                <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Project Launch</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-black text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                {{ featuredArticle.title }}
              </h2>
              <p class="text-gray-500 leading-relaxed mb-6">
                {{ featuredArticle.excerpt }}
              </p>
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 border-t border-gray-100 pt-6">
                <span class="flex items-center gap-2"><i class="fas fa-calendar-alt text-primary"></i> {{ featuredArticle.date }}</span>
                <span class="flex items-center gap-2"><i class="fas fa-user text-primary"></i> {{ featuredArticle.author }}</span>
                <span class="flex items-center gap-2"><i class="fas fa-clock text-primary"></i> {{ featuredArticle.readTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Grid (6 Items) -->
    <section class="py-12 bg-gray-50" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(item, index) in filteredNews" :key="item.title"
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 50 } }"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div class="h-52 relative overflow-hidden">
              <img :src="item.image" :alt="item.title" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow-sm', 
                               item.category === 'Event' ? 'bg-secondary text-white' : 
                               item.category === 'Market' ? 'bg-yellow-500 text-white' : 
                               item.category === 'Company' ? 'bg-gray-800 text-white' :
                               'bg-primary text-white']">
                  {{ item.category }}
                </span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span class="flex items-center gap-1.5"><i class="fas fa-calendar-alt text-primary"></i> {{ item.date }}</span>
                <span class="flex items-center gap-1.5"><i class="fas fa-clock text-primary"></i> {{ item.readTime }}</span>
              </div>
              <h3 class="font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors flex-1">{{ item.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{{ item.excerpt }}</p>
              <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span class="text-xs text-gray-400 flex items-center gap-1.5">
                  <i class="fas fa-user text-primary"></i> {{ item.author }}
                </span>
                <button class="text-primary text-sm font-semibold hover:gap-2 flex items-center gap-1 transition-all group-hover:underline">
                  Read More <i class="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
           <i class="fas fa-search text-5xl text-gray-200 mb-4"></i>
           <p class="text-gray-500">No items found in the "{{ activeCategory }}" category.</p>
           <button @click="activeCategory = 'All'" class="mt-4 text-primary font-semibold text-sm">View All</button>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="py-16 bg-white" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Calendar</span>
          <h2 class="text-3xl font-black text-gray-900 mt-2">Upcoming Events</h2>
          <p class="text-gray-500 mt-3 max-w-lg mx-auto">Mark your calendar for these exclusive real estate opportunities, workshops, and forums.</p>
        </div>
        <div class="space-y-6">
          <div v-for="(event, index) in upcomingEvents" :key="event.title"
            v-motion
            :initial="{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: index * 100 } }"
            class="flex flex-col md:flex-row items-center gap-6 bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg border border-gray-100 transition-all duration-300">
            
            <div class="flex items-center gap-5 flex-1 w-full md:w-auto">
                <div class="flex-shrink-0 w-20 h-20 bg-primary rounded-2xl flex flex-col items-center justify-center text-white shadow-inner">
                  <span class="text-3xl font-black leading-none">{{ event.day }}</span>
                  <span class="text-xs font-bold uppercase tracking-wider mt-1">{{ event.month }}</span>
                </div>
                <div class="flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden hidden sm:block border border-gray-200">
                   <img :src="event.image" :alt="event.title" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 mb-1 hover:text-primary transition-colors cursor-pointer">{{ event.title }}</h4>
                  <p class="text-gray-500 text-sm line-clamp-2">{{ event.desc }}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                <div class="text-center sm:text-right flex-shrink-0 space-y-1">
                  <div class="text-xs text-gray-500 flex items-center justify-center sm:justify-end gap-1.5">
                    <i class="fas fa-map-marker-alt text-primary"></i> {{ event.location }}
                  </div>
                  <div class="text-xs text-gray-500 flex items-center justify-center sm:justify-end gap-1.5">
                    <i class="fas fa-clock text-primary"></i> {{ event.time }}
                  </div>
                </div>
                <button class="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow">
                  Register Now
                </button>
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
import newsImg from '../../../assets/img/News/event1.jpg';
import newsImg1 from '../../../assets/img/News/event.jpg';
import newsImg2 from '../../../assets/img/News/lwam.jpg';
export default {
  name: 'NewsPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      activeCategory: 'All',
      categories: ['All', 'News', 'Events', 'Market', 'Company'],
      
      featuredArticle: { 
        title: 'Sophor Launches New Premium Residential Complex in Mekelle',
        excerpt: 'Our latest development features 120 modern units with state-of-the-art amenities, smart home technology, and sustainable design principles. The complex is set to redefine urban living in Tigray.',
        category: 'Project Launch', 
        date: 'May 20, 2026', 
        readTime: '5 min read', 
        author: 'Sophor Developments',
        image: newsImg2
      },

      newsItems: [
        { title: 'Tigray Real Estate Market Shows Strong Growth in Q1 2026', category: 'Market', date: 'May 15, 2026', readTime: '4 min read', author: 'Market Team', image: newsImg1, excerpt: 'Property values in Mekelle have increased by 18% year-over-year, signaling a robust recovery and strong investment opportunity.' },
        { title: 'Annual Real Estate Investment Forum 2026 — Registration Open', category: 'Event', date: 'May 10, 2026', readTime: '2 min read', author: 'Events Team', image: newsImg, excerpt: 'Join us for our flagship event bringing together investors, developers, and property experts from across Ethiopia.' },
        { title: 'Sophor Introduces Smart Maintenance Request System', category: 'Company', date: 'May 5, 2026', readTime: '3 min read', author: 'Tech Team', image: newsImg2, excerpt: 'Our new digital maintenance portal allows tenants to submit, track, and receive updates on requests in real time.' },
     ],
      upcomingEvents: [
        { day: '05', month: 'JUN', title: 'Annual Real Estate Investment Forum 2026', desc: 'A full-day conference featuring keynote speakers, panel discussions, and networking.', location: 'Axum Hotel, Mekelle', time: '9:00 AM – 6:00 PM', image: newsImg1 },
        { day: '18', month: 'JUN', title: 'Property Expo Mekelle 2026', desc: 'Explore hundreds of property listings and meet developers, agents, and investors.', location: 'Exhibition Center', time: '10:00 AM – 5:00 PM', image: newsImg },
        { day: '02', month: 'JUL', title: 'First-Time Homebuyer Workshop', desc: 'Free workshop covering everything you need to know about buying your first property.', location: 'Sophor Office', time: '2:00 PM – 5:00 PM', image: newsImg1 },
        { day: '15', month: 'JUL', title: 'Property Investment Masterclass', desc: 'Advanced session on investment strategies, ROI analysis, and portfolio building.', location: 'Online (Zoom)', time: '6:00 PM – 8:00 PM', image: newsImg },
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>