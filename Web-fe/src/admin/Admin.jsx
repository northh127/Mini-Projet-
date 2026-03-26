import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, []);

  return <div>Admin Page</div>;
}