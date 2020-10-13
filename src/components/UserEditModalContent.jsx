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
import { print } from "graphql";

import { saveUserUpdateInfo } from "../utilities/actions";
import { useDispatch, useSelector } from "react-redux";

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
  const [user, setUser] = useState({});

  const dispatch = useDispatch();
  const userInputInfo = useSelector((state) => state.savedUserUpdateInfo);

  const [userInputs, setUserInputs] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
  });

  const { firstName, lastName, gender, address } = userInputs;

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
          setUser(res.data.data.getUserById);

          setUserInputs({
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            address: user.address,
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    // eslint-disable-next-line
  }, [setUser]);

  useEffect(() => {
    const geocoder = document.querySelector(".geocoder-container");

    geoInput.current = geocoder.children[0].children[0];

    geoInput.current.name = "address";

    geoInput.current.classList.add(textBoxClass.addressInput);
    geoInput.current.style.marginTop = 0;
    geoInput.current.style.paddingBottom = "3%";

    address
      ? (geoInput.current.value = address)
      : (geoInput.current.value = userInputInfo.address);

    addressLabel.current = geoInput.current;

    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    if (e.preventDefault) e.preventDefault();

    setUserInputs({
      ...userInputs,
      [e.target.name]: e.target.value,
    });

    dispatch(
      saveUserUpdateInfo({
        ...userInputInfo,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleAddressChange = (e) => {
    setUserInputs({
      ...userInputs,
      latitude: e.latitude,
      longitude: e.longitude,
    });

    dispatch(
      saveUserUpdateInfo({
        ...userInputInfo,
        latitude: e.latitude,
        longitude: e.longitude,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateResponse = await axiosWithAuth()({
        url: `${process.env.REACT_APP_BASE_URL}/graphql`,
        method: "post",
        data: {
          query: print(UPDATE_USER),
          variables: {
            input: {
              ...userInputInfo,
              address: geoInput.current.value,
            },
            id: me,
          },
        },
      });

      if (!(updateResponse.status === 200))
        throw new Error("Problem with update request");
      else {
        const userInfoFromSessionStorage = JSON.parse(
          sessionStorage.getItem("user")
        );
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            ...userInfoFromSessionStorage,
            ...userInputInfo,
            address: geoInput.current.value,
          })
        );
        props.toggleOpen();
      }
    } catch (err) {
      console.dir(err);
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
              value={firstName ? firstName : userInputInfo.firstName}
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
              value={lastName ? lastName : userInputInfo.lastName}
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
              value={gender ? gender : userInputInfo.gender}
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
                onSelected={handleAddressChange}
                limit={2}
                viewport={"viewport"}
                hideOnSelect={true}
                queryParams={"queryParams"}
                updateInputOnSelect={true}
              />
            </div>
          }
        />
        <Button type="submit" onClick={handleSubmit}>
          Update
        </Button>
      </div>
    </div>
  );
}

export default UserEditModalContent;
