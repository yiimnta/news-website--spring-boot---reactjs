import { useForm } from "react-hook-form";
import { useEffect } from "react";

type FormInput = {
  date: string;
};

export const DashboardDate = () => {
  const { register, setValue } = useForm<FormInput>();

  useEffect(() => {
    setValue("date", new Date().toISOString().substring(0, 10));
  }, [setValue]);

  return (
    <div className="date">
      <input
        className="text-center"
        type="date"
        {...register("date", {
          valueAsDate: false,
        })}
        disabled
        style={{ paddingLeft: "15px" }}
      />
    </div>
  );
};
