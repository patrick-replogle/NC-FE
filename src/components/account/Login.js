// import React from "react";
// import { buttonStyles, cardStyles } from "../../styles";
// import ls from "local-storage";
// import { nanoid } from "nanoid";
// import AuthHeader from "../other/AuthHeader.js";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";
// import food from "../../assets/food.jpg";

// const qs = require("querystring");
// const crypto = require("crypto-browserify");

// const Login = () => {
//   const cardClass = cardStyles();
//   const buttonClass = buttonStyles();

//   const handleClick = (e) => {
//     e.preventDefault();
//     ls.set("code_verifier", nanoid(43));

//     const hash = crypto
//       .createHash("sha256")
//       .update(ls.get("code_verifier"))
//       .digest("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=/g, "");
//     const query = {
//       client_id: "0oasjox1z5iMEk04b4x6",
//       response_type: "code",
//       scope: "openid",
//       redirect_uri: `${process.env.REACT_APP_FRONT_END_BASE_URL}/login-redirect-url`,
//       state: "state-bsaWCD8F0dkd85REyU87",
//       code_challenge_method: "S256",
//       code_challenge: hash,
//     };

//     const redirectURL = `https://dev-519458.okta.com/oauth2/default/v1/authorize?${qs.stringify(
//       query
//     )}`;
//     window.location.replace(`${redirectURL}`);
//   };

//   return (
//     <>
//       <AuthHeader />
//       <div className="landing-page-container">
//         <div className="landing-page-left">
//           <Card className={`${cardClass.root} ${cardClass.landingPage}`}>
//             <CardContent style={{ marginTop: "2%" }}>
//               <Typography variant="h3">Login to Neighborhood Chef</Typography>
//               <Typography style={{ marginTop: "20px" }} variant="caption">
//                 <span style={{ opacity: ".6" }}>Choose to eat comfortably</span>
//               </Typography>
//               <div
//                 style={{ marginTop: "10%" }}
//                 className={`${buttonClass.root} ${buttonClass.single}`}
//                 onClick={handleClick}
//               >
//                 <Typography variant="h5">Login Securely with Okta</Typography>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="landing-page-right" style={{ overflow: "hidden" }}>
//           <img src={food} alt="food community" height="100%" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { MobileStepper } from "@material-ui/core";
import { cardStyles } from "../../styles";
import AuthHeader from "../other/AuthHeader.js";
import LoginFields from "./LoginFields.js";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import food from "../../assets/food.jpg";

const Login = () => {
  const history = useHistory();
  const currentPage = useSelector((state) => state.page);
  const cardClass = cardStyles();
  const [errMessage, setErrMessage] = useState("");

  return (
    <div>
      <AuthHeader />
      <div className="landing-page-container">
        <div className="landing-page-left">
          <Card
            className={`${cardClass.root} ${cardClass.landingPage}`}
            style={{ overflowY: "auto" }}
          >
            <CardContent style={{ marginTop: "2%" }}>
              <Typography variant="h4">Login Below</Typography>
              <Typography variant="caption" color="textSecondary">
                Start eating well while making friends!
              </Typography>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = "Required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.password) {
                    errors.password = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const userValues = {
                    email: values.email,
                    password: values.password,
                  };
                  axios
                    .post(
                      `${process.env.REACT_APP_BASE_URL}/auth/login`,
                      userValues
                    )
                    .then((res) => {
                      setSubmitting(false);
                      console.log(res.data);
                      localStorage.setItem("access_token", res.data.token);
                      localStorage.setItem("user", res.data.id);
                      history.push("/dashboard");
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      setErrMessage(err.response.data.message);
                      console.dir({
                        err,
                        message: err.message,
                        stack: err.stack,
                      });
                    });
                }}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form style={{ display: "flex", flexDirection: "column" }}>
                    <LoginFields
                      submitting={isSubmitting}
                      setFieldValue={setFieldValue}
                      values={values}
                      errMessage={errMessage}
                    />
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardActions
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <MobileStepper
                style={{ background: "white" }}
                variant="dots"
                steps={1}
                position="static"
                activeStep={currentPage - 1}
              />
            </CardActions>
          </Card>
        </div>
        <div className="landing-page-right" style={{ overflow: "hidden" }}>
          <img src={food} alt="food community" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default Login;
