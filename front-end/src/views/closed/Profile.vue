<template>
  <div>
     <Toast ref="toast" />
  <div
    v-if="visible"
   class="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-auto"
  >
    <div
     class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto"
    >
       <div class="bg-primary text-white px-6 py-4 flex justify-between items-center text-xl font-semibold">
        Update Profile
        <button @click="$emit('close')" class="text-white font-bold">✕</button>
      </div>

      <form @submit.prevent="updateProfile" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- First Name -->
  <div>
    <label class="block text-gray-700">First Name</label>
    <input v-model="form.first_name" type="text" class="custom-input" />
  </div>

  <!-- Middle Name -->
  <div>
    <label class="block text-gray-700">Middle Name</label>
    <input v-model="form.middle_name" type="text" class="custom-input" />
  </div>

  <!-- Last Name -->
  <div>
    <label class="block text-gray-700">Last Name</label>
    <input v-model="form.last_name" type="text" class="custom-input" />
  </div>

  <!-- Email -->
  <div>
    <label class="block text-gray-700">Email</label>
    <input v-model="form.email" type="email" class="custom-input" />
  </div>

  <!-- Phone Number -->
  <div>
    <label class="block text-gray-700">Phone Number</label>
    <input v-model="form.phone_number" type="text" class="custom-input" />
  </div>

  <!-- Address -->
  <div>
    <label class="block text-gray-700">Address</label>
    <input v-model="form.address" type="text" class="custom-input" />
  </div>

  <!-- Save Button (full width row, aligned right) -->
  <div class="md:col-span-2 text-right mt-4">
    <button type="submit" class="bg-primary hover:bg-primary text-white px-6 py-2 rounded">
      Update
    </button>
  </div>
</form>


    </div>
  </div>
  </div>
</template>

<script>

import Toast from "../../components/Toast.vue";
export default {
  name: "Profile",
    components:{Toast},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
      },
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadProfile();
      }
    },
  },
  methods: {
    async loadProfile() {
      try {
        const id = localStorage.getItem("userId");
        const res = await this.$apiGet(`/get_user/${id}`);
        //this.form = res;
        this.form.email=res.email;
        this.form.first_name=res.first_name;
        this.form.last_name=res.last_name;
        this.form.middle_name=res.middle_name;
        this.form.phone_number=res.phone_number;
        this.form.address=res.address;



      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    },
    async updateProfile() {
      try {
        const id = localStorage.getItem("userId");

        console.log("this form",this.form);

       const res = await this.$apiPatch(`/old_update_user`, id, this.form);
         if(res && res.error){
 this.$root.$refs.toast.showToast(
          res.error || "Failed to update profile ",
          "error"
        );
         this.$emit("close");
        } else {
        this.$root.$refs.toast.showToast(
          "Profile updated successfully ",
          "success"
        );
      this.$emit("updated", this.form);
        this.$emit("close");
        }
        
       
      } catch (err) {
        console.error("Update failed", err);
       this.$root.$refs.toast.showToast(
         "Failed to update profile ",
          "error"
        );
      }
    },
  },
};
</script>
