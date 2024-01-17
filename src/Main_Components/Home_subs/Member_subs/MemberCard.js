import React from 'react';
import './MemberCard.css';
// assets

import adminIcon from '../../../Images/crown.png'
import memberIcon from '../../../Images/sword.png'
import moderatorIcon from '../../../Images/shield.png'

function MemberCard(props) {

    const [role, setRole] = React.useState(props.members.memberRole)
    var roleIcon = null

    if (role.toLowerCase() === 'admin') {
        var roleIcon = adminIcon
    } else if (role.toLowerCase() === 'member') {
        roleIcon = memberIcon
    } else if (role.toLowerCase() === 'moderator') {
        roleIcon = moderatorIcon
    }
    else {
        roleIcon = adminIcon
    }


    return (
        <div className='member_card'>
            <div className='member_card_nav'>
                <img src={roleIcon} alt='avatar' className='member_card_icon' />
                <p className='member_card_role'>{props.members.memberRole}</p>
            </div>
            <div className='member_card_body'>
                <img src={props.members.profilePicture} alt='avatar' className='member_card_avatar' />
                <p>{props.members.memberName}</p>
            </div>

        </div>
    )
}

export default MemberCard