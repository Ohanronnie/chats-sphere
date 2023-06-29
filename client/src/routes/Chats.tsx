import "../assets/css/style.css";
import mail from "../assets/images/mail.svg";
import circle from "../assets/images/circle.svg";
import camera from "../assets/images/camera.svg";
import leftArrow from "../assets/images/arrow-left.svg";
import _times from "../assets/images/times.svg";
import axios from "../utils/axios.ts";
import extract from "../utils/extract.ts";
import {
  FromMessage,
  ToMessage,
  ReplyTo,
  ReplyFrom,
} from "../components/Message";
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
  url?: string;
  replyTo?: {
    from: string;
    to: string;
    message: string;
  };
}
interface IReply {
  from: string;
  to: string;
  message: string;
}
function Chat() {
  const [message, setMessage] = useState<IMessage[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [defMessage, setDefMessage] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [reply, setReply] = useState<null | IReply>(null);
  const socket = useContext(SocketContext)!;
  const id = useRef<null | string>(null);
  const msg = useRef<HTMLDivElement | null>(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  useEffect(function () {
    socket.emit("active", { token: localStorage.getItem("token") });
  }, []);
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
      socket.on("online", function (_id: string) {
        if (_id === userId) {
          setActive(true);
        }
      });
      socket.on("offline", function (_id: string) {
        if (_id === userId) {
          setActive(false);
        }
      });
      return () => {
        socket.off("message");
        socket.off("online");
        socket.off("offline");
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
        setMessage(data.message);
        setActive(data.online);
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
    setReply(null);
    if (defMessage !== " " && defMessage.length >= 1) {
      socket.emit("newMessage", {
        from: id.current,
        to: userId,
        message: defMessage,
        createdAt: new Date(),
        replyTo: reply,
      });
    }
  };
  const handleReply = (text: string, from: string) => {
    from === "from"
      ? setReply({
          from: userId,
          to: id.current,
          message: text,
        })
      : setReply({
          from: id.current,
          to: userId,
          message: text,
        });
  };
  const TransformDate = (date: string) => {
    let _date = new Date(date);
    let hour = _date.getHours().toString().padStart(2, "0");
    let min = _date.getMinutes().toString().padStart(2, "0");

    return `${hour}:${min}`;
  };
  const MapMessage = (_message) => {
    let newMessage = _message.map((e: IMessage) => {
      if (!e.replyTo) {
        if (e.from === userId) {
          return FromMessage(
            name,
            e.message,
            e.createdAt,
            msg,
            handleReply,
            e.url
          );
        } else {
          return ToMessage(e.message, e.createdAt, msg, handleReply, e.url);
        }
      } else {
        if (e.from === userId) {
          if (e.replyTo.from === userId) {
            return ReplyFrom(
              name,
              e.message,
              e.createdAt,
              handleReply,
              msg,
              null,
              e.replyTo.message,
              name
            );
          } else {
            return ReplyFrom(
              name,
              e.message,
              e.createdAt,
              handleReply,
              msg,
              null,
              e.replyTo.message,
              "You"
            );
          }
        } else {
          if (e.replyTo.from === userId) {
            return ReplyTo(
              name,
              e.message,
              e.createdAt,
              handleReply,
              msg,
              null,
              e.replyTo.message,
              name
            );
          } else {
            return ReplyTo(
              name,
              e.message,
              e.createdAt,
              handleReply,
              msg,
              null,
              e.replyTo.message,
              "You"
            );
          }
        }
      }
    });
    return newMessage;
  };
  function handleMessage(message: any) {
    let extracted = extract(message);
    let arr = Object.keys(extracted).map((value: any, index: number) => {
      return (
        <div>
          <div class="w-full flex justify-center">
            <p class="bg-slate-300 relative w-max left-[50%] translate-x-[-50%] text-slate-100 text-xs flex justify-center text-center p-1 mb-1 rounded-md">
              {new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {MapMessage(extracted[value])}
          </div>
        </div>
      );
    });
    return arr;
  }
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-around lowercase items-center shadoew-md bg-white">
        <img
          src={leftArrow}
          onClick={() => navigate("/home")}
          className="h-4 w-4"
        />
        {cover && (
          <img
            src={
              cover.startsWith("images")
                ? import.meta.env.VITE_IMG_URL + cover
                : cover
            }
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
        )}
        <p className="uppercase text-sm w-16 truncate text-slate-500">{name}</p>
        {active ? (
          <img src={circle} className="ml-4 h-3 w-3 text-slate-500" />
        ) : (
          <img className="ml-4 h-3 w-3 text-slate-500" />
        )}
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <div className="ml-2 bg-slate-100 h-[70vh] overflow-y-scroll">
          {message && handleMessage(message)}
        </div>
        <form
          className="bg-white -ml-2 p-2 rounded-md w-full mr-2 fixed bottom-0"
          onSubmit={handleSubmit}
        >
          {reply && (
            <div className="flex rounded-md overflow-ellipsis max-h-14 justify-between p-2 mb-2 bg-slate-100">
              <p className="text-xs overflow-hidden text-slate-400 ">
                {reply.message}
              </p>
              <img
                src={_times}
                onClick={() => setReply(null)}
                class="h-4 w-4"
              />
            </div>
          )}
          <div className="flex">
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
          </div>
        </form>
      </section>
    </div>
  );
}
export default Chat;
