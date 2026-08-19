<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Section Components -->
    <HeroSection />
    <FeaturesStrip />
    <FeaturedProperties />
    <AboutSection />
    <FeaturesSection />
    <TestimonialsSection />
    <NewsSection />
    <FaqSection />
    <ContactCta />

    <LandingFooter />
  </div>
</template>

<script>
import LandingNavbar from '../../../components/LandingNavbar.vue';
import LandingFooter from '../../../components/LandingFooter.vue';
import HeroSection from '../../../components/sections/HeroSection.vue';
import FeaturesStrip from '../../../components/sections/FeaturesStrip.vue';
import FeaturedProperties from '../../../components/sections/FeaturedProperties.vue';
import AboutSection from '../../../components/sections/AboutSection.vue';
import FeaturesSection from '../../../components/sections/FeaturesSection.vue';
import TestimonialsSection from '../../../components/sections/TestimonialsSection.vue';
import NewsSection from '../../../components/sections/NewsSection.vue';
import FaqSection from '../../../components/sections/FaqSection.vue';
import ContactCta from '../../../components/sections/ContactCta.vue';

export default {
  name: 'LandingHome',
  components: { 
    LandingNavbar, 
    LandingFooter,
    HeroSection,
    FeaturesStrip,
    FeaturedProperties,
    AboutSection,
    FeaturesSection,
    TestimonialsSection,
    NewsSection,
    FaqSection,
    ContactCta
  },
};
</script>
