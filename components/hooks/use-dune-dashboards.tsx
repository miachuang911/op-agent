import useSWR from 'swr'

export const useDuneDashboards = () => {
  return useSWR(
    'useDuneDashboards',
    async () => {
      const url = 'https://core-api.dune.com/public/graphql'
      const body = {
        operationName: 'GetBrowseDashboardsList',
        variables: {
          input: {
            order: 'CREATED_AT',
            perPage: 100,
            pageNumber: 1,
            searchTerm: 'title:optimism',
          },
        },
        query:
          'query GetBrowseDashboardsList($input: BrowseDashboardsListInput!) {\n  browseDashboardsList(input: $input) {\n    dashboards {\n      id\n      name\n      slug\n      tags\n      owner {\n        type\n        id\n        name\n        handle\n        profileImageUrl\n        __typename\n      }\n      isPrivate\n      favoriteCounts {\n        count24h\n        count7d\n        count30d\n        countAll\n        __typename\n      }\n      trendingScores {\n        score1h\n        score4h\n        score24h\n        __typename\n      }\n      createdAt\n      updatedAt\n      __typename\n    }\n    total\n    __typename\n  }\n}\n',
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const json = await res.json()
      const data = json?.data?.browseDashboardsList?.dashboards

      if (!data?.length) return []
      return data.map((dashboard: any) => {
        return {
          id: dashboard.id,
          title: dashboard.name,
          description: '',
          updatedAt: dashboard.updatedAt,
          stars: dashboard.favoriteCounts.countAll,
          tags: dashboard.tags,
          link: `https://dune.com/${dashboard.owner.handle}/${dashboard.slug}`,
          authorName: dashboard.owner.name,
          authorAvatar: dashboard.owner.profileImageUrl,
        }
      })
    },
    { revalidateOnFocus: false }
  )
}
