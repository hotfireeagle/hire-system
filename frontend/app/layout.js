import Header from "@/component/header"
import Footer from "@/component/footer"
import TanStore from "@/component/tanStore"
import "./globals.css"

export const metadata = {
  title: "testing",
  description: "testing2",
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <TanStore>
          <div className="fakepinAppContainer">
            <Header />
            <div className="fakepinBodyContainer">
              {children}
            </div>
            <Footer />
          </div>
        </TanStore>
      </body>
    </html>
  )
}
