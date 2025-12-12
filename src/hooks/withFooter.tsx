import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const withFooter = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <WrappedComponent {...props} />
        </div>

        <div className="mt-5 bg-gray-800 text-white px-5 py-20 md:p-20">
          <h2 className="text-lg font-bold">Contact</h2>
          <p className="text-lg">You can find me on LinkedIn and GitHub.</p>
          <div className="">
            <p className="text-lg"> <a href="https://www.linkedin.com/in/zhihao-h-a6b28b182"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a></p>
            <p className="text-lg"><a href="https://github.com/rayhong118"><FontAwesomeIcon icon={faGithub} /> GitHub</a></p>
          </div>
        </div>
      </div>
    );
  };
};