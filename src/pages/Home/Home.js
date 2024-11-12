import styled from "styled-components";
import "./Home.css";
import getApiUri from "../../utils/api.util";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import download from "../../assets/download.png";
import cross from "../../assets/cross.png";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import Header from "../../components/Header/Header";
import "react-pdf/dist/esm/Page/TextLayer.css";
console.log(
  new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()
);
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

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const Home = () => {
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
  const width = useWindowWidth();

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
    if (customerValue && monthValue && yearValue) {
      fetchInvoiceList(
        customerValue[0].value,
        monthValue[0].value,
        yearValue[0].value
      );
    }
  }, [customerValue, monthValue, yearValue]);

  const fetchInvoiceList = async (customerValuee, monthValuee, yearValuee) => {
    console.log("rarnanr");
    try {
      console.log(
        getApiUri(
          `CustomeINVOICE?cusid=${customerValuee}&MONTH=${monthValuee}&YEAR=${yearValuee}`
        )
      );
      const listRes = await axios.get(
        getApiUri(
          `CustomeINVOICE?cusid=${customerValuee}&MONTH=${monthValuee}&YEAR=${yearValuee}`
        )
      );
      console.log({ listRes });
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
      // const valid = validate();
      console.log(file);
      console.log({
        name: file.name,
        type: file.type,
        uri: file,
      });
      // return;
      console.log(monthValue[0].value);
      console.log(yearValue[0].value);
      console.log(customerValue[0].value);
      setLoading(true);
      const formdata = new FormData();
      formdata.append("Files", file, file.name);
      const cust_Payment_Res = await axios.post(
        getApiUri(
          `CusInvoice?Id=${customerValue[0].value}&Month=${monthValue[0].value}&year=${yearValue[0].value}`
        ),
        formdata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const trimmedResponse = cust_Payment_Res?.data.trim();

      if (
        cust_Payment_Res &&
        trimmedResponse?.includes(
          "Documents uploaded and paths saved successfully"
        )
      ) {
        const fetch_user = await axios.get(
          // getApiUri(
          //   `AdminCustomeINVOICE?MONTH=${monthValue}&YEAR=${yearValue}`,
          // ),

          getApiUri(
            `CustomeINVOICE?cusid=${
              customerValue[0].value ? customerValue[0].value : 0
            }&MONTH=${monthValue[0].value}&YEAR=${yearValue[0].value}`
          )
        );

        if (
          fetch_user &&
          fetch_user?.data?.statuscode === 200 &&
          fetch_user?.data?.success
        ) {
          // Toast.showWithGravity(
          //   'Your document uploaded successfully!',
          //   Toast.SHORT,
          //   Toast.CENTER,
          // );

          setLoading(false);
          setData(fetch_user?.data?.data);
          // setCustomerItem([]);
          setFile({});
        }
        // onModalClose(true);
      }
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
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header />
      <div
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <p>loading</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: width > 800 ? "row" : "column",
              columnGap: 50,
              padding: 50,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "auto",
                padding: "2% 5% 5% 5%",
                backgroundColor: "#eee9f0",
                borderRadius: 10,
                border: "0.5px solid black",
                flex: 1,
              }}
            >
              <p style={{ fontWeight: "700", fontSize: 20 }}>
                Invoice Upload Form
              </p>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  columnGap: 20,
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
                <Dropdown
                  options={customerItem}
                  setValues={(values) => {
                    setCustomerValue(values);
                  }}
                />
              </div>
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
                    marginBottom: 20,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "oswald",
                      fontWeight: "bold",
                      color: "#236fa1",
                    }}
                  >
                    Month
                  </p>
                  <Dropdown options={monthItems} setValues={setMonthValue} />
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
                    Year
                  </p>
                  <Dropdown options={yearItems} setValues={setYearValue} />
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 150,
                  border: "1px solid black",
                  borderRadius: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <input
                  type="file"
                  style={{ color: "#236fa1" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div
                onClick={() => {
                  handleUpload();
                }}
                style={{
                  width: "30%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#25a6b8",
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
                Uploaded Invoices
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
                          style={{
                            width: "55%",
                            fontSize: 18,
                            textAlign: "end",
                          }}
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
                          style={{
                            width: "55%",
                            fontSize: 15,
                            textAlign: "end",
                          }}
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
                          <img
                            src={download}
                            style={{ width: 30, height: 30 }}
                          />
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
            <div
              style={{
                position: "relative",
                // width: "50%",
                height: 150,
                width: "auto",
                flex: 1,
              }}
            >
              {console.log("===-->", { pageNumber, numPages })}
              <Document
                file={file}
                onLoadSuccess={({ numPages }) =>
                  onDocumentLoadSuccess(numPages)
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: "10%",
                    paddingRight: "10%",
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{ fontWeight: 500 }}
                    onClick={() => {
                      if (pageNumber > 1) {
                        setPageNumber(pageNumber - 1);
                      }
                    }}
                  >
                    previous
                  </div>
                  <div>
                    {pageNumber} of {numPages}
                  </div>
                  <div
                    style={{ fontWeight: 500 }}
                    onClick={() => {
                      console.log(numPages, pageNumber);
                      if (pageNumber < numPages) {
                        setPageNumber((page) => pageNumber + 1);
                      }
                    }}
                  >
                    next
                  </div>
                </div>

                <Page
                  height={130}
                  width={width > 800 ? width / 2.5 : width / 1.3}
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                />
              </Document>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
