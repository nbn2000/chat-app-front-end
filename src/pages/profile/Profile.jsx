import React from "react"
import {PatternFormat} from "react-number-format"
import ShowAndHidePassword from "../../components/showandhide/ShowAndHidePassword";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import "./Profile.css"
import {enqueueSnackbar} from "notistack"

const url  = process.env.REACT_APP_BASE_URL

export const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const value = Object.fromEntries(formData.entries())
      const config = {
          method: "PATCH",
          url: `${url}/patch/profile`,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("token")}`},
          data: JSON.stringify(value),
        }

        axios(config).then(res => {
          const {message, variant} = res?.data
          enqueueSnackbar(message, {variant})
          navigate("/")
        }).catch(err => {
          const {message, variant} = err?.response.data
          enqueueSnackbar(message, {variant})
        })
  }

  const deleteAccount = () => {
    const confirm = window.confirm("Are you sure, you want to delete your account?")
    if(!confirm) return

    const option = {
      method: "DELETE",
      url: `${url}/delete/user`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    axios(option).then(res => {
      const {message, variant} = res?.data
      enqueueSnackbar(message, {variant})
      localStorage.clear()
    window.location.reload()
    }).catch(err => {
      const {message, variant} = err?.response.data
      enqueueSnackbar(message, {variant})
    })

  }
    return (
    <div className="profile">
            <form  onSubmit={handleSubmit}>
        <h1>
          <span>Edit Profile</span>
        </h1>

        <label>
          <span>Fullname</span>
          <input type="text" name="fullname" defaultValue={user?.fullname} autoComplete="off"/>
        </label>

        <label>
          <span>Username</span>
          <input type="text" name="username" defaultValue={user?.username} autoComplete="off"/>
        </label>

        <label>
          <span>Telephone Number</span>
          <PatternFormat name="phone" format="+998 ## ### ####" allowEmptyFormatting mask="_" defaultValue={user?.phone} autoComplete="off"/>
        </label>

        <label>
          <span>Password</span>
          <ShowAndHidePassword/>
        </label>

        <label>
          <input type="submit" value="Edit" />
        </label>
      </form>
      <button className="btn_deleteAccount" onClick={deleteAccount}>delete account</button>
    </div>
    );
  };