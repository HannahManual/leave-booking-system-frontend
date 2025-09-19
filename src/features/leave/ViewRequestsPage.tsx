import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ViewRequestsPage.module.css";

type LeaveRequest = {
  leaveRequestId: number;
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  firstName: string;
  surname: string;
};

export default function ViewRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const userRoleId = parseInt(localStorage.getItem("roleId") || "0");
  const isManagerOrAdmin = userRoleId === 2 || userRoleId === 3;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/leave", {
          withCredentials: true,
        });
        setRequests(res.data.data);
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setError("Failed to fetch leave requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (
    leaveRequestId: number,
    newStatus: string
  ) => {
    try {
      await axios.put(
        "/api/status",
        {
          leaveRequestId,
          newStatus,
        },
        {
          withCredentials: true,
        }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.leaveRequestId === leaveRequestId
            ? { ...req, status: newStatus }
            : req
        )
      );

      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>All Leave Requests</h2>
      {error && <p className={styles.error}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.leaveRequestId}>
              <td>{`${req.firstName} ${req.surname}`}</td>
              <td>{req.type}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    position: "relative",
                  }}
                >
                  {req.status === "Pending" && isManagerOrAdmin ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === req.leaveRequestId
                              ? null
                              : req.leaveRequestId
                          )
                        }
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: "orange",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        aria-label="Toggle status dropdown"
                      ></button>

                      {openDropdownId === req.leaveRequestId && (
                        <select
                          defaultValue=""
                          style={{
                            marginLeft: "4px",
                            padding: "4px",
                            position: "absolute",
                            top: "20px",
                            left: 0,
                            zIndex: 100,
                          }}
                          onChange={(e) =>
                            handleStatusChange(
                              req.leaveRequestId,
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Change status…
                          </option>
                          <option value="Approved">✅ Approve</option>
                          <option value="Rejected">❌ Reject</option>
                        </select>
                      )}

                      <span>{req.status}</span>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor:
                            req.status === "Approved"
                              ? "purple"
                              : req.status === "Rejected"
                              ? "gray"
                              : "orange",
                        }}
                      ></div>
                      <span>{req.status}</span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}