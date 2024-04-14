import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface KnowledgeBaseProps {
  source: string
  list: {
    id: string
    title: string
    description: string
    updatedAt: string
    stars: number
    tags: string[]
    link: string
    authorName: string
    authorAvatar: string
  }[]
}

export const KnowledgeBase = (props: KnowledgeBaseProps) => {
  if (!props.list?.length) {
    return (
      <Card>
        <CardHeader className="px-7">
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <CardDescription>
          Recent dashboards from{' '}
          <a className="underline" href={props.source} target="_blank">
            {props.source}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-scroll knowledge-base-window">
        <Table>
          <TableBody>
            {props.list.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={item.authorAvatar} />
                      <AvatarFallback>
                        <span className="text-4xl">🤔</span>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium mb-1">
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        @{item.authorName} updated{' '}
                        {dayjs(item.updatedAt).fromNow()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-xs whitespace-nowrap"
                    variant="secondary"
                  >
                    ⭐ {item.stars}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
