import { NavLink, useLocation } from "react-router-dom";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useState } from "react";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isLogout, setIsLogout] = useState(false);

  const onLogout = () => {
    localStorage.removeItem(storageKey);
    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };

  const onToggleLogout = () => {
    setIsLogout((prev) => !prev);
  };

  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? (
          <div className="flex items-center text-indigo-600 space-x-4">
            <li className="duration-200 text-lg">
              <NavLink to="/todos">todos</NavLink>
            </li>
            <li className="duration-200 text-lg">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <button
              className="bg-indigo-500 text-white p-2 rounded-md cursor-pointer"
              onClick={onToggleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
      <Modal isOpen={isLogout} closeModal={onToggleLogout} title="Logout">
        <div className="flex  justify-center space-x-20  mt-3">
          <Button variant={"default"} onClick={onLogout}>
            Logout
          </Button>
          <Button variant={"cancel"} onClick={onToggleLogout} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
