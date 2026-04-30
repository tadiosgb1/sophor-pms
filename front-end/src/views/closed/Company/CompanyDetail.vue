<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading Company..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors shadow-sm"
        >
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Company Detail</h1>
          <p class="text-xs text-gray-400">{{ item.name || '' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="showEditModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <i class="fas fa-pen text-[10px]"></i> Edit
        </button>
        <button
          @click="deleteModalVisible = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <i class="fas fa-trash text-[10px]"></i> Delete
        </button>
      </div>
    </div>

    <template v-if="!loading && item.id">

      <!-- Top identity row -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5 flex items-center gap-5">
        <!-- Logo -->
        <div class="shrink-0">
          <img
            v-if="item.logo"
            :src="item.logo"
            alt="logo"
            class="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
          />
          <div
            v-else
            class="w-16 h-16 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-500 font-bold text-2xl uppercase shadow-sm"
          >
            {{ item.name?.[0] || '?' }}
          </div>
        </div>

        <!-- Name + description + social pills -->
        <div class="flex-1 min-w-0">
          <h2 class="text-base font-bold text-gray-900 truncate">{{ item.name }}</h2>
          <p v-if="item.description" class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ item.description }}</p>

          <!-- Social links -->
          <div class="flex flex-wrap gap-2 mt-3">
            <a v-if="item.website"   :href="item.website"   target="_blank" class="social-pill text-orange-600 bg-orange-50 border-orange-200"><i class="fas fa-globe text-[10px]"></i> Website</a>
            <a v-if="item.facebook"  :href="item.facebook"  target="_blank" class="social-pill text-blue-600 bg-blue-50 border-blue-200"><i class="fab fa-facebook text-[10px]"></i> Facebook</a>
            <a v-if="item.instagram" :href="item.instagram" target="_blank" class="social-pill text-pink-600 bg-pink-50 border-pink-200"><i class="fab fa-instagram text-[10px]"></i> Instagram</a>
            <a v-if="item.linkedin"  :href="item.linkedin"  target="_blank" class="social-pill text-sky-600 bg-sky-50 border-sky-200"><i class="fab fa-linkedin text-[10px]"></i> LinkedIn</a>
            <a v-if="item.twitter"   :href="item.twitter"   target="_blank" class="social-pill text-cyan-600 bg-cyan-50 border-cyan-200"><i class="fab fa-twitter text-[10px]"></i> Twitter</a>
            <a v-if="item.telegram"  :href="item.telegram"  target="_blank" class="social-pill text-indigo-600 bg-indigo-50 border-indigo-200"><i class="fab fa-telegram text-[10px]"></i> Telegram</a>
          </div>
        </div>
      </div>

      <!-- Detail sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Contact -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-address-card text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-phone w-3.5 text-gray-400"></i> Phone</span>
              <span class="detail-value">{{ item.phone || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-envelope w-3.5 text-gray-400"></i> Email</span>
              <span class="detail-value">{{ item.official_email || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-globe w-3.5 text-gray-400"></i> Website</span>
              <a v-if="item.website" :href="item.website" target="_blank" class="text-orange-500 hover:underline truncate">{{ item.website }}</a>
              <span v-else class="detail-value">—</span>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-green-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-map-pin w-3.5 text-gray-400"></i> Address</span>
              <span class="detail-value">{{ item.address || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-location-crosshairs w-3.5 text-gray-400"></i> Latitude</span>
              <span class="detail-value font-mono">{{ item.latitude || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-location-crosshairs w-3.5 text-gray-400"></i> Longitude</span>
              <span class="detail-value font-mono">{{ item.longitude || '—' }}</span>
            </div>
            <div v-if="item.latitude && item.longitude" class="pt-1">
              <a
                :href="`https://www.google.com/maps?q=${item.latitude},${item.longitude}`"
                target="_blank"
                class="inline-flex items-center gap-1.5 text-xs text-green-600 hover:underline"
              >
                <i class="fas fa-external-link-alt text-[10px]"></i> View on Google Maps
              </a>
            </div>
          </div>
        </div>

        <!-- Owner -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-user text-blue-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Owner</span>
          </div>
          <div class="p-5">
            <template v-if="item.User">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm uppercase shrink-0">
                  {{ item.User.first_name?.[0] }}{{ item.User.last_name?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">
                    {{ item.User.first_name }} {{ item.User.middle_name }} {{ item.User.last_name }}
                  </p>
                  <p class="text-xs text-gray-400">{{ item.User.email }}</p>
                  <p class="text-xs text-gray-400">{{ item.User.phone }}</p>
                </div>
              </div>
            </template>
            <p v-else class="text-gray-400 text-xs">Owner ID: {{ item.owner_id || '—' }}</p>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-clock text-purple-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Record Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-plus-circle w-3.5 text-gray-400"></i> Created</span>
              <span class="detail-value">{{ formatDate(item.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-pen-to-square w-3.5 text-gray-400"></i> Updated</span>
              <span class="detail-value">{{ formatDate(item.updatedAt) }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Edit modal -->
    <edit-company
      v-if="showEditModal"
      :data="item"
      @close="showEditModal = false"
      @saved="reload"
    />

    <!-- Delete modal -->
    <delete-confirm-modal
      :visible="deleteModalVisible"
      title="Delete Company"
      message="Are you sure you want to delete this company? This action cannot be undone."
      @confirm="confirmDelete"
      @cancel="deleteModalVisible = false"
    />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditCompany from "./EditCompany.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditCompany, DeleteConfirmModal },

  data() {
    return {
      item: {},
      loading: false,
      showEditModal: false,
      deleteModalVisible: false,
    };
  },

  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById("/company", this.$route.params.id);
        this.item = res || {};
      } catch (e) {
        console.error("load error:", e);
      } finally {
        this.loading = false;
      }
    },

    async confirmDelete() {
      try {
        await this.$apiDelete("/company", this.item.id);
        this.$router.push({ name: "Company-view" });
      } catch (e) {
        console.error("delete error:", e);
      } finally {
        this.deleteModalVisible = false;
      }
    },

    reload() {
      this.showEditModal = false;
      this.loadItem();
    },

    formatDate(ts) {
      if (!ts) return "—";
      return new Date(ts).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    },
  },

  mounted() {
    this.loadItem();
  },
};
</script>

<style scoped>
.detail-row {
  @apply flex items-start justify-between gap-4;
}
.detail-label {
  @apply flex items-center gap-1.5 text-xs text-gray-400 shrink-0 w-28;
}
.detail-value {
  @apply text-gray-800 text-xs text-right;
}
.social-pill {
  @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border hover:opacity-80 transition-opacity;
}
</style>
