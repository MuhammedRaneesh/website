import api from "../../api/axios"
import { useEffect, useState } from "react"
import "./Users.css"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 12,
  })

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        `/admin/users?keyword=${encodeURIComponent(search)}&page=${page}&limit=12`
      )
      setUsers(res.data.users)       
      setPagination(res.data.pagination)
    } catch (error) {
      console.log("Failed to fetch users", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, page])


  useEffect(() => {
    setPage(1)
  }, [search])

  const toggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/users/${id}`)   
      
  
      setUsers((prev) =>
        prev.map((item) =>
          item._id === res.data.user.id
            ? { ...item, isBlocked: res.data.user.isBlocked }
            : item
        )
      )
    } catch (error) {
      console.log("Failed to update user status", error)
    }
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1 className="admin-users-title">User Management</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-users-search"
        />
      </div>

      <div className="admin-users-table-wrapper">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((item) => (
                <tr key={item._id} className="admin-users-row">
                  <td>{item._id}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`status-badge status-${item.isBlocked ? "blocked" : "active"}`}>
                      {item.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(item._id)} 
                      className={`btn-status ${item.isBlocked ? "btn-active" : "btn-block"}`}
                    >
                      {item.isBlocked ? "Activate" : "Block"}  
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Added: Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="admin-users-pagination">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="btn-page"
          >
            Previous
          </button>

          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === pagination.totalPages}
            className="btn-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminUsers