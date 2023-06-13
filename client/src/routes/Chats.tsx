import "../assets/css/style.css";
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
import { useParams } from "react-router-dom";
interface IMessage {
  from: string;
  to: string;
  message: string;
  createdAt: string;
}
function Chat() {
  const [message, setMessage] = useState<IMessage[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [defMessage, setDefMessage] = useState<string>("");
  const socket = useContext(SocketContext)!;
  const id = useRef<null | string>(null);
  const msg = useRef<HTMLElement | null>(null);
  const { userId } = useParams();
  useEffect(
    function () {
      socket.on("message", function (data: IMessage) {
        if (data.to === id.current || data.from === id.current)
          setMessage((prev: IMessage) => [...prev, data]);
        msg.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [socket]
  );
  useEffect(function () {
    axios()
      .post("/api/message", { id: userId })
      .then(({ data }) => {
        setName(data.name);
        setMessage(data.message);
        msg.current?.scrollIntoView({ behavior: "smooth" });
        id.current = data.id;
      })
      .catch(console.log);
  }, []);
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setDefMessage(ev.target.value);
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
  const FromMessage = (text: string, date: string | Date) => {
    return (
      <>
        <div
          ref={msg}
          className="rounded-md mb-2 bg-white p-2 w-max max-w-[90%]"
        >
          <p className="font-bold text-sm text-slate-600">{name}</p>
          <p className="text-sm font-base w-full break-words text-slate-500">
            {text}
          </p>
          <p className="text-xs text-slate-400">{TransformDate(date)}</p>
        </div>
      </>
    );
  };
  const ToMessage = (text: string, date: string | Date) => {
    return (
      <>
        <div
          ref={msg}
          className="rounded-md ml-auto mb-2 bg-white p-2 w-max max-w-[90%]"
        >
          <p className="font-bold text-sm text-slate-600">You</p>
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
        return FromMessage(e.message, e.createdAt);
      } else {
        return ToMessage(e.message, e.createdAt);
      }
    });
    return newMessage;
  };
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-slate-500">{name}</p>
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <div className="ml-2">{name && <MapMessage />}</div>
        <form
          className="bg-white ml-2 p-2 flex rounded-md w-11/12 mr-2 fixed bottom-0"
          onSubmit={handleSubmit}
        >
          <input
            className="outline-none w-10/12 pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12"
            placeholder="Enter your message..."
            onChange={handleChange}
            value={defMessage}
            type="text"
            name="message"
          />
          <button
            className="bg-slate-100 text-slate-500 ml-2 rounded-md h-12 w-14"
            type="submit"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
export default Chat;
