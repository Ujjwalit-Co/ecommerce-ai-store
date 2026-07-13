import {ClerkProvider} from "@clerk/nextjs"

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>{children}</div>
  )
}

export default Layout