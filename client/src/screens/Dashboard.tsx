import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const authContext = useAuth();
  return (
    <div>
      <button onClick={authContext.logout}>Logout</button>
      <h1>Hello World</h1>
    </div>
  );
}

export default Dashboard;
