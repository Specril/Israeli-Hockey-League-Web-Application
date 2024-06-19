import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';

// Simply pretty text for user types
const userTypes = {
    coach: 'Coach User',
    referee: 'Referee User',
    admin: 'Admin User'
};

// This will be in the database
const userTypeMapping = {
    '5jNBtjoDHleTFpxlGEPJZzPSszh2': 'coach',
    '8nbsEbm2YAWg1erGuhjxEFMsJrg2': 'referee',
    'X8F8sEu7XORGctSFwIsWm3ArhZs1': 'admin'

    // Add more UID to user type mappings as needed
};

// THIS IS A PLACE HOLDER - WILL BE HANDLED THROUGH DATABASE (I THINK... MAYBE NOT? BUT DEFINITELY NOT HERE)

const Home = () => {
    const { currentUser } = useAuth();
    const [userType, setUserType] = useState(null);
    const name = currentUser.displayName ? currentUser.displayName : currentUser.email;

    useEffect(() => {
        if (currentUser) {
            const userTypeKey = userTypeMapping[currentUser.uid];
            if (userTypeKey) {
                setUserType(userTypes[userTypeKey]);
            } else {
                setUserType('Unknown User Type');
            }
        }
    }, [currentUser]);

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            {userType && <div>Your user type is: {userType}</div>}
        </div>
    );
};

export default Home;
