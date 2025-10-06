<template>
  <div class="app-container">
    <!-- Filter Form -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="name" label="Name">
          <el-input
            v-model="queryParams.name"
            placeholder="Enter role name"
            clearable
            @keyup.enter="applyFilters"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="applyFilters">Search</el-button>
          <el-button icon="refresh" @click="resetFilters">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Roles Table -->
    <el-card shadow="hover" class="data-table">
      <div class="data-table__toolbar">
        <div class="data-table__toolbar--actions">
          <el-button type="success" icon="plus" @click="openDialog()">Add</el-button>
        </div>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roles"
        highlight-current-row
        border
        class="data-table__content"
      >
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="Name" prop="name" min-width="120" />
        <el-table-column label="Guard Name" prop="guard_name" width="150" />
        <el-table-column fixed="right" label="Actions" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" link icon="edit" @click="openDialog(row.id)">
              Edit
            </el-button>
            <el-button type="danger" size="small" link icon="delete" @click="deleteRole(row.id)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.per_page"
        @pagination="fetchRoles"
      />
    </el-card>

    <!-- Role Dialog -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="closeDialog">
      <el-form
        ref="roleFormRef"
        label-position="top"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" placeholder="Enter role name" />
        </el-form-item>

        <el-form-item label="Guard Name" prop="guard_name">
          <el-input v-model="formData.guard_name" placeholder="Enter guard name" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">Confirm</el-button>
          <el-button @click="closeDialog">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Role, RoleFilters } from "@/interfaces/role";
import RoleAPI from "@/api/roles";

defineOptions({
  name: "Role",
  inheritAttrs: false,
});

const queryFormRef = ref();
const roleFormRef = ref();

const loading = ref(false);
const roles = ref<Role[]>([]);
const total = ref(0);

const queryParams = reactive<RoleFilters>({
  page: 1,
  per_page: 10,
});

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<Partial<Role>>({});

const rules = reactive({
  name: [{ required: true, message: "Please enter a role name.", trigger: "blur" }],
  guard_name: [{ required: true, message: "Please enter a guard name.", trigger: "blur" }],
});

async function fetchRoles() {
  loading.value = true;

  try {
    const result = await RoleAPI.fetchRoles(queryParams);

    roles.value = result.data ?? [];
    total.value = result.meta?.total ?? 0;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  queryParams.page = Number(queryParams.page) || 1;
  fetchRoles();
}

function resetFilters() {
  queryFormRef.value?.resetFields?.();
  queryParams.page = 1;
  applyFilters();
}

function openDialog(id?: number) {
  dialog.visible = true;

  if (id) {
    dialog.title = "Edit Role";

    RoleAPI.getRole(id).then((res) => {
      Object.assign(formData, res.data);
    });
  } else {
    dialog.title = "Add Role";

    resetFormData();
  }
}

function submitForm() {
  roleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      const id = formData.id;
      if (id) {
        await RoleAPI.updateRole(id, formData);
        ElMessage.success("Role updated successfully");
      } else {
        await RoleAPI.createRole(formData);
        ElMessage.success("Role created successfully");
      }
      closeDialog();
      await fetchRoles();
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      loading.value = false;
    }
  });
}

function closeDialog() {
  dialog.visible = false;
  roleFormRef.value?.resetFields?.();
  formData.id = undefined;
}

function resetFormData() {
  Object.keys(formData).forEach((key) => (formData[key as keyof Role] = undefined));
}

async function deleteRole(id: number) {
  ElMessageBox.confirm("Are you sure you want to delete this role?", "Warning", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(
    async () => {
      loading.value = true;
      try {
        await RoleAPI.deleteRole(id);
        ElMessage.success("Role deleted successfully");
        await fetchRoles();
      } catch (error) {
        console.error("Failed to delete role:", error);
      } finally {
        loading.value = false;
      }
    },
    () => {
      ElMessage.info("Delete cancelled");
    }
  );
}

onMounted(fetchRoles);
</script>
