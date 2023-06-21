import "../assets/css/style.css";
import mail from "../assets/images/mail.svg";
import circle from "../assets/images/circle.svg";
import camera from "../assets/images/camera.svg";
import axios from "../utils/axios.ts";
import {
  useState,
  useRef,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from "react";
import { SocketContext } from "../SocketContext";
import { useParams, useNavigate } from "react-router-dom";
interface IMessage {
  from: string;
  to: string;
  message: string;
  createdAt: string;
}
function Chat() {
  const [message, setMessage] = useState<IMessage[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [defMessage, setDefMessage] = useState<string>("");
  const socket = useContext(SocketContext)!;
  const id = useRef<null | string>(null);
  const msg = useRef<HTMLDivElement | null>(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  useEffect(
    function () {
      socket.on("message", function (data: IMessage) {
        if (
          (data.to === id.current && data.from === userId) ||
          (data.from === id.current && data.to === userId)
        )
          setMessage((prev: IMessage[]) => [...prev, data]);
        msg.current?.scrollIntoView({ behavior: "smooth" });
      });
      return () => {
        socket.off("message");
      };
    },
    [socket]
  );
  useEffect(function () {
    axios()
      .post("/api/message", { id: userId })
      .then(({ data }) => {
        setName(data.name);
        setCover(data.cover);
        console.log(data.cover);
        setMessage(data.message);
        msg.current?.scrollIntoView({ behavior: "smooth" });
        id.current = data.id;
      })
      .catch(console.log);
  }, []);
  useEffect(
    function () {
      msg.current?.scrollIntoView({ behavior: "smooth" });
    },
    [message]
  );
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setDefMessage(ev.target.value);
  };
  const _handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const _file = ev.target.files![0];
    const _reader = new FileReader();
    _reader.onloadend = function (_ev: any) {
      localStorage.setItem("image", _ev.target!.result);
      navigate(`/imageupload/${userId}/${id.current}`);
    };
    _reader.readAsDataURL(_file);
  };
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    setDefMessage("");
    if (defMessage !== " " && defMessage.length >= 1) {
      socket.emit("newMessage", {
        from: id.current,
        to: userId,
        message: defMessage,
        createdAt: new Date(),
      });
    }
  };
  const TransformDate = (date: string) => {
    let _date = new Date(date);
    let hour = _date.getHours().toString().padStart(2, "0");
    let min = _date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${min}`;
  };
  const FromMessage = (text: string, date: string, image?: string) => {
    return (
      <>
        <div
          ref={msg}
          className="rounded-md mb-2 bg-white p-2 w-max max-w-[90%]"
        >
          <p className="font-bold text-sm text-slate-600">{name}</p>
          {image && (
            <img
              src={image}
              class="object-cover rounded-sm w-full max-h-[20rem]"
            />
          )}
          <p className="text-sm font-base w-full break-words text-slate-500">
            {text}
          </p>
          <p className="text-xs text-slate-400">{TransformDate(date)}</p>
        </div>
      </>
    );
  };
  const ToMessage = (text: string, date: string, image?: string) => {
    return (
      <>
        <div
          ref={msg}
          className="rounded-md ml-auto mb-2 bg-white p-2 w-max max-w-[90%]"
        >
          <p className="font-bold text-sm text-slate-600">You</p>
          {image && (
            <img
              src={image}
              class="object-cover rounded-sm w-full max-h-[20rem]"
            />
          )}
          <p className="text-sm font-base w-full break-words text-slate-500">
            {text}
          </p>
          <p className="text-xs text-slate-400">{TransformDate(date)}</p>
        </div>
      </>
    );
  };
  const MapMessage = () => {
    let newMessage = message.map((e: IMessage) => {
      if (e.from === userId) {
        return FromMessage(e.message, e.createdAt, e.url);
      } else {
        return ToMessage(e.message, e.createdAt, e.url);
      }
    });
    return newMessage;
  };
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav class="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-around lowercase items-center shadoew-md bg-white">
        {cover && (
          <img
            src={
              cover.startsWith("images")
                ? import.meta.env.VITE_IMG_URL + cover
                : cover
            }
            class="object-cover h-10 w-10 rounded-full"
            alt=""
          />
        )}
        <p class="uppercase text-slate-500">{name}</p>
        <img src={circle} class="ml-4 h-3 w-3 text-slate-500" />
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <div className="ml-2 bg-slate-100 h-[70vh] overflow-y-scroll">
          {name && MapMessage()}
        </div>
        <form
          className="bg-white -ml-2 p-2 flex rounded-md w-full mr-2 fixed bottom-0"
          onSubmit={handleSubmit}
        >
          <label
            className="block bg-slate-100 break-words flex items-center justify-center text-slate-500 ml-2 mr-2 rounded-md h-10 w-10"
            htmlFor="image"
          >
            <img className="w-4 h-4" src={camera} />
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={_handleChange}
            className="hidden"
            accept="image/*"
          />
          <input
            className="py-3 px-4 outline-none flex items-center justify-center w-10/12 break-all pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-10 pt-auto"
            onChange={handleChange}
            value={defMessage}
            placeholder="Enter your message..."
            type="text"
          />
          <button
            className="bg-slate-100 break-words flex items-center justify-center text-slate-500 ml-2 rounded-md h-10 w-10"
            type="submit"
          >
            <img className="w-6 h-8" src={mail} />
          </button>
        </form>
      </section>
    </div>
  );
}
export default Chat;
