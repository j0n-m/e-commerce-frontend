function Nav() {
  return (
    <nav className="border-b-2">
      <ul className="flex gap-4 p-4">
        <li>Logo</li>
        <li>
          {/* outer search bar */}
          <form className="searchbar-form flex border shadow-sm rounded-md items-center justify-center h-[42px]">
            <input
              className="py-1 px-3 rounded-l-md w-[30svw] h-full"
              type="text"
              placeholder="Search"
            />
            <div className=" rounded-r-md h-full">
              <button className="flex justify-center items-center h-full px-2 border-l">
                <div className="bg-nav-searchIcon bg-no-repeat bg-contain w-[24px] h-[24px]"></div>
              </button>
            </div>
          </form>
        </li>
        <li>Switch Day/Night</li>
        <li>Sign in</li>
        <li>Cart</li>
      </ul>
    </nav>
  );
}

export default Nav;
