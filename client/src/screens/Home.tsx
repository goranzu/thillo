import { Link } from "react-router-dom";

const nav = [
  {
    name: "Signin",
    path: "/signin",
  },
  {
    name: "Signup",
    path: "/signup",
  },
];

function Home() {
  return (
    <>
      <header>
        <nav>
          <ul>
            {nav.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <h1>Home</h1>
      </main>
    </>
  );
}

export default Home;
