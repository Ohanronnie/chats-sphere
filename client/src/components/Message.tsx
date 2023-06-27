import _reply from "../assets/images/reply.svg";
const TransformDate = (date: string) => {
  let _date = new Date(date);
  let hour = _date.getHours().toString().padStart(2, "0");
  let min = _date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${min}`;
};
const ReplyFrom = (
  name: string,
  text: string,
  date: string,
  handleReply: any,
  ref: any,
  image?: string,
  replyText?: string,
  replyName?: string
) => {
  return (
    <div
      ref={ref}
      className="relative rounded-md mb-2 bg-white p-2 w-max max-w-[90%]"
    >
      <div className="flex w-full justify-between">
        <p className="font-bold text-sm text-slate-600">You</p>
        <img
          onClick={() => handleReply(text, "from")}
          src={_reply}
          className="ml-2 h-4 w-4"
        />
      </div>
      <div className="bg-slate-100 rounded-md ml-2 p-2">
        <p className="font-bold text-xs text-slate-600">{replyName}</p>
        <p className="text-xs font-base w-full break-words text-slate-500">
          {replyText}
        </p>
      </div>
      <div>
        {image && (
          <img
            src={image}
            className="object-cover rounded-sm w-full max-h-[20rem]"
          />
        )}
        <p className="text-sm font-base w-full break-words text-slate-500">
          {text}
        </p>
      </div>
      <p className="text-xs text-slate-400">{TransformDate(date)}</p>
    </div>
  );
};
const ReplyTo = (
  name: string,
  text: string,
  date: string,
  handleReply: any,
  ref: any,
  image?: string,
  replyText?: string,
  replyName?: string
) => {
  return (
    <div
      ref={ref}
      className="relative ml-auto rounded-md mb-2 bg-white p-2 w-max max-w-[90%]"
    >
      <div className="flex w-full justify-between">
        <p className="font-bold text-sm text-slate-600">You</p>
        <img
          onClick={() => handleReply(text, "to")}
          src={_reply}
          className="ml-2 h-4 w-4"
        />
      </div>
      <div className="bg-slate-100 rounded-md ml-2 p-2">
        <p className="font-bold text-xs text-slate-600">{replyName}</p>
        <p className="text-xs font-base w-full break-words text-slate-500">
          {replyText}
        </p>
      </div>
      <div>
        {image && (
          <img
            src={image}
            className="object-cover rounded-sm w-full max-h-[20rem]"
          />
        )}
        <p className="text-sm font-base w-full break-words text-slate-500">
          {text}
        </p>
      </div>
      <p className="text-xs text-slate-400">{TransformDate(date)}</p>
    </div>
  );
};
const FromMessage = (
  name: string,
  text: string,
  date: string,
  ref: any,
  handleReply: any,
  image?: string
) => {
  return (
    <>
      <div ref={ref} className="rounded-md mb-2 bg-white p-2 w-max max-w-[90%]">
        <div className="flex w-full justify-between">
          <p className="font-bold text-sm text-slate-600">{name}</p>
          <img
            src={_reply}
            onClick={() => handleReply(text, "from")}
            className="ml-2 h-4 w-4"
          />
        </div>
        {image && (
          <img
            src={image}
            className="object-cover rounded-sm w-full max-h-[20rem]"
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
const ToMessage = (
  text: string,
  date: string,
  ref: any,
  handleReply: any,
  image?: string
) => {
  return (
    <>
      <div
        ref={ref}
        className="rounded-md ml-auto mb-2 bg-white p-2 w-max max-w-[90%]"
      >
        <div className="flex w-full justify-between">
          <p className="font-bold text-sm text-slate-600">You</p>
          <img
            onClick={() => handleReply(text, "to")}
            src={_reply}
            className="ml-2 h-4 w-4"
          />
        </div>
        {image && (
          <img
            src={image}
            className="object-cover rounded-sm w-full max-h-[20rem]"
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
export { FromMessage, ToMessage, ReplyTo, ReplyFrom };
