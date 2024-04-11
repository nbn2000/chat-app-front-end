import React, { memo, useState, useEffect } from "react";
import "./Menu.css";
import { useParams, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

export const Menu = memo(() => {
  const [users, setUsers] = useState(null);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${url}/get/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchData();
  }, [update]);

  const filteredUsers = users?.filter(
    (user) =>
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  const getUser = (id) => {
    navigate(`/chat/${id}`);
  };

  const logout = () => {
    const confirm = window.confirm("Are you sure, you want to logout");

    if (!confirm) return;

    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  setInterval(() => {
    setUpdate(!update);
  }, 30000);

  return (
    <div className="menu">
      <form>
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <ol className="users_list">
        {filteredUsers?.map((user) => {
          const lastActive = new Date(user.lastActive).toLocaleString("gr-GR", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
            day: "numeric",
            month: "numeric",
          });

          if (user?._id === JSON.parse(localStorage.getItem("user"))._id) {
            return (
              <li
                style={user._id === id ? { background: "#cccccc3a" } : {}}
                key={user._id}
                onClick={() => getUser(user._id)}
              >
                <h1>Saved Messages</h1>
              </li>
            );
          }
          return (
            <li
              key={user._id}
              onClick={() => getUser(user._id)}
              style={user._id === id ? { background: "#cccccc3a" } : {}}
            >
              <h1>
                <span>{user.fullname}</span>
              </h1>

              <p>
                <span>@{user.username}</span>
                <i>{lastActive}</i>
              </p>
            </li>
          );
        })}
      </ol>

      <div className="menu_action">
        <button onClick={() => navigate("/profile")}>
          <CgProfile />
        </button>

        <button onClick={logout}>
          <TbLogout />
        </button>
      </div>
    </div>
  );
});
