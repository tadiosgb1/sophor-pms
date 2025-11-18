<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
      >
        Add New Super Staff User
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-2xl"
        >
          &times;
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Row 1: Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              required
              placeholder="John"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Middle Name</label>
            <input
              v-model="form.middle_name"
              type="text"
              placeholder="Michael"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              required
              placeholder="Doe"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <!-- Row 2: Email & Phone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="john@example.com"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="text"
              placeholder="+251912345678"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <!-- Row 3: Password & Address -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Address</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Addis Ababa, Ethiopia"
              class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <!-- Flags -->
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="form.is_active" class="mr-2" /> Active
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="form.is_staff" class="mr-2" /> Staff
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="form.is_superuser" class="mr-2" /> Superuser
          </label>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUserModal",
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        password: "",
        last_login: new Date().toISOString(),
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        date_joined: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        // 1. Create the user
        const payload = { ...this.form };
        const res = await this.$apiPost("/post_user", payload);
         console.log("res sign up",res);
        // if (!res || !res.id) {
        //   throw new Error("User creation failed: No ID returned.");
        // }

        console.log("User created:", res);

        // 2. Assign to super_staff group
        const groupPayload = {
          user_id: res.id,
          groups: ["super_staff"],
        };

        console.log("Assigning groups:", groupPayload);

        const resAsign=await this.$apiPost("/set_user_groups", groupPayload);
       
        if(resAsign){
          this.$root.$refs.toast.showToast("Successfully  Created", "success");
        }
        // 3. Emit events to parent
        this.$emit("success"); // refresh parent users
        this.$emit("close");   // close modal
      } catch (error) {
        console.error("Failed to create user or assign group:", error);
        alert("Failed to create user or assign to super_staff group.");
      }
    },
  },
};
</script>
