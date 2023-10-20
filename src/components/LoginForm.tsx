"use client"
import styles from "../css/login.module.css"
import { useState } from "react"
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {

    const router = useRouter();

    //const [session, setSession] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function useSes() {
        const session = await getSession();
        if (session) {
            router.replace('/dashboard');
        }
    }

    useSes();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!password || !email) {
            setError("All fields must be filled in.");
            return;
        }

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            });
            if (res!.error) {
                setError("Invaild Credentials");
                return;
            }

            router.replace("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className={styles.wrapper}>
                <form onSubmit={handleSubmit}>
                    <input onChange={(e) => setEmail(e.target.value.toLowerCase())} type="text" placeholder="Email" />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                    <button>Log in</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>
            </div>
        </>
    )
}
