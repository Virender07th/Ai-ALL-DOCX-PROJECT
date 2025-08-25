import React from "react";
import { Link } from "react-router-dom";
import {
  featuresOne,
  featuresTwo,
  featuresThree,
  featuresforUserCase,
} from "../../Data/feature";
import CardWithIcon from "./CardWithIcon";
import CardwithImage from "./CardWithImage";
import Button from "../../Component/Reusable/Button";

const HeroSection = () => {
  return (
    <div className="w-full px-4 sm:px-6 py-10 space-y-16">
      {/* Section 1: Learning Features */}
      <section className="max-w-[1100px] mx-auto text-center flex flex-col justify-center items-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-700 bg-clip-text text-transparent mb-4 tracking-tight">
          Transform Your Learning with AI
        </h1>
        <p className="text-sm sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Upload files, ask questions, and auto-generate study videos and quizzes — all in one place.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {featuresOne.map((feature, index) => (
            <div
              key={index}
              className=" sm:w-[240px] flex justify-center transition duration-300 hover:scale-105 hover:-rotate-1 rounded-2xl hover:shadow-xl"
            >
              <CardWithIcon {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Interaction Capabilities */}
      <section className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4 tracking-tight">
          Unlock the Power of AI-Driven Interaction
        </h2>
        <p className="text-sm sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Seamlessly explore and interact with documents, websites, and videos using intelligent agents.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {featuresTwo.map((feature, index) => (
            <div
              key={index}
              className="sm:w-[240px] flex justify-center transition duration-300 hover:scale-105 hover:-rotate-1 rounded-2xl hover:shadow-xl"
            >
              <CardWithIcon {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Tech Stack Capabilities */}
      <section className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-slate-500 to-gray-700 bg-clip-text text-transparent mb-4 tracking-tight">
          Built with the Best of GenAI & Agents
        </h2>
        <p className="text-sm sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Under the hood, we use GenAI, RAG, and autonomous agents to deliver smarter learning experiences.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {featuresThree.map((feature, index) => (
            <div
              key={index}
              className="sm:w-[240px] flex  justify-center transition duration-300 hover:scale-105 hover:-rotate-1 rounded-2xl hover:shadow-xl"
            >
              <CardWithIcon {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Use Cases */}
      <section className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-700 bg-clip-text text-transparent mb-4 tracking-tight">
          Who Can Benefit?
        </h2>
        <p className="text-sm sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Explore real-world applications of our platform for students, developers, and researchers.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {featuresforUserCase.map((feature, index) => (
            <div
              key={index}
              className="sm:w-[240px] flex justify-center transition duration-300 hover:scale-105 hover:-rotate-1 rounded-2xl hover:shadow-xl"
            >
              <CardwithImage {...feature} />
            </div>
          ))}
        </div>
      </section>

  {/* CTA Section */}
<section className="max-w-[1200px] mx-auto px-4 text-center flex flex-col justify-center items-center space-y-6">
  <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-700 bg-clip-text text-transparent tracking-tight">
    Ready to Transform Your Learning?
  </h2>

  <div className="w-full flex justify-center">
    <Link to="/register">
      <Button
        data={true}
        condition={true}
        color={true}
        content="Get Started"
        style="max-w-[220px]"
      />
    </Link>
  </div>
</section>


    </div>
  );
};

export default HeroSection;
