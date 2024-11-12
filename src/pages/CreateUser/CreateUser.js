import React, { useState } from "react";
import CreateAccount from "./CreateAccount/CreateAccount";
import Header from "../../components/Header/Header";
import CreatePassword from "./CreatePassword/CreatePassword";
import Registration from "./Registration/Registration";

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState("CREATE_ACCOUNT");
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Header />
      {visible === "CREATE_ACCOUNT" ? (
        <CreateAccount email={email} setEmail={setEmail} setVisible={setVisible} />
      ) : (
        <></>
      )}
      {visible === "CREATE_PASSWORD" ? (
        <CreatePassword email={email} setEmail={setEmail} setVisible={setVisible} />
      ) : (
        <></>
      )}
      {visible === "REGISTRATION" ? (
        <Registration email={email} setEmail={setEmail} setVisible={setVisible} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateUser;
