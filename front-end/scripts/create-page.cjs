/**
 * create-page.cjs
 * Generates Vue3/Tailwind CRUD pages with modal-based Add/Edit, responsive View, Detail pages,
 * updates src/router/index.js with proper routes, and adds page to sidebar.
 * Usage: node create-page.cjs PageName src views closed admin
 */

const fs = require('fs');
const path = require('path');

// Read command line arguments
const args = process.argv.slice(2);
const [pageName, srcFolder, type, apiType, role] = args;

if (!pageName || !srcFolder || !type || !apiType || !role) {
  console.error("Usage: node create-page.cjs PageName src views closed admin");
  process.exit(1);
}

// Utility to capitalize first letter
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// Dynamic field names
const fields = ['Field1', 'Field2', 'Field3'];

// Paths
const baseDir = path.join(process.cwd(), srcFolder, type, apiType, role);
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// ------------------ ADD / EDIT MODAL COMPONENT ------------------
const modalTemplate = (mode) => `
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">${mode} ${capitalize(pageName)}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <form @submit.prevent="submitForm" class="space-y-4">
        ${fields.map(f => `
        <div class="mb-2">
          <label class="block mb-1 text-sm font-medium text-gray-700">${capitalize(f)}</label>
          <input 
            v-model="form.${f}" 
            type="text" 
            required
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
          />
        </div>`).join('')}
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium">${mode}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return { 
      form: {
        ${fields.map(f => `${f}: this.data?.${f} || ''`).join(',\n        ')}
      } 
    };
  },
  methods: {
    async submitForm() {
      try {
        if ('${mode}' === 'Add') {
          await this.$apiPost('/${pageName.toLowerCase()}', this.form);
        } else {
          await this.$apiPatch(\`/${pageName.toLowerCase()}/\${this.data.id}/\`, this.form);
        }
        this.$emit('saved');
        this.$emit('close');
      } catch (err) { console.error(err); }
    }
  }
};
</script>
`;

// ------------------ VIEW PAGE ------------------
const viewTemplate = `
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">${capitalize(pageName)} Overview</h1>
      <button @click="openAddModal" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-150 flex items-center space-x-1 text-sm">
        <span>Add ${capitalize(pageName)}</span>
      </button>
    </div>

    <div class="bg-white overflow-hidden rounded-xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              ${fields.map(f => `<th class="px-6 py-3 text-left">${capitalize(f)}</th>`).join('\n              ')}
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-green-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              ${fields.map(f => `<td class="px-6 py-4 whitespace-nowrap font-semibold text-green-700">{{ item.${f} }}</td>`).join('\n              ')}
              <td class="px-6 py-4 whitespace-nowrap text-center space-x-3">
                <button @click="editItem(item)" class="text-green-500 hover:text-green-700">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td :colspan="${fields.length + 2}" class="text-center py-6 text-gray-400 italic">No ${capitalize(pageName)} found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <add${capitalize(pageName)} v-if="showModal && !editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>
    <edit${capitalize(pageName)} v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>
  </div>
</template>

<script>
import Add${capitalize(pageName)} from './Add${capitalize(pageName)}.vue';
import Edit${capitalize(pageName)} from './Edit${capitalize(pageName)}.vue';

export default {
  components: { Add${capitalize(pageName)}, Edit${capitalize(pageName)} },
  data() {
    return {
      items: [],
      showModal: false,
      editMode: false,
      selectedItem: null
    };
  },
  methods: {
    async fetchItems() {
      try { this.items = (await this.$apiGet('/${pageName.toLowerCase()}')).data || []; }
      catch(err){ console.error(err); this.items = []; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = item; this.showModal = true; },
    async deleteItem(id) { 
      if(confirm('Are you sure?')) { 
        try { await this.$apiDelete(\`/${pageName.toLowerCase()}/\${id}/\`); this.fetchItems(); } 
        catch(err){ console.error(err); }
      }
    }
  },
  mounted() { this.fetchItems(); }
};
</script>
`;

// ------------------ DETAIL PAGE ------------------
const detailTemplate = `
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <div class="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">${capitalize(pageName)} Details</h2>
        <button @click="$router.back()" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div class="space-y-3">
        <div><span class="font-medium text-gray-600">ID:</span> <span class="font-semibold text-green-700">{{ item.id }}</span></div>
        ${fields.map(f => `<div><span class="font-medium text-gray-600">${capitalize(f)}:</span> <span class="font-semibold text-green-700">{{ item.${f} }}</span></div>`).join('\n        ')}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    try { this.item = (await this.$apiGet(\`/${pageName.toLowerCase()}/\${id}/\`)).data || {}; }
    catch(err){ console.error(err); }
  }
};
</script>
`;

// ------------------ WRITE FILES ------------------
fs.writeFileSync(path.join(baseDir, `Add${capitalize(pageName)}.vue`), modalTemplate('Add'));
fs.writeFileSync(path.join(baseDir, `Edit${capitalize(pageName)}.vue`), modalTemplate('Edit'));
fs.writeFileSync(path.join(baseDir, `${capitalize(pageName)}View.vue`), viewTemplate);
fs.writeFileSync(path.join(baseDir, `${capitalize(pageName)}Detail.vue`), detailTemplate);

console.log(`✅ Generated modal-based CRUD pages for ${capitalize(pageName)} in ${baseDir}`);

// ------------------ UPDATE ROUTER ------------------
const routerPath = path.join(process.cwd(), srcFolder, 'router', 'index.js');

if (fs.existsSync(routerPath)) {
  let routerContent = fs.readFileSync(routerPath, 'utf8');

  const routeSnippet = `
      {
        path: "${role.toLowerCase()}",
        name: "${capitalize(pageName)}-view",
        component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}View.vue'),
      },
      {
        path: "${role.toLowerCase()}/add",
        name: "${capitalize(pageName)}-add",
        component: () => import('../${type}/${apiType}/${role}/Add${capitalize(pageName)}.vue'),
      },
      {
        path: "${role.toLowerCase()}/edit/:id",
        name: "${capitalize(pageName)}-edit",
        component: () => import('../${type}/${apiType}/${role}/Edit${capitalize(pageName)}.vue'),
        props: true,
      },
      {
        path: "${role.toLowerCase()}/detail/:id",
        name: "${capitalize(pageName)}-detail",
        component: () => import('../${type}/${apiType}/${role}/${capitalize(pageName)}Detail.vue'),
        props: true,
      },`;

  routerContent = routerContent.replace(/children:\s*\[/, `children: [${routeSnippet}\n`);

  fs.writeFileSync(routerPath, routerContent);
  console.log(`✅ Router updated with ${capitalize(pageName)} routes.`);
} else {
  console.warn(`⚠ Router file not found at ${routerPath}. Skipping route injection.`);
}

// ------------------ UPDATE SIDEBAR ------------------
const sidebarPath = path.join(process.cwd(), srcFolder, 'components', 'layouts', 'leftSidevar.vue');

if (fs.existsSync(sidebarPath)) {
  let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

  const sidebarSnippet = `{
      name: "${capitalize(pageName)}",
      route: "${capitalize(pageName)}-view",
      icon: "fas fa-folder",
      color: "#f97316"
  },`;

  sidebarContent = sidebarContent.replace(/(menuItems:\s*\[)/, `$1\n${sidebarSnippet}\n`);

  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log(`✅ Sidebar updated with ${capitalize(pageName)} as top-level menu item.`);
} else {
  console.warn(`⚠ Sidebar file not found at ${sidebarPath}. Skipping sidebar update.`);
}
