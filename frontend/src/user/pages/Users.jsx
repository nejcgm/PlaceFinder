import React from 'react'
import UsersList from '../components/UsersList'

const Users = () => {
    const usersData = [
        {
          id: '1',
          name: 'John Wick',
          image: 'https://variety.com/wp-content/uploads/2023/03/John-Wick-3.jpg',
          places: 3,
        },
    ];

  return (
    <UsersList users={usersData}/>
  )
}

export default Users