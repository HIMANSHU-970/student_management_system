import { useEffect, useState } from "react";
import socket from "../socket";

function LiveNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => socket.off("receive_notification");
  }, []);

  return (
    <div className="card">
      <h3>🔔 Live Notifications</h3>

      {notifications.map((n, i) => (
        <p key={i}>📢 {n.message}</p>
      ))}
    </div>
  );
}

export default LiveNotifications;