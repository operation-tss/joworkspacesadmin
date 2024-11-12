import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import Applogo from "../../assets/Applogo.png";
import "./Header.css";
import { useAuth } from "../../hooks/useAuth";

const StyledHeader = styled.header`
  background-image: linear-gradient(to right, #409fed, #e0a1f7);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
    display: ${(props) => (props.isToggleOpen ? "block" : "block")};
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`;

const Header = ({text= 'Admin Panel'}) => {
  const { user } = useAuth();
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };
  const { logout } = useAuth();

  console.log({ user });

  return (
    <>
      <StyledHeader>
        <NavManu>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 23,
              color: "#262626",
              fontWeight: "bolder",
              marginLeft: -40
            }}
          >
            {text}
          </div>
          <li style={{ paddingTop: 10, paddingBottom: 10 }}>
            {user ? (
              <Link to={"/"} className="nav-menu-list">
                {/* Invoice Upload */}
              </Link>
            ) : (
              <></>
            )}
          </li>
        </NavManu>
      </StyledHeader>
    </>
  );
};

export default Header;
