import { computed, ref } from "vue";

export interface PaginationState {
	currentPage: number;
	pageSize: number;
	total: number;
}

export interface UsePaginationOptions {
	initialPage?: number;
	initialPageSize?: number;
	initialTotal?: number;
}

/**
 * 分页逻辑Composable - 提供分页相关的状态和操作
 * @param options 分页选项
 * @returns 分页状态和方法
 */
export function usePagination(options: UsePaginationOptions = {}) {
	const { initialPage = 1, initialPageSize = 10, initialTotal = 0 } = options;

	const currentPage = ref(initialPage);
	const pageSize = ref(initialPageSize);
	const total = ref(initialTotal);

	const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

	const pageNumbers = computed(() => {
		const pages = [];
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i);
		}
		return pages;
	});

	const displayRange = computed(() => {
		const start =
			total.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1;
		const end =
			total.value === 0
				? 0
				: Math.min(currentPage.value * pageSize.value, total.value);
		return { start, end };
	});

	const isFirstPage = computed(
		() => total.value === 0 || currentPage.value === 1,
	);

	const isLastPage = computed(
		() => total.value === 0 || currentPage.value === totalPages.value,
	);

	const updatePaginationState = (state: Partial<PaginationState>) => {
		if (state.currentPage !== undefined) currentPage.value = state.currentPage;
		if (state.pageSize !== undefined) pageSize.value = state.pageSize;
		if (state.total !== undefined) total.value = state.total;
	};

	return {
		currentPage,
		pageSize,
		total,
		totalPages,
		pageNumbers,
		displayRange,
		isFirstPage,
		isLastPage,
		updatePaginationState,
	};
}
