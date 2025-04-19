import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading heading={"Sign up"} />
          <SubHeading
            subheading={"Enter your information to create an account"}
          />
          <InputBox
            placeholder="First Name"
            label={"First Name"}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <InputBox
            placeholder="Last Name"
            label={"Last Name"}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <InputBox
            placeholder="email"
            label={"Email"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <InputBox
            placeholder="password"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button
              label={"Sign up"}
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signup",
                  {
                    firstName,
                    lastName,
                    username,
                    password,
                  }
                );
                const token = response.data.token;
                localStorage.setItem("token", token);
                navigate("/dashboard");
              }}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
