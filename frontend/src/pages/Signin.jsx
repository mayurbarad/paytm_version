import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading heading={"Sign in"} />
          <SubHeading
            subheading={"Enter your credentials to access your account"}
          />
          <InputBox
            placeholder="email"
            label={"Email"}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputBox
            placeholder="password"
            label={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-4">
            <Button
              label={"Sign in"}
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signin",
                  {
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
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
