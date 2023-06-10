import { useEffect, useRef } from "react";
import { IProps, IForm, IMeta } from "../interfaces/login.ts";

function MyTextInput({ label, ...props }: IProps) {
  const meta = useRef<IMeta>({
    touched: true,
    error: props.error,
  });
  function Touched(): void {
    meta.current.touched = true;
  }
  useEffect(
    function () {
      meta.current.error = props.error;
    },
    [props]
  );
  return (
    <>
      <label className="mt-4 text-sm" htmlFor={props.name}>
        {label}
      </label>
      <input
        {...props}
        style={{ borderWidth: "1.5px" }}
        onTouchStart={Touched}
        onMouseOver={Touched}
        className={`w-full mt-1 border-great-blue-1 p-3 text-slate-500 border-2 border-solid drop-shadow-lg focus:outline-none rounded-2xl h-10 mb-5 ${
          props.dClass && !props.error ? "mb-4" : "mb-0"
        } text-sm `}
      />
      {meta.current.touched && meta.current.error ? (
        <p
          className={`text-m ml-1 font-base text-red-600 w-full           ${
            props.dClass && props.error ? "mb-4" : "mb-0"
          }`}
        >
          {meta.current.error}
        </p>
      ) : null}
    </>
  );
}
export default MyTextInput;
