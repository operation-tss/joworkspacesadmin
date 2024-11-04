import styled from "styled-components";
import getApiUri from "../../utils/api.util";
import "./PendingPayment.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import download from "../../assets/download.png";
import cross from "../../assets/cross.png";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import Header from "../../components/Header/Header";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 3%;
  padding-bottom: 5%;
  padding-left: 10%;
  padding-right: 10%;
  min-height: 80vh;
  h1 {
    color: #fab005;
  }
`;

export const PendingPayment = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, onModalClose] = useState(false);
  // const upload_inVoice_selector = useSelector(uploadInvoiveSelector);
  // console.log('upload_inVoice_selector', upload_inVoice_selector);
  // console.log('user', user);

  //current month and year.
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear().toString(); // Get current year as 'YYYY'

  //select month
  const [openMonth, setOpenMonth] = useState(false);
  const [monthValue, setMonthValue] = useState("");
  const [monthItems, setMonthItems] = useState([
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]);

  // select Year
  const generateYearItems = (startYear, endYear) => {
    const items = [];
    for (let year = startYear; year <= endYear; year++) {
      items.push({ label: year.toString(), value: year.toString() });
    }
    return items;
  };
  const [openYear, setOpenYear] = useState(false);
  const [yearValue, setYearValue] = useState("");
  const [yearItems, setYearItems] = useState(generateYearItems(2020, 2050));
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  //cutomer Dropdown
  const [openCustomer, setOpenCustomer] = useState(false);
  const [customerValue, setCustomerValue] = useState("");
  const [customerItem, setCustomerItem] = useState([]);
  const [error, setError] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCusData();
  }, []);

  const fetchCusData = async () => {
    try {
      const customerDataRes = await axios.get(
        getApiUri(`AdminCustomerDropdown`)
      );
      if (
        customerDataRes &&
        customerDataRes?.data?.statuscode === 200 &&
        customerDataRes?.data?.success
      ) {
        const customer_List = customerDataRes?.data?.data?.map((item) => {
          return {
            label: item.mst_customer_name,
            value: item?.mst_customer_id,
          };
        });
        setCustomerItem(customer_List);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchPendingList();
  }, []);

  const fetchPendingList = async () => {
    try {
      const listRes = await axios.get(getApiUri(`fetch_pending_payment`));
      if (
        listRes &&
        listRes?.data?.statuscode === 200 &&
        listRes?.data?.success
      ) {
        setData(listRes?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  function onDocumentLoadSuccess(numPages) {
    setNumPages(numPages);
  }

  const handleUpload = async () => {
    try {
      console.log({
        CusId: customerValue,
        PaymentAmount: !monthValue || isNaN(monthValue),
        PaymentStatus: yearValue,
      });
      if (!monthValue) {
        alert("Please enter amount");
        return;
      }
      if (isNaN(monthValue)) {
        alert("Amount should be a number");
        return;
      }
      if (!customerValue) {
        alert("Please select customer");
        return;
      }
      if (!yearValue) {
        alert("Please select payment status");
        return;
      }
      // return;
      setLoading(true);
      const cust_Payment_Res = await axios.post(
        getApiUri(`insert_pending_payments`),
        {
          CusId: customerValue[0].value,
          PaymentAmount: monthValue,
          PaymentStatus: yearValue[0].value,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log(cust_Payment_Res.data);
      setCustomerValue("");
      setYearValue("");
      setMonthValue("");
      setLoading(false);
      alert("Data saved successfully");
    } catch (error) {
      console.log("error", error);
      // Alert.alert('somthing went wrong please try again later......');
      setLoading(false);
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: 'Something went wrong, please try again later.',
      // });
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  return (
    <><Header />
    <div
      style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
    >
      {loading ? (
        <p>loading</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 50,
            padding: "5% 10% 10% 10%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ccfcf9",
              width: "100%",
              padding: "5%",
              borderRadius: 20,
            }}
          >
            <p style={{ fontWeight: "700", fontSize: 20 }}>
              Upload Pending Payment
            </p>
            <div
              style={{ display: "flex", flexDirection: "row", columnGap: 20 }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  columnGap: 20,
                  // marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "oswald",
                    fontWeight: "bold",
                    color: "#236fa1",
                  }}
                >
                  Pending Amount
                </p>
                <input
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    columnGap: 20,
                    borderRadius: 10,
                    padding: "9px 0px 9px 10px",
                    borderWidth: 0.5,
                    // marginBottom: 20,
                  }}
                  onChange={(e) => setMonthValue(e.target.value)}
                  placeholder="Enter pending amount"
                />
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  columnGap: 20,
                  // marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "oswald",
                    fontWeight: "bold",
                    color: "#236fa1",
                  }}
                >
                  Payment Status
                </p>
                <Dropdown
                  options={[
                    { label: "Paid", value: "paid" },
                    { label: "Pending", value: "pending" },
                  ]}
                  setValues={setYearValue}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                columnGap: 20,
                marginBottom: 40,
              }}
            >
              <p
                style={{
                  fontFamily: "oswald",
                  fontWeight: "bold",
                  color: "#236fa1",
                }}
              >
                Customer
              </p>
              <Dropdown options={customerItem} setValues={setCustomerValue} />
            </div>

            <div
              onClick={() => {
                handleUpload();
              }}
              className="box"
              style={{
                width: "30%",
                display: 'flex',
                justifyContent:'center',
                alignItems: 'center',
                backgroundColor: "#5bbf58",
                alignSelf: "center",
                borderRadius: 10,
                paddingTop: 10,
                paddingBottom: 10,
                color: "#fff",
                fontWeight: "500",
                marginBottom: 20,
              }}
            >
              Submit
            </div>
            <p
              style={{
                width: "100%",
                fontSize: 18,
                fontFamily: "oswald",
                fontWeight: "bold",
                color: "#236fa1",
              }}
            >
              Uploaded Pending Status
            </p>
            {data.length ? (
              data.map((item) => {
                const invoicedata = item;
                console.log("itrm", item);
                return (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: 20,
                      borderRadius: 10,
                      boxShadow: "3px 3px lightgray",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          width: "45%",
                          fontSize: 18,
                          fontFamily: "oswald",
                          fontWeight: "bold",
                          color: "#236fa1",
                          textAlign: "start",
                        }}
                      >
                        Name:
                      </div>
                      <div
                        style={{ width: "55%", fontSize: 18, textAlign: "end" }}
                      >
                        {console.log(invoicedata?.mst_customer_name)}
                        {invoicedata?.mst_customer_name}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          width: "45%",
                          fontSize: 18,
                          fontFamily: "oswald",
                          fontWeight: "bold",
                          color: "#236fa1",
                          textAlign: "start",
                        }}
                      >
                        Date :
                      </div>
                      <div
                        style={{ width: "55%", fontSize: 15, textAlign: "end" }}
                      >
                        {invoicedata?.MST_UPLOAD_INVOICE_MONTHS}
                        {invoicedata?.MST_UPLOAD_INVOICE_YEAR}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingTop: 6,
                      }}
                    >
                      {/* <p
              style={{
                width: '45%',
                fontSize: 18,
                color: 'darkgray',
                fontWeight: '600',
              }}>
              Invoice:
            </p> */}
                      {/* <Icon name="file-pdf-box" size={50} style={{color: COLORS.GREEN}} /> */}
                      <div style={{ backgroundColor: "blue" }}></div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 6,
                      }}
                    >
                      <div
                        style={{
                          width: "45%",
                          fontSize: 15,
                          fontFamily: "oswald",
                          fontWeight: "bold",
                          color: "#236fa1",
                          textAlign: "start",
                        }}
                      >
                        Download :
                      </div>
                      <a
                        download={true}
                        href={item?.MST_UPLOAD_INVOICE_PATH}
                        target="_blank"
                        style={{ alignSelf: "flex-end" }}
                      >
                        <img src={download} style={{ width: 30, height: 30 }} />
                      </a>
                      {/* <Icon
              onPress={() =>
                downloadFunction(invoicedata?.MST_UPLOAD_INVOICE_PATH)
              }
              name="download"
              size={30}
              style={{color: COLORS.GREEN, marginLeft: 10}}
            /> */}
                      {/* <div style={{ backgroundColor: "blue" }}></div> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No data found</p>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};
