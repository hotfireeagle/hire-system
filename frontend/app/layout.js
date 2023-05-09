import Header from "@//components/header"
import ClientQueryProvider from "@/components/clientQueryProvider"
import ToastContainerWrapper from "@/components/toastContainerWrapper"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

export const metadata = {
  title: "t platform",
  description: "an platform will catch your flower message",
}

export default function RootLayout({ children }) {
  return (
    <html lang="cn">
      <body>
        <ClientQueryProvider>
          <div className="systemPageContainer">
            <Header />
            <div className="bodyContainer">
              {children}
            </div>
          </div>
          <ToastContainerWrapper />
        </ClientQueryProvider>
      </body>
    </html>
  )
}