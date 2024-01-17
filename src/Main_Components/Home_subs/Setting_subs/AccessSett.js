import React, { useEffect, useState, useRef } from 'react';
import './AcessSett.css';
import InviteMembers from './Access_Subs/InviteMembers';
import { ProjectContext } from '../../../Context/ProjectProvider';
import axios from 'axios';


const AccessSett = ({ currentProject }) => {
      const roleRef = useRef()
      const { state, dispatch } = React.useContext(ProjectContext);

      const [showInviteDialog, setShowInviteDialog] = useState(false);
      const [members, setMembers] = useState([
            { name: 'John Doe', email: 'johndoe@gmail.com', role: 'admin' },
            { name: 'Jane Smith', email: "janeS@gmail.com", role: 'member' },
            { name: 'Bob Johnson', email: "boba@gmail.com", role: 'moderator' },
      ]);



      const handleDelete = (index) => {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
      };

      const handleChangeRole = async (index, value) => {

            const isAuthorized = checkAuthorization();
            if (isAuthorized) {
                  const memberId = members[index].memberId;
                  if (memberId === currentProject.projectLeadId) {
                        alert("You cannot change role of the project lead");
                        return
                  }


                  const newRole = value;

                  const payload = { memberId: memberId, newRole: newRole };
                  dispatch({ type: 'UPDATE_ROLE', payload: payload })
                  const projectID = currentProject.projectID;


                  const res = await axios.post('https://synchronaut-backend.onrender.com/api/project/updateRole', { memberId: memberId, role: newRole, projectID: projectID });
                  if (res.status === 200) {
                        alert('Role updated successfully');
                  }
            }
            else {
                  alert("You are not authorized to change roles");
            }

      };

      const checkAuthorization = () => {
            const userId = JSON.parse(localStorage.getItem('user')).userID;
            const projectLeadId = currentProject.projectLeadId;
            if (projectLeadId === userId) {
                  return true;
            }
            return false;

      }

      const toggleShowInviteDialog = () => {
            setShowInviteDialog(!showInviteDialog);
      }

      const deleteMember = async (index) => {

            const isAuthorized = checkAuthorization();
            if (!isAuthorized) {
                  alert("You are not authorized to delete members");
                  return
            }

            const m = members.splice(index, index);

            const memberId = m[0].memberId;
            const projectID = currentProject.projectID;
            const payload = { userId: memberId, projectId: projectID };

            const res = await axios.post('https://synchronaut-backend.onrender.com/api/project/removeUserById', payload);
            if (res.status === 200) {
                  const members0 = members.filter((member) => member.memberId !== memberId);
                  setMembers(members0);
                  alert('Member deleted successfully');
            }
            else {
                  alert('Member could not be deleted');
            }



      }


      useEffect(() => {

            setMembers(currentProject.projectMembers);
      }
            , [members]);

      // ...

      return (
            <div className="access-settings">
                  <button className='invite_members' onClick={toggleShowInviteDialog}>Invite Members</button>
                  {showInviteDialog && <InviteMembers currentProject={currentProject} goback={toggleShowInviteDialog} />}
                  <table className="access-settings-table">
                        <thead>
                              <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                              </tr>
                        </thead>
                        <tbody>
                              {members.map((member, index) => (
                                    <tr key={index}>
                                          <td>{member.memberName}</td>
                                          <td>{member.memberEmail}</td>
                                          <td>
                                                <select
                                                      ref={roleRef}
                                                      value={member.memberRole}
                                                      onChange={(e) => handleChangeRole(index, e.target.value)}
                                                >
                                                      <option value="admin">Admin</option>
                                                      <option value="moderator">Moderator</option>
                                                      <option value="Member">Member</option>
                                                </select>
                                          </td>
                                          <td>
                                                <button onClick={() => deleteMember(index)}>Delete</button>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </div>
      );
      // ...

};

export default AccessSett;
