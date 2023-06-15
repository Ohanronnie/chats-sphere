import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { RootState, setId } from "../store/slice.ts";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios.ts";
import "../assets/css/style.css";
import dummy from "../assets/images/image.jpg";
import plus from "../assets/images/plus.svg";

function Home() {
  const [messageList, setMessageList] = useState<any[] | null>(null);
  const details = useRef<null | any>(null);
  const navigate = useNavigate();
  const id = useRef<null | string>(null);
  useEffect(function () {
    axios()
      .post("/api/messagelist")
      .then(({ data }) => {
        setMessageList(data.list);
        id.current = data.id!;
      })
      .catch(console.log);
  }, []);
  const MessageList = () => {
    return messageList!.map((e) => (
      <div
        onClick={() => navigate(`/chats/${e.id}`)}
        className="flex  mb-2 bg-white p-2 rounded-md items-center"
      >
        <img
          src={import.meta.env.VITE_IMG_URL + e.cover}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
        <div className="ml-[0.3rem]">
          <p className="font-bold text-sm">
            {e.firstName} {e.lastName}
          </p>
          <p className="text-xs text-slate-500">{e.lastMessage}</p>
        </div>
      </div>
    ));
  };
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
                onClick={() => navigate("/upload")}
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
        <div className="">{messageList && MessageList()}</div>
        <div
          onClick={() => navigate("/adduser")}
          className="fixed w-12 h-12 flex justify-center items-center border border-solid border-slate-300 hover:animate-pulse bg-white left-[50%] translate-x-[-50%] translate-x-[-50%] bottom-[2rem] shadow-lg rounded-full"
        >
          <img src={plus} className="h-10" alt="" />
        </div>
      </section>
    </div>
  );
}
export default Home;
