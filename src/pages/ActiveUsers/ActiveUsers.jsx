// Import necessary libraries
import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import "./ActiveUsers.css";
import Header from "../../components/Header/Header";
import getApiUri from "../../utils/api.util";
import Applogo from "../../assets/Applogo.png";

const ActiveUsers = () => {
  const [isActive, setIsActive] = useState(true);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const userStatus = {
    Active: "green",
    InActive: "red",
  };

  useEffect(() => {
    handleToggle(true);
  }, []);

  const handleToggle = async (val) => {
    try {
      setLoading(true);
      setIsActive(val);
      const isActiveValue = val ? 1 : 0;
      const activeUserResponse = await axios.get(
        getApiUri(`AdminCustomerDetails?Isactive=${isActiveValue}`)
      );
      if (
        activeUserResponse?.data &&
        activeUserResponse?.data?.statuscode === 200 &&
        activeUserResponse?.data?.success
      ) {
        setUserList(activeUserResponse?.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("Something went wrong, please try again later...");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 50,
            padding: 50,
            height: 200,
          }}
        >
          <img src={Applogo} style={{ height: 50, width: 50 }} alt="" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="screen-wrapper">
      <Header />
      <div className="content">
        <div className="header-wrapper">
          <h2
            className="title"
            style={{ color: isActive ? "green" : "darkgray" }}
          >
            {isActive ? "Active Users" : "Inactive Users"}
          </h2>
          <Switch
            checked={isActive}
            onChange={(val) => handleToggle(val)}
            onColor="#0f4734"
            offColor="gray"
            onHandleColor="#30a566"
            offHandleColor="#000"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
            height={15}
            width={35}
          />
        </div>

        {userList.length > 0 ? (
          <div className="table-wrapper">
            <div className="table-header">
              <div className="table-column">Name</div>
              <div className="table-column">Customer No</div>
              <div className="table-column">Email</div>
              <div className="table-column">Active User</div>
            </div>
            {userList.map((item) => (
              <div key={item?.mst_customer_id} className="table-row">
                <div className="table-column">{item?.mst_customer_name}</div>
                <div className="table-column">
                  {item?.mst_customer_contact_no}
                </div>
                <div className="table-column">{item?.mst_customer_Email}</div>
                <div
                  className="table-column"
                  style={{ color: userStatus[item?.Isactive] }}
                >
                  {item?.Isactive}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-record">
            <p>No Record Found.</p>
          </div>
        )}
      </div>
      {/* <Loader loading={loading} /> */}
    </div>
  );
};

export default ActiveUsers;
