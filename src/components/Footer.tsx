import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800 text-white px-5 py-20 md:p-20 md:flex gap-20">
      <div>
        <h2 className="text-lg font-bold">{t("footer.contact.title")}</h2>
        <p className="text-lg">{t("footer.contact.text")}</p>
        <p className="text-lg">
          <a href="https://www.linkedin.com/in/zhihao-h-a6b28b182">
            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
          </a>
        </p>
        <p className="text-lg">
          <a href="https://github.com/rayhong118">
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
        </p>
      </div>

      <hr className="md:hidden my-4" />

      <div className="text-lg">
        <FontAwesomeIcon icon={faCog} />{" "}
        <a className="cursor-pointer" onClick={() => navigate("/settings")}>
          {t("footer.settings")}
        </a>
      </div>
    </div>
  );
};

export default Footer;
