import { useState } from "react";
import Baner from "../assets/images/baner.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Login() {
  const Navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [send, setSend] = useState(false);
  const [user, setUser] = useState("");

  const [logData, setLogdata] = useState({
    email: "",
    otp: "",
  });

  const handlOnchange = (e) => {
    const { name, value } = e.target;
    let oldData = { ...logData };
    oldData[name] = value;
    setLogdata(oldData);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const Submitlog = async () => {
    try {
      if (logData.email === "" || logData.otp === "") {
        toast.error("all feilds are required");
        return;
      }
      await axios.post("https://highway-delite-backend-wv4v.onrender.com/secure-login", logData);
      toast.success("login Successfull");
      localStorage.setItem("token", "dummy-token");
      Navigate("/dashboard", { state: { user: user } });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Invalid or expired OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const sendOtp = async () => {
    if (logData.email === "") {
      toast.error("Email required");
      return;
    }
    try {
      const emRes = await axios.post("https://highway-delite-backend-wv4v.onrender.com/check-mail", {
        email: logData.email,
      });
      if (emRes.data.status === 300) {
        toast.error("please sign up");
        return;
      }
      let data = emRes.data.exists;
      setUser(data);
    } catch (err) {
      console.log(err);
    }

    try {
      const response =await axios.post("https://highway-delite-backend-wv4v.onrender.com/secure-login", {
        email: logData.email,
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
  return (
    <>
      <Toaster />
      <div className="flex justify-center items-center space-x-8 w-full ">
        <div className="w-100">
          <div className="flex items-center justify-center sm:justify-start md:mt-0 mt-10">
            <img className="h-6 w-6" src={logo} alt="" />
            <h1 className="font-bold ml-2 text-2xl">HD</h1>
          </div>
          <div className="flex flex-col justify-center mt-20 ">
            <h1 className="text-4xl font-bold text-center md:text-left">
              Sign in
            </h1>
            <p className="text-gray-600 text-center md:text-left">
              Please signin to login your account.
            </p>

            <div className="mt-10 space-y-5 ml-4 md:ml-0">
              <div className="relative w-full max-w-sm">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={logData.email}
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
                    value={logData.otp}
                    onChange={handlOnchange}
                    placeholder="OTP"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 max-w-sm focus:ring-blue-500 mb-3"
                  />
                  <button className="text-blue-500 underline hover:text-black cursor-pointer">
                    Resend otp
                  </button>
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="myCheckbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="myCheckbox" className="text-gray-700">
                  Keep me loggen in
                </label>
              </div>
              {send ? (
                <button
                  onClick={Submitlog}
                  className="border border-gray-300 rounded-lg text-white bg-blue-500 relative w-full max-w-sm h-12"
                >
                  Sign in
                </button>
              ) : (
                <button
                  onClick={sendOtp}
                  className="border border-gray-300 rounded-lg text-white bg-blue-500 relative w-full max-w-sm h-12"
                >
                  Send otp
                </button>
              )}

              <p className="text-center">
                Need an account ??{" "}
                <a className="text-blue-500  underline" href="/">
                  create one
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

export default Login;
