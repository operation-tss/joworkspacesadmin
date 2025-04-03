import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AppLogo from '../../../assets/Applogo.png'

const customStyles = {
  content: {
    top: "55%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width:'50%',
    transform: "translate(-50%, -50%)",
    border: "0.5px solid #3c3c3c",
  },
};

const DownloadModal = ({
  modalIsOpen,
  setIsOpen,
  openModal,
  afterOpenModal,
  closeModal,
  subtitle,
  invoiceData,
}) => {
  const contentRef = useRef();

  const generatePdf = () => {
    console.log("rannn");
    const input = contentRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Reciept_${moment(invoiceData.UPLIFT_MST_PAYMENT_CREATEDONDATE)
          .format("MMM Do YYYY")
          .split()
          .join("_")}.pdf`
      );
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      generatePdf();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  let receiptNumber = Math.floor(Math.random() * 1000) + 1000; // Random number between 1000 and 1999

  function generateReceiptNumber() {
    return receiptNumber++;
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 40
            }}
          >
            <button
              style={{
                alignSelf: "end",
                justifySelf: "flex-start",
                display: "flex",
              }}
              onClick={generatePdf}
            >
              Download as PDF
            </button>
            <button
              style={{
                alignSelf: "end",
                justifySelf: "flex-end",
                display: "flex",
              }}
              onClick={closeModal}
            >
              close
            </button>
          </div>
      <div ref={contentRef} style={{ padding: 10, background: "#fff" }}>
        <div className="invoice-box" style={styles.invoiceBox}>
          <h1 style={styles.header}>Payment Receipt</h1>
          <table style={styles.table}>
            <tbody>
              <tr style={styles.row}>
                <td colSpan="2">
                  <table style={styles.innerTable}>
                    <tbody>
                      <tr style={styles.flexRow}>
                        <td style={styles.flexRow}>
                          <img
                            src={AppLogo}
                            alt="Company Logo"
                            style={styles.logoImage}
                          />
                          <div style={{...styles.companyName,fontWeight: 'bold'}}>workspaces</div>
                        </td>
                        <td style={styles.rightAlign}>
                          <div>
                            Payment Receipt No: {generateReceiptNumber()}
                          </div>
                          <div>
                            Created:{" "}
                            {moment(
                              invoiceData.UPLIFT_MST_PAYMENT_CREATEDONDATE
                            ).format("MMM Do YYYY")}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr style={styles.row}>
                <td colSpan="2">
                  <table style={styles.innerTable}>
                    <tbody>
                      <tr>
                        <td style={{marginRight: '100px'}}>
                          <div style={styles.fontSize}>Jupiter Orison. Pvt. Ltd.</div>
                          <div style={styles.fontSize}>Building 96, First Floor,</div>
                          <div style={styles.fontSize}>Udyog Vihar Phase 1,</div>
                          <div style={styles.fontSize}>Email: joworkspaces@gmail.com</div>
                          <div style={styles.fontSize}>Gst: 06AAKCS6706Q2ZN</div>
                        </td>
                        <td style={styles.rightAlign}>
                          <p style={{...styles.customerDetailsHeader,fontWeight: 'bold'}}>
                            Customer Details
                          </p>
                          <div style={styles.fontSize}>{invoiceData?.mst_customer_name}</div>
                          <div style={styles.fontSize}>{invoiceData?.mst_customer_Email}</div>
                          <div style={styles.fontSize}>Gst: {invoiceData?.mst_customer_gst_no}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr style={{...styles.row, backgroundColor: 'lightgray'}}>
                <td style={styles.bold}>Payment Mode</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_PAYMENT_MODE}
                </td>
              </tr>

              <tr style={styles.row}>
                <td>Payment Status</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_STATUS}
                </td>
              </tr>

              <tr style={styles.row}>
                <td>Payment Receipt Id</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_ORDERID}
                </td>
              </tr>

              <tr style={styles.row}>
                <td>Remarks</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT_DESCRIPTION}
                </td>
              </tr>

              <tr style={{...styles.row, backgroundColor: 'lightgray'}}>
                <td style={styles.bold}>Description</td>
                <td style={{...styles.bold,...styles.rightAlign}}>Price</td>
              </tr>

              <tr style={styles.row}>
                <td>Rent Pay</td>
                <td style={styles.rightAlign}>
                  Rs. {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}
                </td>
              </tr>

              <tr style={styles.row}>
                <td></td>
                <td style={styles.bold}>
                  Total: {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}
                </td>
              </tr>
            </tbody>
          </table>
          <h6 style={styles.note}>
            This is a digitally generated payment Invoice. It does not require
            any signature or stamp.
          </h6>
        </div>
      </div>
    </Modal>
  );
};

// Inline styles for elements
const styles = {
  invoiceBox: {
    maxWidth: "800px",
    margin: "auto",
    padding: "30px",
    border: "1px solid #eee",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
    fontSize: "16px",
    lineHeight: "24px",
    color: "#555",
    fontFamily: "'Helvetica Neue', 'Helvetica', Arial, sans-serif",
  },
  header: {
    fontSize: "30px",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    lineHeight: "inherit",
    textAlign: "left",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  innerTable: {
    width: "100%",
    marginBottom: "10px",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
  },
  companyName: {
    fontSize: "20px",
    margin: 0,
  },
  rightAlign: {
    textAlign: "right",
    paddingRight: "10px",
  },
  leftAlign: {
    textAlign: "left",
    paddingLeft: "10px",
  },
  row: {
    borderBottom: "1px solid #ddd",
    padding: "8px 0",
    verticalAlign: "middle",
  },
  bold: {
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
    marginTop: "20px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
    cursor: "pointer",
  },
  fontSize: {
    fontSize: '15px'
  }
};

export default DownloadModal;
