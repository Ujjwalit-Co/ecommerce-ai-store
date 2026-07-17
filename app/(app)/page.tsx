import { sanityFetch } from "@/sanity/lib/live"

export default async function Home() {
  const categories = await sanityFetch({
    query: `*[_type == "category"]`,
  })

  console.log(categories);

  return (
    <div>
    Home Page
    </div>
  )
}