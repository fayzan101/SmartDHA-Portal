'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Phone, PhoneCall, Mail, Headphones } from "lucide-react";

export default function ContactSupportPage() {
  const router = useRouter();

  const contacts = [
    { icon: <MapPin size={15} />, text: "2-B East Street Ph-1 DHA Karachi-75500" },
    { icon: <Phone size={15} />, text: "Phone: +92 21 35686401-5" },
    { icon: <PhoneCall size={15} />, text: "UAN: +92 21 111-589-589" },
    { icon: <Mail size={15} />, text: "Dha@Dhakarachi.Org" },
    { icon: <Headphones size={15} />, text: "DHA Helpline: 1092" },
  ];

  return (
    <>
      <style>{`html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }`}</style>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', boxSizing: 'border-box', padding: '20px', background: '#ffffff' }}>
        <div style={{ display: 'flex', width: '100%', height: '100%', maxHeight: 'calc(100vh - 40px)', borderRadius: '16px', overflow: 'hidden', background: '#f4f4f4' }}>

          {/* Left - Image */}
          <div style={{ position: 'relative', width: '60%', flexShrink: 0, overflow: 'hidden' }}>
            <Image loading="eager" src="/images/contact.png" alt="DHA Karachi" fill sizes="70vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', padding: '24px 20px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image src="/images/PDOHA.png" alt="Logo" width={28} height={28} style={{ width: 'auto', height: '28px', filter: 'brightness(0) invert(1)' }} />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Smart DHA City Portal</span>
              </div>
            </div>
          </div>

          {/* Right - Contact Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 36px', background: '#fff', overflowY: 'auto' }}>
            <Image loading="eager" src="/images/PDOHA.png" alt="Logo of PDOHA" width={72} height={72} style={{ width: 'auto', height: '72px', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>Welcome to DHA Karachi</h2>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 28px' }}>Smart Society . Home For Defenders</p>

            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginBottom: '14px' }}>Contact Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {contacts.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#555' }}>
                    <span style={{ color: '#16a34a', flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => router.push('/auth/sign-in')} style={{ marginTop: '28px', width: '100%', padding: '11px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.3px' }}>
              Back
            </button>
          </div>

        </div>
      </main>
    </>
  );
}