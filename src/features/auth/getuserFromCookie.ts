import { useNavigate } from "react-router-dom";

export async function getUserFromCookie(request: Request) {
    const navigate = useNavigate();
  const cookieHeader: string | null = request.headers.get("Cookie");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check`, {
    headers: {
      Cookie: cookieHeader || "",
    },
    credentials: "include", 
  });

  if (!response.ok) {
    throw navigate("/login"); 
  }

  const user = await response.json(); 
  return user;
}
