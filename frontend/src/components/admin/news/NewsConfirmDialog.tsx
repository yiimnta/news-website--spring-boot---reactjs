import { Dialog } from "primereact/dialog";

export const NewsConfirmDialog = (props: {
  children: React.ReactNode;
  visible: boolean;
  footer: React.ReactNode;
  onHide: () => void;
}) => {
  const { children, visible, footer, onHide } = props;

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Confirm"
      modal
      footer={footer}
      onHide={onHide}
    >
      {children}
    </Dialog>
  );
};
