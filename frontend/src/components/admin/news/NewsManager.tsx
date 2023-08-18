import { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./NewsManager.scss";
import { ROLES, Role, User } from "../../../Constants";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { Toolbar } from "primereact/toolbar";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { NewsDetailsDialog } from "./NewsDetailsDialog";
import { NewsConfirmDialog } from "./NewsConfirmDialog";

export default function NewsManager() {
  let emptyUser: User = {
    firstname: "",
    lastname: "",
    email: "",
    avatar:
      "https://firebasestorage.googleapis.com/v0/b/news-ae8fb.appspot.com/o/default-avatar.jpg?alt=media&token=272fa245-a638-4896-8d74-a6d2b44256cb",
    name: "",
    roles: [],
  };

  FilterService.register("roleFilter", (roles: Role[], selectedRole) => {
    return roles.some((role) => role.name == selectedRole.name);
  });

  const matchModes = [{ label: "Role Filter", value: "roleFilter" }];
  const statuses = ["Active", "Inactive", "Blocked"];

  const [submitted, setSubmitted] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [user, setUser] = useState<User>(emptyUser);

  const privateAxios = usePrivateAxios();
  const [users, setUsers] = useState<User[]>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>();
  const [roles, setRoles] = useState<Role[]>();

  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
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
    roles: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

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
    setLoading(false);

    return () => {
      userArbortController.abort();
      roleArbortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h2 className="table-title">User Management</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Name, email, age"
          />
        </span>
      </div>
    );
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

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    console.log("delete");
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    console.log("delete n users");
  };

  const header = renderHeader();

  const bodyTemplate = {
    name: (rowData: User) => {
      return (
        <div className="user-info-name">
          <div className="profile-photo">
            <img
              src={rowData.avatar}
              onError={(e) =>
                (e.target.src =
                  "https://firebasestorage.googleapis.com/v0/b/news-ae8fb.appspot.com/o/default-avatar.jpg?alt=media&token=272fa245-a638-4896-8d74-a6d2b44256cb")
              }
            />
          </div>
          <div>
            <p>
              <b>{rowData.name}</b>
            </p>
          </div>
        </div>
      );
    },

    status: (rowData: User) => {
      return (
        <span className={`customer-badge status-${rowData.status}`}>
          {rowData.status}
        </span>
      );
    },

    action: () => {
      return <Button type="button" icon="pi pi-cog"></Button>;
    },

    role: (rowData: User) => {
      return (
        <div className="role-list">
          {rowData.roles.map((e, index) => {
            if (ROLES[e.name]) {
              return (
                <>
                  <span className="role" key={index}>
                    <span
                      className="circle"
                      style={{ background: `${e.color}` }}
                    ></span>{" "}
                    {ROLES[e.name]}
                  </span>
                  <br />
                </>
              );
            }
            return "";
          })}
        </div>
      );
    },
  };

  const itemTemplate = {
    status: (option) => {
      return <span>{option}</span>;
    },
    role: (option) => {
      return <span>{ROLES[option.name]}</span>;
    },
  };

  const filterTemplate = {
    status: (options) => {
      return (
        <Dropdown
          value={options.value}
          options={statuses}
          onChange={(e) => options.filterCallback(e.value, options.index)}
          itemTemplate={itemTemplate.status}
          placeholder="Select a Status"
          className="p-column-filter"
          showClear
        />
      );
    },
    role: (options) => {
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
  };

  const saveUser = () => {
    console.log("save user");
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
        onClick={deleteUser}
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
        onClick={deleteSelectedUsers}
      />
    </>
  );

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
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

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const editUser = (user: User) => {
    setUser({ ...user });
    setUserDialog(true);
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
          onSelectionChange={(e) => setSelectedUsers(e.value)}
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
            sortable
            sortField="roles.name"
            filterField="roles"
            filterMenuStyle={{ width: "14rem" }}
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
            filterMenuStyle={{ width: "5rem" }}
            body={bodyTemplate.status}
            filter
            filterElement={filterTemplate.status}
            headerStyle={{ width: "5rem", textAlign: "center" }}
          />
          <Column
            headerStyle={{ width: "4rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={bodyTemplate.action}
          />
        </DataTable>
      </div>

      <NewsDetailsDialog
        hideDialog={hideDialog}
        saveUser={saveUser}
        userDialog={userDialog}
        user={user}
      />

      <NewsConfirmDialog
        visible={deleteUserDialog}
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
              Are you sure you want to delete user <b>{user.name}</b>?
            </span>
          )}
        </div>
      </NewsConfirmDialog>

      <NewsConfirmDialog
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
      </NewsConfirmDialog>
    </div>
  );
}
