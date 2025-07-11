<template>
  <div class="px-2 sm:px-4 pt-6 sm:rounded-lg">
    <div class="mb-4 col-span-full">
      <Breadcrumbs :names="['任务管理']" />
      <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">任务管理</h1>
    </div>

    <TableFilterForm :filters="filterConfig" :initialValues="filterValues" @search="handleSearch"
      @update:values="updateFilterValues">
    </TableFilterForm>

    <!-- 移动端卡片布局 -->
    <div class="md:hidden">
      <MobileCardList :items="jobs">
        <template #title="{ item }">
          {{ `${item.name}:${item.group}` }}
        </template>
        <template #status="{ item }">
          <div class="flex items-center">
            <div class="h-2.5 w-2.5 rounded-full me-2"
              :class="item.triggerState === 'NORMAL' ? 'bg-green-500' : item.triggerState === 'PAUSED' ? 'bg-red-500' : 'bg-yellow-500'">
            </div>
            <span class="text-sm">{{ item.triggerState }}</span>
          </div>
        </template>
        <template #content="{ item }">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs font-medium text-gray-600">类型</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ item.schedulerType }}</p>
            </div>
            <div v-if="item.schedulerType === 'CRON'">
              <p class="text-xs font-medium text-gray-600">Cron表达式</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ item.cronExpression }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs font-medium text-gray-600">下次执行</p>
              <p class="text-sm text-gray-900 mt-0.5">{{ item.nextFireTime ? dayjs(item.nextFireTime).format("llll") :
                '无' }}</p>
            </div>
          </div>
        </template>
        <template #actions="{ item }">
          <div class="flex gap-x-2">
            <button @click="handleCronUpdateClick(item)" :disabled="item.schedulerType !== 'CRON'"
              :class="['flex items-center justify-center gap-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5' , { 'opacity-50 cursor-not-allowed': item.schedulerType !== 'CRON' }]"
              type="button">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                <path fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd"></path>
              </svg>
              <span>编辑</span>
            </button>
            <button
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5"
              @click="handleResumeJobClick(item)" type="button">
              <span>恢复</span>
            </button>
            <button
              class="bg-red-700 hover:bg-red-800 focus:ring-red-300 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5"
              @click="handlePauseJobClick(item)" type="button">
              <span>暂停</span>
            </button>
          </div>
        </template>
      </MobileCardList>
    </div>

    <!-- PC端表格布局 -->
    <div class="hidden md:block">
      <TableFormLayout :items="jobs || []" :columns="columns">
        <template #name="{ item }">
          {{ `${item.name}:${item.group}` }}
        </template>
        <template #trigger="{ item }">
          {{ `${item.triggerName}:${item.triggerGroup}` }}
        </template>
        <template #startTime="{ item }">
          {{ dayjs(item.startTime!).format("llll") }}
        </template>
        <template #endTime="{ item }">
          {{ item.endTime ? dayjs(item.endTime).format("llll") : undefined }}
        </template>
        <template #nextFireTime="{ item }">
          {{ item.nextFireTime ? dayjs(item.nextFireTime).format("llll") : undefined }}
        </template>
        <template #previousFireTime="{ item }">
          {{ item.previousFireTime && item.previousFireTime > 0 ? dayjs(item.previousFireTime).format("llll") :
          undefined }}
        </template>
        <template #schedulerType="{ item }">
          {{ item.schedulerType }}
        </template>
        <template #cronExpression="{ item }">
          {{ item.cronExpression }}
        </template>
        <template #triggerState="{ item }">
          {{ item.triggerState }}
        </template>
        <template #edit="{ item }">
          <div class="flex items-center gap-x-2">
            <button @click="handleCronUpdateClick(item)" :disabled="item.schedulerType !== 'CRON'"
              :class="['flex items-center justify-center gap-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2.5' , { 'opacity-50 cursor-not-allowed': item.schedulerType !== 'CRON' }]"
              type="button">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                <path fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd"></path>
              </svg>
              <span>编辑</span>
            </button>
          </div>
        </template>
        <template #actions="{ item }">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-y-0 sm:gap-x-2">
            <button
              :class="['text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2.5 text-center']"
              @click="handleResumeJobClick(item)" type="button">
              <span>恢复</span>
            </button>
            <button
              :class="['bg-red-700 hover:bg-red-800 focus:ring-red-300 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2.5 text-center']"
              @click="handlePauseJobClick(item)" type="button">
              <span>暂停</span>
            </button>
          </div>
        </template>
      </TableFormLayout>
    </div>

    <TablePagination :pageChange="handlePageChange" :total="total" />
  </div>
  <PopupModal :id="'job-resume-modal'" :closeModal="() => {
    jobResumeModal!.hide();
  }" :onSubmit="handleResumeModalSubmit" title="确定恢复该任务吗？" content="恢复任务"></PopupModal>
  <PopupModal :id="'job-pause-modal'" :closeModal="() => {
    jobPauseModal!.hide();
  }" :onSubmit="handlePauseModalSubmit" title="确定暂停该任务吗" content="暂停任务"></PopupModal>
  <SchedulerFormDialog :job="selectedJob" :id="'job-update-modal'" :closeModal="() => {
    jobUpdateModal!.hide();
  }" :onSubmit="handleUpdateModalSubmit"></SchedulerFormDialog>
</template>

<script setup lang="ts">
import Breadcrumbs from "@/components/layout/Breadcrumbs.vue";
import PopupModal from "@/components/modals/ConfirmationDialog.vue";
import SchedulerFormDialog from "@/components/modals/SchedulerFormDialog.vue";

import MobileCardList from "@/components/tables/MobileCardList.vue";
import TableFilterForm from "@/components/tables/TableFilterForm.vue";
import type { FilterItem } from "@/components/tables/TableFilterForm.vue";
import TableFormLayout from "@/components/tables/TableFormLayout.vue";
import TablePagination from "@/components/tables/TablePagination.vue";
import { useJobControl } from "@/composables/job/useJobControl";
import { useJobsPaginationQuery } from "@/composables/job/useJobQuery";
import { useJobUpdate } from "@/composables/job/useJobUpdate";
import useAlertStore from "@/composables/store/useAlertStore";
import dayjs from "dayjs";
import { Modal, type ModalInterface, initFlowbite } from "flowbite";
import { nextTick, onMounted, reactive, ref } from "vue";
import type { components } from "../api/types/schema";

// 定义筛选配置
const filterConfig: FilterItem[] = [
	{
		type: "input",
		name: "jobName",
		placeholder: "任务名称",
	},
];

// 筛选值
const filterValues = reactive<{
	jobName: string;
}>({
	jobName: "",
});

// 更新筛选值
const updateFilterValues = (
	values: Record<string, string | number | boolean | Date[] | undefined>,
) => {
	if (values.jobName !== undefined) {
		filterValues.jobName = values.jobName as string;
	}
};

const jobResumeModal = ref<ModalInterface>();
const jobPauseModal = ref<ModalInterface>();
const jobUpdateModal = ref<ModalInterface>();
const selectedJob = ref<components["schemas"]["JobTriggerDto"]>();

const { jobs, total, fetchJobsWith } = useJobsPaginationQuery();

const alertStore = useAlertStore();

const { resumeTrigger, pauseTrigger } = useJobControl();

const { updateCron } = useJobUpdate();

// 定义表格列配置
const columns = [
	{ title: "任务", field: "name" },
	{ title: "触发器", field: "trigger", class: "hidden lg:table-cell" },
	{ title: "开始", field: "startTime", class: "hidden lg:table-cell" },
	{ title: "结束", field: "endTime", class: "hidden lg:table-cell" },
	{ title: "下次执行", field: "nextFireTime", class: "hidden md:table-cell" },
	{
		title: "上次执行",
		field: "previousFireTime",
		class: "hidden lg:table-cell",
	},
	{ title: "类型", field: "schedulerType", class: "hidden md:table-cell" },
	{ title: "Cron", field: "cronExpression", class: "hidden md:table-cell" },
	{ title: "状态", field: "triggerState" },
	{ title: "编辑", field: "edit", class: "hidden sm:table-cell" },
	{ title: "操作", field: "actions" },
];

const handleResumeJobClick = async (
	currentJob: components["schemas"]["JobTriggerDto"],
) => {
	selectedJob.value = currentJob;
	await nextTick(() => {
		jobResumeModal.value?.show();
	});
};

const handleCronUpdateClick = async (
	currentJob: components["schemas"]["JobTriggerDto"],
) => {
	selectedJob.value = currentJob;
	await nextTick(() => {
		jobUpdateModal.value?.show();
	});
};

const handlePauseJobClick = async (
	currentJob: components["schemas"]["JobTriggerDto"],
) => {
	selectedJob.value = currentJob;
	await nextTick(() => {
		jobPauseModal.value?.show();
	});
};

const handleResumeModalSubmit = async () => {
	await resumeTrigger({
		triggerName: selectedJob.value!.triggerName!,
		triggerGroup: selectedJob.value!.triggerGroup!,
	});
	jobResumeModal.value?.hide();
	alertStore.showAlert({
		level: "success",
		content: "操作成功",
	});
	await fetchJobsWith({
		name: filterValues.jobName,
	});
};

const handleUpdateModalSubmit = async (cronExpression: string) => {
	await updateCron({
		triggerName: selectedJob.value!.triggerName!,
		triggerGroup: selectedJob.value!.triggerGroup!,
		cron: cronExpression,
	});
	jobUpdateModal.value?.hide();
	alertStore.showAlert({
		level: "success",
		content: "操作成功",
	});
	await fetchJobsWith({
		name: filterValues.jobName,
	});
};

const handlePauseModalSubmit = async () => {
	await pauseTrigger({
		triggerName: selectedJob!.value!.triggerName!,
		triggerGroup: selectedJob!.value!.triggerGroup!,
	});
	jobPauseModal.value?.hide();
	alertStore.showAlert({
		level: "success",
		content: "操作成功",
	});
	await fetchJobsWith({
		name: filterValues.jobName,
	});
};

const handleSearch = async () => {
	await fetchJobsWith({
		name: filterValues.jobName,
	});
};

const handlePageChange = async (page: number, pageSize: number) => {
	await fetchJobsWith(
		{
			name: filterValues.jobName,
		},
		page,
		pageSize,
	);
};

onMounted(async () => {
	await fetchJobsWith({
		name: filterValues.jobName,
	});
	initFlowbite();
	const $jobResumeModalElement: HTMLElement | null =
		document.querySelector("#job-resume-modal");
	const $jobPauseModalElement: HTMLElement | null =
		document.querySelector("#job-pause-modal");
	const $jobUpdateModalElement: HTMLElement | null =
		document.querySelector("#job-update-modal");
	if ($jobResumeModalElement) {
		jobResumeModal.value = new Modal($jobResumeModalElement, {});
	}
	if ($jobPauseModalElement) {
		jobPauseModal.value = new Modal($jobPauseModalElement, {});
	}
	if ($jobUpdateModalElement) {
		jobUpdateModal.value = new Modal($jobUpdateModalElement, {});
	}
});
</script>

<style scoped></style>
