import { ChangeEvent, useEffect, useState, useRef } from "react";
import axios from "../utils/axios.ts";
import { useNavigate } from "react-router-dom";
import _dummy from "../assets/images/image.jpg";
export default function Upload() {
  const [file, setFile] = useState<null | Blob>(null);
  const [imgData, setImgData] = useState<string>("");
  const [dummy, setDummy] = useState<string>("/images/dummy.jpg");
  const id = useRef<null | HTMLImageElement>(null);
  const navigate = useNavigate();
  const reader = new FileReader();
  useEffect(
    function () {
      if (file) {
        reader.onloadend = function (ev: any) {
          setImgData(ev.target!.result);
          console.log(ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [file]
  );
  useEffect(function () {
    axios()
      .post("/update/data")
      .then((e) => setDummy(e.data.cover))
      .catch(console.error);
  }, []);
  const handleSubmit = () => {
    if (!file) return;
    let formdata = new FormData();
    formdata.append("image", file);
    axios()
      .post("/update/image", formdata, {
        headers: {
          enctype: "multipart/form-data",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => navigate("/home"));
  };
  return (
    <div>
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-slate-500">Change Profile Picture</p>
      </nav>
      <section className="ml-4 mr-4 pt-[5rem]">
        <img
          src={
            imgData
              ? imgData
              : dummy.startsWith("http://res.")
              ? dummy
              : `${import.meta.env.VITE_IMG_URL}${dummy}`
          }
          className="h-72 object-cover w-full border border-slate-500 border-dashed"
        />
        <label
          htmlFor="image"
          className="h-10 mt-2 text-sm hover:bg-slate-200 hover:border hover:border-slate-500 flex justify-center items-center hover:border-solid hover:text-slate-500 rounded-md w-full text-center text-white bg-slate-500"
        >
          Change
        </label>
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFile(e.target.files![0])
          }
          id="image"
          name="image"
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleSubmit}
          className="h-10 mt-2 hover:border-0 hover:text-white hover:bg-slate-500 text-sm rounded-md w-full bg-slate-200 border border-slate-500 border-solid text-slate-500 "
        >
          Save
        </button>
      </section>
    </div>
  );
}
