import { Link, useHistory } from "react-router-dom";

function NotFound() {
  const history = useHistory();
  return (
    <main>
      <p>Page not Found.</p>
      <p>
        Click{" "}
        <Link to="#" onClick={history.goBack}>
          here
        </Link>{" "}
        to go back.
      </p>
    </main>
  );
}

export default NotFound;
