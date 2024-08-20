import { useNavigate } from "react-router-dom";

const useHandleUnauthorized = () => {
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("UserName");
    localStorage.removeItem("Email");
    localStorage.removeItem("Role");
    localStorage.removeItem("CoCode");
    localStorage.removeItem("exp");

    navigate("/login");
  };

  return handleUnauthorized;
};

export default useHandleUnauthorized;