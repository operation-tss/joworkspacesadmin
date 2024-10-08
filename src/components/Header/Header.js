import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/logo.png"
import Applogo from "../../assets/Applogo.png"
import './Header.css'

const StyledHeader = styled.header`
  background-color: #E2E8B2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    font-weight: 500
  }
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isToggleOpen ? "block" : "none")};
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 5px;
  }
`;

const Header = ({user}) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate =  useNavigate();
  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    setTimeout(() => {
      if (!user) {
        setLoading(false)
        navigate("/login")
      }
      setLoading(false)
      
    },2000)
  },[])

  return (
    <>
      <StyledHeader>
        <div className="nav_logo">
          <Link to={"/"} className="nav-logo-link">
            <img src={Applogo} className="logo" alt="" />
            <p style={{textAlign: 'center',color: '#000',fontWeight: '500', fontSize: 16,}}>workspaces.com</p>
          </Link>
        </div>

        <NavManu isToggleOpen={isToggleOpen}>
          <li>
            <Link to={"/"} className="nav-menu-list">
              {/* Upload Invoice */}
            </Link>
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

            {user ?
            
            <Link to={"/login"} onClick={()=> {localStorage.removeItem('user');navigate("/login")}} className="nav-menu-list">
              Logout
            </Link>:<></>
          }
          </li> 
        </NavManu>
        <FaBars className="menuToggleBtn" onClick={handleToggleOpen} color="#000" />
      </StyledHeader>
    </>
  );
};

export default Header;
