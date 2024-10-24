import { useRouteError } from "react-router-dom";
import '../component/error.css'; // Make sure to create this CSS file

const Error = () => {
  const error = useRouteError();

  return (
    <div className="error-container">
      <h1>Oops!!</h1>
      <h2>Something went wrong!</h2>
      <h3>
        {error?.status} : {error?.statusText}
      </h3>
    </div>
  );
};

export default Error;
