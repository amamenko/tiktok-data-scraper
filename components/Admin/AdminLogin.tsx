"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeaderLogo } from "../Header/HeaderLogo";
import { useSearchParams } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { ThemeContext } from "../Providers/Theme/ThemeProvider";
import { DarkModeToggle } from "../Room/DarkModeToggle";
import "./AdminLogin.scss";

export interface UserInfo {
  email: string;
  password: string;
}

export const AdminLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { darkMode, changeDarkMode } = useContext(ThemeContext);

  const [userInfo, changeUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
  });
  const [error, changeError] = useState("");

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await signIn("credentials", {
      callbackUrl: "/admin/monthly",
      email: userInfo.email,
      password: userInfo.password,
    });
    if (response?.error) {
      changeError("Invalid email or password.");
    } else {
      changeError("");
    }
  };

  useEffect(() => {
    const urlCallback = searchParams?.get("callbackUrl");
    if (urlCallback && !session) {
      changeError("Unauthorized user.");
      router.push("/admin");
    }
  }, [searchParams, session, router]);

  if (session && session.user) router.push("/admin/monthly");

  return (
    <div className={`admin_login_page ${darkMode ? "dark" : ""}`}>
      <HeaderLogo />
      <form
        onSubmit={handleLoginSubmit}
        className={`admin_login_form ${darkMode ? "dark" : ""}`}
      >
        <div className="admin_login_header">
          {/* button placeholder */}
          <span style={{ opacity: 0 }}>
            <DarkModeToggle />
          </span>
          <h1 className={`${darkMode ? "dark" : ""}`}>Admin Login</h1>
          <DarkModeToggle />
        </div>
        <div className={`form_input_container ${darkMode ? "dark" : ""}`}>
          <label htmlFor="email" placeholder="Email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={({ target }) => {
              changeUserInfo({ ...userInfo, email: target.value });
              if (error) changeError("");
            }}
          />
        </div>
        <div className={`form_input_container ${darkMode ? "dark" : ""}`}>
          <label htmlFor="password" placeholder="Password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={({ target }) => {
              changeUserInfo({ ...userInfo, password: target.value });
              if (error) changeError("");
            }}
          />
        </div>
        <button type="submit" className="admin_login_button">
          Login
        </button>
        <div className={`admin_or_container ${darkMode ? "dark" : ""}`}>
          <span className="admin_or_text text-center bg-white z-10 px-4">
            OR
          </span>
          <div className="admin_or_divider absolute w-full border-b border-black" />
        </div>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="admin_google_login_button"
        >
          <AiOutlineGoogle size={25} /> Continue with Google
        </button>
        {error && <p className="admin_error_text">{error}</p>}
      </form>
    </div>
  );
};
