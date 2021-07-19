import Head from 'next/head'
import dynamic from 'next/dynamic';

const VimeoApp = dynamic(
  async () => {
    const mod = await import('../components/VimeoApp');
    return mod.VimeoApp;
  },
  {
    ssr: false,
  },
)

export default function Home() {
  return (
    <div>
      <Head>
        <title>Lion Plyr Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VimeoApp />
    </div>
  )
}
