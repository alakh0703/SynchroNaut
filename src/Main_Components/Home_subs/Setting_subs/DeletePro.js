import React from 'react'
import DeleteAccount from './Access_Subs/DeleteProject'
import './DeletePro.css'

function DeletePro() {
  const [showDelete, setShowDelete] = React.useState(false);

  const showDeleteHandler = () => {
    setShowDelete(!showDelete);
  }

  return (
    <div>
      <button onClick={showDeleteHandler} className='delete_pro_btn'>Delete Project</button>
     {showDelete && <DeleteAccount delete1={showDeleteHandler} />}
    </div>
  )
}

export default DeletePro