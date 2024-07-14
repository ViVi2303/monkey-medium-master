import UserTable from "./UserTable.jsx";

const UserManage = () => {
  // const { userInfo } = useAuth();
  // if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
