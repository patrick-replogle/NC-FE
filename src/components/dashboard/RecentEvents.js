import React, { useEffect, useState } from "react";
import { axiosWithAuth } from "../../utilities/axiosWithAuth";
import { useSelector, useDispatch } from "react-redux";
import RecentCard from "./RecentCard";
import { print } from "graphql";
import {
  GET_INVITED_EVENTS,
  GET_FAVORITE_EVENTS,
} from "../../graphql/users/user-queries";
import {
  getEventsSuccess,
  getFavoriteEventsSuccess,
} from "../../utilities/actions";
import Typography from "@material-ui/core/Typography";

//icon imports
import CircularProgress from "@material-ui/core/CircularProgress";

const RecentEvents = () => {
  const me = JSON.parse(localStorage.getItem("user"));
  const update = useSelector((state) => state.update);
  const eventList = useSelector((state) => state.eventList);
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (me) {
      setIsFetching(true);
      axiosWithAuth()({
        url: `${process.env.REACT_APP_BASE_URL}/graphql`,
        method: "post",
        data: {
          query: print(GET_INVITED_EVENTS),
          variables: { id: me },
        },
      })
        .then((res) => {
          const sorted = res.data.data.getInvitedEvents.sort(
            (a, b) => b.createDateTime - a.createDateTime
          );
          const limitSet = sorted.slice(
            0,
            process.env.REACT_APP_DASHBOARD_EVENT_LIMIT
          );
          dispatch(getEventsSuccess(limitSet));
        })
        .catch((err) => {
          console.log(err.message);
        })
        .finally((res) => {
          setIsFetching(false);
        });
    }
    // eslint-disable-next-line
  }, [update]);

  useEffect(() => {
    if (me) {
      axiosWithAuth()({
        url: `${process.env.REACT_APP_BASE_URL}/graphql`,
        method: "post",
        data: {
          query: print(GET_FAVORITE_EVENTS),
          variables: { id: me },
        },
      })
        .then((res) => {
          dispatch(getFavoriteEventsSuccess(res.data.data.getFavoriteEvents));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Typography
        variant="h4"
        //with minimal elements on dashboard, moving this to center for better styling. to be moved back once feed and other components are added back
        style={
          { textAlign: "center", marginBottom: "10px" } // {{ marginLeft: "12px", marginBottom: "5px" }}
        }
      >
        Newest Events
      </Typography>
      <div
        style={{
          overflow: "auto",
          height: "80vh",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="recent-events-container">
          {isFetching ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress style={{ color: "#58D573" }} />
            </div>
          ) : eventList.length > 0 ? (
            eventList.map((ele) => (
              <RecentCard
                {...ele}
                key={ele.id}
                currentStatus={
                  ele.users.filter((u) => `${u.id}` === `${me}`)[0].status
                }
              />
            ))
          ) : (
            <Typography style={{ marginTop: "20px" }}>
              No recently created events.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentEvents;
