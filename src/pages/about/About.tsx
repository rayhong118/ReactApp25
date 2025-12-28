const About = () => {
  return (
    <div>
      <h1 className="text-xl font-bold">About Me</h1>
      <p className="text-lg">
        I am a Software Development Engineer II at Microsoft with extensive
        experience in front-end and full-stack development, specializing in
        scalable UI architecture and reusable components. I have led impactful
        projects in PowerApps, including collaboration features, accessibility
        improvements, and AI-powered plan design tools, while also architecting
        security role management solutions. My career spans contributions at BNY
        Mellon, Optum, and the County of Santa Clara, where I delivered risk
        assessment applications, management platforms, and justice information
        portals using Angular, React, and Material UI. With a strong foundation
        in JavaScript, TypeScript, and modern frameworks, I consistently drive
        product innovation, enhance user experience, and set new standards for
        documentation and knowledge transfer. I bring a proven ability to
        balance technical depth, user-centric design, and long-term
        maintainability to every role.
      </p>

      <h1 className="text-xl font-bold mt-5">About this app</h1>
      <p className="text-lg">
        This is my personal website built using React and TypeScript, deployed
        using Google Firebase.{" "}
      </p>
      <h2 className="text-lg font-bold">List of features:</h2>
      <div className="ml-5">
        <h2 className="text-lg font-bold">Restaurant page</h2>
        <p className="text-lg">
          It is a restaurant finder that allows users to search for restaurants
          based on their location, price range, and rating. Users can also add
          notes to their favorite restaurants and share them with their friends.
        </p>
        <h2 className="text-lg font-bold">Experiments</h2>
        <p className="text-lg">
          Pages I used to practice my frontend skills. For example, Stopwatch,
          Tic Tac Toe, Image carousel, etc.
        </p>
      </div>
    </div>
  );
};

export default About;
