import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/auth";


export default function Home() {

    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                // Redirect to login if not authenticated
                navigate("/login");
                return
            }
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);


    return (
        <div>
            Home
        </div>
    )
}
