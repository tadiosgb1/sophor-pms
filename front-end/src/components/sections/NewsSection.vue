<template>
  <section class="py-20 bg-gray-50" id="news" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4" 
        v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
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
        <div v-for="(news, index) in newsItems" :key="news.title"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div class="h-44 relative overflow-hidden">
            <img :src="news.image" :alt="news.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
</template>

<script>
import newsImg from '../../assets/img/News/event1.jpg';
import newsImg1 from '../../assets/img/News/event.jpg';
import newsImg2 from '../../assets/img/News/lwam.jpg';
export default {
  name: 'NewsSection',
  data() {
    return {
      newsItems: [
        { 
          category: 'News', 
          date: 'May 20, 2026', 
          title: 'Sophor Launches New Premium Residential Complex in Mekelle', 
          excerpt: 'Our latest development features 120 modern units with state-of-the-art amenities and smart home technology.',
          image: newsImg
        },
        { 
          category: 'Event', 
          date: 'June 5, 2026', 
          title: 'Annual Real Estate Investment Forum 2026', 
          excerpt: 'Join us for our flagship event bringing together investors, developers, and property experts from across Ethiopia.',
          image: newsImg1
        },
        { 
          category: 'Market', 
          date: 'May 15, 2026', 
          title: 'Tigray Real Estate Market Shows Strong Growth in Q1 2026', 
          excerpt: 'Property values in Mekelle have increased by 18% year-over-year, signaling a robust recovery and investment opportunity.',
          image: newsImg2
        },
      ],
    };
  },
};
</script>