import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {


  const {backendUrl}=useContext(Appcontent);

  axios.defaults.withCredentials=true;



  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword,setNewPassword]=useState('');
  const [isEmailSent,setisEmailSent]=useState('');
  const [otp,setOtp]=useState('');
  const [isOtpSubmitted,setIsOtpSubmitted]=useState('');

  const inputRefs = React.useRef([]);

  async function handleInput(e, index) {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  function handlePaste(e) {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }


  async function onSubmitEmail(e){

    e.preventDefault();

    try {
      const {data}=await axios.post(backendUrl+'/auth/send-reset-otp',{email})

      data.success ? toast.success(data.message) : toast.error(data.message)


      data.success && setisEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }

  }

  async function onSubmitOtp(e) {
    e.preventDefault();

    const otpArray=inputRefs.current.map(e => e.value)

    setOtp(otpArray.join(''));

    setIsOtpSubmitted(true);


  }


  async function onSubmitNewPassword(e) {
    e.preventDefault()
    try {
      const {data}=await axios.post(backendUrl + '/auth/reset-password',{email,otp,newPassword})

      data.success ? toast.success(data.message) : toast.error(data.message);

      data.success&& navigate('/login')
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
{/*ENTER EMAIL ID*/}
{!isEmailSent &&       <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitEmail}>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered email address
        </p>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} className="w-3 h-3" />
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3" >
          {" "}
          Submit
        </button>
      </form>}



{/* 
{otp input form} */}

{!isOtpSubmitted && isEmailSent &&       <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitOtp}>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset password OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit-code sent to you Email
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md "
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3">
          Submit
        </button>
      </form>}


{/* {enter new password} */}

{isOtpSubmitted && isEmailSent &&   <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitNewPassword}>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          New Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the new Password below
        </p>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} className="w-3 h-3" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-white"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
        </div>

        <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3">
          {" "}
          Submit
        </button>
      </form>}
    
    </div>
  );
}
