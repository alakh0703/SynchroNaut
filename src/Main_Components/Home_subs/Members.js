import React from 'react';
import './Members.css';
// importing assets
import memIcon from '../../Images/team.png'
import MemberCard from './Member_subs/MemberCard';
import one from '../../Images/Avatars/1292351.png'
import two from '../../Images/Avatars/jane4.jpg'
import three from '../../Images/Avatars/jane5.jpg'
import four from '../../Images/Avatars/review-john-wick-chapter-4-elevates-the-badass-action-franchise-to-a-new-level.jpg'


function Members({currentProject}) {
  const memRef = React.useRef(null)
  const [members, setMembers] = React.useState([
    {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      role: 'Member',
      avatar: one
    },
    {
      name: 'Alakh Patel',
      email: 'alakhhbn007@gmail.com',
      role: 'Admin',
      avatar: two
    },
    {
      name: 'Garv Chhokra',
      email: 'garv.chhokra@gmail.com',
      role: 'Moderator',
      avatar: three
    },
    {
      name: 'John Wick',
      email: 'john.wick@gmail.com',
      role: 'Member',
      avatar: four
    },
    {
      name: 'Dhrumit Patel',
      email: 'dhrumit.patel1677@gmail.com',
      role: 'Admin',
      avatar: one
    },
    {
      name: 'Divya Agarwal',
      email: 'divya.a12@gmail.com',
      role: 'Member',
      avatar: two
    },
    {
      name: 'Gitansh Mittal',
      email: 'gitansh9mittal@gmail.com',
      role: 'Admin',
      avatar: two
    }
    
  ])
  const [showMembers, setShowMembers] = React.useState([])

  
  const handleSearch = () => {
    const search = memRef.current.value
    const newMembers = members.filter((member) => {
      return (member.memberName).toLowerCase().includes(search.toLowerCase())
    })
    setShowMembers(newMembers)
  
  }

  React.useEffect(() => {
    setMembers(currentProject.projectMembers)

    setShowMembers(currentProject.projectMembers)

    
  }, [])
  return (
    <div className='members_main'>
      <div className='members_navbar'>
        <div className='members_navbar_left'>
          <img src={memIcon} alt='avatar' className='members_icon' />
          <h1>Members</h1>
          </div>
        <div className='members_navbar_center'>
          <input ref={memRef} onChange={handleSearch} type='text' placeholder='Search' className='members_search' />

        </div>
    
      </div>
      <div className='members_body'>
        {showMembers.map((member) => (
          <MemberCard members={member}/>
        ))}
        </div>
    </div>
  )
}

export default Members