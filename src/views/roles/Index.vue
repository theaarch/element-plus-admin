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
            @click="deleteRoles()"
          >
            Delete
          </el-button>
        </div>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
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
        <el-table-column fixed="right" label="Actions" width="240">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              icon="position"
              @click="handleOpenAssignPermDialog(scope.row)"
            >
              Permissions
            </el-button>
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
              @click="deleteRoles(scope.row.id)"
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
        @pagination="fetchRoles"
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

    <el-drawer
      v-model="assignPermDialogVisible"
      :title="'【' + checkedRole.name + '】权限分配'"
      :size="drawerSize"
    >
      <div class="flex-x-between">
        <el-input v-model="permKeywords" clearable class="w-[150px]" placeholder="菜单权限名称">
          <template #prefix>
            <Search />
          </template>
        </el-input>

        <div class="flex-center ml-5">
          <el-button type="primary" size="small" plain @click="togglePermTree">
            <template #icon>
              <Switch />
            </template>
            {{ isExpanded ? "收缩" : "展开" }}
          </el-button>
          <el-checkbox
            v-model="parentChildLinked"
            class="ml-5"
            @change="handleParentChildLinkedChange"
          >
            父子联动
          </el-checkbox>

          <el-tooltip placement="bottom">
            <template #content>
              如果只需勾选菜单权限，不需要勾选子菜单或者按钮权限，请关闭父子联动
            </template>
            <el-icon class="ml-1 color-[--el-color-primary] inline-block cursor-pointer">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </div>

      <el-tree
        ref="permTreeRef"
        node-key="value"
        show-checkbox
        :data="menuPermOptions"
        :filter-node-method="handlePermFilter"
        :default-expand-all="true"
        :check-strictly="!parentChildLinked"
        class="mt-5"
      >
        <template #default="{ data }">
          {{ data.label }}
        </template>
      </el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAssignPermSubmit">确 定</el-button>
          <el-button @click="assignPermDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app-store";
import { DeviceEnum } from "@/enums/settings/device-enum";
import RoleAPI from "@/api/role-api";
import MenuAPI from "@/api/menu-api";
import { Role, RoleFilters } from "@/interfaces/role";

defineOptions({
  name: "Roles",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const roleFormRef = ref();

const loading = ref(false);
const checkedIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RoleFilters>({
  page: 1,
  per_page: 10,
});

const roleList = ref<Role[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<Partial<Role>>({});

const rules = reactive({
  name: [{ required: true, message: "Please enter name", trigger: "blur" }],
  guard_name: [{ required: true, message: "Please enter guard name", trigger: "blur" }],
});

async function fetchRoles() {
  loading.value = true;

  try {
    const result = await RoleAPI.fetchRoles(queryParams);

    roleList.value = result.data;
    total.value = result.meta.total;
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

  fetchRoles();
}

function handleSelectionChange(selection: any) {
  checkedIds.value = selection.map((item: any) => item.id);
}

function resetFormData() {
  Object.keys(formData).forEach((key) => (formData[key as keyof Role] = undefined));
}

function openDialog(id?: number) {
  dialog.visible = true;

  if (id) {
    dialog.title = "Edit Role";

    RoleAPI.getRole(id).then((result) => {
      Object.assign(formData, result.data);
    });
  } else {
    dialog.title = "Add Role";

    resetFormData();
  }
}

function submitForm() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;

      const id = formData.id;
      if (id) {
        RoleAPI.updateRole(id, formData)
          .then(() => {
            ElMessage.success("Updated successful");
            closeDialog();
            applyFilters();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI.createRole(formData)
          .then(() => {
            ElMessage.success("Created successful");
            closeDialog();
            fetchRoles();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

function closeDialog() {
  dialog.visible = false;

  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
}

function deleteRoles(id?: number) {
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
        await RoleAPI.bulkDeleteRoles(ids);
        ElMessage.success("Deleted successful");
        applyFilters();
      } catch (error) {
        console.error("Failed to delete role(s):", error);
        ElMessage.error("Failed to delete role(s)");
      } finally {
        loading.value = false;
      }
    },
    () => {
      ElMessage.info("Deletion Cancelled");
    }
  );
}

/** Permissions */

const permTreeRef = ref();
const menuPermOptions = ref<OptionType[]>([]);

const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

interface CheckedRole {
  id?: string;
  name?: string;
}

const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);

const permKeywords = ref("");
const isExpanded = ref(true);

const parentChildLinked = ref(true);

async function handleOpenAssignPermDialog(row: Role) {
  const roleId = row.id;
  if (roleId) {
    assignPermDialogVisible.value = true;
    loading.value = true;

    checkedRole.value.id = roleId;
    checkedRole.value.name = row.name;

    // 获取所有的菜单
    const response = await MenuAPI.getOptions();
    menuPermOptions.value = response.data;

    // 回显角色已拥有的菜单
    RoleAPI.getRoleMenuIds(roleId)
      .then((res) => {
        const data = res.data;

        const checkedMenuIds = data;
        checkedMenuIds.forEach((menuId) => permTreeRef.value!.setChecked(menuId, true, false));
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id;

  if (roleId) {
    const checkedMenuIds: number[] = permTreeRef
      .value!.getCheckedNodes(false, true)
      .map((node: any) => node.value);

    loading.value = true;
    RoleAPI.updateRoleMenus(roleId, checkedMenuIds)
      .then(() => {
        ElMessage.success("分配权限成功");
        assignPermDialogVisible.value = false;
        resetFilters();
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

function togglePermTree() {
  isExpanded.value = !isExpanded.value;
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand();
      } else {
        node.collapse();
      }
    });
  }
}

watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any;
  }
) {
  if (!value) return true;
  return data.label.includes(value);
}

function handleParentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}

onMounted(fetchRoles);
</script>
