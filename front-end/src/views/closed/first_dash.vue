<template>
  <div class="p-8 space-y-8 bg-slate-50 min-h-full">
    
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-extrabold text-slate-800 tracking-tight">Dashboard</h2>
        <div class="flex gap-2">
          <span class="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-500">Jan 2026 - Present</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-primary/10 rounded-lg text-primary"><i class="fas fa-hand-holding-usd"></i></div>
            <span class="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded">+14% vs LY</span>
          </div>
          <p class="text-slate-500 text-xs font-bold uppercase mt-4">Total Net Revenue</p>
          <h3 class="text-2xl font-black text-slate-800">$842,500.00</h3>
          <div class="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div class="bg-primary h-full w-[78%]"></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-2">78% of Annual Target Achieved</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-secondary/10 rounded-lg text-secondary"><i class="fas fa-door-open"></i></div>
            <span class="text-[10px] font-bold text-slate-400">Stable</span>
          </div>
          <p class="text-slate-500 text-xs font-bold uppercase mt-4">Portfolio Occupancy</p>
          <h3 class="text-2xl font-black text-slate-800">96.4%</h3>
          <p class="text-[10px] text-slate-500 mt-2"><span class="text-primary font-bold">12 Units</span> becoming vacant soon</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-tertiary/10 rounded-lg text-tertiary"><i class="fas fa-chart-pie"></i></div>
            <span class="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2 py-1 rounded">-2.4%</span>
          </div>
          <p class="text-slate-500 text-xs font-bold uppercase mt-4">Expense Ratio</p>
          <h3 class="text-2xl font-black text-slate-800">32.1%</h3>
          <p class="text-[10px] text-slate-400 mt-2">Operating costs vs Gross Income</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start">
            <div class="p-2 bg-slate-100 rounded-lg text-slate-700"><i class="fas fa-user-clock"></i></div>
            <span class="text-[10px] font-bold text-tertiary underline cursor-pointer">View List</span>
          </div>
          <p class="text-slate-500 text-xs font-bold uppercase mt-4">Rent Delinquency</p>
          <h3 class="text-2xl font-black text-slate-800">4.2%</h3>
          <p class="text-[10px] text-slate-400 mt-2">8 Tenants with overdue payments</p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Site Performance & Sales</h3>
            <div class="flex gap-2">
              <button class="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1 rounded transition-colors">By Site</button>
              <button class="text-xs font-bold text-slate-400 hover:bg-slate-50 px-3 py-1 rounded transition-colors">By Manager</button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase font-black text-slate-400 tracking-widest bg-slate-50/50">
                  <th class="px-6 py-4">Site Name</th>
                  <th class="px-6 py-4">Manager</th>
                  <th class="px-6 py-4">Inventory (Units)</th>
                  <th class="px-6 py-4">Sales/Rent Status</th>
                  <th class="px-6 py-4">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="site in sites" :key="site.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-700 text-sm">{{site.name}}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-[10px] flex items-center justify-center font-bold">JD</div>
                      <span class="text-xs text-slate-600">{{site.manager}}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs font-medium text-slate-500">{{site.units}} Units</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div class="bg-primary h-full" :style="{width: site.occupancy + '%'}"></div>
                      </div>
                      <span class="text-[10px] font-black text-slate-700">{{site.occupancy}}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-black text-primary text-sm">${{site.revenue}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i class="fas fa-tools text-secondary"></i> Maintenance Workflow
            </h4>
            <div class="space-y-4">
              <div v-for="task in maintenance" :key="task.label" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span class="text-xs font-bold text-slate-600">{{task.label}}</span>
                <span :class="task.count > 5 ? 'text-tertiary' : 'text-slate-800'" class="text-sm font-black">{{task.count}}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i class="fas fa-warehouse text-primary"></i> Store & Inventory
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500 italic">Critical Stock Alerts</span>
                <span class="text-tertiary font-bold">4 Items</span>
              </div>
              <div class="p-3 border-l-4 border-tertiary bg-tertiary/5 rounded-r-xl">
                <p class="text-[10px] font-bold text-slate-800">HVAC Filters - Central Site</p>
                <p class="text-[10px] text-slate-500">Available: 2 | Min Required: 10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-6">Payment Collection Status</h3>
          <div class="relative flex items-center justify-center py-4">
            <div class="w-32 h-32 rounded-full border-[12px] border-slate-100 flex items-center justify-center relative">
              <div class="absolute inset-0 border-[12px] border-primary rounded-full" style="clip-path: polygon(0 0, 100% 0, 100% 85%, 0 85%);"></div>
              <div class="text-center">
                <p class="text-xl font-black text-slate-800">85%</p>
                <p class="text-[9px] text-slate-400 font-bold uppercase">Collected</p>
              </div>
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-primary"></span> Collected</div>
              <span class="font-bold">$716,125</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-secondary"></span> Scheduled</div>
              <span class="font-bold">$92,400</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-tertiary"></span> Overdue</div>
              <span class="font-bold text-tertiary">$33,975</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
          <h3 class="font-bold text-sm mb-4 opacity-80">Operational Expenses</h3>
          <p class="text-3xl font-black mb-1">$270,442</p>
          <p class="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-6">Current Month Spend</p>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-[10px] mb-1 font-bold">
                <span>Maintenance & Staff</span>
                <span>$142k</span>
              </div>
              <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                <div class="bg-primary h-full w-[60%]"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-[10px] mb-1 font-bold">
                <span>Utilities & Tax</span>
                <span>$98k</span>
              </div>
              <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                <div class="bg-secondary h-full w-[40%]"></div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all border border-white/10">
            Generate Full Financial Report
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardOverview",
  data() {
    return {
      sites: [
        { id: 1, name: "Downtown Heights", manager: "Sarah Connor", units: 120, occupancy: 98, revenue: "24,500" },
        { id: 2, name: "Sunset Gardens", manager: "Marcus Aurel", units: 85, occupancy: 92, revenue: "18,200" },
        { id: 3, name: "North Industrial", manager: "Elena Fisher", units: 45, occupancy: 75, revenue: "42,000" },
        { id: 4, name: "East Side Villas", manager: "Sarah Connor", units: 30, occupancy: 100, revenue: "12,800" },
      ],
      maintenance: [
        { label: "Emergency Repairs", count: 2 },
        { label: "Pending Inspections", count: 14 },
        { label: "Scheduled Cleaning", count: 8 },
        { label: "Awaiting Staff Assignment", count: 3 }
      ]
    };
  }
};
</script>