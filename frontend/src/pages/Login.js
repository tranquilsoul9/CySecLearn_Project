import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
// import { Oval } from "react-loader-spinner";
import { api } from "../api";

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(""); // To store reCAPTCHA response

  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically load the reCAPTCHA script
    const loadRecaptcha = () => {
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);
    };

    loadRecaptcha();

    // Clean up script on component unmount
    return () => {
      document.head.removeChild(document.querySelector("script[src='https://www.google.com/recaptcha/api.js?render=explicit']"));
    };
  }, []);

  const handleRecaptcha = () => {
    window.grecaptcha.render("recaptcha-container", {
      sitekey: "6LfH9yoqAAAAAPUVeE06QVMqeZZ7mjFE_7cETIe8", // Replace with your actual Site Key
      callback: (token) => {
        setRecaptchaToken(token);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      notify("Please complete the CAPTCHA.");
      return;
    }

    try {
      const data = await api.login(email, password);
      console.log(data);
      setCookie("AuthToken", data.data.token);
      setCookie("UserId", data.data.userId);

      navigate("/");
      window.location.reload();
    } catch (e) {
      notify(e.response.data);
    }
  };

  const notify = (error) =>
    toast.error(error, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <>
      <ToastContainer
        className="mt-20"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-col lg:flex-row items-center justify-center bg-[#E1E9F4] bg-opacity-25 h-[100vh] bg-auto">
        <div className="rounded-2xl bg-white drop-shadow-2xl overflow-auto mt-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-[320px] w-[240px] md:w-[300px] lg:w-[320px] mr-5 ml-5 mt-8 mb-8 md:mt-10 md:mb-10 md:mr-7 md:ml-7 lg:mr-10 lg:ml-10 "
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#0287BF] text-center">
              Login
            </h2>
            <label className="block mr-auto ml-auto mt-6 mb-6 md:mt-8 md:mb-8">
              <span className="block mb-2 text-left text-md md:text-lg text-[#2f2e41] font-medium">
                Email:
              </span>
              <input
                className="p-2 md:p-3 w-[100%] border-[#2f2e41] border-2 rounded-lg focus:bg-[#FFD9C0] focus:bg-opacity-10"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
              />
            </label>
            <label className="block mr-auto ml-auto mt-6 mb-6 md:mt-8 md:mb-8">
              <span className="block mb-2 text-left text-md md:text-lg text-[#2f2e41] font-medium">
                Password:
              </span>
              <input
                className="p-2 md:p-3 w-[100%] border-[#2f2e41] border-2 rounded-lg focus:bg-[#FFD9C0] focus:bg-opacity-10"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                maxLength={13}
                minLength={6}
              />
            </label>

            {/* reCAPTCHA */}
            <div id="recaptcha-container" className="flex justify-center items-center mt-6 mb-6 md:mt-8 md:mb-8"></div>

            <div className="w-[100%] flex justify-center items-center">
              <button className="text-white bg-[#0287BF] px-4 py-2 md:px-6 md:py-3 m-2 rounded-full font-semibold w-fit text-lg md:text-xl cursor-pointer hover:bg-[#E1E9F4] hover:text-[#0287BF]">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
