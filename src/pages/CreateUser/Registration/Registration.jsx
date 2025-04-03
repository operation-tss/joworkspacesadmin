import React, { useContext, useEffect, useState } from "react";
import ValidationHelper from "../../../utils/ValidationHelper";
import getApiUri from "../../../utils/api.util";
import "./Registration.css";
import axios from "axios";
// import ImagePicker from 'react-native-image-crop-picker';

const Registration = ({ email, setEmail, setVisible }) => {
  const [name, setName] = useState("");

  // const email =
  //   user?.Uplift_Signup_User_Email_Id || user?.Uplift_Signup_User_Phone_No;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  // const [isVisible, setVisible] = useState(false);
  const [success, setSuccess] = useState(true);
  const [topic, setTopic] = useState("");
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [contactPersonName, setContPersonName] = useState("");
  const [contactPersonNumber, setContPersonNumber] = useState("");
  const [gstNo, setgstNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [companyLogo, setCompanyLogo] = useState({});
  const [panCard, setPanCard] = useState({});
  const [gst, setGst] = useState({});
  const [mobileNumber, setMobileNumber] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  const validatePANNumber = (panNumber) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  };

  const IsvalidateGSTNumber = (gstNumber) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  };

  // useEffect(() => {}, [email]);

  const validate = () => {
    let valid = true;
    let err = {};
    if (name == "" && name.length == 0) {
      valid = false;
      err.name = "Please enter your company name.";
    }
    if (!ValidationHelper.isPhone(mobileNumber)) {
      err.mobileNumber = "Enter a Valid phone number";
      valid = false;
    }
    if (mobileNumber < 10 || mobileNumber > 10) {
      err.mobileNumber = "Enter a Valid phone number";
      valid = false;
    }
    if (email?.length >= 1 && !isValidEmail(email)) {
      valid = false;
      err.email = "Please enter a valid email address...";
    }
    if (contactPersonName == "" && contactPersonName.length == 0) {
      valid = false;
      err.contactPersonName = "Please enter contact person name.";
    }
    if (!ValidationHelper.isPhone(contactPersonNumber)) {
      err.contactPersonNumber = "Enter a Valid contact phone number.";
      valid = false;
    }
    if (contactPersonNumber < 10 || contactPersonNumber > 10) {
      err.contactPersonNumber = "Enter a Valid phone number";
      valid = false;
    }
    if (!IsvalidateGSTNumber(gstNo)) {
      valid = false;
      err.gstNo = " Please enter valid GST number .";
    }
    if (!validatePANNumber(panNo)) {
      valid = false;
      err.panNo = "Please enter valid  Pan No.";
    }
    console.log("gst?.name", gst?.name);
    // console.log(Object.keys(gst))
    if (!gst?.name) {
      valid = false;
      err.gst = true;
      err.gstErrorText = "Please select your gst..";
    }
    if (gst?.size > 1015 * 1024) {
      valid = false;
      err.gst = true;
      err.gstErrorText = "Please select file less than 1mb";
    }
    console.log("panCard?.name", panCard?.name);
    if (!panCard?.name) {
      valid = false;
      err.panCard = true;
      err.panCardErrorText = "Please select your panCard..";
    }
    if (panCard?.size > 1015 * 1024) {
      valid = false;
      err.panCard = true;
      err.panCardErrorText = "Please select file less than 1mb";
    }
    // if (Object.keys(companyLogo).length === 0) {
    //   err.companyLogo = true;
    // }
    console.log({ err });
    setError(err);
    return valid;
  };

  // async function getCameraPermissions() {
  //   try {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     ]);
  //     if (
  //       granted['android.permission.CAMERA'] ===
  //       PermissionsAndroid.RESULTS.GRANTED
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }

  // const handleUploadProfileIMage = async side => {
  //   const perm = await getCameraPermissions();
  //   if (perm) {
  //     ImagePicker.openPicker({
  //       width: 300,
  //       height: 250,
  //       cropping: true,
  //     })
  //       .then(image => {
  //         setProfileImage(image);
  //       })
  //       .catch(e => {
  //         if (e.message.includes('cancelled')) {
  //           console.log('Image selection was cancelled by the user.');
  //         } else {
  //           console.log('image selection cancelled', e);
  //         }
  //         //Always ends up here even on image selection
  //       });
  //   }
  // };

  // Example function to pick an image
  const handleDocsPicker = async (side, file) => {
    console.log("File:", file[0]);
    setLoading(true);
    try {
      // const res = await DocumentPicker.pick({
      //   type: [
      //     // DocumentPicker.types.doc,
      //     DocumentPicker.types.images,
      //     DocumentPicker.types.pdf,
      //   ],
      //   // allowMultiSelection: true,
      // });
      if (file?.length && file[0]?.type === "image/webp") {
        setLoading(false);
        return alert("Please Upload only jpg or png images");
      }
      if (file[0]?.length !== 0) {
        setLoading(false);
        if (side === "Pan_card") {
          console.log("this ran Pan_card");
          setPanCard(file[0]);
          setError({ ...error, panCard: false });
          setLoading(false);
        }
        if (side === "Gst_doc") {
          console.log("this ran Gst_doc");
          setGst(file[0]);
          setError({ ...error, gst: false });
          setLoading(false);
        }
      }
    } catch (err) {
      // if (DocumentPicker.isCancel(err)) {
      //   setLoading(false);
      //   // Handle canceled selection
      //   console.log("User canceled the picker");
      // } else {
      setLoading(false);
      // Handle other errors
      alert("Error while picking a file: " + JSON.stringify(err));
      console.error("Error while picking a file:", err);
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async (side, files) => {
    setLoading(true);
    try {
      console.log(files[0]);
      setCompanyLogo(files[0]);
      setLogoUploaded(true);
      // const res = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.images],
      // });
      // if (res?.length && res[0]?.type === "image/webp") {
      //   setLoading(false);
      //   return alert("Please Upload only jpg or png images");
      // }
      // if (res[0]?.length !== 0) {
      //   setLoading(false);
      //   if (side === "company_Logo") {
      //     setCompanyLogo(res[0]);
      //     setLogoUploaded(true);
      //     // setError({...error, companyLogo: false});
      //   }
      // }
    } catch (err) {
      // if (DocumentPicker.isCancel(err)) {
      // setLoading(false);
      // } else {
      alert("Error while picking a file: " + JSON.stringify(err));
      console.error("Error while picking a file:", err);
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = async () => {
    setName("");
    setMobileNumber("");
    setEmail("");
    setContPersonName("");
    setgstNo("");
    setPanNo("");
    setCompanyLogo("");
    setContPersonNumber("");
    if (topic?.includes("BUYER ALLREADY EXISTS")) {
      // navigation.navigate(ScreensNameEnum.LOGIN);
    }
  };

  const handleRegister = async () => {
    const valid = validate();
    console.log({ valid });
    console.log("companyLogoFile:", companyLogo);
    console.log("Pan Card File:", panCard);
    console.log("GST File:", gst);

    const formData1 = new FormData();
    formData1.append("company_Logo", companyLogo);

    console.log("formData1 Entries:");
    formData1.forEach((value, key) => {
      console.log(key, value);
    });

    // const formData2 = new FormData();
    // if (panCard) {
    //   formData2.append("Pan_card", panCard);
    // }
    // if (gst) {
    //   formData2.append("Gst_doc", gst);
    // }

    // // Log formData2 entries for debugging
    // console.log("FormData2 Entries:");
    // formData2.forEach((value, key) => {
    //   console.log(key, value);
    // });

    if (!valid) return;
    console.log("error");
    // return;
    //

    try {
      setLoading(true);

      // Prepare form data for the first API call
      const formData1 = new FormData();
      formData1.append("company_Logo", companyLogo);

      // First API call
      const response = await axios.post(
        getApiUri(
          `CustomerDetails?CustomerName=${name}&CustomerContactPerson=${contactPersonName}&ContactNo=${mobileNumber}&CustomerGstNo=${gstNo}&CustomerPanNo=${panNo}&CustomerEmail=${email}&contactPersonNumber=${contactPersonNumber}`
        ),
        logoUploaded === true ? formData1 : null,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check the response from the first API call
      if (response?.data?.success && response?.data?.data[0]?.mst_customer_id) {
        const customerId = response.data.data[0].mst_customer_id;

        // Prepare form data for the second API call
        const formData2 = new FormData();
        if (panCard) {
          formData2.append("PanCard", panCard);
        }
        if (gst) {
          formData2.append("GST", gst);
        }

        // Log formData2 entries for debugging
        console.log("FormData2 Entries:");
        formData2.forEach((value, key) => {
          console.log(key, value);
        });

        // Second API call
        console.log(getApiUri(`CusDocument?Id=${customerId}`));
        const responseUpload = await axios.post(
          getApiUri(`CusDocument?Id=${customerId}`),
          formData2,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Check the response from the second API call
        if (
          responseUpload?.data?.includes(
            "Documents uploaded and paths saved successfully"
          )
        ) {
          setTopic(response?.data?.msg);
          setSuccess(true);
          setName("");
          setContPersonName("");
          setgstNo("");
          setPanNo("");
          setCompanyLogo("");
          setVisible("CREATE_ACCOUNT");
          alert("User Created Successfully");
        } else {
          alert("Document upload failed, please try again.");
        }
      } else if (
        response?.data?.msg?.includes("ALREADY SUBMITTED SUCCESSFULLY")
      ) {
        setVisible("CREATE_ACCOUNT");
        alert("User Created Successfully");
      } else {
        alert("Registration failed, please try again.");
      }
    } catch (error) {
      console.log("error", error);
      alert("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="registration-container">
        <div style={{}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              color: "#3c3c3c",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Customer Registration
          </div>
        </div>
        <div style={{ paddingTop: "8%" }}>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="companyName">
              Company Name (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Company Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setError({ ...error })} // Reset error when input is focused
              onBlur={() => {
                // Add validation logic here if needed
              }}
              maxLength={100}
            />
            {error?.name && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.name}
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="mobileNumber">
              Phone (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Your mobile number..."
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onFocus={() => setError({ ...error })} // Reset error when input is focused
              onBlur={() => {
                // Add validation logic here if needed
              }}
              maxLength={10}
              inputMode="numeric" // Ensures numeric keyboard on mobile devices
            />
            {error?.mobileNumber && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.mobileNumber}
              </span>
            )}
          </div>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="contactPersonName">
              Contact Person Name (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="contactPersonName"
              name="contactPersonName"
              placeholder="Your contact person..."
              value={contactPersonName}
              onChange={(e) => setContPersonName(e.target.value)}
              onFocus={() => setError({ ...error })} // Reset error when input is focused
              onBlur={() => {
                // Add validation logic here if needed
              }}
            />
            {error?.contactPersonName && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.contactPersonName}
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="contactPersonNumber">
              Contact person Number (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="contactPersonNumber"
              name="contactPersonNumber"
              placeholder="Contact person mobile Number..."
              value={contactPersonNumber}
              onChange={(e) => setContPersonNumber(e.target.value)}
              onFocus={() => setError({ ...error })} // Reset error when input is focused
              onBlur={() => {
                // Add validation logic here if needed
              }}
              maxLength={10}
              inputMode="numeric" // Ensures numeric keyboard on mobile devices
            />
            {error?.contactPersonNumber && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.contactPersonNumber}
              </span>
            )}
          </div>

          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="gstNo">
              Gst No (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="gstNo"
              name="gstNo"
              placeholder="Your Gst No..."
              value={gstNo}
              onChange={(e) => setgstNo(e.target.value.toUpperCase())}
              onFocus={() => setError("")} // Reset error when the input is focused
              onBlur={() => {
                // Validation logic could be added here if needed
              }}
              maxLength={15}
            />
            {error?.gstNo && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.gstNo}
              </span>
            )}
            {/* {error && <span style={{ color: "red" }}>{error}</span>} */}
          </div>
          {/* <HelperText type="error" visible={!!error.gstNo}>
            {error.gstNo}
          </HelperText> */}
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="panNo">
              Pan Number (Required)*
            </label>
            <input
              className="registration-input"
              type="text"
              id="panNo"
              name="panNo"
              placeholder="Your Pan Number..."
              value={panNo}
              onChange={(e) => setPanNo(e.target.value.toUpperCase())}
              // onFocus={() => setError(null)} // Reset error when the input is focused
              onBlur={() => {
                // Validation logic could be added here if needed
              }}
              maxLength={10}
            />
            {error?.panNo && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.panNo}
              </span>
            )}
            {/* {error && <span style={{ color: 'red' }}>{error}</span>} */}
          </div>
          {/* <HelperText type="error" visible={!!error.panNo}>
            {error.panNo}
          </HelperText> */}

          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label className="registration-label" htmlFor="email">
              Email (Required)*
            </label>
            <input
              className="registration-input"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
            />
            {error?.email && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {error.email}
              </span>
            )}
            {/* {error && <span style={{ color: "red" }}>{error}</span>} */}
          </div>
          {/* <div type="error" visible={!!error.email}>
                  {error.email}
                </div> */}

          <div style={styles.uploadWrapper}>
            <div
              // activeOpacity={0.5}
              style={styles.buttonWrapper}
            >
              <div
                style={{
                  fontSize: 15,
                  color: "#3c3c3c",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  border: "0.5px solid #3c3c3c",
                  padding: "10px 20px 10px 20px",
                  justifyContent: "space-between",
                  borderRadius: 12,
                }}
              >
                choose company logo
                <input
                  className="registration-input picker"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => {
                    console.log(e.target.files[0].type);
                    if (
                      e.target.files[0].type === "image/png" ||
                      e.target.files[0].type === "image/jpeg" ||
                      e.target.files[0].type === "image/jpg"
                    ) {
                      handleImagePicker("company_Logo", e.target.files);
                    } else {
                      alert("Please select Image file");
                      e.target.value = null;
                      return;
                    }
                  }}
                />
              </div>
              {/* <Icon
                      name="cloud-upload"
                      size={50}
                      style={{paddingLeft: 15}}
                      color={COLORS.PRIMARY_TEXT}
                    /> */}
            </div>

            {logoUploaded && companyLogo?.uri ? (
              <img src={companyLogo?.uri} style={styles.image} />
            ) : (
              <></>
            )}
            {logoUploaded && companyLogo?.name ? (
              <div style={styles.fileNameText}>
                {companyLogo ? companyLogo?.name : null}
              </div>
            ) : (
              <></>
            )}
            {error.companyLogo ? (
              <div style={{ ...styles.err, paddingLeft: 5 }}>
                Please select your company logo..
              </div>
            ) : (
              <></>
            )}
          </div>
          <div style={styles.uploadWrapper}>
            <div style={styles.buttonWrapper}>
              <div
                style={{
                  fontSize: 15,
                  color: "#3c3c3c",
                  fontWeight: "700",
                  paddingRight: 18,
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  border: "0.5px solid #3c3c3c",
                  padding: "10px 20px 10px 20px",
                  justifyContent: "space-between",
                  borderRadius: 12,
                }}
              >
                upload your pancard
                <input
                  className="registration-input picker"
                  type="file"
                  onChange={(e) => {
                    console.log(e.target.files[0].type);
                    if (
                      e.target.files[0].type === "application/pdf" ||
                      e.target.files[0].type === "image/png" ||
                      e.target.files[0].type === "image/jpeg" ||
                      e.target.files[0].type === "image/jpg"
                    ) {
                      handleDocsPicker("Pan_card", e.target.files);
                    } else {
                      alert("Please select PDF file or Image file");
                      e.target.value = null;
                      return;
                    }
                  }}
                />
              </div>
              {/* <Icon
                      name="cloud-upload"
                      size={50}
                      // style={{paddingLeft: 15}}
                      color={COLORS.PRIMARY_TEXT}
                    /> */}
            </div>

            {panCard?.type === "application/pdf" ? (
              <></>
            ) : (
              // <Iconn
              //   name="file-pdf-box"
              //   size={100}
              //   style={{color: COLORS.Orange}}
              // />
              <>
                {panCard?.uri ? (
                  <img src={panCard?.uri} style={styles.image} />
                ) : (
                  <></>
                )}
              </>
            )}

            {panCard?.name ? (
              <div style={styles.fileNameText}>
                {panCard ? panCard?.name : null}
              </div>
            ) : (
              <></>
            )}
            {error.panCard ? (
              <div
                style={{
                  ...styles.err,
                  paddingLeft: 10,
                  alignSelf: "flex-start",
                }}
              >
                {error.panCardErrorText}
              </div>
            ) : null}
          </div>

          <div style={styles.uploadWrapper}>
            <div style={styles.buttonWrapper}>
              <div
                style={{
                  fontSize: 15,
                  color: "#3c3c3c",
                  fontWeight: "700",
                  paddingRight: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "0.5px solid #3c3c3c",
                  width: "100%",
                  padding: "10px 20px 10px 20px",
                  borderRadius: 12,
                }}
              >
                upload your GST
                <input
                  className="registration-input picker"
                  type="file"
                  onChange={(e) => {
                    console.log(e.target.files[0].type);
                    if (
                      e.target.files[0].type === "application/pdf" ||
                      e.target.files[0].type === "image/png" ||
                      e.target.files[0].type === "image/jpeg" ||
                      e.target.files[0].type === "image/jpg"
                    ) {
                      handleDocsPicker("Gst_doc", e.target.files);
                    } else {
                      alert("Please select PDF file or Image file");
                      e.target.value = null;
                      return;
                    }
                  }}
                />
              </div>
              {/* <Icon
                      name="cloud-upload"
                      size={50}
                      // style={{paddingLeft: 15}}
                      color={COLORS.PRIMARY_TEXT}
                    /> */}
            </div>
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {gst?.type === "application/pdf" ? (
                <></>
              ) : (
                // <Iconn
                //   name="file-pdf-box"
                //   size={100}
                //   style={{color: COLORS.Orange}}
                // />
                <>{gst?.uri && <img src={gst?.uri} style={styles.image} />}</>
              )}
              {gst?.name ? (
                <div style={styles.fileNameText}>{gst ? gst?.name : null}</div>
              ) : (
                <></>
              )}
              {error.gst ? (
                <div style={{ ...styles.err, paddingLeft: 5 }}>
                  {error.gstErrorText}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div onClick={handleRegister} className="register-button">
          {loading ? "loading..." : "Register"}
        </div>
      </div>

      {/* <StatusModal
        isVisible={isVisible}
        onModalClose={setVisible}
        topic={`${
          success
            ? `${topic} Please go to the login Page`
            : `${topic} Please go to the Login Page.`
        }`}
        success={topic?.includes('BUYER ALLREADY EXISTS') ? false : true}
        onConfirm={handleNavigation}
      /> */}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  input: {
    width: "100%",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
    color: "gray",
    textTransform: "capitalize",
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    elevation: 0,
    marginBottom: "2%",
    backgroundColor: "#25a6b8",
  },
  err: {
    color: "red",
    fontSize: 16,
  },
  fileNameText: {
    color: "gray",
    width: "80%",
    paddingTop: 2,
    textAlign: "center",
  },
  uploadWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "yellow",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 20,
    borderWidth: 0.5,
    marginTop: 20,
    borderColor: "#3c3c3c",
    resizeMode: "cover",
  },
};

export default Registration;
