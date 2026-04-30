'use client';
import SignInForm from "../components/SignInForm";
import Image from "next/image";
import { useLogin } from "../../../hooks/auth/useLogin";
import Loader from "../../../components/ui/loader";
import { Phone, Info } from "lucide-react";

export default function SignInPage() {
  const { mutate: login, isPending } = useLogin();

  return (
    <main className="authContainer" style={{ position: 'relative' }}>
      {isPending && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader bare />
        </div>
      )}
      <div className="auth_left">
        <Image loading="eager" src="/images/SignIn.jpg" alt="Sign In" width={500} height={700} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="auth_right">
        <div className="auth_header">
          <div className="auth_logo">
            <Image loading="eager" src="/images/PDOHA.png" alt="Logo of PDOHA" width={120} height={60} style={{ width: "auto", height: "auto" }} />
          </div>
          <h1 className="auth_title">Welcome to DHA Karachi</h1>
          <h3 className="auth_subtitle">Smart Society . Home For Defenders</h3>
        </div>
        <SignInForm login={login} isPending={isPending} />
        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: '#6e6c6c' }}>Don't have an account? <a href="/auth/sign-up" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Signup</a></p>
        <hr style={{ border: 'none', borderTop: '1px solid #969799', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#555' }}><Phone size={14} color="#16a34a" /><a href="/contact-support" style={{ color: '#555', textDecoration: 'none' }}>Contact Support</a><Info size={14} color="#16a34a" /><a href="/about" style={{ color: '#555', textDecoration: 'none' }}>About Us</a></div>
      </div>
    </main>
  );
}