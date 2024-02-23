import { FaGithub } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Navbar({ title }) {
  return (
    <nav className="navbar mb-12 shadow-lg bg-neutral text-neutral-content ">
      <div className="container mx-auto">
        <div className="flex-none px-2 mx-2  text-white ">
          <FaGithub className="inline pr-2 text-3xl text-white" />
          <Link to="/" className="text-lg font-bold align-middle">
            {title}
          </Link>
        </div>
      </div>
      <div className="flex-1 px-2 mx-2">
        <div className="flex justify-end">
          <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
            Home
          </Link>
        </div>
        <div className="flex justify-end">
          <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  title: "GitHub Finder",
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
