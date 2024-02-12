import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'; 

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); // app from firebase.js
            // Create a popup request
            const result = await signInWithPopup(auth, provider);
            // console.log(result);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate('/');
            
        } catch (error) {
            console.log("Could not sign in with Google", error)
        }
    }
    return (        
        // in order to prevent submition => type = "button" => as it is inside the form
        <button 
            className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95" 
            type="button"
            onClick={ handleGoogleClick }
        >
            Continue with Google
        </button>
    )
}

export default OAuth;