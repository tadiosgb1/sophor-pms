export default {
  data() {
    return {
      loading: false,
      data: null,
    }
  },

  methods: {
    async fetchData() {
      this.loading = true;

      // simulate API
      await new Promise(r => setTimeout(r, 600));

      this.data = {
        message: "Hello from common mixin",
        time: new Date().toLocaleTimeString()
      };

      this.loading = false;
    }
  },

  created() {
    this.fetchData();
  }
}
