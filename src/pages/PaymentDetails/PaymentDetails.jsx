import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
import getApiUri from "../../utils/api.util";
import { renderToString } from "react-dom/server";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../components/Header/Header";
import DownloadModal from "./Components/DownloadModal";
import placeHolder from "../../assets/placeholderProfile.png";

const PaymentDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [companyDetailsList, setCompanyDetailsList] = useState([]);

  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear().toString();

  const [monthValue, setMonthValue] = useState(currentMonth);
  const [yearValue, setYearValue] = useState(currentYear);

  const monthOptions = [
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
  ];

  const generateYearOptions = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({ label: year.toString(), value: year.toString() });
    }
    return years;
  };

  const yearOptions = generateYearOptions(2020, 2050);

  const getCompanyDesAction = async () => {
    try {
      const url = getApiUri(`CompanyDetails`);
      const res = await axios.get(url);
      if (res && res?.data?.success && res?.data?.statuscode === 200) {
        return res?.data?.data;
      }
    } catch (error) {
      return console.log(error.code);
    }
  };

  useEffect(() => {
    const companyDetails = getCompanyDesAction();
    if (companyDetails?.length >= 1) {
      setCompanyDetailsList(companyDetails);
    }
  }, []);

  useEffect(() => {
    fetch_Cust_Payment(monthValue, yearValue);
  }, []);

  const handleRefresh = async () => {
    try {
      await fetch_Cust_Payment(monthValue, yearValue);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetch_Cust_Payment = async (month, year) => {
    console.log({ month, year });
    setLoading(true);
    try {
      const cust_Payment_Res = await axios.get(
        getApiUri(`AdminPaymentDetails?Months=${month}&Year=${year}`)
      );
      console.log(cust_Payment_Res?.data);
      if (
        cust_Payment_Res?.data?.statuscode === 200 &&
        cust_Payment_Res?.data?.success
      ) {
        setData(cust_Payment_Res.data.data);
      }
    } catch (error) {
      console.log("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchCompanyDis();
  //   }, []);

  //   const fetchCompanyDis = async () => {
  //     try {
  //       const fetchRes = await dispatch(getCompanyDesAction());
  //       if (fetchRes.type.includes('fulfilled') && Array.isArray(fetchRes.payload) && fetchRes.payload.length > 0) {
  //         setCompanyDetailsList(fetchRes.payload[0]);
  //       }
  //     } catch (error) {
  //       alert('Something went wrong, please try again.');
  //     }
  //   };

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState("");

  function openModal(orderId) {
    setIsOpen(orderId);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen("");
  }

  const RenderInvoice = ({ item }) => {
    const invoicedata = item;
    return (
      <div
        style={{
          marginBottom: "15px",
          marginRight: "15px",
          width: '40%',
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          borderRadius: "8px",
          backgroundImage: "linear-gradient(to bottom,#faf9f9,#f3e2f8)",
          border: "0.5px solid #3c3c3c",
          // alignSelf: "left",
          backgroundColor: 'yellow'
        }}
      >
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
            backgroundColor: "#fff",
          }}
        >
          {invoicedata.mst_customer_logo ? (
            <img
              src={invoicedata.mst_customer_logo}
              alt="Company Logo"
              style={styles.photo}
            />
          ) : (
            <img src={placeHolder} alt="No Logo" style={styles.photo} />
          )}
        </div>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "start" }}>
            <strong>Company Name:</strong>{" "}
          </div>
          <div> {invoicedata?.mst_customer_name} </div>
        </p>

        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Payment ID:</strong> {invoicedata.UPLIFT_MST_PAYMENT_ORDERID}
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Payment Status:</strong>{" "}
          <span
            style={{
              color:
                invoicedata.UPLIFT_MST_PAYMENT_STATUS === "success"
                  ? "green"
                  : "red",
            }}
          >
            {invoicedata.UPLIFT_MST_PAYMENT_STATUS}
          </span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Payment Mode:</strong>{" "}
          {invoicedata.UPLIFT_MST_PAYMENT_PAYMENT_MODE}
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Date:</strong>{" "}
          {moment(invoicedata.UPLIFT_MST_PAYMENT_CREATEDONDATE).format(
            "MMM Do YYYY"
          )}
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Message Note:</strong>{" "}
          {invoicedata.UPLIFT_MST_PAYMENT_AMOUNT_DESCRIPTION}
        </p>
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Total Amount:</strong> Rs.{" "}
          {invoicedata.UPLIFT_MST_PAYMENT_AMOUNT}
        </p>
        <div
          style={{ display: "flex", justifyContent: "right" }}
          onClick={() => {
            openModal(invoicedata.UPLIFT_MST_PAYMENT_ORDERID);
            // generatePDF(invoicedata)
          }}
        >
          {invoicedata.UPLIFT_MST_PAYMENT_STATUS === "success" ? (
            <div
              style={{
                backgroundColor: "#25a6b8",
                padding: "4px 8px 4px 8px",
                borderRadius: "2px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              Download
            </div>
          ) : (
            <></>
          )}
        </div>
        {modalIsOpen === invoicedata.UPLIFT_MST_PAYMENT_ORDERID ? (
          <DownloadModal
            modalIsOpen={modalIsOpen}
            setIsOpen={setIsOpen}
            openModal={openModal}
            afterOpenModal={afterOpenModal}
            closeModal={closeModal}
            subtitle={subtitle}
            invoiceData={invoicedata}
          />
        ) : (
          <></>
        )}
      </div>
    );
  };

  const generatePDF = async (invoiceData) => {
    console.log("invoiceData-----", { invoiceData });

    // Determine which image to use
    // Define a random starting point for the receipt number
    let receiptNumber = Math.floor(Math.random() * 1000) + 1000; // Random number between 1000 and 1999

    function generateReceiptNumber() {
      return receiptNumber++;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      
      <!-- Invoice styling -->
      <style>
      body {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      text-align: center;
      color: #777;
      }
      
      body h1 {
      font-weight: 300;
      margin-bottom: 0px;
      padding-bottom: 0px;
      color: #000;
      }
      
      body h3 {
      font-weight: 300;
      margin-top: 10px;
      margin-bottom: 20px;
      font-style: italic;
      color: #555;
      }
      
      body a {
      color: #06f;
      }
      
      .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 30px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      font-size: 16px;
      line-height: 24px;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #555;
      }
      
      .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
      border-collapse: collapse;
      }
      
      .invoice-box table td {
      padding: 5px;
      vertical-align: top;
      }
      
      .invoice-box table tr td:nth-child(2) {
      text-align: right;
      }
      
      .invoice-box table tr.top table td {
      padding-bottom: 20px;
      }
      
      .invoice-box table tr.top table td.title {
      font-size: 45px;
      line-height: 45px;
      color: #333;
      }
      
      .invoice-box table tr.information table td {
      padding-bottom: 40px;
      }
      
      .invoice-box table tr.heading td {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      }
      
      .invoice-box table tr.details td {
      padding-bottom: 20px;
      }
      
      .invoice-box table tr.item td {
      border-bottom: 1px solid #eee;
      }
      
      .invoice-box table tr.item.last td {
      border-bottom: none;
      }
      .logo {
      margin: 20px 0 20px 0;
      padding-bottom:20px
      
      }
      .logo img {
      width: 40%; /* Set to 100% to fit the container */
      max-width: 250px; /* Increase size as needed */
      height: 80px;
      }
      
      .invoice-box table tr.total td:nth-child(2) {
      border-top: 2px solid #eee;
      font-weight: bold;
      }
      
      @media only screen and (max-width: 600px) {
      .invoice-box table tr.top table td {
      width: 100%;
      display: block;
      text-align: center;
      }
      
      .invoice-box table tr.information table td {
      width: 100%;
      display: block;
      text-align: center;
      }
      }
      </style>
      </head>
      
      <body>
      
      <div class="invoice-box">
      <h1 style="font-size:30px; font-weight:500">Payment Reciept</h1>
      <table style="margin-top:40px">
      <tr class="top">
      <td colspan="2">
      <table>
      <tr style="display:flex;flex-direction:row;justify-content:space-between;align-items: center">
      <td style="display:flex;flex-direction:row;align-items: center">
      <img src="https://api.repairindia.in/image/JoLogo.jpeg" alt="Company Logo" style="width:50px;height:50px"/>
      <p style="margin-left:0px;font-size:30px">workspaces</p>
      </td>
      <td>
      Payment Receipt No: ${generateReceiptNumber()} <br />
      Created: ${moment(invoiceData.UPLIFT_MST_PAYMENT_CREATEDONDATE).format(
        "MMM Do YYYY"
      )}<br />
      
      </td>
      </tr>
      </table>
      </td>
      </tr>
      
      <tr class="information">
      <td colspan="2">
      <table>
      <tr>
      <td>
      Jupiter Orison. Pvt. Ltd.<br />
      Building 96, First Floor,
      <br />Udyog Vihar Phase 1,<br />
      Email: joworkspaces@gmail.com,<br />
      Gst: 06AAKCS6706Q2ZN
      </td>
      
      <td>
      <p style="margin-left:0px;font-size:20px; padding-bottom:0px">Customer Details</p>
      ${invoiceData?.mst_customer_name}<br /> 
      ${invoiceData?.mst_customer_Email}<br />
      Gst: ${invoiceData?.mst_customer_gst_no}
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr class="heading">
      <td>Payment Mode</td>
      <td>${invoiceData?.UPLIFT_MST_PAYMENT_PAYMENT_MODE}</td>
      </tr>
      
      <tr>
      <td>Payment Status</td>
      
      <td>${invoiceData?.UPLIFT_MST_PAYMENT_STATUS}</td>
      </tr>
      <tr >
      <td>Payment Receipt Id</td>
      
      <td>${invoiceData?.UPLIFT_MST_PAYMENT_ORDERID}</td>
      </tr>
      <tr class="details">
      <td>Remarks</td>
      <td>${invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT_DESCRIPTION}</td>
      </tr>
      
      <tr class="heading">
      <td>Discription</td>
      
      <td>Price</td>
      </tr>
      
      <tr class="item">
      <td>Rent Pay</td>
      
      <td>Rs. ${invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}</td>
      </tr>
      
      <tr class="total">
      <td></td>
      
      <td>Total: ${invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}</td>
      </tr>
      </table>
      <h6>This is a digitally generated payment receipt. It does not require any signature or stamp.</h6>
      </div>
      </body>
      </html>
      `;

    try {
      const virtualContainer = document.createElement("div");

      // Define your HTML content as a string
      virtualContainer.innerHTML = htmlContent;

      // Apply styles needed for the PDF layout directly to the virtual element
      virtualContainer.style.position = "absolute";
      virtualContainer.style.top = "-9999px";
      virtualContainer.style.left = "-9999px";

      //   const tempDiv = document.createElement('div');
      //   tempDiv.innerHTML = htmlContent;
      //   document.body.appendChild(tempDiv);
      html2canvas(virtualContainer, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("generated.pdf");
        // const pdf = new jsPDF('p', 'mm', 'a4');
        // const imgData = canvas.toDataURL('image/png');

        // const imgProps = pdf.getImageProperties(imgData);
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        // pdf.save('generated.pdf');

        // // Clean up the temporary div
        // document.body.removeChild(tempDiv);
      });
      //   const file = await RNHTMLtoPDF.convert(options);

      //   if (!file?.filePath) {
      //     throw new Error('PDF file generation failed.');
      //   }
      //   const uniqueName = `Payment_Receipt_${
      //     invoiceData?.mst_customer_name
      //   }${Date.now()}.pdf`;
      //   const destPath = `${
      //     Platform.OS === 'android'
      //       ? RNFS.DownloadDirectoryPath
      //       : RNFS.DocumentDirectoryPath
      //   }/${uniqueName}`;

      //   Platform.OS === 'android'
      //     ? await RNFS.copyFile(file?.filePath, destPath)
      //     : await RNFS.moveFile(file?.filePath, destPath);
      //   if (!!destPath) {
      //     const shareOptions = {
      //       title: 'Payment_Receipt',
      //       url: `file://${destPath.replace(/\s/g, '%20')}`,
      //       type: 'application/pdf',
      //       subject: 'PDF',
      //       type: 'application/pdf',
      //     };
      //     Share.open(shareOptions)
      //       .then(result => console.log('result', result))
      //       .catch(error => console.log(error));
      //   }
    } catch (error) {
      console.log("error", error);
      alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Header />
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
          marginTop: 20,
        }}
      >
        Payment Details
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
          width: "70%",
        }}
      >
        <div
          style={{ width: "48%", border: "1px solid #3c3c3c", borderRadius: 4 }}
        >
          <Select
            options={monthOptions}
            value={monthOptions.find((option) => option.value === monthValue)}
            onChange={(option) => {
              setMonthValue(option.value);
              fetch_Cust_Payment(option.value, yearValue);
            }}
            placeholder="Month*"
          />
        </div>
        <div
          style={{ width: "48%", border: "1px solid #3c3c3c", borderRadius: 4 }}
        >
          <Select
            options={yearOptions}
            styles={{ border: "none" }}
            value={yearOptions.find((option) => option.value === yearValue)}
            onChange={(option) => {
              setYearValue(option.value);
              fetch_Cust_Payment(monthValue, option.value);
            }}
            placeholder="Year*"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          margin: "20px",
          width: "80%",
        }}
      >
        {data.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "10px 7% 10px 7%",
              justifyContent: 'left',
              width: '90%',
            }}
          >
            {data.map((item, index) => (
              <RenderInvoice key={index} item={item} />
            ))}
          </div>
        ) : (
          <p style={{alignSelf:'center'}}>No Data Available</p>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;

const styles = {
  photo: {
    width: "100%",
    height: "250px",
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
