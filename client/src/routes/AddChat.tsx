import "../assets/css/style.css";
function AddChat() {
  return (
    <div className="bg-slate-100 h-[100vh]">
      <nav className="h-16 mt-2 p-0 rounded-md w-11/12 fixed left-[50%] translate-x-[-50%] flex justify-center items-center shadoew-md bg-white">
        <p className="uppercase text-slate-500">Add new Friends</p>
      </nav>
      <section className="ml-2 mr-2 pt-[5rem]">
        <form className="ml-2 mr-2 rounded-md bg-white p-2 mt-6">
          <label className="text-slate-500 text-sm">Enter email address</label>
          <input
            className="mt-2 mb-2  outline-none pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12 w-full"
            type="email"
            placeholder="Email Address"
          />
          <label className="text-slate-500 text-sm">Enter your message</label>
          <input
            className="mt-2 outline-none pl-2 bg-slate-100 text-sm text-slate-500 rounded-md h-12 w-full"
            type="text"
            placeholder="Message"
          />
          <button className="mt-4 bg-slate-100 text-slate-500 w-full h-12">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
export default AddChat;
