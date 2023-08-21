import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  ROLES,
  Role,
  USER_GENDER,
  USER_STATUS,
  User,
} from "../../../Constants";
import { useForm } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

type FormValue = {
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  avatar: string;
  status: number;
  gender: string;
  password: string;
  repassword?: string;
};

const formEmpty: FormValue = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  status: USER_STATUS.INACTIVE,
};

export const NewsDetailsDialog = (props: {
  user: User;
  userDialog: boolean;
  roles: Role[];
  hideDialog: () => void;
  saveUser: (e: any) => void;
}) => {
  const { user, userDialog, roles, hideDialog, saveUser } = props;
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [avatarFile, setAvatarFile] = useState<HTMLInputElement | null>(null);
  const avatarRef = useRef(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [rolesErrorMessage, setRolesErrorMessage] = useState<string>("");
  const { register, setValue, handleSubmit, formState, reset, getValues } =
    useForm<FormValue>({
      defaultValues: formEmpty,
    });

  const { errors } = formState;

  useEffect(() => {
    if (selectedRoles.length > 0) {
      setRolesErrorMessage("");
    }
  }, [selectedRoles]);

  const onSubmitForm = async (data: FormValue, e) => {
    if (selectedRoles.length == 0) {
      setRolesErrorMessage("At least one role has to be selected");
      e.preventDefault();
    }

    const userData = {
      ...data,
      roles: selectedRoles.map((e) => e.id),
      avatarFile: avatarFile,
    };

    delete userData["repassword"];

    saveUser(userData);
  };

  const selectedRoleTemplate = (option: Role) => {
    return <>{ROLES[option.name]}</>;
  };

  const selectedOptionLabel = (option: Role): string => {
    return ROLES[option.name];
  };

  const handleCancelClick = () => {
    setSelectedRoles([]);
    setRolesErrorMessage("");
    reset();
    hideDialog();
    setAvatar("");
    setAvatarFile(null);
  };

  const userDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={handleCancelClick}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={handleSubmit(onSubmitForm)}
      />
    </>
  );

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    const newAvatar = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatar(newAvatar);
  };

  return (
    <Dialog
      visible={userDialog}
      style={{ width: "450px" }}
      header="User Details"
      modal
      className="p-fluid"
      footer={userDialogFooter}
      onHide={hideDialog}
    >
      <div id="user-details-dialog-avatar">
        <div className="outer">
          <img
            src={
              avatar
                ? avatar
                : "https://firebasestorage.googleapis.com/v0/b/news-ae8fb.appspot.com/o/default-avatar.jpg?alt=media&token=272fa245-a638-4896-8d74-a6d2b44256cb"
            }
            alt="avatar"
            className="block m-auto pb-3"
            ref={avatarRef}
          />
          <div className="inner">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChangeAvatar}
              className="input-file"
            />
            <EditIcon />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="field row">
          <div className="col-sm-6">
            <label htmlFor="firstname">First Name</label>
            <input
              autoFocus
              className="form-control"
              {...register("firstname", {
                required: "First Name is required",
              })}
              placeholder="Your first name"
            />
            <span className="d-block text-error">
              {errors.firstname?.message}
            </span>
          </div>
          <div className="col-sm-6">
            <label htmlFor="lastname">Last Name</label>
            <input
              {...register("lastname", {
                required: "Last Name is required",
              })}
              className="form-control"
              placeholder="Your last name"
            />
            <span className="d-block text-error">
              {errors.lastname?.message}
            </span>
          </div>
        </div>
        <div className="field row">
          <div className="col-sm-6">
            <label htmlFor="age">Age</label>
            <input
              {...register("age", {
                min: { value: 18, message: "Age must be min 18" },
                max: { value: 100, message: "Age must be max 100" },
                required: "Age is required",
              })}
              type="number"
              className="form-control"
              placeholder="Your age"
            />
            <span className="d-block text-error">{errors.age?.message}</span>
          </div>
          <div className="col-sm-6">
            <label htmlFor="email">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
              })}
              required
              className="form-control"
              placeholder="Your email"
              type="email"
            />
            <span className="d-block text-error">{errors.email?.message}</span>
          </div>
        </div>
        <div className="field row">
          <div className="col-sm-6">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  return (
                    getValues("repassword") === value ||
                    "Password and Re-password does not match"
                  );
                },
              })}
              required
              className="form-control"
              placeholder="Your password"
              type="password"
            />
            <span className="d-block text-error">
              {errors.password?.message}
            </span>
          </div>
          <div className="col-sm-6">
            <label htmlFor="repassword">Confirm Password</label>
            <input
              {...register("repassword", {
                required: "Confirm-Password is required",
              })}
              required
              className="form-control"
              placeholder="Re-enter your password"
              type="password"
            />
            <span className="d-block text-error">
              {errors.repassword?.message}
            </span>
          </div>
        </div>
        <div className="field row">
          <div className="col">
            <label htmlFor="roles">Roles</label>
            <MultiSelect
              options={roles}
              optionLabel={selectedOptionLabel}
              display="chip"
              itemTemplate={selectedRoleTemplate}
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.value)}
            />
            <span className="d-block text-error">{rolesErrorMessage}</span>
          </div>
        </div>
        <div className="field">
          <fieldset className="border rounded-3 p-3 ">
            <legend
              className="float-none w-auto px-3"
              style={{ margin: 0, fontSize: "1rem" }}
            >
              Gender
            </legend>
            <div className="formgrid row">
              {Object.keys(USER_GENDER).map((gender) => {
                const value = USER_GENDER[gender as keyof typeof USER_GENDER];
                return (
                  <div className="col-sm-4" key={value}>
                    <input
                      type="radio"
                      {...register("gender", {
                        required: "At least a gender must be selected",
                        validate: (value) => {
                          return (
                            [
                              USER_GENDER.MALE,
                              USER_GENDER.FEMALE,
                              USER_GENDER.NEUTRAL,
                            ].some((g) => g === value) || "Invalid gender value"
                          );
                        },
                      })}
                      id={`status-${gender}`}
                      className="form-check-input"
                      style={{ marginRight: "8px" }}
                      value={value}
                    />
                    <label htmlFor={`status-${gender}`}>
                      {value === USER_GENDER.FEMALE ? (
                        <FemaleIcon />
                      ) : value === USER_GENDER.MALE ? (
                        <MaleIcon />
                      ) : (
                        <TransgenderIcon />
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <span className="d-block text-error">{errors.gender?.message}</span>
        </div>
        <div className="field">
          <fieldset className="border rounded-3 p-3 ">
            <legend
              className="float-none w-auto px-3"
              style={{ margin: 0, fontSize: "1rem" }}
            >
              Status
            </legend>
            <div className="formgrid row">
              {Object.keys(USER_STATUS).map((status) => {
                const value = USER_STATUS[status as keyof typeof USER_STATUS];
                return (
                  <div className="col-sm-4" key={value}>
                    <input
                      type="radio"
                      {...register("status", {
                        required: "At least a status must be selected",
                        validate: (value) => {
                          return (
                            [
                              USER_STATUS.ACTIVE,
                              USER_STATUS.INACTIVE,
                              USER_STATUS.BLOCK,
                            ].some((g) => g == value) || "Invalid status value"
                          );
                        },
                      })}
                      id={`status-${status}`}
                      className="form-check-input"
                      style={{ marginRight: "8px" }}
                      value={value}
                      defaultChecked={value === formEmpty.status}
                    />
                    <label htmlFor={`status-${status}`}>{status}</label>
                  </div>
                );
              })}
              <span className="d-block text-error">
                {errors.status?.message}
              </span>
            </div>
          </fieldset>
        </div>
      </div>
    </Dialog>
  );
};
