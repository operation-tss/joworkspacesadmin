import React, { useEffect, useState } from "react";
import BgImage from "../../../assets/BgImage.png";
import axios from "axios";
import getApiUri from "../../../utils/api.util";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate =  useNavigate();
  const submit = async () => {
    try {
    console.log(username,password);
    const response = await axios.post(getApiUri('UserLogin'),{
      UserName: username,
      Password: password,
    });
    console.log('-->res',response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    navigate("/");
          
  } catch (error) {
      
  }
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    setTimeout(() => {
      if (user) {
        setLoading(false)
        navigate("/")
      }
      setLoading(false)
    },2000)
  },[])

  return (
    <div
      style={{
        // paddingLeft: "10%",
        // paddingRight: "10%",
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "red",
        paddingBottom: 150,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          width: 500,
          marginTop: 50,
          borderRadius: 10,
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        <div style={{ fontWeight: "500", fontSize: 18, marginBottom: 20 }}>
          Admin Login
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginBottom: 20,
            width: "80%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "start",
              fontWeight: "500",
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            Email
          </div>
          <div style={{ width: "100%" }}>
            <input
              style={{
                width: "100%",
                paddingLeft: 10,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
                borderRadius: 5,
                borderWidth: 1,
              }}
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginBottom: 20,
            width: "80%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "start",
              fontWeight: "500",
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            Password
          </div>
          <div style={{ width: "100%" }}>
            <input
              style={{
                width: "100%",
                paddingLeft: 10,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
                borderRadius: 5,
                borderWidth: 1,
              }}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div
          onClick={() => submit()}
          style={{
            width: "50%",
            height: 40,
            color: "#fff",
            fontWeight: "500",
            fontSize: 18,
            backgroundColor: "#25a6b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};
