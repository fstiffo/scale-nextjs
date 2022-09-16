import Head from 'next/head';

const Home = (props) => {
  return (
    <div>
      <Head>
        <title>Scale</title>
        <meta name="description" content="Scale" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto">
        <div className="navbar bg-primary">
          <div className='navbar-start'></div>
          <div className='navbar-center'>
            <a className="btn btn-ghost normal-case text-3xl text-base-100">Scale</a>
          </div>
          <div className='navbar-end'></div>
        </div>
        <p className="mb-20 text-xl text-center">
          🔥 Shop from the hottest items in the world 🔥
        </p>
        <button className="btn">Hello daisyUI</button>
      </main>

      <footer></footer>
    </div >
  );
};

export default Home;