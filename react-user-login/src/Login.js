import React, { useState, useRef, useEffect, useContext } from 'react'
import AuthContext from './Context/AuthProvider';
import axios from './axios';
const LOGIN_URL = '/auth'
const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState();
    const [pwd, setPwd] = useState();
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    useEffect(() => {
        userRef.current.focus();
    }, [])
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(user, pwd)
        try {
            const res = await axios.post(LOGIN_URL, JSON.stringify({
                user: user,
                pwd: pwd
            }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(res.data);
            console.log(res.accessToken);
            console.log(JSON.stringify(res?.data));
            console.log(res);
            const accessToken = res?.data?.accessToken;
            setAuth({user, pwd, accessToken});
            setUser('');
            setPwd('');
            setSuccessMsg(true);
        }
        catch (err) {
            if(!err?.response){
                setErrMsg("No server response ");

            }else if(err.response?.status === 400){
                setErrMsg("Missing userName and Password");
            }else if(err.response?.status === 401){
                setErrMsg("Unauthorized");
            }
            else{

                console.log(err);
            }
            errRef.current.focus();
        }
    }
    return (
        <>
            {
                successMsg ? (
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="#">Go to home </a>
                        </p>
                    </section>
                ) : (
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Sign In</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='username'>username</label>
                            <input
                                type="text"
                                id='username'
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            />
                            <label htmlFor='password'>Password: </label>
                            <input
                                type="password"
                                id='password'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                            <button>Sign In</button>
                        </form>
                    </section>
                )
            }
        </>
    )
}

export default Login