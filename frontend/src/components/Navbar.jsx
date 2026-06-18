import "../styles/navbar.css";

function Navbar() {
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  return (
    <div className="navbar">

      <div>
        <h2>
          Student Dashboard
        </h2>
      </div>

      <div className="profile-box">
        👤 {user?.name}
      </div>

    </div>
  );
}

export default Navbar;