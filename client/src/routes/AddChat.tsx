import "../assets/css/style.css";
import { useState, useEffect, FormEvent, ChangeEvent, useContext } from "react";
import { SocketContext } from "../SocketContext";
import { useNavigate } from "react-router-dom";
import { RootState, setId } from "../store/slice.ts";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios.ts";
interface message {
  email: string;
  message: string;
}

function AddChat() {
  const [message, setMessage] = useState<message>({
    email: "",
    message: "",
  });
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.id);
  console.log(token);
  const socket = useContext(SocketContext)!;
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    let name = ev.target.name;
    let value = ev.target.value;
    setMessage((e) => ({ ...e, [name]: value }));
  };
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      let response = await axios().get(`/api/user?email=${message.email}`);
      socket.emit("newMessage", {
        message: message.message,
        from: response.data.from,
        to: response.data.to,
        createdAt: new Date(),
      });
    } catch (err: any) {
      if (err.response.status == 500) return navigate("/register/login");
      else if (err.response.status == 302) setError("User doesn't exist");
      else {
      }
    }
  };
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-slate-500">Add new Friends</p>
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <form
          onSubmit={handleSubmit}
          className="ml-2 mr-2 rounded-md bg-white p-2 mt-6"
        >
          <label className="text-slate-500 text-sm">Enter email address</label>
          <input
            className="mt-2 outline-none pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12 w-full"
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email Address"
          />

          <label className="text-slate-500 text-sm">Enter your message</label>
          <input
            className="mt-2 outline-none pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12 w-full"
            name="message"
            onChange={handleChange}
            type="text"
            placeholder="Message"
          />
          <button
            type="submit"
            className="mt-4 bg-slate-100 text-slate-500 w-full h-12"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
export default AddChat;
