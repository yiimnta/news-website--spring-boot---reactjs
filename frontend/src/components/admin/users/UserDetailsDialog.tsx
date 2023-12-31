/* eslint-disable prefer-const */
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  DEFAULT_USER_AVATAR,
  ROLES,
  USER_GENDER,
  USER_STATUS,
} from "../../../Constants";
import { useForm } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { UserData } from "./UserManager";
import { Role, User } from "../../../Define";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { useToastify } from "../../../hooks/useToastify";
import useDashboardContext from "../../../hooks/useDashboardContext";
import emailjs from "@emailjs/browser";

type FormValue = {
  id: number | undefined;
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
  id: undefined,
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  repassword: "",
  avatar: DEFAULT_USER_AVATAR,
  age: 0,
  gender: "",
  status: USER_STATUS.INACTIVE,
};

export const UserDetailsDialog = forwardRef(
  (
    props: {
      user: User;
      userDialog: boolean;
      roles: Role[];
      hideDialog: () => void;
      saveUser: (e: UserData) => void;
    },
    ref
  ) => {
    const { user, userDialog, roles, hideDialog, saveUser } = props;
    const [avatar, setAvatar] = useState<string>(DEFAULT_USER_AVATAR);
    const [avatarFile, setAvatarFile] = useState<HTMLInputElement | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [rolesErrorMessage, setRolesErrorMessage] = useState<string>("");
    const [showVerifyEmailBtn, setShowVerifyEmailBtn] =
      useState<boolean>(false);
    const avatarRef = useRef(null);
    const { register, handleSubmit, formState, reset, watch } =
      useForm<FormValue>({
        defaultValues: formEmpty,
      });
    const { errors } = formState;
    const privateAxios = usePrivateAxios();
    const toastify = useToastify();
    const { setLoading } = useDashboardContext();

    useImperativeHandle(ref, () => {
      return {
        resetForm: () => clearAllFields(),
      };
    });

    useEffect(() => {
      if (selectedRoles.length > 0) {
        setRolesErrorMessage("");
      }
    }, [selectedRoles]);

    useEffect(() => {
      setShowVerifyEmailBtn(
        watch("email") != null &&
          watch("email") != "" &&
          errors.email == undefined &&
          watch("status") == USER_STATUS.INACTIVE
      );
    }, [watch("status"), watch("email"), errors.email]);

    const onSubmitForm = async (data: FormValue, e) => {
      if (selectedRoles.length == 0) {
        setRolesErrorMessage("At least one role has to be selected");
        e.preventDefault();
      }

      const userData = {
        ...data,
        roles: selectedRoles.map((role) => role.id),
        avatarFile: avatarFile,
        age: data.age && +data.age,
        status: +data.status,
      };

      delete userData["repassword"];
      saveUser(userData as UserData);
    };

    const selectedRoleTemplate = (option: Role) => {
      return <>{ROLES[option.name]}</>;
    };

    const selectedOptionLabel = (option: Role): string => {
      return ROLES[option.name];
    };

    const handleResetClick = () => {
      reset();
    };

    const handleCancelClick = () => {
      clearAllFields();
      hideDialog();
    };

    useEffect(
      () => emailjs.init(`${import.meta.env.VITE_EMAILJS_PUBLIC_KEY}`),
      []
    );

    const handleVerifyEmailClick = (e) => {
      e.preventDefault();
      const email = watch("email");

      setLoading(true);
      privateAxios.post("/users/verify", { email }).then((res) => {
        if (res.data) {
          const verification_link = `${window.location.origin}/verify?token=${res.data.message}&email=${email}`;
          const serviceId = `${import.meta.env.VITE_EMAILJS_SERVICE_ID}`;
          const templateId = `${import.meta.env.VITE_EMAILJS_TEMPLATE_ID}`;
          const website = `${import.meta.env.VITE_EMAILJS_DATA_WEBSITE}`;
          const data = {
            to_name: watch("firstname") + " " + watch("lastname"),
            website,
            verification_link,
            reply_to: email,
          };
          emailjs
            .send(serviceId, templateId, data)
            .then(() => {
              toastify.success(`Sent a verify email message to ${email}`);
            })
            .catch((error) => {
              toastify.error(`Cannot send a verify email message to ${email}`);
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    };

    const clearAllFields = () => {
      setSelectedRoles([]);
      setRolesErrorMessage("");
      setAvatar(DEFAULT_USER_AVATAR);
      reset(formEmpty);
      setAvatarFile(null);
    };

    const userDialogFooter = (
      <>
        {showVerifyEmailBtn && (
          <Button
            icon="pi"
            className="p-button-text"
            onClick={handleVerifyEmailClick}
          >
            <ForwardToInboxIcon /> <b>Verify Email</b>
          </Button>
        )}
        <Button icon="pi" className="p-button-text" onClick={handleCancelClick}>
          <CloseIcon /> <b>Cancel</b>
        </Button>
        <Button icon="pi" className="p-button-text" onClick={handleResetClick}>
          <RestartAltIcon /> <b>Reset</b>
        </Button>
        <Button
          icon="pi"
          className="p-button-text"
          onClick={handleSubmit(onSubmitForm)}
        >
          <CheckIcon /> <b>Save</b>
        </Button>
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

    useEffect(() => {
      let formValues = { ...formEmpty };

      if (user.id) {
        // update mode
        Object.assign(formValues, user);
        setSelectedRoles(user.roles);
        setAvatar(user.avatar);
      }

      reset(formValues);
    }, [user]);

    return (
      <Dialog
        visible={userDialog}
        style={{ width: "600px" }}
        header={`User Details${user.id ? `( ID: ${user.id})` : ""}`}
        modal
        className="p-fluid"
        footer={userDialogFooter}
        onHide={handleCancelClick}
      >
        <div id="user-details-dialog-avatar">
          <div className="outer">
            <img
              src={avatar}
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
                type="email"
              />
              <span className="d-block text-error">
                {errors.email?.message}
              </span>
            </div>
          </div>
          <div className="field row">
            <div className="col-sm-6">
              <label htmlFor="password">Password</label>
              <input
                {...register("password", {
                  validate: (value) => {
                    if (user.id === undefined && value === null) {
                      return "Password is required";
                    }
                  },
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
                required
                className="form-control"
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
                  validate: (value) => {
                    if (
                      user.id === undefined ||
                      watch("password") != null ||
                      watch("password") != ""
                    ) {
                      if (user.id === undefined && value === null) {
                        return "Confirm-Password is required";
                      }

                      return (
                        watch("password") === value || "Passwords do not match"
                      );
                    }
                  },
                })}
                required
                className="form-control"
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
                              ].some((g) => g === value) ||
                              "Invalid gender value"
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
                          <FemaleIcon style={{ color: "#ff00a3" }} />
                        ) : value === USER_GENDER.MALE ? (
                          <MaleIcon style={{ color: "#4926ff" }} />
                        ) : (
                          <TransgenderIcon style={{ color: "#0dcf65" }} />
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
                              ].some((g) => g == value) ||
                              "Invalid status value"
                            );
                          },
                        })}
                        id={`status-${status}`}
                        className="form-check-input"
                        style={{ marginRight: "8px" }}
                        value={value}
                        defaultChecked={value === watch("status")}
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
  }
);
