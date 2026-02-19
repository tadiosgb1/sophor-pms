<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Secure Payment</h2>

    <form @submit.prevent="payNow" class="space-y-5">

      <!-- Customer Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          v-model="form.full_name"
          type="text"
          required
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          placeholder="John Doe"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          placeholder="email@example.com"
        />
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Phone Number</label>
        <input
          v-model="form.phone"
          type="text"
          required
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          placeholder="+251 912 345 678"
        />
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Amount (ETB)</label>
        <input
          v-model="form.amount"
          type="number"
          min="1"
          required
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          placeholder="100.00"
        />
      </div>

      <!-- Currency -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Currency</label>
        <select
          v-model="form.currency"
          class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="ETB">ETB - Ethiopian Birr</option>
          <option value="USD">USD - US Dollar</option>
        </select>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Pay Now
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        full_name: "",
        email: "",
        phone: "",
        amount: "",
        currency: "ETB",
      }
    };
  },

  methods: {
    async payNow() {
      try {
        const response = await fetch("http://localhost:3000/generate-signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.form),
        });

        const data = await response


        console.log("data",data);
        // Create Hosted Checkout Form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://testsecureacceptance.cybersource.com/pay";

        Object.keys(data).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (e) {
        console.error("Payment error:", e);
      }
    },
  },
};
</script>
