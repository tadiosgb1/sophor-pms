<template>
  <div class="max-w-4xl mx-auto px-6">

    <h2 class="text-3xl font-bold text-center text-green-800 mb-10">
      Frequently Asked Questions
    </h2>

    <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
      <button
        @click="toggle(index)"
        class="w-full bg-white p-4 shadow rounded-lg flex justify-between items-center"
      >
        <span class="font-medium text-gray-800">{{ faq.question }}</span>
        <span class="text-xl">{{ active === index ? '-' : '+' }}</span>
      </button>

      <div
        v-if="active === index"
        class="p-4 bg-gray-50 border border-gray-200 rounded-b-lg text-gray-700"
      >
        {{ faq.answer }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: null,
      faqs: [
        {
          question: "What is a Property Management System?",
          answer:
            "A PMS helps manage rental properties, sales, tenants, payments, maintenance, documents and reports in one centralized system."
        },
        {
          question: "Can I manage rent and payments online?",
          answer:
            "Yes, the system supports rent tracking, online payments, reminders, and automated invoices."
        },
        {
          question: "Is the system suitable for large real estate companies?",
          answer:
            "Absolutely. PMS Suite supports multi-branch, multi-property, staff roles, and large data operations."
        },
        {
          question: "Can tenants submit maintenance requests?",
          answer:
            "Yes, tenants can submit issues, upload photos, and track progress."
        },
        {
          question: "Does it include reports?",
          answer:
            "Yes, including financial, occupancy, sales, commission, maintenance, and income reports."
        }
      ]
    };
  },
  methods: {
    toggle(i) {
      this.active = this.active === i ? null : i;
    },
  },
};
</script>
