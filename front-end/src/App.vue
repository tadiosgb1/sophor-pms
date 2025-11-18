<template>
  <router-view :key="$route.fullPath"></router-view>
    <Toast ref="toast" />
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import Toast from './components/Toast1.vue';
export default {
  components: {
    Toast,
  },
  data() {
    return {
      serviceBanks: [],
      blockBanks: [],
      inactivityTimeout: null, // Timeout for inactivity
      inactivityDuration: 30 * 60 * 1000, // 30 minutes
    };
  },
  created() {
    this.$store.dispatch('fetchBanks');
    setInterval(() => {
      this.$store.dispatch('fetchBanks');
    }, 60000); // Fetch every 60 seconds
  },
  mounted() {
    // Check if the user is already logged in
   // this.checkUserSession();

    // Add global event listeners to track user activity
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keypress', this.resetInactivityTimer);
    document.addEventListener('click', this.resetInactivityTimer);

    // Start the initial inactivity timer
    this.resetInactivityTimer();
  },
  beforeDestroy() {
    // Remove the event listeners to avoid memory leaks
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keypress', this.resetInactivityTimer);
    document.removeEventListener('click', this.resetInactivityTimer);
  },
  methods: {
    resetInactivityTimer() {
      // Clear the previous inactivity timer
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }
      // Start a new inactivity timer
      this.inactivityTimeout = setTimeout(() => {
        this.handleInactivity();
      }, this.inactivityDuration);
    },
    handleInactivity() {
      // Check if the current route requires authentication
      if (this.$route.meta.requiresAuth) {
        console.log('User has been inactive for 30 minutes. Logging out.');
        localStorage.removeItem('token'); // Remove the token from local storage
        this.$router.push('/'); // Redirect to login page
      }
    },

    // checkUserSession() {
    //   // Optionally verify if the token exists and is valid
    //   const token = localStorage.getItem('token');
    //   if (!token) {
    //     this.$router.push('/'); // Redirect to login if no token
    //   }
    // },
  },
};
</script>

<style>
/* Global styles for jTable */
.jtable {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.jtable th,
.jtable td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e2e8f0;
}

.jtable th {
  background-color: #f7fafc;
  font-weight: bold;
}

.jtable tbody tr:hover {
  background-color: #f1f5f9;
}

.jtable tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.jtable .pagination-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.jtable .pagination-btn:hover {
  background-color: #e2e8f0;
}
</style>
