import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loading } from "./Loading";
import { PublicAxios } from "../services/AxiosService";

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (
      token != undefined &&
      token != "" &&
      email != undefined &&
      email != ""
    ) {
      PublicAxios.post("/auth/verify", { token, email })
        .then((res) => {
          if (res.data) {
            setMessage(res.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="page-container">
      <div className="email-verification">
        {loading ? <Loading /> : <div>{message}</div>}
      </div>
    </div>
  );
};
