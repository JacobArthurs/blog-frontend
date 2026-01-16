export async function onRequest(context: {
  env: { VITE_API_BASE_URL: string }
}) {
  const res = await fetch(`${context.env.VITE_API_BASE_URL}/rss.xml`)
  return new Response(await res.text(), {
    headers: { 'Content-Type': 'application/xml' }
  })
}
