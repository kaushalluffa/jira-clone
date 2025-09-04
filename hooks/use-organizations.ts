import { useApiClient } from "@/lib/api-client"

export default function useOrganizations() {
    const apiClient = useApiClient()

    return {
        getOrganizations: async () => {
            const response = await apiClient.get("/organizations")
            return response.data
        },
        createOrganization: async (data: any) => {
            const response = await apiClient.post("/organizations", data)
            return response.data
        },
        updateOrganization: async (id: string, data: any) => {
            const response = await apiClient.put(`/organizations/${id}`, data)
            return response.data
        },
        deleteOrganization: async (id: string) => {
            const response = await apiClient.delete(`/organizations/${id}`)
            return response.data
        },
    }
}