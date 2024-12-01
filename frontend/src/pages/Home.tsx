import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/auth";
import axiosInstance from "../utils/axios";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
                return
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const info = auth.currentUser?.providerData[0];

    const pic = info?.photoURL

    const backend = async () => {
        console.log("backend test")
        let resp = await axiosInstance.get('/')
        console.log(resp)
    }

    return (
        <div>
            <img src={pic || ""} className="w-10 h-10" />
            <p>
                Home of {auth.currentUser?.providerData.map(m => m.displayName)}
            </p>
            <button onClick={backend}>
                click me to test backend
            </button>
        </div>
    )
}
