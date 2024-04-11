import React, {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import "./ShowAndHidePassword.css"

function ShowAndHidePassword(){
    const [bool,setBool] = useState(false);

    return(
    <div className="showandhide">
            <input type={bool ? "text" : "password"} name="password" placeholder="Password..." />
            <button type="button" onClick={() => setBool(!bool)}>
            { bool ? <AiOutlineEye/> : <AiOutlineEyeInvisible/> }
            </button>
      </div>
    )
}
export default ShowAndHidePassword;