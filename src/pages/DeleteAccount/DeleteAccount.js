import axios from "axios";
import React, { useState } from "react";
import getApiUri from "../../utils/api.util";
import { OtpInput } from "reactjs-otp-input";
import "./DeleteAccount.css";
import Header from "../../components/Header/Header";

export const DeleteAccount = () => {
  // const authContext = useContext(AuthContext);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [genratedOtp, setGenratedOtp] = useState();
  const [autoId, setAutoId] = useState();
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = (otp) => setOtp(otp);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const valid = await validate();
      console.log({ valid });
      if (valid) {
        const res = await axios.post(
          getApiUri(`GenerateResetOTP?txtmobileno=${email}&role_id=2`)
        );
        console.log({ res });
        if (
          res &&
          res.data &&
          res?.data?.statuscode == 200 &&
          res?.data?.success == true
        ) {
          console.log("res?.data?.OTP", res?.data?.data);

          await axios.post(
            getApiUri(`sendMail?recipientEmail=${email}&otp=${res?.data?.data}`)
          );

          console.log(res?.data);
          //go to verify otp
          // setMobileNumber('');
          setData(res?.data);
          setOtp("");
          setGenratedOtp(res?.data?.data);
          setOtpEnabled(true);
          setOtp("");
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //   const handleDeleteAccount = async () => {
  //     Alert.alert(
  //       "Confirm Deletion",
  //       "Are you sure you want to delete this account? \n \n Your account will be permanently deleted. You will lose all your data, including payment details and profile information.",
  //       [
  //         {
  //           text: "Cancel",
  //           onPress: () => console.log("Cancel Pressed"),
  //           style: "cancel",
  //         },
  //         {
  //           text: "Yes",
  //           onPress: () => deleteUser(),
  //         },
  //       ]
  //     );
  //   };

  const deleteUser = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        getApiUri(`DeleteCustomer?mst_customer_id=${data?.cusid}`)
      );
      if (response && response?.data?.success) {
        setLoading(false);
        alert("Your account deleted successfully");
        setOtpEnabled(false);
        setGenratedOtp(null);
        setOtp(false);
        setEmail("");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const valid = validateOtp();
      if (valid && genratedOtp === otp) {
        const response = await axios.post(
          getApiUri(
            `Verify_OTP?autoid=${autoId}&generated_otp=${genratedOtp}&entered_otp=${otp}`
          )
        );
        if (
          response &&
          response?.data?.statuscode == 200 &&
          response.data.msgcode != "4" &&
          response?.data?.success
        ) {
          setOtpEnabled(false);
          setEmail("");
          setOtp("");
          deleteUser();
        } else {
        }
      } else {
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validate = () => {
    let valid = true;
    let err = {};
    if (!isValidEmail(email)) {
      valid = false;
      err.email = "Please enter a valid email address...";
    }
    setError(err);
    return valid;
  };

  const validateOtp = async () => {
    let valid = true;
    let err = {};
    if (!otp?.length < 7) {
      err.otp = "check your otp...";
      valid = false;
    }
    setError(err);
    return valid;
  };

  if (loading) {
    return (
      <><Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 25,
          flexDirection: "column",
          marginTop: 100,
          color: "#fff",
        }}
      >
        Loading...
      </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: "oswald",
            fontWeight: "bold",
            color: "#3c3c3c",
            marginBottom: 10,
            marginTop: 10,
            fontSize: 25,
          }}
        >
          DeleteAccount
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
          }}
        >
          <div
            style={{
              fontFamily: "oswald",
              fontWeight: "bold",
              color: "#3c3c3c",
              marginBottom: 20,
              fontSize: 20,
            }}
          >
            User can delete their account from here
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              padding: "20px 20px",
              backgroundColor: "#ccfcf9",
              width: "60%",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontFamily: "oswald",
                fontWeight: "bold",
                color: "#236fa1",
                marginBottom: 20,
              }}
            >
              Email
            </div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              style={{
                borderRadius: 10,
                borderWidth: 0.5,
                //   paddingRight: 10,
                paddingLeft: 10,
                paddingTop: 10,
                paddingBottom: 10,
                width: "96%",
                marginBottom: 30,
              }}
            />
            <div
              onClick={() => handleLogin()}
              style={{
                display: 'flex',
                justifyContent:'center',
                alignItems: 'center',
                width: "100%",
                fontWeight: '500',
                backgroundColor: "#5bbf58",
                color: '#fff',
                borderRadius: 10,
                //   padding: "10px 10px",
                paddingTop: 8,
                paddingBottom: 8,
                marginBottom: 20,
                cursor: "pointer",
              }}
            >
              Send Otp
            </div>
            {otpEnabled ? (
              <>
                <div
                  style={{
                    fontFamily: "oswald",
                    fontWeight: "bold",
                    color: "#236fa1",
                    marginBottom: 20,
                  }}
                >
                  Enter otp to delete account
                </div>
                <div
                  style={{
                    fontFamily: "oswald",
                    fontWeight: "bold",
                    color: "#236fa1",
                    marginBottom: 10,
                  }}
                >
                  OTP
                </div>
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  separator={<span>-</span>}
                  inputStyle={{ marginBottom: 20 }}
                  containerStyle={{ width: "100%" }}
                />
                <div
                  onClick={() => deleteUser()}
                  style={{
                    width: "100%",
                    backgroundColor: "#5bbf58",
                    borderRadius: 10,
                    display: 'flex',
                    justifyContent:'center',
                    alignItems: 'center',
                    fontWeight: '500',
                    color: '#fff',
                    //   padding: "10px 10px",
                    paddingTop: 7,
                    paddingBottom: 7,
                    cursor: "pointer",
                  }}
                >
                  Delete Account
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
