import React, { useEffect, useState } from "react";
import BgImage from "../../../assets/BgImage.png";
import axios from "axios";
import getApiUri from "../../../utils/api.util";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { useAuth } from "../../../hooks/useAuth";
import "./Login.css";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async () => {
    try {
      console.log(username, password);
      const response = await axios.post(
        getApiUri("UserLogin"),
        {
          UserName: username,
          Password: password,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "http://203.110.90.228:86",
          },
        }
      );
      console.log("-->res", response.data);
      await login(response.data);
    } catch (error) {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div
        className="logincontainer"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            width: 500,
            // marginTop: 50,
            boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.5), 0 8px 24px 0 rgba(0, 0, 0, 0.39)',
            borderRadius: 10,
            paddingTop: 50,
            paddingBottom: 50,
          }}
        >
          <div style={{ fontWeight: "bolder", fontSize: 22, marginBottom: 20,color: '#3c3c3c' }}>
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
    </div>
  );
};
