import client from "@/api/client";

const usePermissionDelete = () => {
	const deletePermission = async (id: number) => {
		await client.DELETE("/iam/permission", {
			params: {
				query: {
					permissionId: id,
				},
			},
		});
	};

	return {
		deletePermission,
	};
};

export default usePermissionDelete;
