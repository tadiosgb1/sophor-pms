<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading payments..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-5 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Payments</h1>
        <p class="text-xs text-gray-400">All rent and sale payments in one place</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400 mb-1">Total Payments</p>
        <p class="text-2xl font-bold text-gray-800">{{ allPayments.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-yellow-200 shadow-sm p-4">
        <p class="text-xs text-yellow-600 mb-1">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-green-200 shadow-sm p-4">
        <p class="text-xs text-green-600 mb-1">Verified</p>
        <p class="text-2xl font-bold text-green-600">{{ verifiedCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-orange-200 shadow-sm p-4">
        <p class="text-xs text-orange-600 mb-1">Total Revenue</p>
        <p class="text-lg font-bold text-orange-600">ETB {{ totalRevenue.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <select v-model="filterType" class="col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300">
          <option value="">All Types</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        <select v-model="filterStatus" class="col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <select v-model="filterMethod" class="col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300">
          <option value="">All Methods</option>
          <option value="telebirr">Telebirr</option>
          <option value="cbebirr">CBE Birr</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
          <option value="screenshot">Screenshot</option>
        </select>
        <input v-model="searchQuery" type="text" placeholder="Search payer, unit, site..."
          class="col-span-2 md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full text-xs">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Type</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Property</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Payer</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Period / Type</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Method</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Date</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="filteredPayments.length === 0">
            <td colspan="9" class="px-4 py-10 text-center text-gray-400 italic">No payments found.</td>
          </tr>
          <tr v-for="pay in filteredPayments" :key="pay._key"
            class="hover:bg-gray-50 transition-colors"
            :class="pay.status === 'rejected' ? 'bg-red-50' : ''">
            <td class="px-4 py-3">
              <span :class="pay._type === 'rent' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'"
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                {{ pay._type }}
              </span>
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-gray-800">{{ pay._unitName }}</p>
              <p class="text-gray-400">{{ pay._siteName }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px] shrink-0">
                  {{ pay._payerInitial }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ pay._payerName }}</p>
                  <p class="text-gray-400">{{ pay._payerPhone }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <p v-if="pay._type === 'rent'" class="text-gray-700">{{ pay._rentPeriod }}</p>
              <p v-else class="text-gray-700 capitalize">{{ pay.payment_type || '-' }}</p>
            </td>
            <td class="px-4 py-3">
              <span :class="methodBadge(pay.payment_method)" class="px-2 py-0.5 rounded-full text-[10px] font-medium">
                {{ formatMethod(pay.payment_method) }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-bold text-gray-900">
              ETB {{ Number(pay.amount).toLocaleString() }}
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(pay.payment_date) }}</td>
            <td class="px-4 py-3">
              <span :class="statusBadge(pay.status)" class="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize">
                {{ pay.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1.5">
                <button v-if="pay.screenshot_url" @click="openLightbox(pay.screenshot_url)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                  title="View receipt">
                  <i class="fas fa-image text-[10px]"></i>
                </button>
                <button v-if="pay.status === 'pending'" @click="approvePayment(pay)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  title="Approve">
                  <i class="fas fa-check text-[10px]"></i>
                </button>
                <button v-if="pay.status === 'pending'" @click="openRejectModal(pay)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  title="Reject">
                  <i class="fas fa-times text-[10px]"></i>
                </button>
                <button v-if="pay.status === 'rejected'" @click="approvePayment(pay)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  title="Approve anyway">
                  <i class="fas fa-rotate-left text-[10px]"></i>
                </button>
                <button @click="goToDetail(pay)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  title="View detail">
                  <i class="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-3">
      <p v-if="filteredPayments.length === 0" class="text-center text-gray-400 italic py-10">No payments found.</p>
      <div v-for="pay in filteredPayments" :key="pay._key"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
        :class="pay.status === 'rejected' ? 'border-red-200 bg-red-50' : ''">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span :class="pay._type === 'rent' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'"
              class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">{{ pay._type }}</span>
            <span :class="statusBadge(pay.status)" class="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize">{{ pay.status }}</span>
          </div>
          <span class="font-bold text-gray-900">ETB {{ Number(pay.amount).toLocaleString() }}</span>
        </div>
        <p class="font-medium text-gray-800 text-xs">{{ pay._unitName }} · {{ pay._siteName }}</p>
        <p class="text-xs text-gray-500 mt-1">
          <i class="fas fa-user text-gray-300 mr-1"></i>{{ pay._payerName }}
          <span v-if="pay._payerPhone"> · {{ pay._payerPhone }}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">
          <span :class="methodBadge(pay.payment_method)" class="px-1.5 py-0.5 rounded text-[10px] font-medium mr-2">{{ formatMethod(pay.payment_method) }}</span>
          {{ formatDate(pay.payment_date) }}
        </p>
        <div v-if="pay.status === 'rejected' && pay.rejection_reason"
          class="mt-2 bg-red-100 border border-red-200 rounded-lg px-3 py-2 text-[10px] text-red-600">
          <i class="fas fa-circle-xmark mr-1"></i>{{ pay.rejection_reason }}
        </div>
        <div class="flex items-center gap-2 mt-3">
          <button v-if="pay.screenshot_url" @click="openLightbox(pay.screenshot_url)"
            class="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100">
            <i class="fas fa-image"></i> Receipt
          </button>
          <button v-if="pay.status === 'pending'" @click="approvePayment(pay)"
            class="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-green-500 text-white rounded-lg hover:bg-green-600">
            <i class="fas fa-check"></i> Approve
          </button>
          <button v-if="pay.status === 'pending'" @click="openRejectModal(pay)"
            class="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-red-500 text-white rounded-lg hover:bg-red-600">
            <i class="fas fa-times"></i> Reject
          </button>
          <button @click="goToDetail(pay)"
            class="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            Detail <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxUrl" @click.self="lightboxUrl = null"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4">
      <div class="relative max-w-3xl w-full">
        <button @click="lightboxUrl = null"
          class="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm flex items-center gap-2">
          <i class="fas fa-times"></i> Close
        </button>
        <img :src="lightboxUrl" class="w-full rounded-xl shadow-2xl max-h-[80vh] object-contain" alt="Receipt" />
        <a :href="lightboxUrl" target="_blank" download
          class="mt-3 flex items-center justify-center gap-2 text-xs text-white hover:text-orange-300 transition-colors">
          <i class="fas fa-download"></i> Download Receipt
        </a>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectingPayment" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden max-h-[90vh] flex flex-col">
        <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-red-50 shrink-0">
          <div class="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
            <i class="fas fa-circle-xmark text-lg"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Reject Payment</h2>
            <p class="text-xs text-gray-500">
              ETB {{ Number(rejectingPayment.amount).toLocaleString() }} · {{ formatMethod(rejectingPayment.payment_method) }}
            </p>
          </div>
        </div>
        <div class="overflow-y-auto flex-1">
          <div v-if="rejectingPayment.screenshot_url" class="px-6 pt-4">
            <p class="text-xs text-gray-400 mb-2">Submitted Receipt</p>
            <button @click="openLightbox(rejectingPayment.screenshot_url)"
              class="relative group block w-full rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 transition-colors">
              <img :src="rejectingPayment.screenshot_url" class="w-full max-h-40 object-cover" alt="Receipt" />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 bg-white text-gray-700 text-xs px-3 py-1 rounded-full shadow transition-opacity">
                  <i class="fas fa-expand mr-1"></i>View Full
                </span>
              </div>
            </button>
          </div>
          <div class="px-6 py-4">
            <label class="block text-xs font-medium text-gray-600 mb-1.5">
              Reason for rejection <span class="text-red-400">*</span>
            </label>
            <textarea v-model="rejectionReason" rows="3"
              placeholder="e.g. Screenshot is blurry, amount mismatch..."
              class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"></textarea>
            <p class="text-[10px] text-gray-400 mt-1">This reason will be visible to the payer.</p>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button @click="rejectingPayment = null; rejectionReason = ''"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 text-sm">Cancel</button>
          <button @click="confirmReject" :disabled="!rejectionReason.trim()"
            class="px-5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="fas fa-times text-xs"></i> Reject Payment
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";

export default {
  name: "PaymentsView",
  components: { Loading },
  data() {
    return {
      loading: false,
      rentPayments: [],
      salePayments: [],
      filterType: "",
      filterStatus: "",
      filterMethod: "",
      searchQuery: "",
      lightboxUrl: null,
      rejectingPayment: null,
      rejectionReason: "",
    };
  },
  computed: {
    allPayments() {
      const rents = this.rentPayments.map((p) => {
        const rent = p.Rent || {};
        const unit = rent.Unit || {};
        const site = rent.Site || {};
        const renter = rent.renter || {};
        const payer = p.payer || renter;
        return {
          ...p,
          _key: "rent-" + p.id,
          _type: "rent",
          _unitName: unit.name || unit.house_number || "Unit #" + (rent.unit_id || ""),
          _siteName: site.name || site.city || "",
          _payerName: payer.first_name ? payer.first_name + " " + payer.last_name : (p.payer_name || "-"),
          _payerPhone: payer.phone || p.payer_phone || "",
          _payerInitial: payer.first_name ? payer.first_name[0] + (payer.last_name ? payer.last_name[0] : "") : "?",
          _rentPeriod: p.cycle_label || (p.cycles_count + " cycle(s)"),
        };
      });
      const sales = this.salePayments.map((p) => {
        const sale = p.Sale || {};
        const unit = sale.Unit || {};
        const site = sale.Site || {};
        const buyer = sale.buyer || {};
        const payer = p.payer || buyer;
        return {
          ...p,
          _key: "sale-" + p.id,
          _type: "sale",
          _unitName: unit.name || unit.house_number || "Unit #" + (sale.unit_id || ""),
          _siteName: site.name || site.city || "",
          _payerName: payer.first_name ? payer.first_name + " " + payer.last_name : (p.payer_name || "-"),
          _payerPhone: payer.phone || p.payer_phone || "",
          _payerInitial: payer.first_name ? payer.first_name[0] + (payer.last_name ? payer.last_name[0] : "") : "?",
          _rentPeriod: p.payment_type || "-",
        };
      });
      return [...rents, ...sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    filteredPayments() {
      return this.allPayments.filter((p) => {
        if (this.filterType && p._type !== this.filterType) return false;
        if (this.filterStatus && p.status !== this.filterStatus) return false;
        if (this.filterMethod && p.payment_method !== this.filterMethod) return false;
        if (this.searchQuery) {
          const q = this.searchQuery.toLowerCase();
          const haystack = [p._payerName, p._unitName, p._siteName, p._payerPhone, p.transaction_ref].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    },
    pendingCount() {
      return this.allPayments.filter((p) => p.status === "pending").length;
    },
    verifiedCount() {
      return this.allPayments.filter((p) => p.status === "verified").length;
    },
    totalRevenue() {
      return this.allPayments
        .filter((p) => p.status === "verified")
        .reduce((s, p) => s + Number(p.amount || 0), 0);
    },
  },
  methods: {
    async loadPayments() {
      this.loading = true;
      try {
        const [rentRes, saleRes] = await Promise.all([
          this.$apiGet("/rentpayment", { page_size: 200 }),
          this.$apiGet("/salepayment", { page_size: 200 }),
        ]);
        this.rentPayments = (rentRes && rentRes.data) ? rentRes.data : (Array.isArray(rentRes) ? rentRes : []);
        this.salePayments = (saleRes && saleRes.data) ? saleRes.data : (Array.isArray(saleRes) ? saleRes : []);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async approvePayment(pay) {
      try {
        const endpoint = pay._type === "rent" ? "/rentpayment/" + pay.id : "/salepayment/" + pay.id;
        await this.$apiPatch(endpoint, "verify", {
          verified_by: parseInt(localStorage.getItem("userId")) || null,
        });
        await this.loadPayments();
      } catch (e) {
        console.error(e);
      }
    },
    openRejectModal(pay) {
      this.rejectingPayment = pay;
      this.rejectionReason = "";
    },
    async confirmReject() {
      if (!this.rejectionReason.trim()) return;
      try {
        const endpoint = this.rejectingPayment._type === "rent"
          ? "/rentpayment/" + this.rejectingPayment.id
          : "/salepayment/" + this.rejectingPayment.id;
        await this.$apiPatch(endpoint, "reject", {
          verified_by: parseInt(localStorage.getItem("userId")) || null,
          rejection_reason: this.rejectionReason,
        });
        this.rejectingPayment = null;
        this.rejectionReason = "";
        await this.loadPayments();
      } catch (e) {
        console.error(e);
      }
    },
    openLightbox(url) {
      this.lightboxUrl = url;
    },
    goToDetail(pay) {
      if (pay._type === "rent") {
        const rentId = pay.Rent ? pay.Rent.id : pay.rent_id;
        this.$router.push({ name: "Rent-detail", params: { id: rentId } });
      } else {
        const saleId = pay.Sale ? pay.Sale.id : pay.sale_id;
        this.$router.push({ name: "Sale-detail", params: { id: saleId } });
      }
    },
    methodBadge(m) {
      const map = {
        telebirr: "bg-blue-100 text-blue-700",
        cbebirr: "bg-yellow-100 text-yellow-700",
        bank_transfer: "bg-indigo-100 text-indigo-700",
        screenshot: "bg-orange-100 text-orange-700",
        cash: "bg-green-100 text-green-700",
      };
      return map[m] || "bg-gray-100 text-gray-500";
    },
    statusBadge(s) {
      const map = {
        pending: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-600",
      };
      return map[s] || "bg-gray-100 text-gray-500";
    },
    formatMethod(m) {
      const map = {
        telebirr: "Telebirr",
        cbebirr: "CBE Birr",
        bank_transfer: "Bank Transfer",
        screenshot: "Screenshot",
        cash: "Cash",
      };
      return map[m] || m || "-";
    },
    formatDate(ts) {
      if (!ts) return "-";
      return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    },
  },
  mounted() {
    this.loadPayments();
  },
};
</script>
