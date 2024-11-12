import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import getApiUri from "../../../utils/api.util";
import logo from "../../../assets/logo.png";
import { OtpInput } from "reactjs-otp-input";

const CreateAccount = ({email,setEmail, setVisible}) => {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [genratedOtp, setGenratedOtp] = useState();
  const [autoId, setAutoId] = useState();
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [data, setData] = useState([]);

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const validate = () => {
    let valid = true;
    let err = { email: "" };
    if (!isValidEmail(email)) {
      valid = false;
      alert("Please enter a valid email address...");
      err.email = "Please enter a valid email address...";
    }
    setError(err);
    return valid;
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const valid = await validate();
      console.log({ email });
      // return;
      if (valid) {
        const res = await axios.post(
          getApiUri(`Generate_OTP?txtmobileno=${email}&role_id=2`)
        );
        if (
          res &&
          res.data &&
          res?.data?.msgcode != "4" &&
          res?.data?.statuscode == 200 &&
          res?.data?.success == true
        ) {
          console.log("res?.data?.OTP", res?.data?.OTP);

          await axios.post(
            getApiUri(`sendMail?recipientEmail=${email}&otp=${res?.data?.OTP}`)
          );

          if (res?.data?.msgcode === "6" || res?.data?.msgcode === "1") {
            //go to verify otp
            // setemail('');
            setOtp("");
            setGenratedOtp(res?.data?.OTP);
            setAutoId(res?.data?.data?.Table[0]?.Uplift_Signup_id);
            setOtpEnabled(true);
            setOtp("");
            // setToastMessage('Your OTP has been sent to your email.');
            alert("Your OTP has been sent to your email.");
            setLoading(false);
          }

          if (res.data.msgcode === "2") {
            // go to for create password
            // await localStorage.setItem(
            //   'USER_CONTEXT',
            //   JSON.stringify({
            //     ...res?.data?.data.Table[0],
            //     msgcode: res?.data?.msgcode,
            //   }),
            // );
            // authContext.signIn();
            setVisible('CREATE_PASSWORD')
            setLoading(false);
          }
          if (res.data.msgcode === "3") {
            // go to for registration
            setVisible('REGISTRATION')
            setLoading(false);
            // localStorage.clear();
            // localStorage.setItem(
            //   'USER_CONTEXT',
            //   JSON.stringify({
            //     ...res?.data?.data.Table[0],
            //     msgcode: res?.data?.msgcode,
            //   }),
            // );
            // authContext.Password();
          }
          if (res?.data?.OTP.includes("000000")) {
            alert("Your email is already registered please signIn.");
            setLoading(false);
            // navigation.navigate(ScreensNameEnum.LOGIN);
          } else {
            // alert("Your OTP is", res?.data?.OTP);
          }
        } else {
          setLoading(false);
          alert(
            `Your email ${email} is already registered. Please log in.\nIf you have trouble logging in, click on "Forgot Password."`
          );
          // Alert.alert(`Your email ${email} is already registered. Please log in. \n If you have trouble logging in, click on "Forgot Password."`);
          // navigation.navigate(ScreensNameEnum.LOGIN);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Alert.alert(`something went wrong please try again later...`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpEnabled(false);
    setOtp("");
  };

  const validateOtp = async () => {
    let valid = true;
    let err = { otp: "" };
    if (!(otp?.length < 7)) {
      err.otp = "check your otp...";
      valid = false;
    }
    setError(err);
    return valid;
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const valid = await validateOtp();
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
          // await sInfoUtil.save(
          //   'USER_CONTEXT',
          //   JSON.stringify({
          //     ...response?.data.data.Table1[0],
          //     msgcode: response.data.msgcode,
          //   }),
          // );
          console.log('res---',response.data)
          // return;
          setVisible('CREATE_PASSWORD')
          setOtpEnabled(false);
          setEmail("");
          setOtp("");
          // authContext.signIn();
        } else {
          // Alert.alert(
          //   `Account with this email is  already exists. Please login`,
          // );
          // navigation.navigate(ScreensNameEnum.LOGIN);
        }
      } else {
        // Alert.alert('your Otp is invalid please Enter the correct Otp');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Alert.alert('something went wrong please try again later...');
    }
  };

  // const setToastMessage = message => {
  //   if (Platform.OS === 'ios') {
  //     showMessage({
  //       message: 'Your OTP has been sent to your email.',
  //       type: 'success',
  //       icon: {icon: 'success', position: 'left'},
  //     });
  //   } else {
  //     ToastAndroid.showWithGravity(
  //       message,
  //       ToastAndroid.SHORT,
  //       ToastAndroid.BOTTOM,
  //     );
  //   }
  // };

  return (
    <>
      <div style={styles.container}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>Create User</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          {console.log({ data })}
          {data?.mst_company_logo ? (
            <></>
          ) : (
            // <FastImage
            //   style={{height: hp(35), width: wp(75)}}
            //   source={{
            //     uri: data?.mst_company_logo,
            //     headers: {Authorization: 'someAuthToken'},
            //     priority: FastImage.priority.normal,
            //   }}
            //   resizeMode={FastImage.resizeMode.contain}
            //   onLoadStart={handleLoadStart}
            //   onLoadEnd={handleLoadEnd}
            // />
            <></>
            // <Image
            //   source={images.Logo}
            //   style={{height: hp(35), width: wp(75)}}
            //   resizeMode="contain"
            // />
          )}
        </div>

        <div
          style={{
            marginLeft: 30,
            marginRight: 30,
            marginTop: 30,
            paddingTop: 20,
            width: "40%",
            alignSelf: "center",
            backgroundImage: 'linear-gradient(to bottom,#faf9f9,#f3e2f8)',
            border: '0.5px solid #3c3c3c',
            display: "flex",
            flexDirection: "column",
            borderRadius: 5,
          }}
        >
          <img
            src={logo}
            style={{
              width: 150,
              height: 50,
              display: "flex",
              alignSelf: "center",
              marginBottom: 30,
            }}
          />
          {!otpEnabled ? (
            <>
              <div
                style={{
                  marginBottom: "20px",
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <div
                  style={{
                    color: "#3c3c3c",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Enter your Email*.
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setError({ ...error, email: null })}
                    onBlur={() => {
                      // You can add validation or other logic here if needed
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "16px",
                      border: `1px solid ${error?.email ? "red" : "#3c3c3c"}`,
                      borderRadius: "5px",
                      outline: "none",
                    }}
                    maxLength={50}
                  />
                </div>

                {/* {error?.email && (
                  <span
                    style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                  >
                    {error.email}
                  </span>
                )} */}
              </div>
            </>
          ) : (
            <div style={{display: 'flex',justifyContent: 'center',flexDirection:'column',alignItems:'center'}}>
              <div
                style={{
                  color: "#3c3c3c",
                  fontWeight: "500",
                  fontSize: 15,
                  marginBottom:20
                }}
              >
                {" "}
                Enter your OTP
              </div>
              <OtpInput
                value={otp}
                onChange={(code) => setOtp(code)}
                numInputs={6}
                separator={<span>-</span>}
                inputStyle={{ marginBottom: 20 }}
                containerStyle={{ width: "100%", display:'flex',flexDirection:'row',justifyContent:'center' }}
              />
              {/* <OTPInputView
                      style={{width: '100%', height: 80, alignSelf: 'center'}}
                      pinCount={6}
                      onCodeChanged={code => setOtp(code)}
                      codeInputFieldStyle={styles.underlineStyleBase}
                      codeInputHighlightStyle={styles.underlineStyleHighLighted}
                      onCodeFilled={code => setOtp(code)}
                      keyboardType="number-pad"
                      keyboardAppearance="default"
                      placeholderTextColor={R.colors.Blue}
                      autoFocusOnLoad={false}
                      //  selectionColor='red'
                    /> */}
            </div>
          )}
          {otpEnabled && (
            <div
              style={{
                width: "100%",
                borderRadius: 8,
                alignSelf: "center",
                marginTop: 10,
              }}
              onClick={handleChangeNumber}
            >
              <div
                style={{
                  textAlign: "center",
                  color: "#3c3c3c",
                  fontSize: 17,
                  padding: 5,
                  paddingLeft: 9,
                  paddingRight: 9,
                  fontWeight: "bold",
                }}
              >
                Change your email
              </div>
            </div>
          )}
          {otpEnabled && (
            <div
              style={{
                alignSelf: "center",
                marginTop: 8,
              }}
              onClick={handleLogin}
            >
              <div
                style={{
                  textAlign: "center",
                  color: "#3c3c3c",
                  fontSize: 16,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                  marginBottom:20
                }}
              >
                Resend Otp
              </div>
            </div>
          )}
          <div
            style={{
              // justifyContent: 'flex-end',
              display: "flex",
              // marginTop: 30,
              marginBottom: 30,
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              borderRadius: 5,
              backgroundColor: "#25a6b8",
              width: "60%",
              padding: 10,
            }}
          >
            <div
              onClick={
                !otpEnabled && email?.length < 10
                  ? true
                  : otpEnabled && otp?.length < 6
                  ? true
                  : false
                  ? () => {}
                  : () => {
                      !otpEnabled ? handleLogin() : verifyOtp();
                    }
              }
              style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}
            >
              {!otpEnabled ? "Continue" : "Verify OTP"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 5,
    elevation: 10,
    backgroundColor: "#e6e6e6",
    fontSize: 15,
    color: "#3c3c3c",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  resetContainer: {
    justifyContent: "center",
    // flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  pressableText: {
    color: "green",
    fontFamily: "oswald",
    fontSize: 15,
    fontWeight: "bold",
  },
  singinText: {
    fontSize: 16,
    color: "#3c3c3c",
    fontWeight: "bold",
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  underlineStyleBase: {
    color: "#3c3c3c",
    width: "10%",
    height: "5%",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  underlineStyleHighLighted: {
    borderColor: "lightblue",
  },
};

export default CreateAccount;
