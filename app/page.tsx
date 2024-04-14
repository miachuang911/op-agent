'use client'
import { useFootprintDashboards } from '@/components/hooks/use-footprint-dashboards'
import { useDuneDashboards } from '@/components/hooks/use-dune-dashboards'
import Link from 'next/link'
import { Loader2, Moon, PanelLeft, Sun, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KnowledgeBase } from '@/components/ui/knowledge-base'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Markdown from 'react-markdown'
import { useCompletion } from 'ai/react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

export default function RootPage() {
  const [lastUpdated, setLastUpdated] = useState(0)

  const { setTheme, theme } = useTheme()
  const ToggleTheme = () => {
    if (theme === 'dark') {
      return (
        <Moon
          className="h-[1.2rem] w-[1.2rem]"
          onClick={() => setTheme('light')}
        />
      )
    } else {
      return (
        <Sun
          className="h-[1.2rem] w-[1.2rem]"
          onClick={() => setTheme('dark')}
        />
      )
    }
  }

  const footprintDashboards = useFootprintDashboards()
  const duneDashboards = useDuneDashboards()

  const completion = useCompletion({
    api: '/api/completion',
  })

  useEffect(() => {
    if (footprintDashboards.isLoading || duneDashboards.isLoading) return
    setLastUpdated(Date.now())
  }, [duneDashboards.isLoading, footprintDashboards.isLoading])

  const knowledgeBaseList = (footprintDashboards.data || []).concat(
    duneDashboards.data || []
  )

  useEffect(() => {
    if (!lastUpdated) return
    const prompt = `
Please answer the following questions based on the provided knowledge base:
- Main features and characteristics
- What are the needs of the community users?
- Based on the above information, what insights and action recommendations can I obtain?

Requirements:
- Use Markdown for clean formatting and readability
- Write in English
- Use conversational language, no need to be overly formal

Knowledge Base:
- ${knowledgeBaseList.map((item: { title: string }) => item.title).join('\n- ')}
      `
    completion.complete(prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated])

  const isLoading =
    footprintDashboards.isLoading ||
    footprintDashboards.isValidating ||
    duneDashboards.isLoading ||
    duneDashboards.isValidating ||
    completion.isLoading

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Avatar className="h-full w-full">
              <AvatarImage
                src="https://prod-dune-media.s3.eu-west-1.amazonaws.com/profile_img_25c21595-56a8-4f3f-9921-3532b1f1cc7f_nkydh.jpeg"
                alt="OP"
              />
            </Avatar>
          </Link>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ToggleTheme />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium h-full content-between">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="https://prod-dune-media.s3.eu-west-1.amazonaws.com/profile_img_25c21595-56a8-4f3f-9921-3532b1f1cc7f_nkydh.jpeg"
                      alt="OP"
                    />
                  </Avatar>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ToggleTheme />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Optimism Knowledge Base</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Automatically gather data and insights related to Optimism,
                    and deliver summarized information to you.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    disabled={isLoading}
                    onClick={async () => {
                      await Promise.all([
                        footprintDashboards.mutate(),
                        duneDashboards.mutate(),
                      ])
                      setLastUpdated(Date.now())
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="mr-2 h-4 w-4" />
                    )}
                    Konwledge Base & Summary
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Konwledge Base</CardDescription>
                  <CardTitle className="text-4xl">
                    {(footprintDashboards.data?.length || 0) +
                      (duneDashboards.data?.length || 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {dayjs(lastUpdated || Date.now()).format(
                      'YYYY-MM-DD HH:mm'
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Your Plan</CardDescription>
                  <CardTitle className="text-4xl">Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Expires on 2024-05-01
                  </div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="dune">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="footprint">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage
                        src="https://files.readme.io/5336301-180.png"
                        alt="Footprint"
                      />
                    </Avatar>
                    Footprint Analytics
                  </TabsTrigger>
                  <TabsTrigger value="dune">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/43092013?s=200&v=4"
                        alt="Dune"
                      />
                    </Avatar>
                    Dune
                  </TabsTrigger>
                  <TabsTrigger value="others" disabled>
                    Others (Soon)
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="footprint">
                <KnowledgeBase
                  source="https://www.footprint.network/"
                  list={footprintDashboards.data}
                />
              </TabsContent>
              <TabsContent value="dune">
                <KnowledgeBase
                  source="https://dune.com/"
                  list={duneDashboards.data}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAY1BMVEUAAAD////r6+vx8fGQkJD8/Pzl5eWsrKywsLDHx8efn5+ZmZm/v7/Ozs75+fmLi4uEhIQSEhPc3NxFRUV2dnYfHx9AQEBkZGQtLS0mJiY1NTZQUFDU1NVxcXIMDAxWVlcpKS6gnCCTAAACE0lEQVRIie2VW5eqMAyF2RRawHKxqIwXZP7/rzxJWsB1lmV01jyaF6v4mWRnNybJJz7xl9FZ58rq611shxDl/i3OEeIKU9NL3r/HlWc5ZTmgkOvi8gpXAbtwPKi5ZvsCSPn84aqJuGVjVzRAev8Bm0pA6jyWjJ38pwbQm9iQsi6hYKhxedAB1QZXST9FkvRUXOh08o8sEOdofIoaI7AlOWSEo4K78uEMdDHuJFWmMAwO/EnvvKT8GzqubI0mWUBS5U7lGc4pVZeoI9wdyB7BDGguoQOowUbBEbivYJtCu6Dr3rL5uPeINFzpDEr6Lg+TlGYPEbCC8qCoGpQoEBK1cQu0flIhY7D1HjTRlk+HqAV6yAxSFkFU5TjDTClSHmWJPJJS4ZaItdXQrWDBrlHrDz+vVYoiSRS+5lKlY+m+idrVzf40WMUhMPOgiw5kIs21OPNSS3bK/QDqKFjRlOkaH/k8KGjq9vAAhk6eBLlqYmdKK3vFh+MK0jxi69KyrGRRNCNfTXsMqnpQ+Rv+LIwvycpd8tdwWsAbcI2BQ3h2cmj8rS2COGmvN3dHIxag8GtYqr7OG8XEObbAbnkji0u+XcqF3ODEAmFWPEnUXkY6bGMJDxl50Y0tY2n4NjX6wn9PMS/9Zl5q2XZ7S1yMJpPnc7dH+9MS/w/njVwbwyvjHS6ZbYDt1f80vnelcza6vj/xiV/FP8W/FBsGGsmfAAAAAElFTkSuQmCC"
                        alt="GPT"
                      />
                    </Avatar>
                    Optimism Agent
                  </CardTitle>
                  <CardDescription>
                    This summary is automatically compiled by Optimism AI and is
                    for reference only.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 leading-7 overflow-y-scroll chat-window">
                {!completion.completion ? (
                  'Loading...'
                ) : (
                  <Markdown className="markdown">
                    {completion.completion}
                  </Markdown>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
