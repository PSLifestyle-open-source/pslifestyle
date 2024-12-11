import { User } from "@pslifestyle/common/src/models/user";

interface IProps {
  user: User;
}

const RoleConfigView = ({ user }: IProps): JSX.Element => (
  <div>
    <table className="table-auto border-collapse border border-orange-100 w-full">
      <thead className="bg-orange-80">
        <tr>
          <th className="border border-orange-100 p-1">Name</th>
          <th className="border border-orange-100 p-1">Options</th>
        </tr>
      </thead>
      <tbody>
        {user?.roles.map((role) => (
          <tr key={role.name}>
            <td className="border border-orange-100 p-1">name: {role.name}</td>
            <td className="border border-orange-100 p-1">
              options: {"options" in role ? JSON.stringify(role.options) : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RoleConfigView;
