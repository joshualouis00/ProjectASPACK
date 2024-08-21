const useHandleUnauthorized = () => {

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("UserName");
    localStorage.removeItem("Email");
    localStorage.removeItem("Role");
    localStorage.removeItem("CoCode");
    localStorage.removeItem("exp");

    window.location.href = "/";
    window.location.reload();
  };

  return handleUnauthorized;
};

export default useHandleUnauthorized;