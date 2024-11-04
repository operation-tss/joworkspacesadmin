import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/logo.png";
import Applogo from "../../assets/Applogo.png";
import "./Header.css";
import { useAuth } from "../../hooks/useAuth";

const StyledHeader = styled.header`
  background-color: #e2e8b2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
  .nav_logo {
    padding: 0 12px;
    .nav-logo-link {
      text-decoration: none;
      font-size: 24px;
      color: #fab005;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .menuToggleBtn {
    display: none;
    color: white;
    font-size: 24px;
    position: absolute;
    right: 20px;
    top: 15px;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    .menuToggleBtn {
      display: block;
    }
  }
`;
const NavManu = styled.ul`
  list-style: none;
  display: flex;
  li {
    &:hover {
      cursor: pointer;
      background: #44a8f4;
      border-radius: 4px;
    }
  }
  .nav-menu-list {
    text-decoration: none;
    color: #000;
    display: block;
    padding: 10px 10px;
    text-align: left;
    font-weight: 500;
  }
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isToggleOpen ? "block" : "none")};
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 5px;
  }
`;

const Header = () => {
  const { user } = useAuth();
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };
  const { logout } = useAuth();

  console.log({ user });

  return (
    <>
      <StyledHeader>
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
          <li>
            {user ? (
              <Link to={"/"} className="nav-menu-list">
                Invoice Upload
              </Link>
            ) : (
              <></>
            )}
          </li>
          <li>
            {user ? (
              <Link to={"/pendingPayment"} className="nav-menu-list">
                Pending Payment
              </Link>
            ) : (
              <></>
            )}
          </li>
          <li>
            <Link to={"/deleteAccount"} className="nav-menu-list">
              Delete Account
            </Link>
          </li>
          <li>
            {!user ? (
              <Link
                to={"/login"}
                className="nav-menu-list"
              >
                Login
              </Link>
            ) : (
              <></>
            )}
          </li>
          {/* <li>
            <Link to={"/projects"} className="nav-menu-list">
              Projects
            </Link>
          </li>
          <li>
            <Link to={"/til"} className="nav-menu-list">
              TIL
            </Link>
          </li>*/}
          <li>
            {user ? (
              <Link onClick={logout} className="nav-menu-list">
                Logout
              </Link>
            ) : (
              <></>
            )}
          </li>
        </NavManu>
        <FaBars
          className="menuToggleBtn"
          onClick={handleToggleOpen}
          color="#000"
        />
      </StyledHeader>
    </>
  );
};

export default Header;
