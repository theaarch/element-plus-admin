<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="日志内容"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item prop="createTime" label="操作时间">
          <el-date-picker
            v-model="queryParams.createTime"
            :editable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="data-table">
      <el-table
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        class="data-table__content"
      >
        <el-table-column label="Time" prop="created_at" />
        <el-table-column label="User ID" prop="user_id" />
        <el-table-column label="User name" prop="user.name" />
        <el-table-column label="Route name" prop="route_name" />
        <el-table-column label="IP" prop="ip" />
        <el-table-column label="Locale" prop="locale" />
        <el-table-column label="Country code" prop="country_code" />
        <el-table-column label="Status" prop="status" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="fetchData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Log",
  inheritAttrs: false,
});

import LogAPI, { LogPageVO, LogPageQuery } from "@/api/log-api";

const queryFormRef = ref();

const loading = ref(false);
const total = ref(0);

const queryParams = reactive<LogPageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  createTime: ["", ""],
});

// 日志表格数据
const pageData = ref<LogPageVO[]>();

/** 获取数据 */
function fetchData() {
  loading.value = true;
  LogAPI.getPage(queryParams)
    .then((res) => {
      pageData.value = res.data;
      total.value = res.meta.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 查询（重置页码后获取数据） */
function handleQuery() {
  queryParams.pageNum = 1;
  fetchData();
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.createTime = undefined;
  fetchData();
}

onMounted(() => {
  handleQuery();
});
</script>
