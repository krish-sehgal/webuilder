import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../configs/firebase";
import ErrorToast from "../components/ErrorToast";
import axios from "axios";

const auth = getAuth(app);

function getErrorMessage(statusCode: string): string {
    switch (statusCode) {
        case 'auth/email-already-in-use':
            return 'Email Already Registered';
        default:
            return 'something went wrong';
    }
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const createUser = async (firebaseUid: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/create`,{ firebaseUid, email })
            return response.data
        } catch (error) {
            console.error('fail to create user in backend');
            throw error
        }
    }

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let userCredential = null

        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log('account created successfuly');

            await createUser(userCredential.user.uid);
        } catch (error: any) {
            if (userCredential?.user) {
                try {
                    await userCredential.user.delete();
                    console.log('cleanup after backend server failed');
                    <ErrorToast message="Resgistration fail, please try Again" onClose={() => setError('')} />
                } catch (deleteError) {
                    console.error('fail to delete firebase user', deleteError);
                    setError('Sign up partially fail, please contect support team');
                }
            } else if (error.code) {
                setError(getErrorMessage(error.code));
            } else {
                setError('An unexpected error occur, pls try again');
            }
        }
    }
    return (
        <div className="bg-linear-to-br from-gray-900 to-gray-800 min-h-screen flex justify-center items-center">
            {error && <ErrorToast message={error} onClose={() => setError('')} />}
            <div className="bg-gray-900 px-10 py-10 rounded-md">
                <div className="flex justify-center pb-5">
                    <p className="text-2xl text-white">SignUp/Login</p>
                </div>
                <form className=" flex flex-col items-center gap-3">
                    <input
                        type="text"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="border w-100 px-4 py-2 rounded-md text-white"
                    />
                    <input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border w-100 px-4 py-2 rounded-md text-white"
                    />
                    <button
                        className="bg-purple-400 w-100 rounded-md px-4 py-2 cursor-pointer"
                        onClick={handleSignupSubmit}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
