import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RootState, setId } from "../store/slice.ts";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios.ts";
import "../assets/css/style.css";
import dummy from "../assets/images/image.jpg";
import plus from "../assets/images/plus.svg";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.id);
  useEffect(function () {
    if (token.length < 5) {
      axios()
        .get("/api/me")
        .then((response) => {
          dispatch(setId(response.data));
        })
        .catch((error) => {
          localStorage.removeItem("token");
          navigate("register/login");
        });
    }
  }, []);
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-md text-slate-500">Chats Sphere</p>
      </nav>
      <section className="pt-[6rem] ml-2 mr-2 ">
        {/* Active users div */}
        <div className="">
          <h1 className="text-xs p-2 bg-white font-base mb-2 text-slate-600 uppercase mt-0">
            Active users
          </h1>
          <hr className="border border-slate-200" />
          <div className="mt-2 bg-white p-2 rounded-md flex">
            <div className="pr-2 ">
              <img
                src={plus}
                className="object-cover h-12 border-black border-2 border-slate-300 w-12 rounded-full"
              />
              <p className="text-slate-500 text-center text-xs">You</p>
            </div>
            <div className="pr-2 ">
              <img
                src={dummy}
                className="object-cover h-12 border-black border-2 border-slate-300 w-12 rounded-full"
                alt=""
              />
              <p className="text-slate-500 text-center text-xs">James</p>
            </div>
          </div>
          <hr className="mb-2 mt-2 border border-slate-200" />
        </div>
        <div className="">
          <div className="flex  mb-2 bg-white p-2 rounded-md items-center">
            <img
              src={dummy}
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
            <div className="ml-[0.3rem]">
              <p className="font-bold text-sm">John Doe</p>
              <p className="text-xs text-slate-500">How are you bro?</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate("adduser")}
          className="fixed w-12 h-12 flex justify-center items-center border border-solid border-slate-300 hover:animate-pulse bg-white left-[50%] translate-x-[-50%] translate-x-[-50%] bottom-[2rem] shadow-lg rounded-full"
        >
          <img src={plus} className="h-10" alt="" />
        </div>
      </section>
    </div>
  );
}
export default Home;
