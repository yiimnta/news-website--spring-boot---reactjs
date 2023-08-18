import { ChangeEvent, useEffect, useState } from "react";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { ROLES, Role, User } from "../../../Constants";
import "../news/NewsManager_2.scss";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";

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
      <div className="table-action">
        <div className="table-search">
          <div className="table-search-item">
            <span className="talbe-search-item-title">Search</span>
            <input
              className="table-search-item-input"
              type="text"
              {...(register("value"),
              {
                onChange: (e) =>
                  handleSearchValue(
                    ["firstname", "lastname", "email", "age"],
                    e
                  ),
              })}
              placeholder={`${users ? users.length : 0} records...`}
            />
          </div>
          <div className="table-search-item">
            <div className="select-box">
              <select
                className="table-search-item-input"
                {...(register("role"),
                { onChange: (e) => handleSelectRole(e) })}
              >
                <option value="">All</option>
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
        </div>
        <button className="add-new-btn">
          <AddIcon />
        </button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr className="title-row">
              <th className="text-left left-border">Name</th>
              <th>Age</th>
              <th>Status</th>
              <th style={{ width: "220px" }}>Role</th>
              <th className="right-border"></th>
            </tr>
          </thead>
          <tbody>
            {showingUsers && showingUsers.length > 0 ? (
              showingUsers.map((user: User) => {
                return (
                  <tr key={user.id}>
                    <td className="text-left left-border">
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
                    <td></td>
                    <td className="right-border"></td>
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
      </div>
    </div>
  );
}
