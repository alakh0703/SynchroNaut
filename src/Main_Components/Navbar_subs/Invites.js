import React, { useState } from "react";
import "./Invites.css";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";

function Invites() {
  const [invites, setInvites] = useState([]);
  const { state, dispatch } = useContext(AuthContext);

  const [selectedInvite, setSelectedInvite] = useState({
    inviteID: "1",
    projectName: "SynchroNaut",
    projectID: "ProjectID 1",
    projectLead: "Alakh Patel",
    projectDescription: "Description 1",
  });

  const viewInvite = (e) => {
    const inviteID = e.target.id;
    const invite = invites.find((invite) => invite.inviteID === inviteID);
    setSelectedInvite(invite);
  };

  const rejectInviteHandler = async () => {
    const inviteID = selectedInvite.inviteID;
    const userID = JSON.parse(localStorage.getItem("user")).userID;
    const projectID = selectedInvite.projectID;
    const res = await axios.post(
      "https://synchronaut-backend.onrender.com/api/project/inviteResponse",
      {
        projectID: projectID,
        userID: userID,
        inviteID: inviteID,
        accepted: false,
      }
    );
    if (res.status === 200) {
      dispatch({ type: "UPDATE_LOCALSTORAGE_USER_FROM_DB" });
    } else {
      alert("Something went wrong");
    }
  };

  const acceptInviteHandler = async () => {
    const inviteID = selectedInvite.inviteID;
    const userID = JSON.parse(localStorage.getItem("user")).userID;
    const projectID = selectedInvite.projectID;
    const res = await axios.post(
      "https://synchronaut-backend.onrender.com/api/project/inviteResponse",
      {
        projectID: projectID,
        userID: userID,
        inviteID: inviteID,
        accepted: true,
      }
    );
    if (res.status === 200) {
      dispatch({ type: "UPDATE_LOCALSTORAGE_USER_FROM_DB" });
    } else {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchInvites = async () => {
      // Fetch user from local storage
      const user = localStorage.getItem("user");
      if (!user) {
        window.location.href = "/";
        return;
      }
      const user2 = JSON.parse(user);

      try {
        const invites = await getInvites(user2.userID);
        setInvites(invites);

        if (invites.length > 0) {
          setSelectedInvite(invites[0]);
        }
      } catch (error) {
        console.error("Error fetching invites: ", error);
      }
    };

    fetchInvites();
  }, []);

  const getInvites = async (userID) => {
    try {
      const res = await axios.get(
        "https://synchronaut-backend.onrender.com/api/project/getInviteById",
        { params: { userID } }
      );
      return res.data.invites;
    } catch (error) {
      throw error;
    }
  };

  // useEffect(() => {
  //   // fetch user from local storage
  //   const invites2 = getInvites();
  //   console.log("invite: ", invites2)
  //   const user = localStorage.getItem('user');
  //   if (!user) {
  //     window.location.href = '/';
  //     return;
  //   }
  //   const user2 = JSON.parse(user);
  //   const invites = user2.invites;
  //   setInvites(invites);

  //   if(invites.length > 0){
  //     setSelectedInvite(invites[0]);
  //   }

  // }, []);

  // const getInvites = async () => {
  //   const res = await axios.get("http://localhost:5000/api/project/getInviteById", {params: {userID: JSON.parse(localStorage.getItem('user')).userID}})
  //   return res.data.invites
  // }


  return (
    <div className="Invites_Main">
      <div className="Invites_Main_Left">
        <div className="InviteContainer">
          {invites.length === 0 && (
            <p className="oops_no_invites"> Oops! No Invites</p>
          )}
          {invites.map((invite, invIdx) => (
            <div
              className="Invite"
              id={invite.inviteID}
              key={invite.inviteID}
              onClick={viewInvite}
            >
              <p>{invite.projectName}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="Invites_Main_Right">
        {invites.length === 0 && <p>Oops! You got no invites</p>}
        {invites.length > 0 && (
          <div className="invite_main_right_top">
            <p>{selectedInvite.projectName}</p>
          </div>
        )}
        {invites.length > 0 && (
          <div className="invite_main_right_middle">
            <div className="invite_main_right_middle_owner">
              <p>Project Manager: </p>
              <input
                type="text"
                value={selectedInvite.projectLead}
                className="invite_project_manager"
                disabled
              />
            </div>
            <div className="invite_main_right_middle_description">
              <p className="invite_des">Description: </p>
              <div className="invite_main_right_middle_description_text">
                <p>{selectedInvite.projectDescription}</p>
              </div>
            </div>
          </div>
        )}
        {invites.length > 0 && (
          <div className="invite_main_right_bottom">
            <button className="accept_invite" onClick={acceptInviteHandler}>
              Accept
            </button>
            <button className="reject_invite" onClick={rejectInviteHandler}>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invites;
