"use client";
import { useState } from "react";

type SocialLink = {
  name: string;
  icon: string;
  url: string;
  color: string;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      name: "Telegram",
      icon: "fa-brands fa-telegram",
      url: "https://t.me/royalsmart",
      color: "hover:text-blue-400"
    },
    {
      name: "Phone",
      icon: "fa-solid fa-phone",
      url: "tel:+1234567890",
      color: "hover:text-green-400"
    },
    {
      name: "Email",
      icon: "fa-solid fa-envelope",
      url: "mailto:support@royalsmart.com",
      color: "hover:text-red-400"
    },
    {
      name: "TikTok",
      icon: "fa-brands fa-tiktok",
      url: "https://tiktok.com/@royalsmart",
      color: "hover:text-pink-400"
    },
   
    {
      name: "Instagram",
      icon: "fa-brands fa-instagram",
      url: "https://instagram.com/royalsmart",
      color: "hover:text-purple-400"
    }
  ]);

  const [tempLinks, setTempLinks] = useState(socialLinks);

  const handleSave = () => {
    setSocialLinks(tempLinks);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLinks(socialLinks);
    setIsEditing(false);
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...tempLinks];
    updated[index] = { ...updated[index], [field]: value };
    setTempLinks(updated);
  };

  return (
    <footer className="w-full bg-linear-to-br from-slate-900 to-slate-800 border-t border-slate-700/50 text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-white to-slate-200 flex items-center justify-center">
              <span className="font-bold text-slate-900 text-sm">RSC</span>
            </div>
            <h3 className="text-2xl font-light bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Royal Smart Computer
            </h3>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Connect with us through your preferred platform
          </p>
        </div>

        <div className="mb-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-slate-800/30 rounded-2xl p-4 text-center border border-slate-700/50 transition-all duration-300 hover:bg-slate-700/50 hover:scale-105 hover:shadow-lg ${link.color}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700/50 group-hover:bg-slate-600/50 transition-all duration-300">
                      <i className={`${link.icon} text-xl text-slate-300 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300">
                      {link.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
    
        </div>

  

        {/* Footer Bottom */}
        <div className="border-t border-slate-700/50 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-copyright text-xs" />
              <span>{year} Royal Smart Computer. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <span>for the community</span>
            </div>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </footer>
  );
}