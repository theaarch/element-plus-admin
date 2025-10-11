<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="filtersForm" :model="queryParams" :inline="true">
        <el-form-item prop="created_at" label="Created At">
          <el-date-picker
            v-model="queryParams.created_at"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :default-time="dateTimeRangeDefaultTime()"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" :loading="tableLoading" @click="applyFilters">
            Search
          </el-button>
          <el-button icon="refresh" @click="resetFilters">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="data-table">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        highlight-current-row
        border
        class="data-table__content"
      >
        <el-table-column
          v-for="col in tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
      </el-table>

      <pagination
        v-if="paginationTotal > 0"
        v-model:total="paginationTotal"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.per_page"
        @pagination="loadData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import LogAPI from "@/api/log-api";
import { formatDatetime } from "@/utils/formatters";
import { dateTimeRangeDefaultTime } from "@/utils/date";
import { Log, LogFilters } from "@/interfaces/logs";
import type { FormInstance } from "element-plus";

defineOptions({
  name: "Logs",
  inheritAttrs: false,
});

const tableLoading = ref(false);
const tableData = ref<Log[]>([]);
const tableColumns = [
  { prop: "created_at", label: "Created At", formatter: formatDatetime },
  { prop: "user_id", label: "User ID" },
  { prop: "user.name", label: "User name", formatter: (row: any) => row.user?.name || "" },
  { prop: "route_name", label: "Route name" },
  { prop: "ip", label: "IP" },
  { prop: "locale", label: "Locale" },
  { prop: "country_code", label: "Country code" },
  { prop: "status", label: "Status" },
];
const paginationTotal = ref(0);

const filtersForm = ref<FormInstance>();
const queryParams = reactive<LogFilters>({
  page: 1,
  per_page: 10,
});

async function loadData() {
  tableLoading.value = true;

  try {
    const result = await LogAPI.getPage(queryParams);

    tableData.value = result.data;
    paginationTotal.value = result.meta.total;
  } catch (error) {
    console.error("Failed to load data:", error);
    ElMessage.error("Failed to load data.");
  } finally {
    tableLoading.value = false;
  }
}

function applyFilters() {
  queryParams.page = Number(queryParams.page) || 1;
  loadData();
}

function resetFilters() {
  filtersForm.value?.resetFields?.();
  queryParams.page = 1;
  queryParams.created_at = undefined;
  loadData();
}

onMounted(loadData);
</script>
