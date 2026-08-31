import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { api } from "@/services/api"

export const queryKeys = {
  currentUser: ["current-user"] as const,
  publicUser: (username: string) => ["public-user", username] as const,
  dashboardStats: ["dashboard-stats"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["project", id] as const,
  repositories: ["repositories"] as const,
  debugCases: ["debug-cases"] as const,
  debugCase: (id: string) => ["debug-case", id] as const,
  casesByProject: (id: string) => ["cases-by-project", id] as const,
  skills: ["skills"] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: api.getCurrentUser,
  })
}

export function usePublicUser(username: string) {
  return useQuery({
    queryKey: queryKeys.publicUser(username),
    queryFn: () => api.getPublicUser(username),
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: api.getDashboardStats,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: api.getProjects,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => api.getProject(id),
  })
}

export function useRepositories() {
  return useQuery({
    queryKey: queryKeys.repositories,
    queryFn: api.getRepositories,
  })
}

export function useDebugCases() {
  return useQuery({
    queryKey: queryKeys.debugCases,
    queryFn: api.getDebugCases,
  })
}

export function useDebugCase(id: string) {
  return useQuery({
    queryKey: queryKeys.debugCase(id),
    queryFn: () => api.getDebugCase(id),
  })
}

export function useCasesByProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.casesByProject(projectId),
    queryFn: () => api.getCasesByProject(projectId),
  })
}

export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createCase,

    onSuccess: (createdCase) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.debugCases,
      })

      queryClient.setQueryData(
        queryKeys.debugCase(createdCase.id),
        createdCase,
      )
    },
  })
}

export function useSkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: api.getSkills,
  })
}