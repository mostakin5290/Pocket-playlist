import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
const ProfileCard = ({ Fname = "User", Img, linkedin = "#", x = "#", instagram = "#" }) => {
  return (
    <div className="w-80 text-white bg-[#191622] rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      {/* Header */}
      <div className="h-64 overflow-hidden">
        {Img ? (
          <img
            src={Img}
            alt={`${Fname} profile`}
            className="h-full w-full object-cover transform hover:scale-105 transition-transform"
          />
        ) : (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-1">{Fname}</h2>
        <p className="text-gray-400 font-medium mb-4">MERN Stack Developer</p>

        {/* Footer */}
        <div className="flex justify-center gap-6 text-xl text-gray-600">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href={x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-100 transition-colors"
            aria-label="X"
            title="X"
          >
            <BsTwitterX />
          </a>

          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
