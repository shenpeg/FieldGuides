import { NextRequest, NextResponse } from 'next/server'

const ERROR_PAGE = `<html data-proxy-error="true"><body></body></html>`

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return new NextResponse(ERROR_PAGE, {
        headers: { 'Content-Type': 'text/html' },
      })
    }

    const contentType = response.headers.get('content-type') ?? 'text/html'

    if (contentType.includes('text/html')) {
      let html = await response.text()
      const origin = new URL(url).origin

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head><base href="${origin}/">`)
      } else if (html.includes('<HEAD>')) {
        html = html.replace('<HEAD>', `<HEAD><base href="${origin}/">`)
      } else {
        html = `<base href="${origin}/">` + html
      }

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      })
    }

    const body = await response.arrayBuffer()
    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse(ERROR_PAGE, {
      headers: { 'Content-Type': 'text/html' },
    })
  }
}
