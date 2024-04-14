import useSWR from 'swr'

export const useFootprintDashboards = () => {
  return useSWR(
    'useFootprintDashboards',
    async () => {
      const url = 'https://www.footprint.network/api/v1/elasticsearch/search'
      const body = {
        category: 'All',
        sortDirection: 'desc',
        current: 1,
        sortBy: 'created_at',
        pageSize: 100,
        tags: [],
        isSort: true,
        project: 'footprint',
        model: 'dashboard',
        qs: ['optimism'],
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const json = await res.json()
      const data = json?.data?.data

      if (!data?.length) return []
      return data.map((dashboard: any) => {
        return {
          id: dashboard.publicUuid,
          title: dashboard.name,
          description: dashboard.description,
          updatedAt: dashboard.createdAt,
          stars: dashboard.statistics.view,
          tags: dashboard.tags,
          link: `https://www.footprint.network/dashboard/${dashboard.id}`,
          authorName: dashboard.creator.name,
          authorAvatar: dashboard.creator.avatar,
        }
      })
    },
    { revalidateOnFocus: false }
  )
}
