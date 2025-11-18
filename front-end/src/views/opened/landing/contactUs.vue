<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">

    <!-- HEADER -->
    <Header />

    <!-- HERO / PAGE TITLE -->
    <section class="relative bg-gradient-to-r from-green-600 via-green-500 to-green-400 py-28 text-center text-white">
      <div class="absolute inset-0 bg-black opacity-25"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
        <p class="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
          Have questions or need assistance? Our team is here to help.
        </p>
      </div>
    </section>

    <!-- CONTACT FORM & INFO -->
    <section class="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

      <!-- CONTACT FORM -->
      <div class="bg-white p-8 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-green-700">Get in Touch</h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Full Name</label>
            <input v-model="form.name" type="text" placeholder="Your Name" class="input" required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" placeholder="you@example.com" class="input" required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Subject</label>
            <input v-model="form.subject" type="text" placeholder="Subject" class="input" required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Message</label>
            <textarea v-model="form.message" rows="5" placeholder="Your message..." class="input" required></textarea>
          </div>

          <button
            type="submit"
            class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition w-full"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- CONTACT INFO -->
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <h3 class="text-xl font-bold mb-4 text-green-700">Address</h3>
          <p class="text-gray-700 mb-2">Addis Ababa,Ethiopia and Mekelle Ethiopia</p>
          <p class="text-gray-700 mb-2">info@sophortechnologies.com</p>
          <p class="text-gray-700"> +251998890220</p>
        </div>

        <!-- Optional: Google Maps Embed -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!..." 
            class="w-full h-64 border-0" 
            allowfullscreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </section>

    <!-- CTA SECTION -->
    <section class="bg-green-600 text-white py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to streamline your property management?</h2>
      <p class="max-w-2xl mx-auto opacity-90">
        Contact us today and see how PMS Suite can transform your real estate operations.
      </p>
      <router-link
        to="/register"
        class="mt-6 inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Get Started
      </router-link>
    </section>

    <!-- FOOTER -->
    <Footer />

  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";

export default {
  components: { Header, Footer },
  data() {
    return {
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const res = await fetch("https://your-api.com/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form),
        });

        if (res.ok) {
          alert("Message sent successfully!");
          this.form = { name: "", email: "", subject: "", message: "" };
        } else {
          alert("Failed to send message. Please try again.");
        }
      } catch (err) {
        alert("Network error. Please try again later.");
      }
    },
  },
};
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400;
}
</style>
