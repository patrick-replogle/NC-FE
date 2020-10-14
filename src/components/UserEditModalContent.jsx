import React, { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/styles";
import { textBoxStyles } from "../styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Geocoder from "react-mapbox-gl-geocoder";

import { USER_BY_ID } from "../graphql/users/user-queries";
import { UPDATE_USER } from "../graphql/users/user-mutations";
import { axiosWithAuth } from "../utilities/axiosWithAuth";
import { makeInitials } from "../utilities/functions";
import { print } from "graphql";
import { Icon } from "@iconify/react";
import closeRectangle from "@iconify/icons-jam/close-rectangle";

const styles = makeStyles((theme) => {
  return {
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      width: "33vw",
      height: "75vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      [theme.breakpoints.down("md")]: {
        width: "66vw",
      },

      [theme.breakpoints.down("sm")]: {
        width: "88vw",
      },
    },
    closeButton: {
      alignSelf: "flex-end",
      padding: "2.5%",
      cursor: "pointer",
    },
    formContainer: {
      width: "100%",
      marginTop: "7%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      "& button": {
        margin: "6% auto",
        fontSize: "125%",
      },
    },
    labels: {
      width: "90%",
      marginTop: "3%",

      "& > span": {
        alignSelf: "flex-start",
        marginLeft: "10%",
      },

      "& > div": {
        width: "75%",
      },
    },
  };
});

function UserEditModalContent(props) {
  const mapAccess = {
    mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  };
  const classes = styles();
  const textBoxClass = textBoxStyles();
  const addressLabel = useRef();
  const geoInput = useRef();
  const me = localStorage.getItem("user");
  const [temp, setTemp] = useState({});
  const [viewport, setViewport] = useState({});

  const [userInputs, setUserInputs] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (me) {
      axiosWithAuth()({
        url: `${process.env.REACT_APP_BASE_URL}/graphql`,
        method: "post",
        data: {
          query: print(USER_BY_ID),
          variables: { id: me },
        },
      })
        .then((res) => {
          setUserInputs({
            firstName: res.data.data.getUserById.firstName,
            lastName: res.data.data.getUserById.lastName,
            gender: res.data.data.getUserById.gender,
            address: res.data.data.getUserById.address,
            latitude: res.data.data.getUserById.latitude,
            longitude: res.data.data.getUserById.longitude,
          });
          setTemp(res.data.data.getUserById);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const geocoder = document.querySelector(".geocoder-container");
    geoInput.current = geocoder.children[0].children[0];
    geoInput.current.name = "address";
    geoInput.current.classList.add(textBoxClass.addressInput);
    geoInput.current.style.marginTop = 0;
    geoInput.current.style.paddingBottom = "3%";
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
  };

  const onSelected = (viewport, item) => {
    console.log(viewport, item);
    setViewport(viewport);
    setUserInputs({
      gender: userInputs.gender,
      address: item.place_name,
      latitude: item.center[1],
      longitude: item.center[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      temp.firstName !== userInputs.firstName ||
      temp.lastName !== userInputs.lastName ||
      temp.address !== userInputs.address
    ) {
      axiosWithAuth()({
        url: `${process.env.REACT_APP_BASE_URL}/graphql`,
        method: "post",
        data: {
          query: print(UPDATE_USER),
          variables: {
            input: {
              ...userInputs,
              address: geoInput.current.value,
            },
            id: me,
          },
        },
      })
        .then((res) => {
          props.setUser(res.data.data.updateUser);
          let newInitials = makeInitials(res.data.data.updateUser);
          props.setInitials(newInitials);
          props.toggleOpen();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      props.toggleOpen();
    }
  };

  return (
    <div className={classes.container}>
      <span onClick={props.toggleOpen} className={classes.closeButton}>
        <Icon height="20" icon={closeRectangle} />
      </span>
      <Typography variant="h4">Change User Information</Typography>
      <div className={classes.formContainer}>
        <FormControlLabel
          className={classes.labels}
          label="First Name"
          labelPlacement="top"
          control={
            <TextField
              name="firstName"
              type="text"
              onChange={handleChange}
              value={userInputs.firstName}
            />
          }
        />
        <FormControlLabel
          className={classes.labels}
          label="Last Name"
          labelPlacement="top"
          control={
            <TextField
              name="lastName"
              type="text"
              onChange={handleChange}
              value={userInputs.lastName}
            />
          }
        />
        <FormControlLabel
          className={classes.labels}
          label="Gender"
          labelPlacement="top"
          control={
            <Select
              labelId="gender-label"
              value={userInputs.gender}
              onChange={handleChange}
              label="Gender"
              name="gender"
            >
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          }
        />
        <FormControlLabel
          className={classes.labels}
          label="Address"
          labelPlacement="top"
          control={
            <div className="geocoder-container">
              <Geocoder
                {...mapAccess}
                name="address"
                onSelected={onSelected}
                limit={3}
                viewport={"viewport"}
                hideOnSelect={true}
                queryParams={"queryParams"}
                updateInputOnSelect={true}
                initialInputValue={userInputs.address}
              />
            </div>
          }
        />
        <Button
          disabled={
            userInputs.firstName === "" ||
            userInputs.lastName === "" ||
            userInputs.address === "" ||
            userInputs.gender === ""
          }
          type="submit"
          onClick={handleSubmit}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export default UserEditModalContent;
