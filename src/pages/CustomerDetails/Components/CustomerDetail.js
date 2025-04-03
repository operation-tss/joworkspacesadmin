// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Alert,
// } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   CircularProgress,
// } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { currentUserSelector } from '../../store/slices/user/user.slice';
// import { Responsive } from '../../constants/Layout';
// import AdminHeader from '../../component/AdminHeader';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import getApiUri from '../../datalib/api.util';
// import Loader from '../../library/commons/Loader';
// import moment from 'moment';
// import { images } from '../../constants/Index';
// import Icon from '@mui/icons-material/CheckCircle';
// import { getCustomerProfileListDetails, getCustomerProfileStatus } from '../../store/actions/customerAction';
// import { customerProfileDetailsSlice, customerProfileStatusSlice } from '../../store/slices/common/customer.slice';
// import { showMessage } from 'react-toastify';

// const CustomerDetail = ({ item, index, setData }) => {
//   const invoicedata = item?.item;
//   const localStorageUser = JSON.parse(localStorage.getItem("user"));
//   console.log({ localStorageUser });
//   const user = {
//     ...localStorageUser?.data?.Table,
//     ...localStorageUser?.data?.Table2,
//   };
//   const [loading, setLoading] = useState(false);
//   const [typeVis, settypeVis] = useState(false);
//   const [docsData, setDocsData] = useState([]);
// //   const dispatch = useDispatch();
//   const respROFLEStatus = useSelector(customerProfileStatusSlice);
//   const resCustomerProfileList = useSelector(customerProfileDetailsSlice);

//   const colorStatus = {
//     Active: 'green',
//     InActive: 'red',
//   };

//   useEffect(() => {}, [user, item]);

//   const handleDocs = async (customer_id) => {
//     try {
//       if (customer_id) {
//         settypeVis(!typeVis);
//       }

//       setLoading(true);
//       const docsResponse = await axios.get(
//         getApiUri(`AdminCustomerDocument?PAYMENT_CUSID=${customer_id}`),
//       );
//       if (
//         docsResponse &&
//         docsResponse?.data?.statuscode === 200 &&
//         docsResponse?.data?.success
//       ) {
//         const fetchedDocs = docsResponse?.data?.data;
//         setDocsData(fetchedDocs);
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('Error:', error);
//     }
//   };

//   const handleConfirm = (cusId) => {
//     if (window.confirm(
//       `Are you sure you want to ${
//         invoicedata?.Isactive === 'InActive' ? 'Activate' : 'Deactivate'
//       } this profile?`
//     )) {
//       handleUserStatus(cusId);
//     }
//   };

//   const handleUserStatus = async (cusId) => {
//     try {
//       setLoading(true);
//       const profileStatusRes = await dispatch(getCustomerProfileStatus(cusId));
//       if (
//         profileStatusRes?.type?.includes('fulfilled') &&
//         Array.isArray(profileStatusRes?.payload) &&
//         profileStatusRes?.payload?.length > 0
//       ) {
//         const cust_Docs_Res = await dispatch(getCustomerProfileListDetails());
//         if (
//           cust_Docs_Res?.type?.includes('fulfilled') &&
//           Array.isArray(cust_Docs_Res?.payload) &&
//           cust_Docs_Res?.payload?.length > 0
//         )
//           setData(cust_Docs_Res?.payload);
//         showMessage({
//           message: `Profile is ${
//             invoicedata?.Isactive === 'InActive' ? 'Activated' : 'Deactivated'
//           }`,
//           type: invoicedata?.Isactive === 'InActive' ? 'success' : 'error',
//         });
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <ScreenWrapper>
//       <Card style={{ marginBottom: 15, elevation: 5, backgroundColor: '#F4EDF9' }}>
//         <CardContent style={{ borderRadius: 12, paddingTop: 0 }}>
//           <div>
//             {invoicedata.mst_customer_logo ? (
//               <img
//                 src={invoicedata.mst_customer_logo}
//                 alt="Company Logo"
//                 style={styles.photo}
//               />
//             ) : (
//               <img
//                 src="../../assets/images/noImage.png"
//                 alt="No Logo"
//                 style={{ ...styles.photo, width: '75%', height: '18%' }}
//               />
//             )}
//           </div>
//           <div style={{ paddingTop: 8 }}>
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 10, paddingVertical: 8 }}>
//               <Typography
//                 style={{
//                   fontWeight: '600',
//                   alignSelf: 'center',
//                   color: 'darkgray',
//                 }}
//               >
//                 {`Profile (${invoicedata?.Isactive})`}
//               </Typography>
//               <Icon
//                 style={{
//                   color: invoicedata?.Isactive === 'Active' ? 'green' : 'red',
//                   marginLeft: 15,
//                 }}
//               />
//             </div>
//             <div style={styles.section}>
//               <Typography style={{ width: '45%', fontSize: 18, color: 'darkgray' }}>
//                 Company Name:
//               </Typography>
//               <Typography style={{ width: '55%', fontSize: 18, color: 'darkgray' }}>
//                 {invoicedata.mst_customer_name}
//               </Typography>
//             </div>
//             <div style={styles.section}>
//               <Typography style={{ width: '45%', fontSize: 18, color: 'darkgray' }}>
//                 Customer Number:
//               </Typography>
//               <Typography style={{ width: '55%', fontSize: 18, color: 'darkgray' }}>
//                 {invoicedata?.mst_customer_contact_no}
//               </Typography>
//             </div>
//             {/* Other fields go here */}
//           </div>
//         </CardContent>
//       </Card>
//     </ScreenWrapper>
//   );
// };

// const styles = {
//   photo: {
//     width: '100%',
//     height: '200px',
//     objectFit: 'cover',
//     marginBottom: 15,
//   },
//   section: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
// };

// export default CustomerDetail;
