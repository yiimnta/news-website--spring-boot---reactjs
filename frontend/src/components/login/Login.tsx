import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Login.scss";
import AuthService from "../../services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import { User } from "../../contexts/AuthProvider";
import useAuth from "../../hooks/useAuth";
import { HTTPSTATUS_CODES } from "../../hooks/usePrivateAxios";

type FormValues = {
  email: string;
  password: string;
  rememberme: boolean;
};

type LoginError = {
  message: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [loginErrors, setLoginErrors] = useState<LoginError[]>([]);
  const location = useLocation();
  const fromLocation = location.state?.from?.pathname || "/";
  const { setAuth } = useAuth();

  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberme: false,
    },
  });

  const { errors } = formState;

  const onSubmit = async (formData: FormValues) => {
    setLoginErrors(() => []);
    try {
      const res = await AuthService.login(formData.email, formData.password);
      const data: User = res.data;
      setAuth(data);
      reset();
      navigate(fromLocation, { replace: true });
    } catch (ex) {
      const errs = ex as Error | AxiosError;

      if (axios.isAxiosError(errs)) {
        if (errs.response?.data) {
          const err: LoginError[] = [];
          const data = errs.response?.data;

          if (data.status === HTTPSTATUS_CODES.FORBIDDEN) {
            err.push({
              message:
                data.message.charAt(0).toUpperCase() + data.message.slice(1),
            });
          } else {
            for (const k in data) {
              const message: string = `${k !== "message" ? k : ""} ${data[k]}`;
              err.push({
                message: message.charAt(0).toUpperCase() + message.slice(1),
              });
            }
          }

          setLoginErrors(err);
        }
      } else {
        console.log(errs);
      }
    }
  };

  useEffect(() => {
    const handleEnterSubmit = (e: {
      code: string;
      preventDefault: () => void;
    }) => {
      if (e.code === "Enter") {
        e.preventDefault();
        handleSubmit(onSubmit);
      }
    };
    window.addEventListener("keydown", handleEnterSubmit);

    return () => {
      window.removeEventListener("keydown", handleEnterSubmit);
    };
  }, []);

  return (
    <>
      <div id="login-form">
        <Form className="login-form">
          <div className="text-center">
            <p className="title">Sign In</p>
          </div>
          <div className="logininfo">
            <Form.Group controlId="email" className="input-box">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                className={`form-input login-input ${
                  errors.password ? "invalid" : ""
                }`}
                type="email"
                placeholder="Enter email"
                autoFocus
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Email is not valid",
                  },
                })}
              />
              <Form.Control.Feedback className="d-block" type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password" className="input-box">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                className={`form-input login-input ${
                  errors.password ? "invalid" : ""
                }`}
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <Form.Control.Feedback className="d-block" type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Check>
              <Form.Check
                label="remember me?"
                id="rememberme"
                type="checkbox"
                {...register("rememberme", {})}
              />
            </Form.Check>
          </div>
          <Button onClick={handleSubmit(onSubmit)}>Login</Button>
          {loginErrors.length > 0 && (
            <div className="error-list">
              {loginErrors.map((e, i) => (
                <p key={i}>{e.message}</p>
              ))}
            </div>
          )}
        </Form>
      </div>
    </>
  );
}
