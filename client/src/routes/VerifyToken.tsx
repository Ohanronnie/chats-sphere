import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/axios.ts";
import "../assets/css/register.css";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  useEffect(
    function () {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      (async () => {
        try {
          let response = await axios().post(`/register/token?token=${token}`);
          setError(false);
          setTimeout(function () {
            navigate("/");
          }, 1000);
        } catch (err: any) {
          setError(true);
        }
      })();
    },
    [location]
  );
  return (
    <div className="text-sm h-[100vh] flex item-center w-[100vw] bg-slate-100">
      <p className="mt-2 text-center flex items-center text-slate-600">
        {!error
          ? `You have successfully verified your email address you will be redirected to our home page in < 1 second`
          : `Your token is invalid`}
      </p>
    </div>
  );
}
