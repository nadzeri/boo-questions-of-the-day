import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto, Roboto_Mono } from "next/font/google";
import Layout from "@/components/Layout";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${robotoSans.variable} ${robotoMono.variable} font-sans bg-background text-text-primary`}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
