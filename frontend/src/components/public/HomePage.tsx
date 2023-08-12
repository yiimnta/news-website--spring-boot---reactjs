import { useEffect, useState } from "react";
import { usePrivateAxios } from "../../hooks/usePrivateAxios";

type TUser = {
  name: string;
};

export default function HomePage() {
  const privateAxios = usePrivateAxios();
  const [users, setUsers] = useState<TUser[]>();

  useEffect(() => {
    const arbortController = new AbortController();

    const getUsers = async () => {
      const response = await privateAxios.get("/users", {
        signal: arbortController.signal,
      });

      if (response?.data) {
        const u: TUser[] = [];
        response.data.forEach((e: { firstname: string; lastname: string }) => {
          u.push({ name: `${e.firstname} ${e.lastname}` });
        });

        setUsers(u);
      }

      return () => {
        arbortController.abort();
      };
    };

    getUsers();

    return () => {
      arbortController.abort();
    };
  }, []);

  return (
    <div>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.name}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
}
