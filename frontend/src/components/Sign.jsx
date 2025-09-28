import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Baner from "../assets/images/baner.png";
import axios from "axios";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

function Sign() {
  const Navigate = useNavigate();
  const [send, setSend] = useState(false);

  const [signUp, setSignup] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const handlOnchange = (e) => {
    const { name, value } = e.target;
    let oldData = { ...signUp };
    oldData[name] = value;
    setSignup(oldData);
  };

  const saveData = () => {
    const updatedUser = {
      name: signUp.name,
      email: signUp.email,
    };
    try {
      axios.post("https://highway-delite-backend-wv4v.onrender.com/signup", signUp);
      toast.success("Signup successfully");
      console.log(updatedUser);
      localStorage.setItem("token", "dummy-token");
      Navigate("/dashboard", { state: { user: updatedUser } });
    } catch (err) {
      console.log(err);
    }
  };

  const OtpSend = async () => {
    if (signUp.name === "" || signUp.dob === "" || signUp.email === "") {
      toast.error("all feilds are required");
      return;
    }
    try {
      const emRes = await axios.post("https://highway-delite-backend-wv4v.onrender.com/check-mail", {
        email: signUp.email,
      });
      if (emRes.data.status === 301) {
        toast.error("email already exist");
        return;
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const response = axios.post("https://highway-delite-backend-wv4v.onrender.com/secure-login", {
        email: signUp.email,
      });
      if (response.status === 500) {
        toast.error("failed to send otp.");
        return;
      }
      toast.success("otp sent");
      setSend(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        signUp.name === "" ||
        signUp.dob === "" ||
        signUp.email === "" ||
        signUp.otp === ""
      ) {
        toast.error("all feilds are required");
        return;
      }

      await axios.post("https://highway-delite-backend-wv4v.onrender.com/secure-login", signUp);
      saveData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Invalid or expired OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <Toaster />

      <div className="flex justify-center items-center space-x-8 w-full ">
        <div className="w-100  ">
          <div className="flex items-center justify-center sm:justify-start md:mt-0 mt-10">
            <img className="h-6 w-6" src={logo} alt="" />
            <h1 className="font-bold ml-2 text-2xl">HD</h1>
          </div>
          <div className="flex flex-col justify-center mt-20 ">
            <h1 className="text-4xl font-bold text-center md:text-left">
              Signup
            </h1>
            <p className="text-gray-600 text-center md:text-left">
              Singup to enjoy the feature of HD
            </p>

            <div className="mt-10 ml-4 md:ml-0 space-y-5">
              <div className="relative w-full max-w-sm">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={signUp.name}
                  onChange={handlOnchange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative w-full max-w-sm mt-6">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={signUp.dob}
                  onChange={handlOnchange}
                  className="w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative w-full max-w-sm">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={signUp.email}
                  onChange={handlOnchange}
                  placeholder="example@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {send ? (
                <div>
                  <input
                    type="password"
                    name="otp"
                    value={signUp.otp}
                    onChange={handlOnchange}
                    placeholder="OTP"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 max-w-sm focus:ring-blue-500 mb-3"
                  />
                  <button
                    onClick={handleSubmit}
                    className="border border-gray-300 rounded-lg text-white bg-blue-500 relative w-full max-w-sm h-12"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={OtpSend}
                    className="border border-gray-300 rounded-lg text-white bg-blue-500 relative w-full max-w-sm h-12"
                  >
                    Get OTP
                  </button>
                </div>
              )}
              <p className="text-center">
                Already have an account ??{" "}
                <a className="text-blue-500  underline" href="/login">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img className="h-200" src={Baner} alt="banner" />
        </div>
      </div>
    </>
  );
}

export default Sign;
