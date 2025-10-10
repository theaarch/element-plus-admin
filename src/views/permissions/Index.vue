<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="name" label="Name">
          <el-input
            v-model="queryParams.name"
            placeholder="Enter name"
            clearable
            @keyup.enter="applyFilters"
          />
        </el-form-item>
        <el-form-item prop="guard_name" label="Guard Name">
          <el-input
            v-model="queryParams.guard_name"
            placeholder="Enter guard name"
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

    <el-card shadow="hover" class="data-table">
      <div class="data-table__toolbar">
        <div class="data-table__toolbar--actions">
          <el-button type="success" icon="plus" @click="openDialog()">Add</el-button>
          <el-button
            type="danger"
            :disabled="checkedIds.length === 0"
            icon="delete"
            @click="deletePermissions()"
          >
            Delete
          </el-button>
        </div>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="permissionsList"
        highlight-current-row
        border
        class="data-table__content"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" />
        <el-table-column label="Name" prop="name" />
        <el-table-column label="Guard Name" prop="guard_name" />
        <el-table-column label="Label" prop="label" />
        <el-table-column fixed="right" label="Actions" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              icon="edit"
              @click="openDialog(scope.row.id)"
            >
              Edit
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              icon="delete"
              @click="deletePermissions(scope.row.id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.per_page"
        @pagination="fetchPermissions"
      />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="closeDialog">
      <el-form ref="roleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" placeholder="Enter name" />
        </el-form-item>

        <el-form-item label="Guard" prop="guard_name">
          <el-input v-model="formData.guard_name" placeholder="Enter guard name" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="closeDialog">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import permissionsApi from "@/api/permissionsApi";
import { Permission, PermissionFilters } from "@/interfaces/permission";

defineOptions({
  name: "Permissions",
  inheritAttrs: false,
});

const queryFormRef = ref();
const roleFormRef = ref();

const loading = ref(false);
const checkedIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<PermissionFilters>({
  page: 1,
  per_page: 10,
});

const permissionsList = ref<Permission[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<Partial<Permission>>({});

const rules = reactive({
  name: [{ required: true, message: "Please enter name", trigger: "blur" }],
  guard_name: [{ required: true, message: "Please enter guard name", trigger: "blur" }],
});

async function fetchPermissions() {
  loading.value = true;

  try {
    const result = await permissionsApi.fetchPermissions(queryParams);

    permissionsList.value = result.data;
    total.value = result.meta.total;
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  queryParams.page = Number(queryParams.page) || 1;

  fetchPermissions();
}

function resetFilters() {
  queryFormRef.value?.resetFields?.();
  queryParams.page = 1;

  fetchPermissions();
}

function handleSelectionChange(selection: any) {
  checkedIds.value = selection.map((item: any) => item.id);
}

function resetFormData() {
  Object.keys(formData).forEach((key) => (formData[key as keyof Permission] = undefined));
}

function openDialog(id?: number) {
  dialog.visible = true;

  if (id) {
    dialog.title = "Edit Permission";

    permissionsApi.getPermission(id).then((result) => {
      Object.assign(formData, result.data);
    });
  } else {
    dialog.title = "Add Permission";

    resetFormData();
  }
}

function submitForm() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;

      const id = formData.id;
      if (id) {
        permissionsApi
          .updatePermission(id, formData)
          .then(() => {
            ElMessage.success("Updated successful");
            closeDialog();
            applyFilters();
          })
          .finally(() => (loading.value = false));
      } else {
        permissionsApi
          .createPermission(formData)
          .then(() => {
            ElMessage.success("Created successful");
            closeDialog();
            fetchPermissions();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

function closeDialog() {
  dialog.visible = false;

  roleFormRef.value?.resetFields?.();
  roleFormRef.value?.clearValidate?.();

  formData.id = undefined;
}

function deletePermissions(id?: number) {
  const ids = id !== undefined ? [id] : checkedIds.value;

  if (!ids || ids.length === 0) {
    ElMessage.warning("Please select item(s)");
    return;
  }

  ElMessageBox.confirm("Are you sure to delete the selected item(s)?", "WARNING", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(
    async () => {
      loading.value = true;

      try {
        await permissionsApi.bulkDeletePermissions(ids);
        ElMessage.success("Deleted successful");
        applyFilters();
      } catch (error) {
        console.error("Failed to delete permission(s):", error);
        ElMessage.error("Failed to delete permission(s)");
      } finally {
        loading.value = false;
      }
    },
    () => {
      ElMessage.info("Deletion Cancelled");
    }
  );
}

onMounted(fetchPermissions);
</script>
