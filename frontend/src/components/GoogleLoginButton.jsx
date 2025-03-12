import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
const GoogleLoginButton = () => {
  const googleFailure = (error) => {
    console.log(error);
    toast.error("Google Sign In Failed, Try Again Later");
  };
  const googleSuccess = async (res) => {
    try {
      console.log("google response:", res);
      //res contains : credentials, clientid=> credentials is nothing but a jwt, so we need to decode it before storing it
      const decoded = jwtDecode(res.credential);
      console.log("Decoded Google User:", decoded);

      const { email, name, sub: googleId, picture } = decoded;

      // Send this data to your backend
      const userData = { email, fullName: name, googleId, picture };

      const response = await axiosInstance.post("/auth/google", userData);
      toast.success("Google Sign In Successful!");

      // Save user to store
      useAuthStore.setState({ authUser: response.data });
    } catch (error) {
      console.log(error);
    }
  };
  // im using riyamehta1608 for google console

  return (
    <>
      <GoogleLogin onSuccess={googleSuccess} onFailure={googleFailure} />
    </>
  );
};
export default GoogleLoginButton;
