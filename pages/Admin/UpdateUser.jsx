
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';


const UpdateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: '',accountStatus: '' });
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
          const response = await axiosInstance.get(`/admin/get-users/${userId}`);
          // Extract only the fields you want to edit
          const userWithoutPassword = {
            email: response.data.ourUsers.email,
            accountStatus: response.data.ourUsers.accountStatus,
          };
          setUser(userWithoutPassword);
        } catch (err) {
          setError('Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const updatedUser = { ...user }; // Only email/accountStatus are here
          if (password) { // Only add password if entered
            updatedUser.password = password;
          }
          await axiosInstance.put(`/admin/update/${userId}`, updatedUser);
          alert('User updated successfully!');
          navigate('/');
        } catch (err) {
          setError('Failed to update user');
        }
      };

    if (loading) return <div>Loading user details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Update User</h2>
            <form className='AdminUpdate' onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} required />
                <input type="text" name="accountStatus" value={user.accountStatus} onChange={handleChange} required />
            

                {/* <label>Role:</label>
                <input type="text" name="role" value={user.role} onChange={handleChange} required /> */}

                <label>Password (Leave blank to keep current):</label>
                <input type="password" name="password" value={password} onChange={handlePasswordChange} placeholder="Leave blank to keep current" />

                <button type="submit">Update User</button>
            </form>
            <style>{`
                .AdminUpdate {
                    display: flex;
                    flex-direction: column;
                    width: 100vw;
                    margin: 30px;
                }
                .AdminUpdate input {
                    width: 200px;
                    margin: 10px;
                }
                .AdminUpdate button {
                    width: 100px;
                }
            `}</style>
        </div>
    );
};

export default UpdateUser;
