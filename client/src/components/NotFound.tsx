import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <main>
      <p>Page not Found.</p>
      <p>
        Click{" "}
        <Link to="#" onClick={() => navigate(-1)}>
          here
        </Link>{" "}
        to go back.
      </p>
    </main>
  );
}

export default NotFound;
