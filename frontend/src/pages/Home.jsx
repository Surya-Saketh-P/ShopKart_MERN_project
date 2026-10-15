import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/customers/me");
        setUser(res.data);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <p className="page-msg">Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="welcome-card">
          <h1>Welcome, {user?.fullName}</h1>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;