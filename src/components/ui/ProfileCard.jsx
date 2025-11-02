import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const ProfileCard = () => {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      {/* Header */}
      <div className="h-64 overflow-hidden">
        <img
          src="https://docs.material-tailwind.com/img/team-3.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Natalie Paisley
        </h2>
        <p className="text-gray-500 font-medium mb-4">CEO / Co-Founder</p>

        {/* Footer */}
        <div className="flex justify-center gap-6 text-xl text-gray-600">
          <a
            href="#facebook"
            className="hover:text-blue-600 transition-colors"
            title="Like on Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="#twitter"
            className="hover:text-sky-500 transition-colors"
            title="Follow on Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="#instagram"
            className="hover:text-pink-500 transition-colors"
            title="Follow on Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
