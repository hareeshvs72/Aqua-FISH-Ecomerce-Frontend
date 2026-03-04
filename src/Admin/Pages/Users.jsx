import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Trash2, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter
} from 'lucide-react';

const Users = () => {
  const [userList, setUserList] = useState([
    { id: 1, name: "Alexander Rivers", email: "alex.r@aquastore.com", role: "Admin", date: "Oct 12, 2023", avatar: "AR" },
    { id: 2, name: "Sarah Jenkins", email: "s.jenkins@gmail.com", role: "Customer", date: "Nov 05, 2023", avatar: "SJ" },
    { id: 3, name: "Michael Chen", email: "m.chen@outlook.com", role: "Editor", date: "Dec 18, 2023", avatar: "MC" },
    { id: 4, name: "Elena Rodriguez", email: "elena.rod@webmail.com", role: "Customer", date: "Jan 22, 2024", avatar: "ER" },
    { id: 5, name: "David Sterling", email: "d.sterling@aquastore.com", role: "Support", date: "Feb 02, 2024", avatar: "DS" }
  ]);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isVisible, setIsVisible] = useState(false);

  // Entrance Animation Trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const deleteUser = (id) => {
    // Optimistic UI update with a slight delay for the feedback
    setUserList(prev => prev.filter(user => user.id !== id));
    showNotification("User removed from system successfully");
  };

  const viewUser = (name) => {
    showNotification(`Fetching profile data for ${name}...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 mt-1">Manage, monitor, and update your store's customer accounts.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download size={18} /> Export CSV
            </button>
            <button className="bg-gradient-to-br from-sky-500 to-teal-400 text-white px-5 py-2 rounded-lg font-medium shadow-md shadow-cyan-500/20 hover:opacity-90 transition-opacity flex items-center gap-2">
              <Plus size={18} /> Add New User
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Users" value="1,284" icon={<UsersIcon className="text-slate-400" />} />
          <StatCard label="Active This Week" value="412" icon={<UserCheck className="text-cyan-500" />} color="text-cyan-600" />
          <StatCard label="New Registrations" value="+24" icon={<UserPlus className="text-teal-500" />} color="text-teal-500" />
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 border border-slate-200 border-b-0 rounded-t-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <Filter size={18} />
            <span className="text-sm font-medium">Filter by Role</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <tr 
                    key={user.id} 
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                    }}
                    className="user-row border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-500 ease-out group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs">
                          {user.avatar}
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{user.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => viewUser(user.name)}
                          className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Showing {userList.length} of 1,284 users</span>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-md hover:bg-white transition-colors"><ChevronLeft size={18} /></button>
              <button className="p-2 border border-slate-200 rounded-md hover:bg-white transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50`}>
        {toast.message}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color = "text-slate-900" }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
    </div>
    <div className="p-2 bg-slate-50 rounded-lg">
      {icon}
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    Admin: 'bg-purple-100 text-purple-700',
    Editor: 'bg-blue-100 text-blue-700',
    Support: 'bg-orange-100 text-orange-700',
    Customer: 'bg-slate-100 text-slate-600'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[role] || styles.Customer}`}>
      {role}
    </span>
  );
};

export default Users;