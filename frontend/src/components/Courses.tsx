import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Courses() {
    const { user } = useAuth();

    return (
        <div className='flex flex-col gap-2 justify-center items-center min-h-screen'>
            {`${user?.first_name}'s courses placeholder`}
            <Link to="/" className='text-blue-500 underline'>Go back to Home</Link>
        </div>
    );
}

export default Courses;