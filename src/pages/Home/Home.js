import styled from "styled-components";
import "./Home.css";
import getApiUri from "../../utils/api.util";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../../components/Dropdown/Dropdown";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 3%;
  padding-bottom: 5%;
  padding-left: 20%;
  padding-right: 20%;
  min-height: 80vh;
  h1 {
    color: #fab005;
  }
`;

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
  const [monthValue, setMonthValue] = useState(currentMonth);
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
  const [yearValue, setYearValue] = useState(currentYear);
  const [yearItems, setYearItems] = useState(generateYearItems(2020, 2050));

  //cutomer Dropdown
  const [openCustomer, setOpenCustomer] = useState(false);
  const [customerValue, setCustomerValue] = useState("");
  const [customerItem, setCustomerItem] = useState([]);
  const [error, setError] = useState({});
  const [file, setFile] = useState({});

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
    fetchInvoiceList(customerValue ? customerValue : 0, monthValue, yearValue);
  }, []);

  const fetchInvoiceList = async (customerValue, monthValue, yearValue) => {
    try {
      const listRes = await axios.get(
        getApiUri(
          `CustomeINVOICE?cusid=${customerValue}&MONTH=${monthValue}&YEAR=${yearValue}`
        )
      );
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

  const checkUser = () => {
    const user = localStorage.getItem("user");
    setTimeout(() => {
      if (!user) {
        setLoading(false);
        navigate("/login");
      }
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    checkUser();
  }, []);

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
      console.log(monthValue[0].value)
      console.log(yearValue[0].value)
      console.log(customerValue[0].value)
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
    <Wrapper>
      {loading ? (
        <p>loading</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5eceb",
            width: "100%",
            padding: "5%",
            borderRadius: 20,
          }}
        >
          <p style={{ fontWeight: "700", fontSize: 20 }}>Invoice Upload Form</p>
          <div style={{ display: "flex", flexDirection: "row", columnGap: 20 }}>
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
              Customer
            </p>
            <Dropdown options={customerItem} setValues={setCustomerValue} />
          </div>

          <input
            type="file"
            style={{ marginBottom: 20, color: "#236fa1" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div
            onClick={() => {
              handleUpload();
            }}
            style={{
              width: "30%",
              backgroundColor: "#5bbf58",
              alignSelf: "center",
              borderRadius: 10,
              paddingTop: 10,
              paddingBottom: 10,
              color: "#fff",
              fontWeight: "500",
            }}
          >
            Submit
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default Home;
