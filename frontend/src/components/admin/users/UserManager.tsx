import { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./UserManager.scss";
import {
  DEFAULT_USER_AVATAR,
  ROLES,
  USER_GENDER,
  USER_STATUS,
} from "../../../Constants";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { Toolbar } from "primereact/toolbar";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { UserConfirmDialog } from "./UserConfirmDialog";
import { useFirebase } from "../../../hooks/useFirebase";
import { useToastify } from "../../../hooks/useToastify";
import { MultiSelect } from "primereact/multiselect";
import { StringUtils } from "../../../Utils";
import { DeleteIds, Role, User } from "../../../Define";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "../../../hooks/useAuth";
import useDashboardContext from "../../../hooks/useDashboardContext";

export type UserData = {
  id?: number | undefined;
  roles: number[];
  avatarFile?: HTMLInputElement | undefined;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  avatar: string;
  status: number;
  gender: string;
  password: string;
};

type userDetailFormRef = {
  resetForm: () => void;
};

export default function UserManager() {
  const emptyUser: User = {
    id: undefined,
    firstname: "",
    lastname: "",
    email: "",
    avatar: DEFAULT_USER_AVATAR,
    name: "",
    roles: [],
    status: USER_STATUS.INACTIVE,
    gender: USER_GENDER.FEMALE,
    age: 0,
  };

  FilterService.register("roleFilter", (roles: Role[], selectedRole) => {
    return roles.some((role) => role.name == selectedRole.name);
  });

  const matchModes = [{ label: "Role Filter", value: "roleFilter" }];

  const { auth } = useAuth();
  const toastify = useToastify();
  const [, setSubmitted] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [user, setUser] = useState<User>(emptyUser);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const privateAxios = usePrivateAxios();
  const { loading, setLoading, admin_id } = useDashboardContext();
  const userDetailFormRef = useRef<userDetailFormRef>();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    age: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    gender: {
      value: null,
      matchMode: FilterMatchMode.IN,
    },
    roles: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      value: null,
      matchMode: FilterMatchMode.IN,
    },
  });

  const genderList = () => {
    const list: { value: string; name: string }[] = [];

    for (const k in USER_GENDER) {
      list.push({
        value: USER_GENDER[k as keyof typeof USER_GENDER],
        name: StringUtils.capitalizeFirstLetter(k),
      });
    }

    return list;
  };

  const statuses = () => {
    const list: { value: number; name: string }[] = [];

    for (const k in USER_STATUS) {
      list.push({
        value: USER_STATUS[k as keyof typeof USER_STATUS],
        name: StringUtils.capitalizeFirstLetter(k),
      });
    }

    return list;
  };

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
        }
      } catch (error) {
        //console.log(error);
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
        //console.log(error);
      }
    };

    setLoading(true);
    getUsers();
    getRoles();
    setLoading(false);

    return () => {
      userArbortController.abort();
      roleArbortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { uploadIMG, deleteIMG } = useFirebase();

  const axiosUserServices = {
    create: (data: UserData, oldAvatar: string, imgURL: string) => {
      setLoading(true);
      data.avatar = imgURL;
      delete data.avatarFile;

      privateAxios
        .post("/users", data)
        .then((response) => {
          oldAvatar &&
            oldAvatar !== DEFAULT_USER_AVATAR &&
            deleteIMG(oldAvatar as string)?.catch((error) => {
              console.error("Cannot remove old avatar from storage: ", error);
              toastify.error("Cannot remove old avatar from storage");
            });

          if (response.data) {
            const newUsers = [...users, response.data];
            setUsers(newUsers);
            hideDialog();
            userDetailFormRef.current?.resetForm();
            toastify.success("Saving successfully!");
          } else {
            toastify.error("Cannot update datatable");
          }
        })
        .catch((error) => {
          console.error(
            "Ops, something went wrong while adding new user",
            error
          );
          toastify.error("Ops, something went wrong while adding new user");
          deleteIMG(imgURL as string)?.catch((error) => {
            console.error("Cannot remove new avatar from storage: ", error);
            toastify.error("Cannot remove new avatar from storage");
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },

    createWithoutAvatar: (data: UserData) => {
      setLoading(true);
      delete data.avatarFile;
      privateAxios
        .post("/users", data)
        .then((response) => {
          if (response.data) {
            const newUsers = [...users, response.data];
            setUsers(newUsers);
            hideDialog();
            userDetailFormRef.current?.resetForm();
            toastify.success("Saving successfully!");
          } else {
            toastify.error("Cannot update datatable");
          }
        })
        .catch((error) => {
          console.error(
            "Ops, something went wrong while adding new user",
            error
          );
          toastify.error("Ops, something went wrong while adding new user");
        })
        .finally(() => {
          setLoading(false);
        });
    },

    update: (data: UserData, oldAvatar: string, imgURL: string) => {
      setLoading(true);
      data.avatar = imgURL;
      delete data.avatarFile;
      privateAxios
        .put(`/users/${user.id}`, data)
        .then((response) => {
          oldAvatar &&
            oldAvatar !== DEFAULT_USER_AVATAR &&
            deleteIMG(oldAvatar as string)?.catch((error) => {
              console.error("Cannot remove old avatar from storage: ", error);
              toastify.error("Cannot remove old avatar from storage");
            });

          if (response.data) {
            const newUsers = [...users].map((u) => {
              if (user.id === u.id) {
                return response.data;
              }

              return u;
            });

            setUsers(newUsers);
            hideDialog();
            userDetailFormRef.current?.resetForm();
            toastify.success("Updating successfully!");
          } else {
            toastify.error("Cannot update datatable");
          }
        })
        .catch((error) => {
          console.error(
            `Ops, something went wrong while updating user ${user.id}`,
            error
          );
          toastify.error(
            `Ops, something went wrong while updating user ${user.id}`
          );
          deleteIMG(imgURL as string)?.catch((error) => {
            console.error("Cannot remove new avatar from storage: ", error);
            toastify.error("Cannot remove new avatar from storage");
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },

    updateWithoutAvatar: (data: UserData) => {
      setLoading(true);
      delete data.avatarFile;
      privateAxios
        .put(`/users/${user.id}`, data)
        .then((response) => {
          if (response.data) {
            const newUsers = [...users].map((u) => {
              if (user.id === u.id) {
                return response.data;
              }

              return u;
            });

            setUsers(newUsers);
            hideDialog();
            userDetailFormRef.current?.resetForm();
            toastify.success("Updating successfully!");
          } else {
            toastify.error("Cannot update datatable");
          }
        })
        .catch((error) => {
          console.error(
            "Ops, something went wrong while adding new user",
            error
          );
          toastify.error("Ops, something went wrong while adding new user");
        })
        .finally(() => {
          setLoading(false);
        });
    },

    delete: () => {
      if (user.id && user.id !== auth.id) {
        setLoading(true);
        const data: DeleteIds = { ids: [user.id] };
        privateAxios
          .delete("/users", { data })
          .then(() => {
            toastify.success(`User ${user.id} has been deleted`);
            const newUsers = [...users].filter((u) => u.id != user.id);
            setUsers(newUsers);
            setUser(emptyUser);
          })
          .catch((error) => {
            console.log(error);
            toastify.error(`Can not delete User ${user.id}`);
          })
          .finally(() => {
            setLoading(false);
          });
      }

      hideDeleteUserDialog();
    },

    deleteSelectedUsers: () => {
      if (selectedUsers.length > 0) {
        const data = {
          ids: selectedUsers.map((u) => {
            if (u.id && u.id !== auth.id) {
              return u.id;
            }
          }),
        };
        if (data.ids.every((e) => e)) {
          setLoading(true);
          privateAxios
            .delete("/users", { data })
            .then(() => {
              toastify.success(`Users have been deleted`);
              const newUsers = [...users].filter(
                (u) => !data.ids.includes(u.id)
              );
              setUsers(newUsers);
            })
            .catch((error) => {
              console.log(error);
              toastify.error(`Can not delete Users`);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          toastify.error(`Can not delete selected users`);
        }
      }

      hideDeleteUsersDialog();
    },
  };

  const saveUser = (data: UserData) => {
    if (data == null) {
      console.error("Data is null. Could not save data.");
      return;
    }

    if (data.avatarFile) {
      const oldAvatar = data.avatar;

      uploadIMG(data.avatarFile)
        ?.then((imgURL) => {
          if (!data.id) {
            // create new mode
            axiosUserServices.create(data, oldAvatar, imgURL as string);
          } else {
            // update mode
            axiosUserServices.update(data, oldAvatar, imgURL as string);
          }
        })
        .catch((error) => {
          console.error("Cannot remove new avatar from storage: ", error);
          toastify.error("Cannot remove new avatar from storage");
        });
    } else {
      if (!data.id) {
        // create new mode
        axiosUserServices.createWithoutAvatar(data);
      } else {
        // update mode
        axiosUserServices.updateWithoutAvatar(data);
      }
    }
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const confirmDeleteUser = (user: User) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="mr-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || !selectedUsers.length}
        />
      </>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h2 className="table-title">User Management</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="id, name, email, age"
          />
        </span>
      </div>
    );
  };

  const bodyTemplate = {
    name: (rowData: User) => {
      return (
        <div className="user-info-name">
          <div className="profile-photo">
            <img src={rowData.avatar} />
          </div>
          <div>
            <p>
              <b>
                {rowData.name}{" "}
                {rowData.id === auth.id && (
                  <span style={{ color: "#ff000a" }}>(You)</span>
                )}
              </b>
            </p>
          </div>
        </div>
      );
    },

    status: (rowData: User) => {
      return rowData.status === USER_STATUS.ACTIVE ? (
        <span className="status status-active">Active</span>
      ) : rowData.status === USER_STATUS.INACTIVE ? (
        <span className="status status-inactive">Inactive</span>
      ) : (
        <span className="status status-block">Blocked</span>
      );
    },

    gender: (rowData: User) => {
      return rowData.gender === USER_GENDER.FEMALE ? (
        <FemaleIcon style={{ color: "#ff00a3" }} />
      ) : rowData.gender === USER_GENDER.MALE ? (
        <MaleIcon style={{ color: "#4926ff" }} />
      ) : (
        <TransgenderIcon style={{ color: "#0dcf65" }} />
      );
    },

    action: (rowData: User) => {
      return (
        <div style={{ display: "flex", gap: "6px" }}>
          <Button style={{ padding: "6px" }} onClick={() => editUser(rowData)}>
            <EditIcon />
          </Button>

          {auth.id !== rowData.id && (
            <Button
              className="p-button p-button-warning"
              style={{ padding: "6px" }}
              onClick={() => confirmDeleteUser(rowData)}
            >
              <DeleteIcon />
            </Button>
          )}
        </div>
      );
    },

    role: (rowData: User) => {
      return (
        <div className="role-list">
          {rowData.roles.map((e) => {
            if (ROLES[e.name]) {
              return (
                <span className="role" key={e.id}>
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
        </div>
      );
    },
  };

  const itemTemplate = {
    status: (option: { value: number; name: string }) => {
      return <span key={option.value}>{option.name}</span>;
    },
    role: (option: { id: number; name: string }) => {
      return <span key={option.id}>{ROLES[option.name]}</span>;
    },
    gender: (option: { value: string }) => {
      return option.value === USER_GENDER.FEMALE ? (
        <FemaleIcon style={{ color: "#ff00a3" }} />
      ) : option.value === USER_GENDER.MALE ? (
        <MaleIcon style={{ color: "#4926ff" }} />
      ) : (
        <TransgenderIcon style={{ color: "#0dcf65" }} />
      );
    },
  };

  const filterTemplate = {
    status: (options: any) => {
      const statusList = statuses();
      return (
        <MultiSelect
          value={options.value}
          options={statusList}
          itemTemplate={itemTemplate.status}
          optionLabel="name"
          onChange={(e) => options.filterCallback(e.value)}
          className="p-column-filter"
        />
      );
    },
    role: (options: any) => {
      return (
        <Dropdown
          value={options.value}
          options={roles}
          onChange={(e) => options.filterCallback(e.value, options.index)}
          itemTemplate={itemTemplate.role}
          optionLabel="name"
          placeholder="Select a Role"
          className="p-column-filter"
        />
      );
    },
    gender: (options: any) => {
      const genders = genderList();
      return (
        <MultiSelect
          value={options.value}
          options={genders}
          itemTemplate={itemTemplate.gender}
          optionLabel="name"
          onChange={(e) => options.filterCallback(e.value)}
          className="p-column-filter"
        />
      );
    },
  };

  const deleteUserDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={axiosUserServices.delete}
      />
    </>
  );

  const deleteUsersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={axiosUserServices.deleteSelectedUsers}
      />
    </>
  );

  const editUser = (data: User) => {
    if (data.id) {
      privateAxios
        .get(`/users/${data.id}`)
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            setUserDialog(true);
          } else {
            toastify.warn(`Can not get data of User ${data.id} from Server`);
          }
        })
        .catch((error) => {
          console.log(
            "Something wrongs when getting data from server: ",
            error
          );
          toastify.warn(`Can not get data of User ${data.id} from Server`);
        });
    }
  };

  return (
    <div id="user-management">
      <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
      <div className="card">
        <DataTable
          value={users}
          paginator
          className="p-datatable-customers"
          header={header}
          rows={5}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 25, 50]}
          dataKey="id"
          rowHover
          selection={selectedUsers}
          onSelectionChange={(e: { value: User[] }) => {
            setSelectedUsers(e.value);
          }}
          showSelectionElement={(e) => {
            if (e.id != admin_id && e.id !== auth.id) {
              return true;
            }
            return null;
          }}
          isDataSelectable={(e) => {
            return e.data.id != admin_id && e.data.id !== auth.id;
          }}
          filters={filters}
          filterDisplay="menu"
          loading={loading}
          globalFilterFields={["id", "name", "email", "age"]}
          emptyMessage="No users found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3em" }}
          ></Column>
          <Column
            header="ID"
            field="id"
            sortable
            sortField="id"
            filter
            filterPlaceholder="Search by id"
            style={{ width: "3rem" }}
          />
          <Column
            header="Name"
            field="name"
            sortable
            sortField="name"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "14rem", maxWidth: "14rem" }}
            body={bodyTemplate.name}
          />
          <Column
            header="Email"
            field="email"
            sortable
            sortField="email"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "15rem", maxWidth: "14rem" }}
          />
          <Column
            header="Gender"
            field="gender"
            headerStyle={{ width: "5rem", textAlign: "center" }}
            body={bodyTemplate.gender}
            sortable
            sortField="gender"
            filter
            filterField="gender"
            showFilterMatchModes={false}
            filterElement={filterTemplate.gender}
          />
          <Column
            field="age"
            header="Age"
            sortable
            filterField="age"
            filter
            filterPlaceholder="Search by age"
            headerStyle={{ width: "5rem", textAlign: "center" }}
          />
          <Column
            header="Roles"
            filterField="roles"
            body={bodyTemplate.role}
            filter
            filterElement={filterTemplate.role}
            filterMatchModeOptions={matchModes}
            headerStyle={{ width: "5rem", textAlign: "center" }}
          />
          <Column
            field="status"
            header="Status"
            sortable
            body={bodyTemplate.status}
            filter
            filterElement={filterTemplate.status}
            showFilterMatchModes={false}
            headerStyle={{ width: "5rem", textAlign: "center" }}
          />
          <Column
            headerStyle={{ width: "4rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={bodyTemplate.action}
          />
        </DataTable>
      </div>

      <UserDetailsDialog
        hideDialog={hideDialog}
        saveUser={saveUser}
        userDialog={userDialog}
        user={user}
        roles={roles}
        ref={userDetailFormRef}
      />

      <UserConfirmDialog
        visible={deleteUserDialog && user.id !== auth.id}
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>
              Are you sure you want to delete user{" "}
              <b>{`${user.name}[${user.id}]`}</b>?
            </span>
          )}
        </div>
      </UserConfirmDialog>

      <UserConfirmDialog
        visible={deleteUsersDialog}
        footer={deleteUsersDialogFooter}
        onHide={hideDeleteUsersDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>Are you sure you want to delete the selected users?</span>
          )}
        </div>
      </UserConfirmDialog>
    </div>
  );
}
