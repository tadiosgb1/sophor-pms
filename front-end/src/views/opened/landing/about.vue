<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Page Hero -->
    <section class="relative pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Story</span>
        <h1 class="text-4xl lg:text-6xl font-black text-white mt-3 mb-5">About Sophor</h1>
        <p class="text-gray-300 text-lg max-w-2xl mx-auto">
          A decade of excellence in real estate — building communities, creating homes, and managing properties with integrity.
        </p>
        <div class="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">About Us</span>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Background</span>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-6 leading-tight">
              From Humble Beginnings to<br /><span class="text-primary">Regional Excellence</span>
            </h2>
            <p class="text-gray-500 leading-relaxed mb-4">
              Founded over a decade ago in the heart of Mekelle, Sophor began as a small property consultancy with a big vision: to transform how real estate is bought, sold, and managed in Tigray. What started with a handful of properties has grown into a comprehensive real estate company managing hundreds of units across the region.
            </p>
            <p class="text-gray-500 leading-relaxed mb-4">
              Our journey has been defined by an unwavering commitment to our clients, a passion for quality, and a belief that every person deserves a place they can call home. We have navigated challenges, celebrated milestones, and continuously evolved to meet the changing needs of our community.
            </p>
            <p class="text-gray-500 leading-relaxed mb-8">
              Today, Sophor stands as a trusted name in Tigray real estate — offering not just properties, but a complete ecosystem of services powered by our state-of-the-art property management system.
            </p>
            <div class="grid grid-cols-3 gap-6">
              <div v-for="s in aboutStats" :key="s.label" class="text-center p-4 bg-gray-50 rounded-2xl">
                <div class="text-2xl font-black text-primary">{{ s.value }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ s.label }}</div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
              <i class="fas fa-city text-8xl text-primary/30"></i>
            </div>
            <div class="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <i class="fas fa-home text-5xl text-gray-400"></i>
            </div>
            <div class="h-40 bg-gradient-to-br from-primary/10 to-primary/30 rounded-2xl flex items-center justify-center">
              <i class="fas fa-handshake text-5xl text-primary/50"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission, Vision, Values -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Foundation</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2">Mission, Vision & Values</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div v-for="mvv in missionVisionValues" :key="mvv.title"
            class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 text-center group">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mx-auto mb-5 transition-all duration-300">
              <i :class="mvv.icon + ' text-2xl text-primary group-hover:text-white transition-colors duration-300'"></i>
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-3">{{ mvv.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ mvv.desc }}</p>
          </div>
        </div>

        <!-- Core Values Grid -->
        <div class="text-center mb-10">
          <h3 class="text-2xl font-black text-gray-900">Our Core Values</h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="val in coreValues" :key="val.title"
            class="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary/30">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <i :class="val.icon + ' text-xl text-primary'"></i>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">{{ val.title }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our People</span>
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Meet Our Leadership Team</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Experienced professionals dedicated to delivering exceptional real estate services.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in team" :key="member.name"
            class="text-center group">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 text-3xl font-black text-primary group-hover:scale-110 transition-transform duration-300">
              {{ member.name[0] }}
            </div>
            <h4 class="font-bold text-gray-900">{{ member.name }}</h4>
            <p class="text-primary text-sm font-medium">{{ member.role }}</p>
            <p class="text-gray-500 text-xs mt-2 leading-relaxed">{{ member.bio }}</p>
            <div class="flex justify-center gap-2 mt-3">
              <a href="#" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-primary flex items-center justify-center transition-all">
                <i class="fab fa-linkedin-in text-xs text-gray-500 hover:text-white"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Advantage</span>
            <h2 class="text-3xl lg:text-4xl font-black mt-2 mb-6">Why Sophor Stands Apart</h2>
            <div class="space-y-5">
              <div v-for="adv in advantages" :key="adv.title" class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <i :class="adv.icon + ' text-primary'"></i>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">{{ adv.title }}</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">{{ adv.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in bigStats" :key="stat.label"
              class="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-primary/50 transition-all">
              <div class="text-3xl font-black text-primary mb-2">{{ stat.value }}</div>
              <div class="text-white font-semibold text-sm">{{ stat.label }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ stat.sub }}</div>
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
  name: 'AboutPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      aboutStats: [
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Properties' },
        { value: '1,200+', label: 'Happy Clients' },
      ],
      missionVisionValues: [
        { icon: 'fas fa-bullseye', title: 'Our Mission', desc: 'To provide exceptional real estate services that empower individuals and businesses to find, manage, and invest in properties with confidence, transparency, and ease.' },
        { icon: 'fas fa-eye', title: 'Our Vision', desc: 'To be the most trusted and innovative real estate company in Tigray, setting the standard for property management excellence across Ethiopia.' },
        { icon: 'fas fa-star', title: 'Our Values', desc: 'We are guided by integrity, excellence, client-centricity, innovation, and community responsibility in everything we do.' },
      ],
      coreValues: [
        { icon: 'fas fa-handshake', title: 'Integrity', desc: 'We operate with complete honesty and transparency in all our dealings.' },
        { icon: 'fas fa-award', title: 'Excellence', desc: 'We pursue the highest standards in every service we provide.' },
        { icon: 'fas fa-users', title: 'Client First', desc: 'Our clients\' needs and satisfaction are at the heart of everything we do.' },
        { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'We embrace technology and creative thinking to solve real estate challenges.' },
        { icon: 'fas fa-leaf', title: 'Sustainability', desc: 'We develop and manage properties with environmental responsibility.' },
        { icon: 'fas fa-balance-scale', title: 'Fairness', desc: 'We ensure equitable treatment for all clients, tenants, and partners.' },
        { icon: 'fas fa-heart', title: 'Community', desc: 'We invest in the communities where we operate and build.' },
        { icon: 'fas fa-shield-alt', title: 'Trust', desc: 'We build lasting relationships based on reliability and accountability.' },
      ],
      team: [
        { name: 'Amanuel Tesfaye', role: 'CEO & Founder', bio: '15+ years in real estate development and investment across Ethiopia.' },
        { name: 'Tigist Hailu', role: 'Head of Operations', bio: 'Expert in property management systems and operational excellence.' },
        { name: 'Berhe Gebremichael', role: 'Chief Financial Officer', bio: 'Seasoned finance professional with deep real estate expertise.' },
        { name: 'Meron Kidane', role: 'Head of Sales', bio: 'Award-winning sales leader with 200+ successful property transactions.' },
      ],
      advantages: [
        { icon: 'fas fa-laptop-code', title: 'Advanced PMS Technology', desc: 'Our proprietary property management system gives you real-time visibility into every aspect of your portfolio.' },
        { icon: 'fas fa-map-marked-alt', title: 'Deep Local Knowledge', desc: 'Over a decade of operating in Tigray gives us unmatched insight into local market dynamics and opportunities.' },
        { icon: 'fas fa-certificate', title: 'Licensed & Certified', desc: 'Fully licensed real estate company operating under Ethiopian real estate regulations with all required certifications.' },
        { icon: 'fas fa-headset', title: 'Dedicated Support', desc: 'Our client support team is available 24/7 to address any concerns, maintenance issues, or inquiries.' },
      ],
      bigStats: [
        { value: '500+', label: 'Properties Managed', sub: 'Across Tigray' },
        { value: '1,200+', label: 'Happy Clients', sub: 'And growing' },
        { value: '98%', label: 'Satisfaction Rate', sub: 'Client surveys' },
        { value: 'ETB 2B+', label: 'Portfolio Value', sub: 'Total managed' },
      ],
    };
  },
};
</script>
