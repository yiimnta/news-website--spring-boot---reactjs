import { useForm } from "react-hook-form";
import { useEffect } from "react";

type FormInput = {
  date: string;
};

export const DashboardMain = () => {
  const { register, setValue } = useForm<FormInput>();

  useEffect(() => {
    setValue("date", new Date().toISOString().substring(0, 10));
  }, [setValue]);

  return (
    <main>
      <h1>Dashboard</h1>
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

      <div className="table-container">
        <h2 className="table-title">Title</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Number</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>85631</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
          </tbody>
        </table>
        <a href="#">Show All</a>
      </div>
    </main>
  );
};
