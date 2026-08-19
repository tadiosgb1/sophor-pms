<template>
  <section
    class="py-20 bg-white"
    id="about"
    v-motion
    :initial="{ opacity: 0 }"
    :visible="{ opacity: 1, transition: { duration: 800 } }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <!-- Left: Image -->
        <div
          class="relative"
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible="{
            opacity: 1,
            x: 0,
            transition: { duration: 700 }
          }"
        >
          <div class="rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              :src="aboutImage"
              alt="About Sophor"
              class="w-full h-auto object-contain"
            />
          </div>
        </div>

        <!-- Right: Content -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{
            opacity: 1,
            x: 0,
            transition: { duration: 700, delay: 200 }
          }"
        >
          <span class="text-primary font-semibold text-sm uppercase tracking-widest">
            Who We Are
          </span>

          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-5 leading-tight">
            Building Trust Through<br />
            <span class="text-primary">Premium Real Estate</span>
          </h2>

          <p class="text-gray-500 leading-relaxed mb-6">
            Sophor is a leading real estate company dedicated to providing
            exceptional property solutions. From residential apartments to
            commercial spaces, we manage every aspect of your real estate
            journey with professionalism and care.
          </p>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div
              v-for="(val, index) in coreValues"
              :key="val.title"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 500,
                  delay: 300 + index * 100
                }
              }"
              class="flex items-start gap-3"
            >
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <i :class="val.icon + ' text-primary'"></i>
              </div>

              <div>
                <div class="font-bold text-gray-900 text-sm">
                  {{ val.title }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ val.desc }}
                </div>
              </div>
            </div>
          </div>

          <router-link
            to="/about"
            class="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md"
          >
            Learn More About Us
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import aboutImg from '../../assets/img/logo.png';

export default {
  name: 'AboutSection',
  data() {
    return {
      aboutImage: aboutImg,
      coreValues: [
        { icon: 'fas fa-handshake', title: 'Integrity', desc: 'Honest & transparent' },
        { icon: 'fas fa-award', title: 'Excellence', desc: 'Premium quality always' },
        { icon: 'fas fa-users', title: 'Client First', desc: 'Your needs matter most' },
        { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Modern solutions' },
      ],
    };
  },
};
</script>
