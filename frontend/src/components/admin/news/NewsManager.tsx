import { ChangeEvent, useEffect, useState } from "react";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { ROLES, Role, User } from "../../../Constants";
import "./NewsManager.scss";
import { useForm } from "react-hook-form";

type UserSearchForm = {
  value: string;
  role: string;
};

export default function NewsManager() {
  const privateAxios = usePrivateAxios();
  const [users, setUsers] = useState<User[]>();
  const [showingUsers, setShowingUsers] = useState<User[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { register } = useForm<UserSearchForm>();
  const [roles, setRoles] = useState<Role[]>();

  useEffect(() => {
    const userArbortController = new AbortController();
    const roleArbortController = new AbortController();

    const getUsers = async () => {
      try {
        const response = await privateAxios.get("/users", {
          signal: userArbortController.signal,
        });

        if (response?.data) {
          setUsers(response.data);
          setShowingUsers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getRoles = async () => {
      try {
        const response = await privateAxios.get("/roles", {
          signal: roleArbortController.signal,
        });

        if (response?.data) {
          setRoles(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
    getRoles();
    setIsLoading(false);

    return () => {
      userArbortController.abort();
      roleArbortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchValue = (
    fields: string[],
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const newUsers =
      users &&
      [...users].filter((user: User) => {
        return fields.some((field: string) => {
          return `${user[field as keyof typeof user]}`.includes(value);
        });
      });

    setShowingUsers(newUsers);
  };

  const handleSelectRole = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  return isLoading ? (
    <span>Loading...</span>
  ) : (
    <div id="user-management">
      <h2 className="table-title">User Management</h2>
      <div>
        <div>
          <span>Search</span>
          <input
            type="text"
            {...(register("value"),
            {
              onChange: (e) =>
                handleSearchValue(["firstname", "lastname", "email", "age"], e),
            })}
            placeholder={`${users ? users.length : 0} records...`}
          />
        </div>
        <div>
          <select
            {...(register("role"), { onChange: (e) => handleSelectRole(e) })}
          >
            {roles &&
              roles.map((role) => {
                return (
                  <option key={role.id} value={role.name}>
                    {ROLES[role.name]}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <table className="data-table" cellPadding={0}>
        <thead>
          <tr className="title-row">
            <th className="top-left-radius text-left">Name</th>
            <th>Age</th>
            <th>Status</th>
            <th>Role</th>
            <th className="top-right-radius"></th>
          </tr>
        </thead>
        <tbody>
          {showingUsers && showingUsers.length > 0 ? (
            showingUsers.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td className="text-left">
                    <div className="user-info-name">
                      <div className="profile-photo">
                        <img src={user.avatar} alt="avatar" />
                      </div>
                      <div>
                        <p>
                          <b>{user.firstname + " " + user.lastname}</b>
                        </p>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.age}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.roles.map((e, index) => {
                      if (ROLES[e.name]) {
                        return (
                          <span className="role" key={index}>
                            <span
                              className="circle"
                              style={{ background: `${e.color}` }}
                            ></span>{" "}
                            {ROLES[e.name]}
                          </span>
                        );
                      }
                      return "";
                    })}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>No records...</td>
            </tr>
          )}
        </tbody>
      </table>
      <a href="#">Show All</a>
    </div>
  );
}
