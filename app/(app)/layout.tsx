import {ClerkProvider} from "@clerk/nextjs"
import { SanityLive } from "@/sanity/lib/live"

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <ClerkProvider>
      <div>{children}</div>
      <SanityLive/>
    </ClerkProvider>
  )
}

export default Layout