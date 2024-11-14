import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
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
        `Reciept_${moment(
          invoiceData.UPLIFT_MST_PAYMENT_CREATEDONDATE
        ).format("MMM Do YYYY").split().join('_')}.pdf`
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
      <div ref={contentRef} style={{ padding: 20, background: "#fff" }}>
        <div className="invoice-box" style={styles.invoiceBox}>
          <button onClick={closeModal}>close</button>
          <h1 style={styles.header}>Payment Receipt</h1>
          <table style={styles.table}>
            <tbody>
              <tr className="top">
                <td colSpan="2">
                  <table style={styles.innerTable}>
                    <tbody>
                      <tr style={styles.flexRow}>
                        <td style={styles.flexRow}>
                          <img
                            src="https://api.repairindia.in/image/JoLogo.jpeg"
                            alt="Company Logo"
                            style={styles.logoImage}
                          />
                          <p style={styles.companyName}>workspaces</p>
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

              <tr className="information">
                <td colSpan="2">
                  <table style={styles.innerTable}>
                    <tbody>
                      <tr>
                        <td>
                          <div>Jupiter Orison. Pvt. Ltd.</div>
                          <div>Building 96, First Floor,</div>
                          <div>Udyog Vihar Phase 1,</div>
                          <div>Email: joworkspaces@gmail.com</div>
                          <div>Gst: 06AAKCS6706Q2ZN</div>
                        </td>
                        <td style={styles.rightAlign}>
                          <p style={styles.customerDetailsHeader}>
                            Customer Details
                          </p>
                          <div>{invoiceData?.mst_customer_name}</div>
                          <div>{invoiceData?.mst_customer_Email}</div>
                          <div>Gst: {invoiceData?.mst_customer_gst_no}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td style={styles.bold}>Payment Mode</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_PAYMENT_MODE}
                </td>
              </tr>

              <tr>
                <td>Payment Status</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_STATUS}
                </td>
              </tr>

              <tr>
                <td>Payment Receipt Id</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_ORDERID}
                </td>
              </tr>

              <tr className="details">
                <td>Remarks</td>
                <td style={styles.rightAlign}>
                  {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT_DESCRIPTION}
                </td>
              </tr>

              <tr className="heading">
                <td style={styles.bold}>Description</td>
                <td style={styles.bold}>Price</td>
              </tr>

              <tr className="item">
                <td>Rent Pay</td>
                <td style={styles.rightAlign}>
                  Rs. {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}
                </td>
              </tr>

              <tr className="total">
                <td></td>
                <td style={styles.bold}>
                  Total: {invoiceData?.UPLIFT_MST_PAYMENT_AMOUNT}
                </td>
              </tr>
            </tbody>
          </table>
          <h6 style={styles.note}>
            This is a digitally generated payment receipt. It does not require
            any signature or stamp.
          </h6>
        </div>
      </div>
      <button onClick={generatePdf}>Download as PDF</button>
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
  },
  table: {
    width: "100%",
    lineHeight: "inherit",
    textAlign: "left",
    borderCollapse: "collapse",
  },
  innerTable: {
    width: "100%",
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
    fontSize: "30px",
    margin: 0,
  },
  rightAlign: {
    textAlign: "right",
  },
  customerDetailsHeader: {
    fontSize: "20px",
    marginBottom: 0,
  },
  bold: {
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
  },
};

export default DownloadModal;
