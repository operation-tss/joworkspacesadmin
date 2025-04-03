import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Backdrop,
} from "@mui/material"; // Using Material-UI for styling
import { styled } from "@mui/system";
import active from "../../assets/check.png";
import inactive from "../../assets/deactivate.png";
// import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import getApiUri from "../../utils/api.util";
import Header from "../../components/Header/Header";
import download from "../../assets/download.png";
import pdfIcon from "../../assets/pdf.png";
import placeHolder from "../../assets/placeholderProfile.png";
import moment from "moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// import { currentUserSelector } from '../../store/slices/user/user.slice';
// import { getCustomerProfileListDetails } from '../../store/actions/customerAction';

const CustomerDetails = () => {
  const localStorageUser = JSON.parse(localStorage.getItem("user"));
  console.log({ localStorageUser });
  const user = {
    ...localStorageUser?.data?.Table,
    ...localStorageUser?.data?.Table2,
  };
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [seacrchValue, setSeacrchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [docloading, setdocLoading] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [invoicedataa, setInvoiceData] = useState();
  const [showDocs, setShowDocs] = useState("");

  const [docsData, setDocsData] = useState([]);

  const handleDocs = async (customer_id) => {
    try {
      // if (customer_id) {
      //   settypeVis(!typeVis);
      // }

      setdocLoading(customer_id);
      const docsResponse = await axios.get(
        getApiUri(`AdminCustomerDocument?PAYMENT_CUSID=${customer_id}`)
      );
      if (
        docsResponse &&
        docsResponse?.data?.statuscode == 200 &&
        docsResponse?.data?.success
      ) {
        const fetchedDocs = docsResponse?.data?.data;
        setDocsData(fetchedDocs);

        setdocLoading("");
      }
    } catch (error) {
      setdocLoading("");
      console.log("eror", error);
    }
  };

  const handleClickOpen = (msg, cusId, invoiceData) => {
    setMessage(msg);
    setCustomerID(cusId);
    setInvoiceData(invoiceData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    handleUserStatus(customerID, invoicedataa);
    // alert("Confirmed!");
  };

  const handleUserStatus = async (cusId, invoicedataa) => {
    try {
      setLoading(true);
      const profileStatusRes = await getCustomerProfileStatus(cusId);
      console.log({ profileStatusRes });
      if (
        profileStatusRes?.data?.length > 0 &&
        profileStatusRes?.statuscode === 200
      ) {
        // const cust_Docs_Res = await getCustomerProfileListDetails();
        // if (
        //   cust_Docs_Res?.type?.includes("fulfilled") &&
        //   Array.isArray(cust_Docs_Res?.payload) &&
        //   cust_Docs_Res?.payload?.length > 0
        // )
        handleRefresh();
        alert(
          `User profile is ${
            invoicedataa?.Isactive === "InActive" ? "Activated" : "Deactivated"
          }`
        );
        // showMessage({
        //   message: `Profile is (${
        //     invoicedata?.Isactive === "InActive" ? "Active" : "InActive"
        //   })`,
        //   type: `${
        //     invoicedata?.Isactive === "InActive" ? "success" : "danger"
        //   }`,
        //   icon: {
        //     icon: `${
        //       invoicedata?.Isactive === "InActive" ? "success" : "danger"
        //     }`,
        //     position: "left",
        //   },
        // });
        // setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerProfileStatus = async (cusId) => {
    try {
      const url = getApiUri(`AdminCustomerUpdateIsActive?CusId=${cusId}`);
      const res = await axios.post(url);
      console.log(res?.data);
      if (res && res?.data?.success && res?.data?.statuscode === 200) {
        return res?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomerProfileListDetails = async (cusId) => {
    try {
      const url = getApiUri(`AdminCustomerDetailsProfile`);
      const res = await axios.get(url);
      if (res && res?.data?.success && res?.data?.statuscode === 200) {
        return res?.data?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   const dispatch = useDispatch();

  useEffect(() => {
    fetchCustDetail();
  }, []);

  const handleRefresh = async () => {
    console.log("Starting refresh...");
    setRefreshing(true);
    try {
      await fetchCustDetail();
      console.log("Refresh successful");
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCustDetail = async () => {
    try {
      setLoading(true);
      const url = getApiUri(`AdminCustomerDetailsProfile`);
      const res = await axios.get(url);
      if (res && res?.data?.success && res?.data?.statuscode === 200) {
        setData(res?.data?.data);
        setDataCopy(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ran");
    if (seacrchValue) {
      let searchData = [...dataCopy];
      console.log({ searchData });
      searchData = searchData.filter((el) =>
        el.mst_customer_name.toLowerCase().includes(seacrchValue)
      );
      setData(searchData);
    } else {
      setData(dataCopy);
    }
  }, [seacrchValue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header />
      <Container style={{ marginTop: "20px", textAlign: "center" }}>
        <Typography
          variant="h6"
          style={{ marginBottom: "20px", fontWeight: "bold" }}
        >
          Customer Details
        </Typography>
        <div style={{ padding: "0px 0px 0px 7%" }}>
          <input
            style={{
              width: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              columnGap: 20,
              borderRadius: 5,
              padding: "9px 0px 9px 10px",
              borderWidth: 0.5,
              // marginBottom: 20,
            }}
            placeholder="Type to search user"
            value={seacrchValue}
            onChange={(e) => {
              setSeacrchValue(e.target.value);
            }}
          />
        </div>
        {loading ? (
          <CircularProgress />
        ) : data?.length ? (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                padding: "10px 7% 10px 7%",
              }}
            >
              {data.map((item, index) => {
                const invoicedata = item;
                console.log({ invoicedata });
                return (
                  <div
                    style={{
                      width: "45%", // Adjust the width to 50% minus margin for two items per row
                      marginRight: "4%", // Space between items
                      marginBottom: 15, // Space between rows
                      // border: "0.2px solid #3c3c3c",
                      borderRadius: 5,
                      boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                      // height: 'auto',
                      alignSelf: "flex-start",
                    }}
                    key={index}
                  >
                    <Card
                      style={{
                        // marginBottom: 15,
                        elevation: 5,
                        backgroundColor: "#efdaf5",
                      }}
                    >
                      <CardContent style={{ borderRadius: 12, paddingTop: 0 }}>
                        <div
                          style={{
                            marginTop: 10,
                            border: "0.5px solid gray",
                            borderRadius: 5,
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingBottom: 0,
                            backgroundColor:'#fff'
                          }}
                        >
                          {invoicedata.mst_customer_logo ? (
                            <img
                              src={invoicedata.mst_customer_logo}
                              alt="Company Logo"
                              style={styles.photo}
                              
                            />
                          ) : (
                            <img
                              src={placeHolder}
                              alt="No Logo"
                              style={styles.photo}
                            />
                          )}
                        </div>
                        <div style={{ paddingTop: 8 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 10,
                              marginBottom: 10,
                              paddingVertical: 8,
                            }}
                          >
                            <Typography
                              style={{
                                fontWeight: "600",
                                alignSelf: "center",
                                color:
                                  invoicedata?.Isactive === "Active"
                                    ? "darkgreen"
                                    : "orangered",
                              }}
                            >
                              {`Profile (${invoicedata?.Isactive})`}
                            </Typography>
                            {invoicedata?.Isactive === "Active" ? (
                              <img
                                src={active}
                                alt="Company Logo"
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            ) : (
                              <img
                                src={inactive}
                                alt="No Logo"
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            )}
                            {/* <Icon
                        style={{
                          color:
                            invoicedata?.Isactive === "Active"
                              ? "green"
                              : "red",
                          marginLeft: 15,
                        }}
                      /> */}
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Company Name:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata.mst_customer_name}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Customer Number:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_contact_no}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Customer Email:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_Email}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Contact Person:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_contactperson}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Contact Person No:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_contactpersonNo}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Pancard No:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_pan_no}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Gst No:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {invoicedata?.mst_customer_gst_no}
                            </Typography>
                          </div>
                          <div style={styles.section}>
                            <Typography
                              style={{
                                width: "45%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "left",
                              }}
                            >
                              Date:
                            </Typography>
                            <Typography
                              style={{
                                width: "55%",
                                fontSize: 15,
                                color: "#3c3c3c",
                                textAlign: "right",
                              }}
                            >
                              {moment(invoicedata?.Createdon).format(
                                "MMM Do YYYY"
                              )}
                            </Typography>
                          </div>
                        </div>

                        <div
                          style={{
                            backgroundColor:
                              invoicedata?.Isactive === "Active"
                                ? "darkgreen"
                                : "orangered",
                            color: "#fff",
                            paddingTop: 5,
                            paddingBottom: 5,
                            marginTop: 5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleClickOpen(
                              `Are you sure, you want to ${
                                invoicedata?.Isactive === "Active"
                                  ? "Deactivate"
                                  : "Activate"
                              } user ?`,
                              invoicedata?.mst_customer_id,
                              invoicedata
                            )
                          }
                        >
                          {invoicedata?.Isactive}
                        </div>
                        {open ? (
                          <ConfirmationDialog
                            open={open}
                            onClose={handleClose}
                            onConfirm={() => handleConfirm()}
                            message={message}
                          />
                        ) : (
                          <></>
                        )}
                        <div
                          style={{
                            backgroundColor: "#40ad99",
                            color: "#3c3c3c",
                            paddingTop: 5,
                            paddingBottom: 5,
                            marginTop: 5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            if (showDocs === invoicedata?.mst_customer_id) {
                              setShowDocs("");
                              return;
                            }
                            await handleDocs(invoicedata?.mst_customer_id);
                            setShowDocs(invoicedata?.mst_customer_id);
                          }}
                        >
                          {docloading === invoicedata?.mst_customer_id
                            ? "loading..."
                            : "Verification Documents"}
                        </div>
                        {showDocs === invoicedata?.mst_customer_id ? (
                          <div
                            style={{
                              backgroundColor: "lightblue",
                              padding: "5px 5px 5px 5px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0px 10px 0px",
                                fontWeight: "bold",
                              }}
                            >
                              Download Documents
                            </div>
                            {docsData.map((item) => {
                              const getFileExtention = (fileUrl) => {
                                let extension = fileUrl?.substr(
                                  fileUrl.lastIndexOf(".")
                                );
                                if (extension != undefined) {
                                  return extension;
                                } else {
                                  return "";
                                }
                                // return /[.]/.exec(fileUrl) ?
                                // /[^.]+$/.exec(fileUrl) : undefined;
                              };

                              let file_ext = getFileExtention(
                                item?.mst_customer_docs_path
                              );

                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingRight: 15,
                                    paddingLeft: 15,
                                  }}
                                >
                                  <div>
                                    {item?.mst_customer_docs_type
                                      .split("_")
                                      .join(" ")
                                      .toUpperCase()}
                                  </div>
                                  {file_ext === ".pdf" ? (
                                    <img
                                      src={pdfIcon}
                                      style={{ width: 30, height: 30 }}
                                    />
                                  ) : (
                                    <img
                                      src={item?.mst_customer_docs_path}
                                      style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: "cover",
                                        borderRadius: 5,
                                        borderWidth: 0.05,
                                      }}
                                    />
                                  )}
                                  <a
                                    href={item.mst_customer_docs_path}
                                    download={true}
                                    target="_blank"
                                  >
                                    <img
                                      src={download}
                                      style={{ width: 30, height: 30 }}
                                    />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <></>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No Record Found
          </Typography>
        )}

        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          style={{ marginTop: "20px" }}
        >
          Refresh
        </Button> */}
      </Container>
    </div>
  );
};

const TransparentDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogPaper-root": {
    backgroundColor: "transparent", // Set the background to transparent
    boxShadow: "none", // Remove any shadow for full transparency
    borderRadius: "8px", // Optional: to give rounded corners to the dialog
  },
  "& .MuiDialogTitle-root": {
    padding: "8px 16px", // Optional: adjust padding for the title
  },
  "& .MuiDialogContent-root": {
    padding: "16px", // Optional: adjust padding for content
  },
  "& .MuiDialogActions-root": {
    padding: "8px 16px", // Optional: adjust padding for actions
  },
}));

function ConfirmationDialog({ open, onClose, onConfirm, message }) {
  return (
    <Backdrop 
    invisible={true}>
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          // backgroundColor: 'transparent', // Transparent background
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Decreased shadow (adjust values as needed)
          borderRadius: "8px", // Optional: rounded corners
        },
      }}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </Backdrop>
  );
}

function VerificationDocuments({ open, onClose, onConfirm, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          // backgroundColor: 'transparent', // Transparent background
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Decreased shadow (adjust values as needed)
          borderRadius: "8px", // Optional: rounded corners
        },
      }}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const styles = {
  photo: {
    width: "100%",
    height: "200px",
    objectFit: "fill",
    // marginBottom: 15,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 8,
  },
};

export default CustomerDetails;
