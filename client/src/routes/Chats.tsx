import "../assets/css/style.css";
function Chat() {
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-slate-500">John Doe</p>
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <div className="ml-2">
          <div className="rounded-md mb-2 bg-white p-2 w-max max-w-[90%]">
            <p className="font-bold text-sm text-slate-600">John Doe</p>
            <p className="text-sm font-base w-full break-words text-slate-500">
              Good morning ienxbdknxkdkdkdkcn ndndk kdknndjcnfndndndjd
            </p>
            <p className="text-xs text-slate-400">19:22</p>
          </div>
          <div className="rounded-md ml-auto mb-2 bg-white p-2 w-max max-w-[90©]">
            <p className="font-bold text-sm text-slate-600">You</p>
            <p className="text-sm font-base w-full break-words text-slate-500">
              Morning, How are you?{" "}
            </p>
            <p className="text-xs text-slate-400">19:22</p>
          </div>
        </div>
        <form className="bg-white ml-2 p-2 flex rounded-md w-11/12 mr-2 fixed bottom-0">
          <input
            className="outline-none w-10/12 pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12"
            placeholder="Enter your message..."
            type="text"
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
