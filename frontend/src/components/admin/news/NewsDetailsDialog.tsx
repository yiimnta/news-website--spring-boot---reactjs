import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { User } from "../../../Constants";

export const NewsDetailsDialog = (props: {
  user: User;
  userDialog: boolean;
  hideDialog: () => void;
  saveUser: () => void;
}) => {
  const { user, userDialog, hideDialog, saveUser } = props;

  const userDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </>
  );

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
      {user?.avatar && (
        <img
          src={user.avatar}
          onError={(e) =>
            (e.target.src =
              "https://firebasestorage.googleapis.com/v0/b/news-ae8fb.appspot.com/o/default-avatar.jpg?alt=media&token=272fa245-a638-4896-8d74-a6d2b44256cb")
          }
          alt="avatar"
          className="product-image block m-auto pb-3"
        />
      )}

      <div className="field">
        <div className="formgrid row">
          <div className="col-sm-6">
            <label htmlFor="firstname">Firstname</label>
            <input
              value={user.firstname}
              required
              autoFocus
              className="form-control"
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="Lastname">Lastname</label>
            <input
              value={user.lastname}
              required
              autoFocus
              className="form-control"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
