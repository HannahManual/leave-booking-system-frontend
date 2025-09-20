import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ViewRequestsPage.module.css";

type LeaveRequest = {
  leaveRequestId: number;
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  user: {
    firstName: string;
    surname: string;
  };
};

export default function ViewRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const navigate = useNavigate();

  const userRoleId = parseInt(localStorage.getItem("roleId") || "0");
  const signedInUserId = parseInt(localStorage.getItem("userId") || "0");
  const isManagerOrAdmin = userRoleId === 2 || userRoleId === 3;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/leave", { withCredentials: true });
        setRequests(res.data.data);
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setError("Failed to fetch leave requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleCancel = async (leaveRequestId: number) => {
    try {
      await axios.put(
        `/api/leave/cancel/${leaveRequestId}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.leaveRequestId === leaveRequestId
            ? { ...req, status: "Cancelled" }
            : req
        )
      );

      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error cancelling leave request:", error);
      alert("Failed to cancel request.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>All Leave Requests</h2>
      {error && <p className={styles.error} role="alert">{error}</p>}

      <table role="table" aria-label="Leave requests table">
        <thead>
          <tr role="row">
            <th role="columnheader">User</th>
            <th role="columnheader">Type</th>
            <th role="columnheader">Start</th>
            <th role="columnheader">End</th>
            <th role="columnheader">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const isOwnRequest = req.userId === signedInUserId;
            const isCancellable = isOwnRequest && (req.status === "Pending" || req.status === "Approved");

            return (
              <tr key={req.leaveRequestId} role="row">
                <td role="cell">{`${req.user.firstName} ${req.user.surname}`}</td>
                <td role="cell">{req.type}</td>
                <td role="cell">{req.startDate}</td>
                <td role="cell">{req.endDate}</td>
                <td role="cell">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
                    {req.status === "Pending" && isManagerOrAdmin ? (
                      <>
                        <button
                          aria-label={`Toggle approval options for request ${req.leaveRequestId}`}
                          onClick={() => setOpenDropdownId(openDropdownId === req.leaveRequestId ? null : req.leaveRequestId)}
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            backgroundColor: "orange",
                            border: "none",
                            cursor: "pointer",
                          }}
                        ></button>

                        {openDropdownId === req.leaveRequestId && (
                          <select
                            defaultValue=""
                            onChange={(e) =>
                              handleStatusChange(req.leaveRequestId, e.target.value)
                            }
                            style={{
                              position: "absolute",
                              top: "20px",
                              left: 0,
                              padding: "4px",
                              zIndex: 100,
                            }}
                            aria-label={`Update status for request ${req.leaveRequestId}`}
                          >
                            <option value="" disabled>Change status…</option>
                            <option value="Approved">✅ Approve</option>
                            <option value="Rejected">❌ Reject</option>
                          </select>
                        )}

                        <span>{req.status}</span>
                      </>
                    ) : isCancellable ? (
                      <>
                        <button
                          aria-label={`Toggle cancel options for request ${req.leaveRequestId}`}
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === req.leaveRequestId ? null : req.leaveRequestId
                            )
                          }
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            backgroundColor: req.status === "Approved" ? "purple" : "orange",
                            border: "none",
                            cursor: "pointer",
                          }}
                        ></button>

                        {openDropdownId === req.leaveRequestId && (
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value === "Cancelled") {
                                handleCancel(req.leaveRequestId);
                              }
                            }}
                            style={{
                              position: "absolute",
                              top: "20px",
                              left: 0,
                              padding: "4px",
                              zIndex: 100,
                              backgroundColor: "white",
                              border: "1px solid #000000",
                            }}
                            aria-label={`Cancel request ${req.leaveRequestId}`}
                          >
                            <option value="" disabled>Cancel request?</option>
                            <option value="Cancelled">❌ Cancel</option>
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
                                : req.status === "Cancelled"
                                ? "red"
                                : "orange",
                          }}
                          aria-label={`Status: ${req.status}`}
                        ></div>
                        <span>{req.status}</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Back to Dashboard Button */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#6a0dad",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          aria-label="Return to dashboard"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

async function handleStatusChange(
  leaveRequestId: number,
  newStatus: string
): Promise<void> {
  try {
    await axios.put(
      `/api/leave/status/${leaveRequestId}`,
      { status: newStatus },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Manager/Admin failed to update status:", error);
  }
}