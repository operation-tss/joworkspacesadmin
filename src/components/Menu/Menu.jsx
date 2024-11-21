import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Applogo from "../../assets/Applogo.png";
import invoice from "../../assets/invoice.png";
import pending from "../../assets/payment.png";
import addUser from "../../assets/add-user.png";
import logoutlogo from "../../assets/logout.png";
import check from "../../assets/check.png";
import shop from "../../assets/shop.png";
import styled from "styled-components";
import "./Menu.css";
import { useAuth } from "../../hooks/useAuth";

const NavManu = styled.ul`
  list-style: none;
  display: flex;
  flex: 1 1 auto;
  height: 100vh;
  flex-direction: column;
  background-image: linear-gradient(to bottom, #409fed, #e0a1f7);
  padding: 0;
  margin: 0;
  width: 100%;

  li {
    width: 100%;
    margin-top: 10px;
    &:hover {
      cursor: pointer;
      background: #fff;
      padding: 0px 10px;
    }
  }

  .nav-menu-list {
    text-decoration: none;
    width: calc(100% - 20px); /* Adjust width to accommodate margin */
    color: #000;
    display: flex;
    padding: 10px;
    text-align: left;
    align-item: center;
    font-weight: 500;
    box-sizing: border-box; /* Keeps padding inside width */
    margin: 0 10px; /* Adds horizontal space for both sides */

    &.selected {
      background-color: #fff;
      color: #000;
      border-radius: 4px;
    }

    &:hover {
      color: #000;
    }
  }

  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isToggleOpen ? "block" : "none")};
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 5px;
  }
`;

const Menu = () => {
  const { user, logout } = useAuth();
  const [isToggleOpen, setIsToggleOpen] = useState(true);
  const location = useLocation();

  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <div style={{ width: 200, display: "flex", flexDirection: "column" }}>
      <div className="nav_logo">
        <Link to={"/"} className="nav-logo-link">
          <img src={Applogo} className="logo" alt="" />
          <p
            style={{
              textAlign: "center",
              color: "#000",
              fontWeight: "500",
              fontSize: 16,
            }}
          >
            workspaces.com
          </p>
        </Link>
      </div>
      <NavManu isToggleOpen={isToggleOpen}>
        {user && (
          <>
            <li>
              <Link
                to={"/"}
                className={`nav-menu-list ${
                  location.pathname === "/" ? "selected" : ""
                }`}
              >
                <img
                  src={invoice}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
                Invoice Upload
              </Link>
            </li>
            <li>
              <Link
                to={"/pendingPayment"}
                className={`nav-menu-list ${
                  location.pathname === "/pendingPayment" ? "selected" : ""
                }`}
              >
                <img
                  src={pending}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
                Pending Payment
              </Link>
            </li>
            <li>
              <Link
                to={"/createUser"}
                className={`nav-menu-list ${
                  location.pathname === "/createUser" ? "selected" : ""
                }`}
              >
                <img
                  src={addUser}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
                Create User
              </Link>
            </li>
            <li>
              <Link
                to={"/activeUsers"}
                className={`nav-menu-list ${
                  location.pathname === "/activeUsers" ? "selected" : ""
                }`}
              >
                <img
                  src={check}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
                Active Users
              </Link>
            </li>
            <li>
              <Link
                to={"/paymentDetails"}
                className={`nav-menu-list ${
                  location.pathname === "/paymentDetails" ? "selected" : ""
                }`}
              >
                <img
                  src={shop}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
                Payment Details
              </Link>
            </li>
          </>
        )}
        {!user && (
          <>
            <li>
              <Link
                to={"/deleteAccount"}
                className={`nav-menu-list ${
                  location.pathname === "/deleteAccount" ? "selected" : ""
                }`}
              >
                Delete Account
              </Link>
            </li>
            <li>
              <Link
                to={"/login"}
                className={`nav-menu-list ${
                  location.pathname === "/login" ? "selected" : ""
                }`}
              >
                Login
              </Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <Link
              to={"/"}
              onClick={logout}
              className="nav-menu-list"
              style={{ color: "#8f200a" }}
            >
              <img
                src={logoutlogo}
                style={{ width: 20, height: 20, marginRight: 10 }}
                alt=""
              />
              Logout
            </Link>
          </li>
        )}
      </NavManu>
    </div>
  );
};

export default Menu;
