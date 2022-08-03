import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState();
    const [validName, setValidName] = useState(false);
    const [userFocused, setUserFocused] = useState(false);

    const [pwd, setPwd] = useState();
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocused, setPwdFocused] = useState(false);

    const [confirmPwd, setConfirmPwd] = useState();
    const [validConfirmPwd, setValidConfirmPwd] = useState(false);
    const [confirmPwdFocused, setConfirmPwdFocused] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    useEffect(() => {
        userRef.current.focus();
    }, [])
    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user])
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === confirmPwd;
        setValidConfirmPwd(match);
    }, [pwd, confirmPwd])
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, confirmPwd])
    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        // console.log(user, pwd);
        // setSuccessMsg(true);
        try{
            const res = await axios.post('/register', JSON.stringify({
                user: user,
                pwd: pwd
            }),{
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(res.data);
            console.log(res.accessToken);
            console.log(JSON.stringify(res));
            console.log(res);
            setSuccessMsg(true);
        }
        catch(err){
            if(!err.response){
                setErrMsg('No server Response')
            } else if(err.response?.status === 409){
                setErrMsg("Username Taken");
            }else{
                setErrMsg("Unknown Error");
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
                            <a href="#">Sign In</a>
                        </p>
                    </section>

                ) : (
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='username'>Username
                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocused(true)}
                                onBlur={() => setUserFocused(false)}
                            />
                            <p id="uidnote" className={userFocused && user && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </p>
                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocused(true)}
                                onBlur={() => setPwdFocused(false)}
                            />
                            <p id="pwdnote" className={pwdFocused && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validConfirmPwd && confirmPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validConfirmPwd || !confirmPwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                value={confirmPwd}
                                required
                                aria-invalid={validConfirmPwd ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setConfirmPwdFocused(true)}
                                onBlur={() => setConfirmPwdFocused(false)}
                            />
                            <p id="confirmnote" className={confirmPwdFocused && !validConfirmPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>
                            <button disabled={!validName || !validPwd || !confirmPwd ? true : false}>Sign Up</button>
                        </form>
                    </section>
                )
            }

        </>
    )
}

export default Register