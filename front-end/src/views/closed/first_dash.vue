<template>
<div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
  <Loading :visible="loading" message="Loading dashboard..." />
  <!-- ADMIN DASHBOARD -->
  <div v-if="isAdmin">
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-xs text-gray-400 mt-0.5">Welcome back, {{ userName }} · {{ currentMonth }}</p>
      </div>
      <button @click="loadData" class="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors">
        <i class="fas fa-rotate-right"></i> Refresh
      </button>
    </div>
    <!-- KPI CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500"><i class="fas fa-money-bill-wave text-sm"></i></div>
          <span class="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">This Month</span>
        </div>
        <p class="text-xs text-gray-400">Total Revenue</p>
        <p class="text-xl font-bold text-gray-900 mt-0.5">ETB {{ fmt(stats.revenue?.thisMonth?.total) }}</p>
        <p class="text-[10px] text-gray-400 mt-1">All time: ETB {{ fmt(stats.revenue?.allTime?.total) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500"><i class="fas fa-door-open text-sm"></i></div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" :class="occupancyRate >= 80 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'">{{ occupancyRate }}% occupied</span>
        </div>
        <p class="text-xs text-gray-400">Units</p>
        <p class="text-xl font-bold text-gray-900 mt-0.5">{{ stats.units?.total || 0 }}</p>
        <p class="text-[10px] text-gray-400 mt-1">{{ stats.units?.available || 0 }} available · {{ stats.units?.rented || 0 }} rented · {{ stats.units?.sold || 0 }} sold</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500"><i class="fas fa-house-user text-sm"></i></div>
          <span v-if="stats.rents?.overdue" class="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">{{ stats.rents.overdue }} overdue</span>
        </div>
        <p class="text-xs text-gray-400">Active Rentals</p>
        <p class="text-xl font-bold text-gray-900 mt-0.5">{{ stats.rents?.active || 0 }}</p>
        <p class="text-[10px] text-gray-400 mt-1">{{ stats.pendingPayments?.rent || 0 }} payments pending review</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600"><i class="fas fa-handshake text-sm"></i></div>
          <span class="text-[10px] text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-full">{{ stats.sales?.pending || 0 }} pending</span>
        </div>
        <p class="text-xs text-gray-400">Sales</p>
        <p class="text-xl font-bold text-gray-900 mt-0.5">{{ stats.sales?.total || 0 }}</p>
        <p class="text-[10px] text-gray-400 mt-1">{{ stats.sales?.completed || 0 }} completed · ETB {{ fmt(stats.revenue?.thisMonth?.sale) }} this month</p>
      </div>
    </div>
    <!-- ROW 2 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center gap-2 mb-3"><div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500"><i class="fas fa-wrench text-xs"></i></div><span class="text-xs font-semibold text-gray-600">Maintenance</span></div>
        <div class="space-y-1.5">
          <div class="flex justify-between text-xs"><span class="text-gray-400">Pending</span><span class="font-semibold text-yellow-600">{{ stats.maintenance?.pending || 0 }}</span></div>
          <div class="flex justify-between text-xs"><span class="text-gray-400">In Progress</span><span class="font-semibold text-blue-600">{{ stats.maintenance?.inProgress || 0 }}</span></div>
          <div class="flex justify-between text-xs"><span class="text-gray-400">Resolved</span><span class="font-semibold text-green-600">{{ stats.maintenance?.resolved || 0 }}</span></div>
          <div v-if="stats.maintenance?.urgent" class="flex justify-between text-xs"><span class="text-red-500 font-semibold">Urgent</span><span class="font-bold text-red-600">{{ stats.maintenance.urgent }}</span></div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center gap-2 mb-3"><div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500"><i class="fas fa-map-pin text-xs"></i></div><span class="text-xs font-semibold text-gray-600">Sites</span></div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.sites?.total || 0 }}</p>
        <p class="text-[10px] text-gray-400 mt-1">{{ stats.sites?.active || 0 }} active sites</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center gap-2 mb-3"><div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500"><i class="fas fa-receipt text-xs"></i></div><span class="text-xs font-semibold text-gray-600">Expenses</span></div>
        <p class="text-xl font-bold text-red-500">ETB {{ fmt(stats.expenses?.thisMonth) }}</p>
        <p class="text-[10px] text-gray-400 mt-1">This month</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="flex items-center gap-2 mb-3"><div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-500"><i class="fas fa-clock text-xs"></i></div><span class="text-xs font-semibold text-gray-600">Pending Reviews</span></div>
        <div class="space-y-1.5">
          <div class="flex justify-between text-xs"><span class="text-gray-400">Rent Payments</span><span class="font-semibold text-orange-600">{{ stats.pendingPayments?.rent || 0 }}</span></div>
          <div class="flex justify-between text-xs"><span class="text-gray-400">Sale Payments</span><span class="font-semibold text-orange-600">{{ stats.pendingPayments?.sale || 0 }}</span></div>
        </div>
      </div>
    </div>
    <!-- SITE PERFORMANCE TABLE -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <i class="fas fa-map-location-dot text-orange-400 text-xs"></i>
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Site Performance</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs divide-y divide-gray-100">
            <thead class="bg-gray-50 text-[10px] uppercase text-gray-400 font-semibold tracking-wide">
              <tr>
                <th class="px-4 py-2.5 text-left">Site</th>
                <th class="px-4 py-2.5 text-left">Manager</th>
                <th class="px-4 py-2.5 text-left">Units</th>
                <th class="px-4 py-2.5 text-left">Occupancy</th>
                <th class="px-4 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="site in stats.siteStats" :key="site.id" class="hover:bg-orange-50 transition-colors">
                <td class="px-4 py-2.5 font-medium text-gray-800">{{ site.name }}</td>
                <td class="px-4 py-2.5 text-gray-500">{{ site.manager }}</td>
                <td class="px-4 py-2.5 text-gray-600">{{ site.totalUnits }}</td>
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                      <div class="h-full rounded-full" :class="site.occupancy >= 80 ? 'bg-green-500' : site.occupancy >= 50 ? 'bg-orange-400' : 'bg-red-400'" :style="{ width: site.occupancy + '%' }"></div>
                    </div>
                    <span class="font-semibold text-gray-700">{{ site.occupancy }}%</span>
                  </div>
                </td>
                <td class="px-4 py-2.5">
                  <span :class="site.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ site.status }}</span>
                </td>
              </tr>
              <tr v-if="!stats.siteStats?.length"><td colspan="5" class="px-4 py-6 text-center text-gray-400 italic">No sites found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- EXPENSE BREAKDOWN -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <i class="fas fa-chart-pie text-purple-400 text-xs"></i>
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Expenses by Category</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="exp in stats.expenses?.byCategory" :key="exp.category" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>
              <span class="text-xs text-gray-600">{{ exp.category }}</span>
            </div>
            <span class="text-xs font-semibold text-gray-800">ETB {{ fmt(exp.total) }}</span>
          </div>
          <div v-if="!stats.expenses?.byCategory?.length" class="text-center text-gray-400 text-xs italic py-4">No expenses this month.</div>
        </div>
      </div>
    </div>
    <!-- RECENT ACTIVITY -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <!-- Recent Rents -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2"><i class="fas fa-house-user text-pink-400 text-xs"></i><span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Recent Rentals</span></div>
          <button @click="$router.push({ name: 'Rent-view' })" class="text-xs text-orange-500 hover:underline">View all</button>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="rent in stats.recentRents" :key="rent.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800 text-xs">{{ rent.Unit?.name || '—' }}</p>
              <p class="text-[10px] text-gray-400">{{ rent.renter?.first_name }} {{ rent.renter?.last_name }} · {{ rent.Site?.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-800">ETB {{ fmt(rent.rent_amount) }}</p>
              <span :class="rent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize">{{ rent.status }}</span>
            </div>
          </div>
          <div v-if="!stats.recentRents?.length" class="px-5 py-6 text-center text-gray-400 text-xs italic">No recent rentals.</div>
        </div>
      </div>
      <!-- Recent Sales -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2"><i class="fas fa-handshake text-yellow-500 text-xs"></i><span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Recent Sales</span></div>
          <button @click="$router.push({ name: 'Sale-view' })" class="text-xs text-orange-500 hover:underline">View all</button>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="sale in stats.recentSales" :key="sale.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800 text-xs">{{ sale.Unit?.name || '—' }}</p>
              <p class="text-[10px] text-gray-400">{{ sale.buyer?.first_name }} {{ sale.buyer?.last_name }} · {{ sale.Site?.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-800">ETB {{ fmt(sale.sale_price) }}</p>
              <span :class="sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize">{{ sale.status }}</span>
            </div>
          </div>
          <div v-if="!stats.recentSales?.length" class="px-5 py-6 text-center text-gray-400 text-xs italic">No recent sales.</div>
        </div>
      </div>
    </div>
    <!-- LOW STOCK -->
    <div v-if="stats.lowStockItems?.length" class="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden mb-6">
      <div class="px-5 py-3 border-b border-red-100 bg-red-50 flex items-center gap-2">
        <i class="fas fa-triangle-exclamation text-red-500 text-xs"></i>
        <span class="text-xs font-semibold text-red-700 uppercase tracking-wide">Low Stock Alerts</span>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="item in stats.lowStockItems" :key="item.id" class="px-5 py-3 flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800 text-xs">{{ item.description }}</p>
            <p class="text-[10px] text-gray-400">{{ item.Site?.name }}</p>
          </div>
          <span class="text-xs font-bold text-red-600">{{ item.quantity }} {{ item.unit }} left</span>
        </div>
      </div>
    </div>
  </div>
  <!-- TENANT DASHBOARD -->
  <div v-else-if="isTenant">
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">My Dashboard</h1>
        <p class="text-xs text-gray-400 mt-0.5">Welcome, {{ userName }}</p>
      </div>
      <button @click="loadData" class="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors">
        <i class="fas fa-rotate-right"></i> Refresh
      </button>
    </div>
    <!-- TENANT KPI CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500 mb-3"><i class="fas fa-house-user text-sm"></i></div>
        <p class="text-xs text-gray-400">Active Rentals</p>
        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ tenantStats.summary?.activeRents || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 mb-3"><i class="fas fa-handshake text-sm"></i></div>
        <p class="text-xs text-gray-400">My Purchases</p>
        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ tenantStats.summary?.totalPurchases || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-3"><i class="fas fa-money-bill-wave text-sm"></i></div>
        <p class="text-xs text-gray-400">Total Paid (Rent)</p>
        <p class="text-lg font-bold text-gray-900 mt-0.5">ETB {{ fmt(tenantStats.summary?.totalPaidRent) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 mb-3"><i class="fas fa-clock text-sm"></i></div>
        <p class="text-xs text-gray-400">Pending Payments</p>
        <p class="text-2xl font-bold text-orange-500 mt-0.5">{{ (tenantStats.summary?.pendingRentCount || 0) + (tenantStats.summary?.pendingSaleCount || 0) }}</p>
      </div>
    </div>
    <!-- MY RENTALS -->
    <div v-if="tenantStats.myRents?.length" class="mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><i class="fas fa-house-user text-pink-400"></i> My Rentals</h2>
      <div class="space-y-4">
        <div v-for="rent in tenantStats.myRents" :key="rent.id" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100">
            <div>
              <p class="font-semibold text-gray-800">{{ rent.Unit?.name }}</p>
              <p class="text-xs text-gray-400">{{ rent.Site?.name }} · {{ rent.rent_period }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">ETB {{ fmt(rent.rent_amount) }}<span class="text-xs text-gray-400 font-normal"> / {{ rent.rent_period }}</span></p>
              <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{{ rent.status }}</span>
            </div>
          </div>
          <!-- Payment history for this rent -->
          <div v-if="rent.payments?.length" class="px-5 py-3">
            <p class="text-[10px] text-gray-400 uppercase font-semibold tracking-wide mb-2">Recent Payments</p>
            <div class="space-y-1.5">
              <div v-for="pay in rent.payments.slice(0,3)" :key="pay.id" class="flex items-center justify-between text-xs">
                <span class="text-gray-600 font-medium">{{ pay.cycle_label }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-gray-700">ETB {{ fmt(pay.amount) }}</span>
                  <span :class="pay.status === 'verified' ? 'bg-green-100 text-green-700' : pay.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ pay.status }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="px-5 py-2 bg-gray-50 flex items-center justify-between">
            <span class="text-[10px] text-gray-400">Next due: <strong :class="isDateOverdue(rent.next_due_date) ? 'text-red-600' : 'text-gray-700'">{{ formatDate(rent.next_due_date) }}</strong></span>
            <button @click="$router.push({ name: 'Rent-detail', params: { id: rent.id } })" class="text-[10px] text-orange-500 hover:underline">View details →</button>
          </div>
        </div>
      </div>
    </div>
    <!-- MY PURCHASES -->
    <div v-if="tenantStats.mySales?.length" class="mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><i class="fas fa-handshake text-yellow-500"></i> My Purchases</h2>
      <div class="space-y-3">
        <div v-for="sale in tenantStats.mySales" :key="sale.id" class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-800">{{ sale.Unit?.name }}</p>
            <p class="text-xs text-gray-400">{{ sale.Site?.name }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-gray-500">Paid: ETB {{ fmt(sale.payments?.filter(p => p.status === 'verified').reduce((s,p) => s + Number(p.amount||0), 0)) }}</span>
              <span class="text-[10px] text-gray-400">/ ETB {{ fmt(sale.sale_price) }}</span>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900">ETB {{ fmt(sale.sale_price) }}</p>
            <span :class="sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize">{{ sale.status }}</span>
            <div class="mt-1"><button @click="$router.push({ name: 'Sale-detail', params: { id: sale.id } })" class="text-[10px] text-orange-500 hover:underline">View →</button></div>
          </div>
        </div>
      </div>
    </div>
    <!-- MY MAINTENANCE -->
    <div v-if="tenantStats.myMaintenance?.length" class="mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><i class="fas fa-wrench text-red-400"></i> My Maintenance Requests</h2>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div v-for="req in tenantStats.myMaintenance" :key="req.id" class="px-5 py-3 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div :class="priorityDot(req.priority)" class="w-2 h-2 rounded-full mt-1.5 shrink-0"></div>
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ req.title }}</p>
                <p class="text-[10px] text-gray-400">{{ req.category }} · {{ req.unit?.name || req.site?.name }}</p>
              </div>
            </div>
            <span :class="maintenanceBadge(req.status)" class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize shrink-0">{{ req.status.replace('_',' ') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- PENDING PAYMENTS ALERT -->
    <div v-if="(tenantStats.summary?.pendingRentCount || 0) + (tenantStats.summary?.pendingSaleCount || 0) > 0" class="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
      <i class="fas fa-triangle-exclamation text-orange-500 mt-0.5"></i>
      <div>
        <p class="font-semibold text-orange-700 text-xs">Payments Awaiting Verification</p>
        <p class="text-[10px] text-orange-600 mt-0.5">You have {{ (tenantStats.summary?.pendingRentCount || 0) + (tenantStats.summary?.pendingSaleCount || 0) }} payment(s) submitted and waiting for manager approval.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loading from "@/components/Loading.vue";

export default {
  name: "Dashboard",
  components: { Loading },
  data() {
    return {
      loading: false,
      stats: {},
      tenantStats: {},
      roles: [],
      userId: null,
      userName: "",
      currentMonth: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    };
  },
  computed: {
    isAdmin() {
      const adminRoles = ["super", "owner", "manager", "staff"];
      return this.roles.some(r => adminRoles.includes(r.toLowerCase()));
    },
    isTenant() {
      if (this.isAdmin) return false;
      const tenantRoles = ["tenant", "renter", "buyer"];
      return this.roles.some(r => tenantRoles.includes(r.toLowerCase()));
    },
    occupancyRate() {
      const total = this.stats.units?.total || 0;
      const rented = this.stats.units?.rented || 0;
      const sold = this.stats.units?.sold || 0;
      if (!total) return 0;
      return Math.round(((rented + sold) / total) * 100);
    },
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        if (this.isAdmin) {
          this.stats = await this.$apiGet("/dashboard/admin");
        } else if (this.isTenant) {
          this.tenantStats = await this.$apiGet(`/dashboard/tenant/${this.userId}`);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        this.loading = false;
      }
    },
    fmt(val) {
      if (val === null || val === undefined) return "0";
      return Number(val).toLocaleString();
    },
    formatDate(ts) {
      if (!ts) return "—";
      return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    },
    isDateOverdue(ts) {
      return ts && new Date(ts) < new Date();
    },
    priorityDot(p) {
      return { urgent: "bg-red-500", high: "bg-orange-500", medium: "bg-yellow-400", low: "bg-gray-400" }[p] || "bg-gray-400";
    },
    maintenanceBadge(s) {
      return { pending: "bg-yellow-100 text-yellow-700", in_progress: "bg-blue-100 text-blue-700", resolved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-600" }[s] || "bg-gray-100 text-gray-500";
    },
  },
  mounted() {
    this.userId = parseInt(localStorage.getItem("userId"));
    this.userName = localStorage.getItem("name") || "User";
    try {
      const raw = localStorage.getItem("roles");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.roles = parsed.map(r => (typeof r === "string" ? r : r.name)).filter(Boolean);
      }
    } catch {
      // fallback: try splitting comma-separated string (old format)
      const raw = localStorage.getItem("roles") || "";
      this.roles = raw.split(",").map(r => r.trim()).filter(Boolean);
    }
    this.loadData();
  },
};
</script>
