export default function Login() {
  return (
    <>
      <h1>Welcome, please log in</h1>
      <form className="
        flex flex-col gap-3
        rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.8)] 
        shadow-neutral-900 bg-neutral-700
      ">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" className="border-1" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" className="border-1" />
        <button className="rounded-3xl bg-neutral-500 px-3 py-2 hover:cursor-pointer" type="submit">Login</button>
      </form>
    </>
  )
}
