import axios from "../utils/axios.ts";
import { useState, useEffect, useContext, FormEvent } from "react";
import mail from "../assets/images/mail.svg";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../SocketContext";
function dataURLtoBlob(dataURL) {
  // Split the data URL into the data type and base64 data
  let [dataType, base64Data] = dataURL.split(",");

  // Convert the base64 data to binary
  let binaryData = atob(base64Data);
  dataType = dataType.split(":")[1].split(";")[0];

  // Create an array buffer to store the binary data
  let buffer = new ArrayBuffer(binaryData.length);

  // Create a view into the buffer
  let view = new Uint8Array(buffer);

  // Convert the binary data to a Uint8Array
  for (let i = 0; i < binaryData.length; i++) {
    view[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the ArrayBuffer
  let blob = new Blob([view], { type: dataType });

  return blob;
}

export default function UploadImage() {
  const [blob, setBlob] = useState<null | Blob>(null);
  const [message, setMessage] = useState<string>("");
  const { to, from } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext)!;
  useEffect(function () {
    if (localStorage.getItem("image"))
      setBlob(dataURLtoBlob(localStorage.getItem("image")));
    else navigate(`/chats/${to}`);
  }, []);
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    let formdata = new FormData();
    formdata.append("image", blob);
    axios()
      .post("/update/message", formdata, {
        headers: {
          enctype: "multipart/form-data",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        socket.emit("newMessage", {
          from,
          to,
          createdAt: new Date(),
          message,
          url: data.url,
        });
        localStorage.removeItem("image");
        navigate(`/chats/${to}`);
      })
      .catch(console.log);
  };
  return (
    <section className="m-2">
      <img
        src={localStorage.getItem("image")}
        className="w-full rounded-sm object-cover h-[28rem]"
      />
      <form
        className="bg-white -ml-2 mb-2b p-2 flex rounded-md w-full mr-2 fixed bottom-0"
        onSubmit={handleSubmit}
      >
        <input
          className="py-3 px-4 outline-none flex items-center justify-center w-10/12 break-all pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-10 pt-auto"
          placeholder="Say something about this picture...."
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
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
  );
}
