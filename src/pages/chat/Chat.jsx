import React, { useRef, useState, useEffect } from "react";
import "./Chat.css";
import { BiSearch } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useParams } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;

export const Chat = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const [boolSeach, setBoolSearch] = useState(false);
  const [rightClickedIndex, setRightClickedIndex] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const messagesEndRef = useRef(null);
  const scrolltoBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredUsers = chat?.messages?.filter((message) =>
    message?.text?.toLowerCase()?.includes(search.toLowerCase())
  );

  const handleSearch = () => {
    setBoolSearch(!boolSeach);
  };

  useEffect(() => {
    scrolltoBottom();
  }, [filteredUsers]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const config = {
          method: "get",
          url: `${url}/get/chat/${id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          user: JSON.parse(localStorage.getItem("user"))._id,
        };
        const response = await axios(config);
        setChat(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChat();
  }, [id, update]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const option = {
      text: e.target.text.value,
      to: id,
    };

    const config = {
      method: "post",
      url: `${url}/send/message`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: JSON.stringify(option),
    };

    axios(config)
      .then((res) => {
        setUpdate(!update);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    e.target.text.value = "";
  };

  const handleClick = (e, i) => {
    e.preventDefault();
    setRightClickedIndex(i);
    const posX = e.clientX;
    const posY = e.clientY;

    setContextMenuPosition({ x: posX, y: posY });
  };

  const handleDeleteChat = async () => {
    const config = {
      method: "delete",
      url: `${url}/delete/message`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios(config);
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <div className="chat_header__info">
          <h1>{chat?.user?.fullname || "Loading..."}</h1>
          <span>
            last seen at{" "}
            {chat
              ? new Date(chat?.user?.lastActive).toLocaleTimeString()
              : "00:00:00"}
          </span>
        </div>
        <div className="chat_header__action">
          <input
            style={!boolSeach ? { scale: 0 } : {}}
            type="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>
            <BiSearch />
          </button>

          <button>
            <BsThreeDots />
          </button>
        </div>
      </div>
      <div className="chat_body">
        {filteredUsers?.map((message, index) => {
          const date = new Date(message.createdAt).toLocaleString();
          const updatedAt = new Date(message.updatedAt).toLocaleString();

          return (
            <div
              onContextMenu={(event) => handleClick(event, index)}
              style={!chat ? { display: "none" } : {}}
              ref={messagesEndRef}
              key={index}
              className={
                message.to !== id ? "chat_msg_box left" : "chat_msg_box right"
              }
            >
              <p>
                <span>{message.text}</span>
                <i>{message?.updatedAt ? `Edited: ${updatedAt}` : date}</i>
              </p>
              {rightClickedIndex === index && (
                <div
                  className="right-click"
                  style={{
                    position: "fixed",
                    top: `${contextMenuPosition.y}px`,
                    left: `${contextMenuPosition.x}px`,
                  }}
                >
                  <button type="button">Edit</button>
                  <button type="button" onClick={handleDeleteChat}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <form className="chat_send" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Message"
          name="text"
          required
          autoFocus
          autoComplete="off"
        />
        <button type="submit">
          <IoSend />
        </button>
      </form>
    </div>
  );
};
