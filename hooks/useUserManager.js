import { useEffect, useState } from "react";
import { auth, db } from "../firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function useUserManager() {

    const user = auth.currentUser;
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user?.email)));
                    if (!userDoc.empty) {
                        const userDocSnapshot = userDoc?.docs[0];
                        const data = userDocSnapshot?.data();
                        setCurrentUser({ 
                            id: userDocSnapshot?.id,
                            email: data?.email,
                            fullName : data?.fullName, 
                            profilePic: data?.profilePic 
                        });
                    } else {
                        console.log('No user document found!');
                    }
                } else {
                    console.log('No user is signed in.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); // Call the function
    }, [user]);

    return {
        currentUser
    }
}